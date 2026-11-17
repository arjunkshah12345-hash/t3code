import { Horizon } from "@/components/dithercn/horizon";

/** Pre-dawn over the village: the dithercn horizon, lit amber from below. */
export default function HeroHorizon() {
  return (
    <Horizon
      className="absolute inset-0"
      horizon={0.15}
      curve={0.45}
      glow={0.95}
      aurora={0.65}
      stars={1.1}
      cell={3}
      speed={0.6}
      glowColor="--village-amber"
      skyColor="--village-night"
    />
  );
}
