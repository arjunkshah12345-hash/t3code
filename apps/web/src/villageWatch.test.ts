import { describe, expect, it } from "vite-plus/test";
import {
  isQuietHour,
  isWaitingOnYou,
  pickNextWaitingThread,
  shouldKnock,
  titleWithWaitingCount,
} from "./villageWatch";

const at = (hour: number) => new Date(2026, 10, 19, hour, 30);

describe("quiet hours", () => {
  it("is never quiet when off", () => {
    for (let hour = 0; hour < 24; hour++) expect(isQuietHour(at(hour), "off")).toBe(false);
  });

  it("handles windows that cross midnight", () => {
    expect(isQuietHour(at(21), "22-07")).toBe(false);
    expect(isQuietHour(at(22), "22-07")).toBe(true);
    expect(isQuietHour(at(3), "22-07")).toBe(true);
    expect(isQuietHour(at(6), "22-07")).toBe(true);
    expect(isQuietHour(at(7), "22-07")).toBe(false);
  });

  it("handles windows that start at midnight", () => {
    expect(isQuietHour(at(23), "00-08")).toBe(false);
    expect(isQuietHour(at(0), "00-08")).toBe(true);
    expect(isQuietHour(at(8), "00-08")).toBe(false);
  });

  it("silences finished threads but never a thread that needs you", () => {
    expect(shouldKnock("completion", at(3), "23-06")).toBe(false);
    expect(shouldKnock("input", at(3), "23-06")).toBe(true);
    expect(shouldKnock("completion", at(12), "23-06")).toBe(true);
  });
});

describe("threads waiting on you", () => {
  it("counts approvals, input and guest requests", () => {
    expect(["approval", "input", "request"].every(isWaitingOnYou)).toBe(true);
    expect(["working", "ready", "failed", "waiting"].some(isWaitingOnYou)).toBe(false);
  });

  const threads = [
    { key: "a", status: "working", updatedAt: "2026-11-19T01:00:00Z" },
    { key: "b", status: "approval", updatedAt: "2026-11-19T03:14:00Z" },
    { key: "c", status: "input", updatedAt: "2026-11-19T02:00:00Z" },
    { key: "d", status: "request", updatedAt: "2026-11-19T04:00:00Z" },
  ];

  it("starts with the thread that has waited longest", () => {
    expect(pickNextWaitingThread(threads, null)?.key).toBe("c");
    expect(pickNextWaitingThread(threads, "a")?.key).toBe("c");
  });

  it("walks the waiting threads in order and wraps", () => {
    expect(pickNextWaitingThread(threads, "c")?.key).toBe("b");
    expect(pickNextWaitingThread(threads, "b")?.key).toBe("d");
    expect(pickNextWaitingThread(threads, "d")?.key).toBe("c");
  });

  it("offers nothing when no other thread is waiting", () => {
    expect(pickNextWaitingThread(threads.slice(0, 1), null)).toBeNull();
    expect(pickNextWaitingThread([threads[1]!], "b")).toBeNull();
  });
});

describe("window title", () => {
  it("prefixes the count only while something waits", () => {
    expect(titleWithWaitingCount("Tung Tung Tung Code", 0)).toBe("Tung Tung Tung Code");
    expect(titleWithWaitingCount("Tung Tung Tung Code", 2)).toBe("(2) Tung Tung Tung Code");
  });
});
