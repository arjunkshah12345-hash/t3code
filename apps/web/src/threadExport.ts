// Turns a thread into Markdown, and today's threads into a "village report"
// standup. Pure functions; the command palette wires them to the clipboard.

export interface ExportMessage {
  readonly role: "user" | "assistant";
  readonly text: string;
}

export interface ThreadMarkdownInput {
  readonly title: string;
  readonly projectName?: string | null;
  readonly branch?: string | null;
  readonly model?: string | null;
  readonly messages: ReadonlyArray<ExportMessage>;
}

export interface ExportTurnItem {
  readonly item: { readonly type: string; readonly text?: string };
}

/** Keeps the conversation: your messages and the agent's replies, in order. */
export function messagesFromTurnItems(
  items: ReadonlyArray<ExportTurnItem>,
): ReadonlyArray<ExportMessage> {
  const messages: ExportMessage[] = [];
  for (const { item } of items) {
    if (item.type !== "user_message" && item.type !== "assistant_message") continue;
    const text = (item.text ?? "").trim();
    if (text.length === 0) continue;
    const role = item.type === "user_message" ? "user" : "assistant";
    const previous = messages.at(-1);
    // An agent reply often arrives as several messages in one turn; keep it one section.
    if (previous && previous.role === role && role === "assistant") {
      messages[messages.length - 1] = { role, text: `${previous.text}\n\n${text}` };
    } else {
      messages.push({ role, text });
    }
  }
  return messages;
}

/** The agent's most recent reply, or null before it has said anything. */
export function lastAgentReply(messages: ReadonlyArray<ExportMessage>): string | null {
  return messages.findLast((message) => message.role === "assistant")?.text.trim() || null;
}

export function threadToMarkdown(input: ThreadMarkdownInput): string {
  const meta = [input.projectName, input.branch, input.model].filter(
    (part): part is string => typeof part === "string" && part.trim().length > 0,
  );
  const lines: string[] = [`# ${input.title.trim() || "Untitled thread"}`];
  if (meta.length > 0) lines.push("", `_${meta.join(" · ")}_`);
  if (input.messages.length === 0) {
    lines.push("", "_No messages yet._");
  }
  for (const message of input.messages) {
    lines.push("", message.role === "user" ? "## You" : "## Agent", "", message.text.trim());
  }
  return `${lines.join("\n")}\n`;
}

export function threadMarkdownFilename(title: string): string {
  const slug = title
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^a-z0-9]+/gu, "-")
    .replace(/^-+|-+$/gu, "")
    .slice(0, 60)
    .replace(/-+$/u, "");
  return `${slug || "thread"}.md`;
}

export type VillageReportStatus = "waiting" | "running" | "failed" | "done";

export interface VillageReportThread {
  readonly title: string;
  readonly projectName: string;
  readonly model?: string | null;
  readonly status: VillageReportStatus;
  readonly updatedAt: string;
}

const STATUS_ORDER: Record<VillageReportStatus, number> = {
  waiting: 0,
  failed: 1,
  running: 2,
  done: 3,
};

function startOfLocalDay(now: Date): number {
  return new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
}

/** Threads touched since local midnight, grouped by project, needs-you first. */
export function buildVillageReport(
  threads: ReadonlyArray<VillageReportThread>,
  now: Date = new Date(),
): string {
  const since = startOfLocalDay(now);
  const today = threads.filter((thread) => {
    const at = Date.parse(thread.updatedAt);
    return !Number.isNaN(at) && at >= since && at <= now.getTime() + 60_000;
  });
  const day = now.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });
  const lines = [`# Village report — ${day}`];
  if (today.length === 0) {
    lines.push("", "_Quiet day in the village. No threads touched today._");
    return `${lines.join("\n")}\n`;
  }

  const byProject = new Map<string, VillageReportThread[]>();
  for (const thread of today) {
    const list = byProject.get(thread.projectName) ?? [];
    list.push(thread);
    byProject.set(thread.projectName, list);
  }
  const waiting = today.filter((thread) => thread.status === "waiting").length;
  const summary = [
    `${today.length} ${today.length === 1 ? "thread" : "threads"}`,
    `${byProject.size} ${byProject.size === 1 ? "project" : "projects"}`,
  ];
  if (waiting > 0) summary.push(`${waiting} waiting on you`);
  lines.push("", `_${summary.join(" · ")}_`);

  const projects = [...byProject.entries()].toSorted(([a], [b]) => a.localeCompare(b));
  for (const [projectName, list] of projects) {
    lines.push("", `## ${projectName}`, "");
    const sorted = list.toSorted(
      (a, b) =>
        STATUS_ORDER[a.status] - STATUS_ORDER[b.status] ||
        Date.parse(b.updatedAt) - Date.parse(a.updatedAt),
    );
    for (const thread of sorted) {
      const model = thread.model ? ` · ${thread.model}` : "";
      // A thread waiting on you has been still since its last update, so that is when it started waiting.
      const since =
        thread.status === "waiting"
          ? ` · since ${new Date(thread.updatedAt).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}`
          : "";
      lines.push(
        `- **${thread.status}** ${thread.title.trim() || "Untitled thread"}${model}${since}`,
      );
    }
  }
  return `${lines.join("\n")}\n`;
}

/** Collapses the sidebar's detailed statuses into the four a standup needs. */
export function villageReportStatus(sidebarStatus: string): VillageReportStatus {
  switch (sidebarStatus) {
    case "approval":
    case "input":
    case "request":
      return "waiting";
    case "working":
    case "waiting":
      return "running";
    case "failed":
    case "limited":
      return "failed";
    default:
      return "done";
  }
}
