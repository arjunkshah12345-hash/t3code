import { useEffect, useEffectEvent, useRef, useState } from "react";
import {
  advanceSahurSequence,
  sahurVisitDiscovery,
  sahurKnockDiscovery,
  sahurMoonDiscovery,
  readSahurProgress,
  SAHUR_EGGS,
  SAHUR_STORAGE_KEY,
  type SahurEgg,
} from "../sahur";
import { SahurMascot } from "./SahurMascot";

function loadProgress() {
  try {
    return readSahurProgress(localStorage.getItem(SAHUR_STORAGE_KEY));
  } catch {
    return readSahurProgress(null);
  }
}

async function playKnock() {
  if (typeof AudioContext === "undefined") return;
  let context: AudioContext | undefined;
  try {
    context = new AudioContext();
    await context.resume();
    const oscillator = context.createOscillator();
    const volume = context.createGain();
    oscillator.type = "sine";
    oscillator.frequency.setValueAtTime(180, context.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(52, context.currentTime + 0.14);
    volume.gain.setValueAtTime(0.22, context.currentTime);
    volume.gain.exponentialRampToValueAtTime(0.001, context.currentTime + 0.18);
    oscillator.connect(volume);
    volume.connect(context.destination);
    oscillator.start();
    oscillator.stop(context.currentTime + 0.2);
    oscillator.onended = () => {
      void context?.close().catch(() => undefined);
    };
  } catch {
    await context?.close().catch(() => undefined);
  }
}

export function SahurRoom() {
  const [progress, setProgress] = useState(loadProgress);
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("The village is quiet. For now.");
  const [knocks, setKnocks] = useState(0);
  const moonTaps = useRef(0);
  const sequence = useRef<string[]>([]);

  function discover(egg: SahurEgg) {
    setProgress((current) =>
      current.discoveries.includes(egg)
        ? current
        : {
            ...current,
            discoveries: [...current.discoveries, egg],
          },
    );
    setMessage(SAHUR_EGGS[egg].title);
  }

  const onSecretKey = useEffectEvent((event: KeyboardEvent) => {
    const target = event.target;
    if (
      event.isComposing ||
      event.repeat ||
      event.metaKey ||
      event.ctrlKey ||
      event.altKey ||
      (target instanceof Element &&
        target.closest(
          "input, textarea, select, [contenteditable]:not([contenteditable='false']), [role='textbox'], .xterm, [role='dialog']",
        ))
    ) {
      sequence.current = [];
      return;
    }
    if (event.key === "Escape") {
      setOpen(false);
      sequence.current = [];
      return;
    }
    const next = advanceSahurSequence(sequence.current, event.key);
    sequence.current = next.buffer;
    if (next.egg) {
      discover(next.egg);
      setOpen(true);
      sequence.current = [];
    }
  });

  // oxlint-disable-next-line t3code/no-unreasoned-state-sync -- subscribes to global secret keys only while the drum room is mounted
  useEffect(() => {
    const handleKey = (event: KeyboardEvent) => onSecretKey(event);
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  // oxlint-disable-next-line t3code/no-unreasoned-state-sync -- persists local discoveries and sound preference across visits
  useEffect(() => {
    try {
      localStorage.setItem(SAHUR_STORAGE_KEY, JSON.stringify(progress));
    } catch {
      return;
    }
  }, [progress]);

  function toggleRoom() {
    setOpen(!open);
    const egg = sahurVisitDiscovery(new Date().getHours());
    if (!open && egg) discover(egg);
  }

  function knock() {
    const next = knocks + 1;
    setKnocks(next);
    if (progress.sound) void playKnock();
    const egg = sahurKnockDiscovery(next);
    if (egg) discover(egg);
    else setMessage(next % 3 === 1 ? "Tung." : "Tung. Tung.");
  }

  return (
    <aside className="sahur-room" aria-label="Sahur easter eggs">
      {open && (
        <section className="sahur-room-panel" aria-label="The drum room">
          <header className="sahur-room-header">
            <span className="sahur-eyebrow">AFTER HOURS / BEFORE DAWN</span>
            <button
              className="sahur-close"
              onClick={() => setOpen(false)}
              aria-label="Close drum room"
            >
              ×
            </button>
          </header>
          <button
            className="sahur-mascot-button"
            onClick={knock}
            aria-label={`Knock on the wooden mascot. ${knocks} knocks.`}
          >
            <SahurMascot />
          </button>
          <h2>The drum room.</h2>
          <p className="sahur-room-message" role="status" aria-live="polite">
            {message}
          </p>
          <div className="sahur-room-controls">
            <button
              onClick={() => setProgress((current) => ({ ...current, sound: !current.sound }))}
              aria-pressed={progress.sound}
            >
              Sound {progress.sound ? "on" : "off"}
            </button>
            <button
              aria-label="Tap the secret moon"
              onClick={() => {
                moonTaps.current += 1;
                const egg = sahurMoonDiscovery(moonTaps.current);
                if (egg) discover(egg);
                else setMessage("The moon is listening.");
              }}
            >
              ☾
            </button>
          </div>
          <details className="sahur-secrets">
            <summary>
              {progress.discoveries.length} / {Object.keys(SAHUR_EGGS).length} secrets found
            </summary>
            <ul>
              {Object.entries(SAHUR_EGGS).map(([key, egg]) => (
                <li key={key} data-found={progress.discoveries.includes(key as SahurEgg)}>
                  <span aria-hidden="true">
                    {progress.discoveries.includes(key as SahurEgg) ? "✦" : "◇"}
                  </span>{" "}
                  {egg.hint}
                </li>
              ))}
            </ul>
            <button
              className="sahur-reset"
              onClick={() => {
                setProgress({ discoveries: [], sound: false });
                setKnocks(0);
                moonTaps.current = 0;
                sequence.current = [];
                setMessage("A fresh night. A fresh legend.");
              }}
            >
              Reset discoveries & mute
            </button>
          </details>
          <p className="sahur-room-footnote">Code quietly. Carry a big stick.</p>
        </section>
      )}
      <button
        className="sahur-room-toggle"
        aria-expanded={open}
        onClick={toggleRoom}
        aria-label="Open or close the Sahur drum room"
      >
        <span aria-hidden="true">☾</span> <span>SAHUR</span>
        <span className="sahur-room-count">
          {progress.discoveries.length}/{Object.keys(SAHUR_EGGS).length}
        </span>
      </button>
    </aside>
  );
}
