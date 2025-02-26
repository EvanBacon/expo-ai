// This file is a fallback for using MaterialIcons on Android and web.

import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { SymbolWeight } from "expo-symbols";
import React from "react";
import { OpaqueColorValue, StyleProp, TextStyle } from "react-native";

// Add your SFSymbol to MaterialIcons mappings here.
const MAPPING = {
  // See MaterialIcons here: https://icons.expo.fyi
  // See SF Symbols in the SF Symbols app on Mac.
  "house.fill": "home",
  "paperplane.fill": "send",
  "chevron.left.forwardslash.chevron.right": "code",
  "chevron.right": "chevron-right",
  "arrow.up.right": "arrow-forward",
  magnifyingglass: "search",
  "photo.on.rectangle": "photo-library",
  star: "star-border",
  "star.fill": "star",
  "car.fill": "directions-car",
  "airpodspro.chargingcase.wireless.fill": "headset",
  "person.fill.badge.plus": "person-add",
  gear: "settings",
  "square.and.pencil": "edit",
  ladybug: "bug-report",
  "xmark.circle.fill": "arrow-circle-down",
  "arrow.down.circle.fill": "arrow-downward",
  "aqi.medium": "dashboard",
  "ellipsis.circle.fill": "more-vert",
  "arrow.up": "arrow-upward",
} as Partial<
  Record<
    import("expo-symbols").SymbolViewProps["name"],
    React.ComponentProps<typeof MaterialIcons>["name"]
  >
>;

export type IconSymbolName = keyof typeof MAPPING;

/**
 * An icon component that uses native SFSymbols on iOS, and MaterialIcons on Android and web. This ensures a consistent look across platforms, and optimal resource usage.
 *
 * Icon `name`s are based on SFSymbols and require manual mapping to MaterialIcons.
 */
export function IconSymbol({
  name,
  size = 24,
  color,
  style,
}: {
  name: IconSymbolName;
  size?: number;
  color: string | OpaqueColorValue;
  style?: StyleProp<TextStyle>;
  weight?: SymbolWeight;

  /** iOS-only */
  animationSpec?: import("expo-symbols").SymbolViewProps["animationSpec"];
}) {
  return (
    <MaterialIcons
      color={color}
      size={size}
      name={MAPPING[name]}
      style={style}
    />
  );
}
