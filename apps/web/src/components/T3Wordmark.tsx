import type { SVGProps } from "react";

export function T3Wordmark(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      aria-label="Tung Tung Tung Code"
      role="img"
      {...props}
      viewBox="0 0 270 60"
      xmlns="http://www.w3.org/2000/svg"
    >
      <image href={`${import.meta.env.BASE_URL}sahur.svg`} x="0" y="10" width="40" height="40" />
      <g fill="currentColor" fontFamily="Arial, sans-serif" fontWeight="900">
        <text x="43" y="29" fontSize="25" textLength="219" lengthAdjust="spacingAndGlyphs">
          TUNG TUNG TUNG
        </text>
        <text x="44" y="51" fontSize="17" letterSpacing="12">
          CODE
        </text>
      </g>
    </svg>
  );
}
