// Same synthesis as the app's wooden-knock alert (apps/web threadNotifications), so the site plays the real sound.
const KNOCK_SECONDS = 0.22;
let context: AudioContext | null = null;

export const KNOCK_PATTERNS = { completion: [0], input: [0, 0.2, 0.4] } as const;

export function playKnocks(offsets: readonly number[] = KNOCK_PATTERNS.input) {
  context ??= new AudioContext();
  const ctx = context;
  if (ctx.state === "suspended") void ctx.resume();
  const start = ctx.currentTime + 0.01;
  for (const [index, offset] of offsets.entries()) {
    const at = start + offset;
    const accent = offsets.length > 1 && index === offsets.length - 1;
    const body = ctx.createOscillator();
    const bodyGain = ctx.createGain();
    body.type = "sine";
    body.frequency.setValueAtTime(accent ? 170 : 210, at);
    body.frequency.exponentialRampToValueAtTime(58, at + 0.12);
    bodyGain.gain.setValueAtTime(0.0001, at);
    bodyGain.gain.exponentialRampToValueAtTime(accent ? 0.34 : 0.26, at + 0.004);
    bodyGain.gain.exponentialRampToValueAtTime(0.0001, at + KNOCK_SECONDS);
    body.connect(bodyGain).connect(ctx.destination);
    body.start(at);
    body.stop(at + KNOCK_SECONDS + 0.02);

    const click = ctx.createOscillator();
    const clickGain = ctx.createGain();
    click.type = "triangle";
    click.frequency.setValueAtTime(1150, at);
    clickGain.gain.setValueAtTime(0.0001, at);
    clickGain.gain.exponentialRampToValueAtTime(0.08, at + 0.002);
    clickGain.gain.exponentialRampToValueAtTime(0.0001, at + 0.03);
    click.connect(clickGain).connect(ctx.destination);
    click.start(at);
    click.stop(at + 0.04);
  }
}
