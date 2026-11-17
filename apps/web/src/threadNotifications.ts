import type { EnvironmentId, ThreadId } from "@t3tools/contracts";
import type { ClientSettings } from "@t3tools/contracts/settings";

import completionUrl from "./assets/notification-completion.mp3";
import inputUrl from "./assets/notification-input.mp3";

type NotificationMode = ClientSettings["notificationMode"];
export const NOTIFICATION_MODE_LABELS = {
  off: "Off",
  notifications: "Notifications only",
  sound: "Sound only",
  "notifications-and-sound": "Notifications with sound",
} satisfies Record<NotificationMode, string>;

export function hasNotificationSound(mode: NotificationMode) {
  return mode === "sound" || mode === "notifications-and-sound";
}

export function hasDesktopNotifications(mode: NotificationMode) {
  return mode === "notifications" || mode === "notifications-and-sound";
}

const TAG_HASH_OFFSET_BASIS = 0xcbf29ce484222325n;
const TAG_HASH_PRIME = 0x100000001b3n;
const TAG_HASH_MASK = 0xffffffffffffffffn;

/** Windows drops toast notifications with the 73-character environment/thread tag. */
export function threadNotificationTag(environmentId: EnvironmentId, threadId: ThreadId): string {
  const key = `${environmentId}:${threadId}`;
  let hash = TAG_HASH_OFFSET_BASIS;
  for (let index = 0; index < key.length; index += 1) {
    hash ^= BigInt(key.charCodeAt(index));
    hash = (hash * TAG_HASH_PRIME) & TAG_HASH_MASK;
  }
  return hash.toString(16).padStart(16, "0");
}

let originalFavicon: HTMLLinkElement | undefined;
let badgeFavicon: HTMLLinkElement | undefined;

export function setNotificationBadge(count: number) {
  const bridge = window.desktopBridge;
  let image: string | null = null;
  if (count > 0 && (!bridge || bridge.getClientPlatform?.() === "win32")) {
    const canvas = document.createElement("canvas");
    canvas.width = canvas.height = 64;
    const context = canvas.getContext("2d");
    if (context) {
      context.fillStyle = "#e5484d";
      context.beginPath();
      context.arc(32, 32, 28, 0, Math.PI * 2);
      context.fill();
      context.fillStyle = "white";
      context.font = `600 ${count > 9 ? 30 : 40}px "Segoe UI", sans-serif`;
      context.textAlign = "center";
      context.textBaseline = "middle";
      context.fillText(count > 9 ? "9+" : String(count), 32, 34);
      image = canvas.toDataURL("image/png");
    }
  }
  if (!bridge) {
    if (image) {
      if (!badgeFavicon) {
        originalFavicon = document.querySelector<HTMLLinkElement>('link[rel="icon"]') ?? undefined;
        badgeFavicon = document.createElement("link");
        badgeFavicon.rel = "icon";
        badgeFavicon.type = "image/png";
        badgeFavicon.sizes.value = "64x64";
        originalFavicon?.remove();
        document.head.append(badgeFavicon);
      }
      badgeFavicon.href = image;
    } else if (badgeFavicon) {
      badgeFavicon.remove();
      badgeFavicon = undefined;
      if (originalFavicon) document.head.append(originalFavicon);
      originalFavicon = undefined;
    }
  }
  void bridge?.setNotificationBadge?.({ count, image }).catch(() => undefined);
}

export type AlertSound = "knock" | "chime";
export const ALERT_SOUND_STORAGE_KEY = "tung-code:alert-sound";
export const ALERT_SOUND_LABELS = {
  knock: "Wooden knocks",
  chime: "Chime",
} satisfies Record<AlertSound, string>;

/** Wooden knocks are the default: one knock when a thread finishes, tung tung tung when it needs you. */
export function readAlertSound(): AlertSound {
  try {
    return localStorage.getItem(ALERT_SOUND_STORAGE_KEY) === "chime" ? "chime" : "knock";
  } catch {
    return "knock";
  }
}

export function writeAlertSound(sound: AlertSound) {
  try {
    localStorage.setItem(ALERT_SOUND_STORAGE_KEY, sound);
  } catch {
    // Storage can be unavailable in private windows; the default still applies.
  }
}

/** Seconds from the start of the alert at which each knock lands. */
export const KNOCK_PATTERNS = {
  completion: [0],
  input: [0, 0.2, 0.4],
} as const;
const KNOCK_SECONDS = 0.22;

/** Schedules a woody knock: a fast pitch drop for the body plus a short bright click. Returns its end time. */
function scheduleKnocks(context: AudioContext, offsets: readonly number[]) {
  const start = context.currentTime + 0.01;
  for (const [index, offset] of offsets.entries()) {
    const at = start + offset;
    // The last knock of the chant lands a little lower and louder: tung, tung, TUNG.
    const accent = offsets.length > 1 && index === offsets.length - 1;
    const body = context.createOscillator();
    const bodyGain = context.createGain();
    body.type = "sine";
    body.frequency.setValueAtTime(accent ? 170 : 210, at);
    body.frequency.exponentialRampToValueAtTime(58, at + 0.12);
    bodyGain.gain.setValueAtTime(0.0001, at);
    bodyGain.gain.exponentialRampToValueAtTime(accent ? 0.34 : 0.26, at + 0.004);
    bodyGain.gain.exponentialRampToValueAtTime(0.0001, at + KNOCK_SECONDS);
    body.connect(bodyGain);
    bodyGain.connect(context.destination);
    body.start(at);
    body.stop(at + KNOCK_SECONDS + 0.02);

    const click = context.createOscillator();
    const clickGain = context.createGain();
    click.type = "triangle";
    click.frequency.setValueAtTime(1150, at);
    clickGain.gain.setValueAtTime(0.0001, at);
    clickGain.gain.exponentialRampToValueAtTime(0.08, at + 0.002);
    clickGain.gain.exponentialRampToValueAtTime(0.0001, at + 0.03);
    click.connect(clickGain);
    clickGain.connect(context.destination);
    click.start(at);
    click.stop(at + 0.04);
  }
  return start + (offsets.at(-1) ?? 0) + KNOCK_SECONDS;
}

let audioContext: AudioContext | undefined;
const buffers = new Map<string, Promise<AudioBuffer>>();
/** When each sound's current playback ends, on the audio context's clock. */
const playingUntil = new Map<string, number>();

/** Called from a gesture so browsers allow later background playback. */
export function unlockNotificationAudio() {
  audioContext ??= new AudioContext();
  void audioContext.resume().catch(() => undefined);
}

/** Plays the chosen alert once, right now. Call from a gesture so the browser allows audio. */
export function previewAlertSound(kind: "completion" | "input") {
  unlockNotificationAudio();
  void playNotificationSound(kind, () => true);
}

export async function playNotificationSound(
  kind: "completion" | "input",
  shouldPlay: () => boolean,
) {
  if (!audioContext || audioContext.state !== "running") return;
  const context = audioContext;
  if (readAlertSound() === "knock") {
    const slot = `knock:${kind}`;
    if (!shouldPlay() || context.currentTime < (playingUntil.get(slot) ?? 0)) return;
    try {
      playingUntil.set(slot, scheduleKnocks(context, KNOCK_PATTERNS[kind]));
    } catch {
      playingUntil.delete(slot);
    }
    return;
  }
  const url = kind === "completion" ? completionUrl : inputUrl;
  try {
    let buffer = buffers.get(url);
    if (!buffer) {
      buffer = fetch(url)
        .then((response) => response.arrayBuffer())
        .then((data) => context.decodeAudioData(data));
      buffers.set(url, buffer);
    }
    const decoded = await buffer;
    if (!shouldPlay() || context.state !== "running") return;
    // Coalesce same-sound bursts after decode to avoid clipping; input and completion alerts keep separate slots.
    if (context.currentTime < (playingUntil.get(url) ?? 0)) return;
    const source = context.createBufferSource();
    source.buffer = decoded;
    source.connect(context.destination);
    source.start();
    playingUntil.set(url, context.currentTime + decoded.duration);
  } catch {
    buffers.delete(url);
  }
}
