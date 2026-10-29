# Tung Tung Tung Code

**Good code. Great aura. All wood.**

A fully Sahur-themed community fork of [T3 Code](https://github.com/pingdotgg/t3code): warm timber palettes, custom wooden-guardian branding, a redesigned website, and a coding-agent workspace that takes everything seriously except itself.

![Tung Tung Tung Sahur](assets/sahur-mark.svg)

## Enter the village

Use the Node and pnpm versions declared in `package.json`:

```sh
git clone https://github.com/arjunkshah12345-hash/t3code.git tung-tung-tung-code
cd tung-tung-tung-code
pnpm install
pnpm dev
```

Authenticate at least one supported coding-agent CLI first. Bring your own Claude Code, Codex, Cursor, Grok, OpenCode, or Antigravity setup. Provider subscriptions and credentials are yours; this fork does not provide them.

**Source builds only for now.** Upstream T3 installers, mobile-store listings, and hosted services are not releases of this fork. Changes in your local checkout are not published until committed and pushed.

## The workspace

- Warm light and dark wood palettes across web, desktop, and mobile.
- Original wooden guardian, Sahur wordmark, desktop icons, mobile splash screens, favicons, and share artwork.
- Projects, agent threads, terminals, diffs, and checkpoints from the upstream foundation.
- An optional drum room with **17 discoveries**, local progress, and an explicit sound toggle.
- A separate Astro website with original Sahur artwork and **six website secrets**.
- A hidden Village OS 95 desktop. Find the suspicious clock in the website footer.

## The lore

Open **☾ SAHUR** in the app. Start with three knocks on the mascot.

| Ritual                                                           | Discovery              |
| ---------------------------------------------------------------- | ---------------------- |
| 3, 33, 66, and 100 mascot knocks                                 | Four wooden milestones |
| 7 and 33 moon taps                                               | Two lunar visitors     |
| Type `sahur` or `tungtungtung`                                   | The original chants    |
| Type `wood`, `bedug`, `aura`, `moonwalk`, `village`, or `wakeup` | Six village legends    |
| ↑ ↑ ↓ ↓ ← → ← → B A                                              | The ancient rhythm     |
| Open the drum room between 3–6 AM, local time                    | Dawn patrol            |
| Open it between midnight–1 AM, local time                        | Midnight supervisor    |

Typing rituals ignore text fields, editors, terminals, IME composition, and modified shortcuts. Sound is off by default and only plays after an intentional mascot click. Discoveries stay on your device and can be reset. No remote meme assets, autoplay, or perpetual background animations.

The website has its own collection: three knocks, 33 knocks, seven moon taps, both original chants, and the ancient rhythm. Website discoveries last for the page visit and do not use cookies or local storage.

## Run the website

```sh
pnpm --filter @t3tools/marketing dev
pnpm --filter @t3tools/marketing build
```

The included `Sahur website` GitHub Actions workflow builds and deploys the static site to GitHub Pages. Enable Pages with GitHub Actions as the source in the fork’s repository settings. Its project-path links follow the repository name automatically, including after a rename. Nothing is deployed until the changes are pushed and the workflow runs.

CLI updates, installer downloads, and desktop recovery links use this fork’s releases, never upstream binaries. No fork binaries are published yet; build from source until a release is available. Existing `t3` commands, archive names, and data-directory identifiers stay compatible.

## Development

```sh
pnpm exec vp test run apps/web/src/sahur.test.ts
pnpm exec vp run @t3tools/web#typecheck
pnpm icons:export
pnpm icons:check
```

Icons are generated from `assets/sahur-mark.svg`; see [the artwork guide](assets/README.md). Read [AGENTS.md](AGENTS.md) before changing the architecture. Internal workspace package names, data paths, provider contracts, and connection protocols retain compatible upstream identifiers where renaming would break integrations.

## Roots, not impersonation

This is an independent community fork, not an official T3 product. The upstream maintainers did not endorse this branding or its lore. Original copyright, [license](LICENSE), and third-party notices remain intact. Existing upstream service policies apply to their services, not to a new service operated by this fork.

Code quietly. Carry a big stick.
