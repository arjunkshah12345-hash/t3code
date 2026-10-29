export const SAHUR_STORAGE_KEY = "tung-code:sahur:v1";
export const SAHUR_EGGS = {
  knock: { title: "Three knocks. One legend.", hint: "Knock on the wooden mascot three times." },
  chant: { title: "The chant has been heard.", hint: "Type sahur outside a text field." },
  rhythm: { title: "Tung. Tung. Tung. SAHUR!", hint: "Type tungtungtung outside a text field." },
  konami: { title: "Ancient rhythm unlocked.", hint: "↑ ↑ ↓ ↓ ← → ← → B A. You know the drill." },
  dawn: {
    title: "The dawn patrol welcomes you.",
    hint: "Visit the drum room between 3 and 6 AM, local time.",
  },
  moon: { title: "Seven moons. Maximum aura.", hint: "Tap the moon seven times." },
  marathon: {
    title: "33 knocks. Certified wooden legend.",
    hint: "Keep knocking. The 33rd is special.",
  },
  wood: { title: "Solid wood. Zero bugs. Allegedly.", hint: "Type wood outside a text field." },
  bedug: { title: "The village drum has entered the chat.", hint: "Type bedug. Respect the drum." },
  aura: { title: "+1,000 wooden aura.", hint: "Type aura. No subscription required." },
  moonwalk: {
    title: "One small step for log. One giant leap for logkind.",
    hint: "Type moonwalk.",
  },
  village: { title: "The whole village is awake now.", hint: "Type village." },
  wakeup: { title: "Your backlog heard that.", hint: "Type wakeup. Your backlog is listening." },
  midnight: {
    title: "Midnight shift. Wooden supervisor on duty.",
    hint: "Open the room during the midnight hour.",
  },
  encore: {
    title: "66 knocks. The neighbors have questions.",
    hint: "The 66th knock deserves an encore.",
  },
  century: {
    title: "100 knocks. You are the drum now.",
    hint: "A century of knocks. Yes, really.",
  },
  lunar: { title: "The moon has filed a noise complaint.", hint: "Tap the moon 33 times." },
} as const;

export type SahurEgg = keyof typeof SAHUR_EGGS;
export type SahurProgress = { discoveries: SahurEgg[]; sound: boolean };
export const KONAMI_SEQUENCE =
  "ArrowUp ArrowUp ArrowDown ArrowDown ArrowLeft ArrowRight ArrowLeft ArrowRight b a".split(" ");

function isSahurEgg(value: unknown): value is SahurEgg {
  return typeof value === "string" && Object.hasOwn(SAHUR_EGGS, value);
}

export function readSahurProgress(raw: string | null): SahurProgress {
  try {
    const value: unknown = JSON.parse(raw ?? "null");
    if (typeof value !== "object" || value === null) return { discoveries: [], sound: false };
    const record = value as Record<string, unknown>;
    return {
      discoveries: Array.isArray(record.discoveries)
        ? [...new Set(record.discoveries.filter(isSahurEgg))]
        : [],
      sound: record.sound === true,
    };
  } catch {
    return { discoveries: [], sound: false };
  }
}

export function advanceSahurSequence(buffer: readonly string[], key: string) {
  const next = [...buffer, key.length === 1 ? key.toLowerCase() : key].slice(-12);
  const joined = next.join("");
  const typedSecrets = ["moonwalk", "village", "wakeup", "bedug", "wood", "aura"] as const;
  const egg: SahurEgg | null =
    next.slice(-10).join(" ") === KONAMI_SEQUENCE.join(" ")
      ? "konami"
      : joined.endsWith("sahur")
        ? "chant"
        : joined.endsWith("tungtungtung")
          ? "rhythm"
          : (typedSecrets.find((secret) => joined.endsWith(secret)) ?? null);
  return { buffer: next, egg };
}

export function isSahurHour(hour: number) {
  return hour >= 3 && hour < 6;
}

export function sahurVisitDiscovery(hour: number): SahurEgg | null {
  return hour === 0 ? "midnight" : isSahurHour(hour) ? "dawn" : null;
}

export function sahurKnockDiscovery(knocks: number): SahurEgg | null {
  if (knocks === 100) return "century";
  if (knocks === 66) return "encore";
  if (knocks === 33) return "marathon";
  return knocks > 0 && knocks % 3 === 0 ? "knock" : null;
}

export function sahurMoonDiscovery(taps: number): SahurEgg | null {
  return taps === 33 ? "lunar" : taps === 7 ? "moon" : null;
}
