import type { SVGProps } from "react";

export function T3Wordmark(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      aria-label="Tung Tung Tung Sahur"
      role="img"
      {...props}
      viewBox="0 0 270 60"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect x="2" y="6" width="30" height="48" rx="13" fill="var(--sahur-art-10)" />
      <path d="M9 12v13m7-16v9m9 13v15M10 41v7" stroke="var(--sahur-art-11)" strokeWidth="2" />
      <circle cx="12" cy="27" r="3" fill="var(--sahur-art-12)" />
      <circle cx="23" cy="27" r="3" fill="var(--sahur-art-12)" />
      <circle cx="13" cy="27" r="1.5" fill="var(--sahur-art-13)" />
      <circle cx="22" cy="27" r="1.5" fill="var(--sahur-art-13)" />
      <path d="M12 35q5 6 11 0" fill="none" stroke="var(--sahur-art-13)" strokeWidth="2" />
      <g fill="currentColor" fontFamily="Arial, sans-serif" fontWeight="900">
        <text x="43" y="29" fontSize="25" textLength="219" lengthAdjust="spacingAndGlyphs">
          TUNG TUNG TUNG
        </text>
        <text x="44" y="51" fontSize="17" letterSpacing="12">
          SAHUR
        </text>
      </g>
    </svg>
  );
}
