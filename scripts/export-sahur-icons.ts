import * as NodeFSP from "node:fs/promises";
import * as NodeURL from "node:url";
import * as NodePath from "node:path";
import sharp from "sharp";
import { encodePngIco, WINDOWS_ICON_SIZES } from "./lib/icon-export.ts";

const root = NodeURL.fileURLToPath(new URL("../", import.meta.url));
const source = await NodeFSP.readFile(NodePath.resolve(root, "assets/sahur-mark.svg"));
const socialSource = await NodeFSP.readFile(NodePath.resolve(root, "assets/sahur-social.svg"));
const png = async (size: number) => sharp(source).resize(size, size).png().toBuffer();
const checkOnly = process.argv.includes("--check");
const save = async (path: string, contents: Buffer) => {
  const target = NodePath.resolve(root, path);
  if (checkOnly) {
    if (!(await NodeFSP.readFile(target)).equals(contents))
      throw new Error(`Stale Sahur icon: ${path}`);
  } else {
    await NodeFSP.writeFile(target, contents);
  }
};
const icon = await png(1024);
const apple = await png(180);
const small = await png(16);
const medium = await png(32);
const ico = encodePngIco(
  await Promise.all(WINDOWS_ICON_SIZES.map(async (size) => ({ size, contents: await png(size) }))),
);
const favicon = encodePngIco(
  await Promise.all([16, 32, 48].map(async (size) => ({ size, contents: await png(size) }))),
);

for (const [directory, prefix] of [
  ["dev", "blueprint"],
  ["nightly", "nightly"],
  ["prod", "black"],
] as const) {
  for (const platform of ["ios", "universal"])
    await save(`assets/${directory}/${prefix}-${platform}-1024.png`, icon);
  const macIcon = await sharp({
    create: { width: 1024, height: 1024, channels: 4, background: "#00000000" },
  })
    .composite([{ input: await png(824), left: 100, top: 100 }])
    .png()
    .toBuffer();
  await save(`assets/${directory}/${prefix}-macos-1024.png`, macIcon);
  const webPrefix = directory === "prod" ? "t3-black" : prefix;
  await save(`assets/${directory}/${webPrefix}-windows.ico`, ico);
  await save(`assets/${directory}/${webPrefix}-web-favicon.ico`, favicon);
  await save(`assets/${directory}/${webPrefix}-web-favicon-16x16.png`, small);
  await save(`assets/${directory}/${webPrefix}-web-favicon-32x32.png`, medium);
  await save(`assets/${directory}/${webPrefix}-web-apple-touch-180.png`, apple);
}

await save("apps/web/public/favicon.ico", favicon);
await save("apps/web/public/favicon-16x16.png", small);
await save("apps/web/public/favicon-32x32.png", medium);
await save("apps/web/public/apple-touch-icon.png", apple);
await save("apps/marketing/public/favicon.ico", favicon);
await save("apps/marketing/public/favicon-16x16.png", small);
await save("apps/marketing/public/favicon-32x32.png", medium);
await save("apps/marketing/public/apple-touch-icon.png", apple);
await save("apps/marketing/public/sahur-social.png", await sharp(socialSource).png().toBuffer());
await save(
  "apps/marketing/src/assets/social-card.webp",
  await sharp(socialSource).webp().toBuffer(),
);
await save(
  "apps/marketing/src/assets/icon-nightly.webp",
  await sharp(source).resize(512).webp().toBuffer(),
);
await save(
  "apps/marketing/src/assets/icon.webp",
  await sharp(source).resize(512).webp().toBuffer(),
);
for (const directory of ["apps/web/public", "apps/marketing/public"])
  await save(`${directory}/sahur.svg`, source);

const transparentMark = Buffer.from(
  source.toString().replace(/  <rect (?:width="128"|x="8")[^\n]+\n/g, ""),
);
const foreground = await sharp({
  create: { width: 432, height: 432, channels: 4, background: "#00000000" },
})
  .composite([
    { input: await sharp(transparentMark).resize(280).png().toBuffer(), left: 76, top: 76 },
  ])
  .png()
  .toBuffer();
await save("apps/mobile/assets/android-icon-foreground.png", foreground);
const silhouette = Buffer.from(
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128"><path fill="white" fill-rule="evenodd" d="M44 24a20 20 0 0 1 40 0v64a20 20 0 0 1-40 0V24Zm10 18a5 7 0 1 0 0 14 5 7 0 1 0 0-14Zm20 0a5 7 0 1 0 0 14 5 7 0 1 0 0-14ZM54 72q10 14 20 0H54Z"/><path d="m96 48 8 54" stroke="white" stroke-width="7" stroke-linecap="round"/></svg>`,
);
await save(
  "apps/mobile/assets/android-icon-mark.png",
  await sharp(silhouette).resize(432).png().toBuffer(),
);
await save(
  "apps/mobile/assets/android-notification-icon.png",
  await sharp(silhouette).resize(96).png().toBuffer(),
);
await save("assets/prod/logo.svg", source);
for (const channel of ["dev", "nightly", "prod"]) {
  await save(`assets/${channel}/app-icon.icon/Assets/text.svg`, source);
}
for (const channel of ["dev", "nightly", "prod"]) {
  const splash = await sharp({
    create: { width: 864, height: 864, channels: 4, background: "#211810" },
  })
    .composite([
      { input: await sharp(transparentMark).resize(500).png().toBuffer(), left: 182, top: 182 },
    ])
    .png()
    .toBuffer();
  await save(`apps/mobile/assets/android-splash-icon-${channel}.png`, splash);
  if (channel !== "prod") {
    await save(
      `apps/mobile/assets/android-icon-background-${channel}.png`,
      await sharp({ create: { width: 432, height: 432, channels: 4, background: "#211810" } })
        .png()
        .toBuffer(),
    );
  }
}
console.log(
  `Sahur icons ${checkOnly ? "verified" : "exported"} for web, desktop, iOS, Android, and marketing.`,
);
