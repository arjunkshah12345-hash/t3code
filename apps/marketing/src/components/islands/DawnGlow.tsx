import { RadialGlow } from "@/registry/free/radial-glow";

/** First light for the closing call to action, from gradients.sh. */
export default function DawnGlow() {
  return (
    <RadialGlow
      className="absolute inset-0"
      colors={["#2a1407", "#b4551f", "#f0b25c", "#fff1d6"]}
      background="#0e0a07"
      speed={0.5}
      grain={0.35}
      dither={{ enabled: true }}
      maxDpr={1.25}
    />
  );
}
