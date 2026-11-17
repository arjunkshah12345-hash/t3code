import type { ReactNode } from "react";
import { GradientText } from "@/registry/free/gradient-text";

/** Live gradient text from gradients.sh, in sunrise colours. */
export default function DawnText({ children }: { children: ReactNode }) {
  return (
    <GradientText kind="mesh" colors={["#ffd28a", "#f0a04b", "#ffe9c4", "#e0702f"]} background="#eba854" speed={0.6}>
      {children}
    </GradientText>
  );
}
