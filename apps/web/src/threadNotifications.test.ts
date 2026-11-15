import { afterEach, beforeEach, describe, expect, it, vi } from "vite-plus/test";

const SOUND_SECONDS = 0.6;

const audio = { currentTime: 0, started: 0, knocks: 0 };
const storage = new Map<string, string>();

const fakeParam = {
  setValueAtTime() {},
  exponentialRampToValueAtTime() {},
};

class FakeAudioContext {
  state = "running";
  destination = {};
  get currentTime() {
    return audio.currentTime;
  }
  resume() {
    return Promise.resolve();
  }
  decodeAudioData() {
    return Promise.resolve({ duration: SOUND_SECONDS });
  }
  createOscillator() {
    return {
      type: "sine",
      frequency: fakeParam,
      connect() {},
      start() {
        audio.knocks += 1;
      },
      stop() {},
    };
  }
  createGain() {
    return { gain: fakeParam, connect() {} };
  }
  createBufferSource() {
    return {
      buffer: null,
      connect() {},
      start() {
        audio.started += 1;
      },
    };
  }
}

async function loadUnlocked() {
  const notifications = await import("./threadNotifications");
  notifications.unlockNotificationAudio();
  return notifications;
}

beforeEach(() => {
  vi.resetModules();
  audio.currentTime = 0;
  audio.started = 0;
  audio.knocks = 0;
  storage.clear();
  vi.stubGlobal("AudioContext", FakeAudioContext);
  vi.stubGlobal("localStorage", {
    getItem: (key: string) => storage.get(key) ?? null,
    setItem: (key: string, value: string) => storage.set(key, value),
  });
  vi.stubGlobal(
    "fetch",
    vi.fn(async () => ({ arrayBuffer: async () => new ArrayBuffer(0) })),
  );
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("playNotificationSound with the chime", () => {
  beforeEach(() => {
    storage.set("tung-code:alert-sound", "chime");
  });

  it("plays one sound for threads that complete together", async () => {
    const { playNotificationSound } = await loadUnlocked();

    await Promise.all(
      Array.from({ length: 4 }, () => playNotificationSound("completion", () => true)),
    );

    expect(audio.started).toBe(1);
  });

  it("still plays an input alert over a completion sound", async () => {
    const { playNotificationSound } = await loadUnlocked();
    await playNotificationSound("completion", () => true);

    await playNotificationSound("input", () => true);

    expect(audio.started).toBe(2);
  });

  it("leaves the slot free when a sound is turned off before it plays", async () => {
    const { playNotificationSound } = await loadUnlocked();
    await playNotificationSound("completion", () => false);

    await playNotificationSound("completion", () => true);

    expect(audio.started).toBe(1);
  });
});

describe("wooden knock alerts", () => {
  // Each knock is a body oscillator plus a click oscillator.
  const knocksPlayed = () => audio.knocks / 2;

  it("are the default and knock once when a thread finishes", async () => {
    const { playNotificationSound, readAlertSound } = await loadUnlocked();
    expect(readAlertSound()).toBe("knock");

    await playNotificationSound("completion", () => true);

    expect(knocksPlayed()).toBe(1);
    expect(audio.started).toBe(0);
  });

  it("knock tung tung tung when a thread needs input", async () => {
    const { playNotificationSound } = await loadUnlocked();

    await playNotificationSound("input", () => true);

    expect(knocksPlayed()).toBe(3);
  });

  it("coalesce bursts of finished threads into one knock", async () => {
    const { playNotificationSound } = await loadUnlocked();

    await Promise.all(
      Array.from({ length: 4 }, () => playNotificationSound("completion", () => true)),
    );

    expect(knocksPlayed()).toBe(1);
  });

  it("stay quiet when the alert is cancelled", async () => {
    const { playNotificationSound } = await loadUnlocked();

    await playNotificationSound("input", () => false);

    expect(knocksPlayed()).toBe(0);
  });

  it("remember the chosen sound", async () => {
    const { readAlertSound, writeAlertSound } = await loadUnlocked();

    writeAlertSound("chime");

    expect(readAlertSound()).toBe("chime");
  });
});
