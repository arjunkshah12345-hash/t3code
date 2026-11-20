# Keep watch — feature film for the village-watch release

35 s, 1920×1080, 30 fps. Music: MusicGen "watch" bed (~112 BPM, wooden percussion). The film shows the five features in the `feat/village-watch` commit, using the labels in the code word for word.

## The idea
⌘K is the hub. A tab counts who's waiting, the palette takes you to them, takes the answer, writes the standup, then night falls: finished threads sleep, stuck ones still knock. Dawn: "Keep watch. Sleep anyway."

## Numbers
- Ground: night #07060d → deep #040309 (quiet) → dawn gradient (end). Accent #eba854, gold #ffd08a, ink #f6ecdc. App surfaces #1b1512 / border rgba(246,236,220,.12), the real app's warm dark.
- Type: DM Sans 600 for titles (96–150 px), 400–500 for UI; JetBrains Mono for keys, code, the report. UI is shown at 1.6–2× its real size, never smaller than 26 px.
- Arrivals: expo.out / power4.out, 0.5–0.8 s. Camera: power2.inOut 0.5–0.6 s. Exits: power3.in, 0.25–0.35 s. Titles land, then hold dead still.
- Transitions (6 kinds): tab count pill morphs into the palette · zoom through the palette row into the thread · whip-in of the second palette · slot-roll of the row title into "Village report" · colour flood to deep night · colour flood to dawn, then the sun rises.
- Cursor: 64 px, enters from off-frame; each click causes the next change on the same frame.

## Beats
| s | Scene | What happens |
|---|---|---|
| 0–6.6 | tab | Tab "Tung Tung Tung Code" at 2×. Knock → "(1)". Knock → rolls to "(2)". "Two agents are waiting on you." Push into the count. |
| 6.3–15.9 | jump | The count morphs into ⌘K. Typing "next" → "Go to next thread waiting on you". ↵ → zoom through into the real thread screenshot, punch in on it. "Longest wait first." Second palette whips in: "Copy last agent reply" ↵ → the reply highlights, toast "Last reply copied". |
| 15.4–21.8 | report | The palette row rolls to "Village report" ↵ → the palette grows into the Markdown report; lines land; "since 3:14 AM" lights up. |
| 21.6–29.4 | quiet | Flood to deep night. Notifications card: cursor sets Quiet hours to "10 p.m. – 7 a.m.". "Finished threads sleep." (waveform goes flat, silence) / "Stuck ones still knock." (tung, tung, TUNG; frame jolts). |
| 29.2–35 | end | Flood to dawn. "Keep watch. Sleep anyway." Sun mascot rises, wordmark, the five features, URL. Hold 2.5 s. |

## Banned
Fade-and-slide-up on every element, floating/breathing loops, a feature list as three cards, tilted 3D UI, click rings, invented UI labels.
