import { describe, expect, it } from "vite-plus/test";
import {
  advanceSahurSequence,
  isSahurHour,
  KONAMI_SEQUENCE,
  readSahurProgress,
  sahurVisitDiscovery,
  sahurKnockDiscovery,
  sahurMoonDiscovery,
} from "./sahur";

describe("Sahur discoveries", () => {
  it("recovers safely from corrupt or unavailable progress", () => {
    for (const raw of [null, "broken", "null", "[]", "42"]) {
      expect(readSahurProgress(raw)).toEqual({ discoveries: [], sound: false });
    }
  });

  it("deduplicates discoveries and rejects unknown eggs and nonboolean sound", () => {
    expect(
      readSahurProgress(
        JSON.stringify({ discoveries: ["chant", "chant", "fake", 3, "moon"], sound: "true" }),
      ),
    ).toEqual({ discoveries: ["chant", "moon"], sound: false });
  });

  it.each([
    ["SAHUR".split(""), "chant"],
    ["tungtungtung".split(""), "rhythm"],
    [KONAMI_SEQUENCE, "konami"],
    ["WOOD".split(""), "wood"],
    ["bedug".split(""), "bedug"],
    ["aura".split(""), "aura"],
    ["moonwalk".split(""), "moonwalk"],
    ["village".split(""), "village"],
    ["wakeup".split(""), "wakeup"],
  ] as const)("recognizes the secret sequence %s", (sequence, egg) => {
    let state: ReturnType<typeof advanceSahurSequence> = { buffer: [], egg: null };
    for (const key of sequence) state = advanceSahurSequence(state.buffer, key);
    expect(state.egg).toBe(egg);
    expect(state.buffer.length).toBeLessThanOrEqual(12);
  });

  it("does not match an incomplete or broken sequence", () => {
    expect(advanceSahurSequence(["s", "a", "h"], "x").egg).toBeNull();
  });

  it("keeps dawn patrol inside the local 3–6 AM window", () => {
    expect([2, 3, 5, 6, 23].map(isSahurHour)).toEqual([false, true, true, false, false]);
  });

  it("keeps late-night visits in their exact hour windows", () => {
    expect([0, 1, 2, 3, 5, 6, 23].map(sahurVisitDiscovery)).toEqual([
      "midnight",
      null,
      null,
      "dawn",
      "dawn",
      null,
      null,
    ]);
  });

  it("gives milestones priority over the recurring three-knock chant", () => {
    expect([0, 1, 3, 6, 32, 33, 34, 66, 99, 100, 101].map(sahurKnockDiscovery)).toEqual([
      null,
      null,
      "knock",
      "knock",
      null,
      "marathon",
      null,
      "encore",
      "knock",
      "century",
      null,
    ]);
  });

  it("awards lunar discoveries only on the seventh and 33rd taps", () => {
    expect([0, 6, 7, 8, 32, 33, 34].map(sahurMoonDiscovery)).toEqual([
      null,
      null,
      "moon",
      null,
      null,
      "lunar",
      null,
    ]);
  });

  it("preserves old progress while accepting newly discovered village legends", () => {
    expect(
      readSahurProgress(
        JSON.stringify({ discoveries: ["knock", "moonwalk", "century", "lunar"], sound: true }),
      ),
    ).toEqual({ discoveries: ["knock", "moonwalk", "century", "lunar"], sound: true });
  });
});
