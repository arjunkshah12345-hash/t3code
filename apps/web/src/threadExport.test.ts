import { describe, expect, it } from "vite-plus/test";

import {
  buildVillageReport,
  messagesFromTurnItems,
  threadMarkdownFilename,
  threadToMarkdown,
  villageReportStatus,
} from "./threadExport";

describe("messagesFromTurnItems", () => {
  it("keeps user and agent messages, drops tool noise, merges agent replies", () => {
    const messages = messagesFromTurnItems([
      { item: { type: "user_message", text: "Add snooze" } },
      { item: { type: "reasoning", text: "thinking…" } },
      { item: { type: "assistant_message", text: "On it." } },
      { item: { type: "command_execution" } },
      { item: { type: "assistant_message", text: "Done. Tests pass." } },
      { item: { type: "user_message", text: "   " } },
      { item: { type: "user_message", text: "Thanks" } },
    ]);
    expect(messages).toEqual([
      { role: "user", text: "Add snooze" },
      { role: "assistant", text: "On it.\n\nDone. Tests pass." },
      { role: "user", text: "Thanks" },
    ]);
  });
});

describe("threadToMarkdown", () => {
  it("writes a title, a meta line and one section per message", () => {
    expect(
      threadToMarkdown({
        title: "Add a snooze",
        projectName: "sahur-alarm",
        branch: "main",
        model: "claude-sonnet-4-5",
        messages: [
          { role: "user", text: "Add snooze()" },
          { role: "assistant", text: "Added it.\n\n- one\n- two" },
        ],
      }),
    ).toBe(
      [
        "# Add a snooze",
        "",
        "_sahur-alarm · main · claude-sonnet-4-5_",
        "",
        "## You",
        "",
        "Add snooze()",
        "",
        "## Agent",
        "",
        "Added it.",
        "",
        "- one",
        "- two",
        "",
      ].join("\n"),
    );
  });

  it("handles empty threads and missing meta", () => {
    expect(threadToMarkdown({ title: " ", messages: [] })).toBe(
      "# Untitled thread\n\n_No messages yet._\n",
    );
  });
});

describe("threadMarkdownFilename", () => {
  it("slugs the title", () => {
    expect(threadMarkdownFilename("Add a snooze to the Sahur alarm!")).toBe(
      "add-a-snooze-to-the-sahur-alarm.md",
    );
    expect(threadMarkdownFilename("???")).toBe("thread.md");
  });
});

describe("villageReportStatus", () => {
  it("collapses sidebar statuses", () => {
    expect(villageReportStatus("approval")).toBe("waiting");
    expect(villageReportStatus("input")).toBe("waiting");
    expect(villageReportStatus("working")).toBe("running");
    expect(villageReportStatus("limited")).toBe("failed");
    expect(villageReportStatus("ready")).toBe("done");
  });
});

describe("buildVillageReport", () => {
  const now = new Date(2026, 10, 12, 18, 0, 0);
  const at = (hours: number) => new Date(2026, 10, 12, hours, 0, 0).toISOString();

  it("groups today's threads by project, waiting first", () => {
    const report = buildVillageReport(
      [
        { title: "Fix contrast", projectName: "village-site", status: "done", updatedAt: at(9) },
        {
          title: "Approve drum copy",
          projectName: "village-site",
          status: "waiting",
          updatedAt: at(8),
        },
        {
          title: "Add snooze",
          projectName: "sahur-alarm",
          model: "claude-sonnet-4-5",
          status: "done",
          updatedAt: at(10),
        },
        {
          title: "Yesterday's thing",
          projectName: "sahur-alarm",
          status: "done",
          updatedAt: new Date(2026, 10, 11, 23, 0, 0).toISOString(),
        },
      ],
      now,
    );
    expect(report).toBe(
      [
        "# Village report — Thursday, November 12",
        "",
        "_3 threads · 2 projects · 1 waiting on you_",
        "",
        "## sahur-alarm",
        "",
        "- **done** Add snooze · claude-sonnet-4-5",
        "",
        "## village-site",
        "",
        "- **waiting** Approve drum copy",
        "- **done** Fix contrast",
        "",
      ].join("\n"),
    );
  });

  it("says so on a quiet day", () => {
    expect(buildVillageReport([], now)).toContain("Quiet day in the village");
  });
});
