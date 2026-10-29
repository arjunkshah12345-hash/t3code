import type { ColorValue } from "react-native";
import Svg, { Circle, Path, Rect, Text as SvgText } from "react-native-svg";
import { withUniwind } from "uniwind";

const ThemedText = withUniwind(SvgText);

export function T3Wordmark(props: {
  readonly height: number;
  readonly color?: ColorValue;
  readonly colorClassName?: string;
}) {
  return (
    <Svg
      accessibilityLabel="Tung Tung Tung Sahur"
      height={props.height}
      width={props.height * 4.5}
      viewBox="0 0 270 60"
    >
      <Rect x="2" y="6" width="30" height="48" rx="13" fill="#b87939" />
      <Path d="M9 12v13m7-16v9m9 13v15M10 41v7" stroke="#75431f" strokeWidth="2" />
      <Circle cx="12" cy="27" r="3" fill="#fff4d9" />
      <Circle cx="23" cy="27" r="3" fill="#fff4d9" />
      <Circle cx="13" cy="27" r="1.5" fill="#291d15" />
      <Circle cx="22" cy="27" r="1.5" fill="#291d15" />
      <Path d="M12 35q5 6 11 0" fill="none" stroke="#291d15" strokeWidth="2" />
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
        SAHUR
      </ThemedText>
    </Svg>
  );
}
