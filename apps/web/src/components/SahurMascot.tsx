import type { SVGProps } from "react";

export function SahurMascot(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 200 220" fill="none" aria-hidden="true" {...props}>
      <image href={`${import.meta.env.BASE_URL}sahur.svg`} y="10" width="200" height="200" />
    </svg>
  );
}
