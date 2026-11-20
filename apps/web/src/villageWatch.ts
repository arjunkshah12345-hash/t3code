// Small helpers for keeping watch over many agents: quiet hours for the
// knocks, a waiting count in the window title, and finding the next thread
// that needs you. Pure where possible; callers wire them to the app.

// ── Quiet hours ────────────────────────────────────────────────────────────

/** Night windows in which "finished" knocks stay silent. Threads that need you still knock. */
export const QUIET_HOURS_PRESETS = {
  off: null,
  "22-07": { start: 22, end: 7 },
  "23-06": { start: 23, end: 6 },
  "00-08": { start: 0, end: 8 },
} as const satisfies Record<string, { start: number; end: number } | null>;
export type QuietHours = keyof typeof QUIET_HOURS_PRESETS;

export const QUIET_HOURS_LABELS = {
  off: "Off",
  "22-07": "10 p.m. – 7 a.m.",
  "23-06": "11 p.m. – 6 a.m.",
  "00-08": "Midnight – 8 a.m.",
} satisfies Record<QuietHours, string>;

export const QUIET_HOURS_STORAGE_KEY = "tung-code:quiet-hours";

function isQuietHoursPreset(value: unknown): value is QuietHours {
  return typeof value === "string" && Object.hasOwn(QUIET_HOURS_PRESETS, value);
}

export function readQuietHours(): QuietHours {
  try {
    const stored = localStorage.getItem(QUIET_HOURS_STORAGE_KEY);
    return isQuietHoursPreset(stored) ? stored : "off";
  } catch {
    return "off";
  }
}

export function writeQuietHours(preset: QuietHours) {
  try {
    localStorage.setItem(QUIET_HOURS_STORAGE_KEY, preset);
  } catch {
    // Storage can be unavailable in private windows; quiet hours stay off.
  }
}

/** True when `now` falls inside the preset's window, including windows that cross midnight. */
export function isQuietHour(now: Date, preset: QuietHours): boolean {
  const window = QUIET_HOURS_PRESETS[preset];
  if (window === null) return false;
  const hour = now.getHours();
  return window.start < window.end
    ? hour >= window.start && hour < window.end
    : hour >= window.start || hour < window.end;
}

/** Whether an alert should make a sound right now. Requests for input or approval always do. */
export function shouldKnock(
  kind: "completion" | "input",
  now: Date,
  preset: QuietHours = readQuietHours(),
): boolean {
  return kind === "input" || !isQuietHour(now, preset);
}

// ── Threads waiting on you ─────────────────────────────────────────────────

/** Sidebar statuses that mean the agent is stopped until you answer. */
export function isWaitingOnYou(status: string): boolean {
  return status === "approval" || status === "input" || status === "request";
}

export interface WatchedThread {
  readonly key: string;
  readonly status: string;
  readonly updatedAt: string;
}

/**
 * The thread to visit next: threads waiting on you, longest-waiting first. From a
 * waiting thread it moves on to the next one and wraps, so repeating it walks them all.
 */
export function pickNextWaitingThread<T extends WatchedThread>(
  threads: ReadonlyArray<T>,
  activeKey: string | null,
): T | null {
  const waiting = threads
    .filter((thread) => isWaitingOnYou(thread.status))
    .toSorted(
      (a, b) =>
        (Date.parse(a.updatedAt) || 0) - (Date.parse(b.updatedAt) || 0) ||
        a.key.localeCompare(b.key),
    );
  if (waiting.length === 0) return null;
  const index = waiting.findIndex((thread) => thread.key === activeKey);
  if (index === -1) return waiting[0] ?? null;
  if (waiting.length === 1) return null;
  return waiting[(index + 1) % waiting.length] ?? null;
}

// ── Window title ───────────────────────────────────────────────────────────

/** "(2) Tung Tung Tung Code" while two threads wait on you; the plain name otherwise. */
export function titleWithWaitingCount(base: string, count: number): string {
  return count > 0 ? `(${count}) ${base}` : base;
}

let baseTitle: string | null = null;
let waitingCount = 0;

function applyTitle() {
  if (baseTitle === null || typeof document === "undefined") return;
  document.title = titleWithWaitingCount(baseTitle, waitingCount);
}

export function setBaseDocumentTitle(title: string) {
  baseTitle = title;
  applyTitle();
}

export function setWaitingDocumentCount(count: number) {
  if (count === waitingCount) return;
  waitingCount = count;
  applyTitle();
}
