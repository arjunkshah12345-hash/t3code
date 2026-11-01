import type { ColorValue } from "react-native";
import Svg, { Image, Text as SvgText } from "react-native-svg";
import { withUniwind } from "uniwind";

import { T3_CODE_BRAND_MARK_SOURCE } from "./brandAssets";

const ThemedText = withUniwind(SvgText);

export function T3Wordmark(props: {
  readonly height: number;
  readonly color?: ColorValue;
  readonly colorClassName?: string;
}) {
  return (
    <Svg
      accessibilityLabel="Tung Tung Tung Code"
      height={props.height}
      width={props.height * 4.5}
      viewBox="0 0 270 60"
    >
      <Image href={T3_CODE_BRAND_MARK_SOURCE} x="0" y="10" width="40" height="40" />
      <ThemedText
        x="43"
        y="29"
        fontSize="24"
        fontWeight="900"
        color={props.color}
        colorClassName={props.colorClassName}
        fill="currentColor"
      >
        TUNG TUNG TUNG
      </ThemedText>
      <ThemedText
        x="44"
        y="49"
        fontSize="16"
        fontWeight="900"
        letterSpacing="8"
        color={props.color}
        colorClassName={props.colorClassName}
        fill="currentColor"
      >
        CODE
      </ThemedText>
    </Svg>
  );
}
