# Tung Tung Tung Code artwork

The fork's canonical character image is `sahur-character.webp`. It depicts the
original Tung Tung Tung Sahur character holding his wooden bat, rather than an
illustrated substitute.

## Image attribution

- Creator credited by the source: **@noxaasht**.
- Source: [Wikimedia Commons — Tung tung tung sahur.webp](https://commons.wikimedia.org/wiki/File:Tung_tung_tung_sahur.webp).
- Original post linked by Commons: [TikTok](https://www.tiktok.com/@noxaasht/video/7476497064961051909).
- Commons marks the image as AI-generated and public domain for insufficient human
  authorship, with jurisdiction-specific caveats. See the source page for details;
  the repository's MIT code license is not a separate license grant for this image.
- Application icons crop the portrait; social artwork composites the image with
  fork branding. The full image remains available in the marketing site.

## Regenerate and verify

Run `vp run icons:export` from the repository root. The Sharp-based exporter creates
the web, marketing, desktop, iOS, and Android artwork from the canonical image.
Run `vp run icons:check` to compare every generated asset without writing files.

`sahur-mark.svg` is a generated, self-contained SVG wrapper around the cropped
portrait. `sahur-social.svg` is the editable social-card composition; its relative
image reference is embedded by the exporter. Do not edit generated PNGs, ICOs, or
portrait SVG wrappers directly.

Development, nightly, and production assets share the same character. Existing
filenames remain stable so packaging and installed-client compatibility are not
broken. The retained Icon Composer projects receive the generated portrait in
their `text.svg` layer; regeneration does not require Icon Composer or Xcode.

macOS icons retain an 824×824 body inset 100 pixels inside a transparent 1024×1024
canvas. Android adaptive foregrounds and splash images keep the portrait inside
their masked safe areas. Android's monochrome launcher and notification icons
retain a simplified, single-color wooden-character silhouette for legibility and
platform requirements.
