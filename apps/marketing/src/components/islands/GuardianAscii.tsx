import { AsciiImage } from "@/components/ascii/ascii-image";

/** The wooden guardian, redrawn in characters by asciicn. Hover to see the real one. */
export default function GuardianAscii({ src }: { src: string }) {
  return (
    <AsciiImage
      src={src}
      alt="Tung Tung Tung Sahur, drawn in ASCII characters"
      reveal
      charset="standard"
      fontSize={10}
      color="source"
      backdrop={0.15}
      className="guardian-ascii"
    />
  );
}
