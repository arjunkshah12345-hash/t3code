import type { SVGProps } from "react";

export function SahurMascot(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 200 220" fill="none" aria-hidden="true" {...props}>
      <ellipse cx="101" cy="207" rx="64" ry="8" fill="currentColor" opacity=".09" />
      <path
        d="M75 170v25l-20 6m67-31v25l19 6"
        stroke="var(--sahur-art-0)"
        strokeWidth="10"
        strokeLinecap="round"
      />
      <path
        d="M55 99q-31 8-22 48m109-48q26 0 31 26"
        stroke="var(--sahur-art-1)"
        strokeWidth="9"
        strokeLinecap="round"
      />
      <path d="m172 143-6-69" stroke="var(--sahur-art-2)" strokeWidth="12" strokeLinecap="round" />
      <rect x="51" y="22" width="95" height="160" rx="40" fill="var(--sahur-art-3)" />
      <path
        d="M64 46v36m10-52v24m16-27v27m16 66v48m19-132v28M64 121v38m21-25v37m48-64v50"
        stroke="var(--sahur-art-4)"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <path
        d="M57 57q40-23 84 0M54 156q45 16 89 0"
        stroke="var(--sahur-art-2)"
        strokeWidth="2"
        opacity=".7"
      />
      <ellipse cx="78" cy="87" rx="16" ry="20" fill="var(--sahur-art-5)" />
      <ellipse cx="119" cy="87" rx="16" ry="20" fill="var(--sahur-art-5)" />
      <ellipse cx="82" cy="89" rx="6" ry="10" fill="var(--sahur-art-6)" />
      <ellipse cx="115" cy="89" rx="6" ry="10" fill="var(--sahur-art-6)" />
      <circle cx="84" cy="85" r="2" fill="var(--sahur-art-7)" />
      <circle cx="117" cy="85" r="2" fill="var(--sahur-art-7)" />
      <path
        d="M80 122q19 21 38 0"
        fill="var(--sahur-art-8)"
        stroke="var(--sahur-art-8)"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <path d="M90 125h18" stroke="var(--sahur-art-5)" strokeWidth="4" strokeLinecap="round" />
      <path
        d="M62 64q12-9 25-3m22 0q12-7 25 3"
        stroke="var(--sahur-art-8)"
        strokeWidth="4"
        strokeLinecap="round"
      />
      <path d="M161 20a14 14 0 1 0 20 20 17 17 0 0 1-20-20Z" fill="var(--sahur-art-9)" />
      <path d="m30 42 2 6 6 2-6 2-2 6-2-6-6-2 6-2Z" fill="var(--sahur-art-9)" />
    </svg>
  );
}
