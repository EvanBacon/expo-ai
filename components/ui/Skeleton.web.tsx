// Use CSS to prevent blocking the suspense loading state with a skeleton loader.
import React from "react";
import { View } from "react-native";

import * as AC from "@bacons/apple-colors";

export const SkeletonBox = ({
  width,
  height,
  borderRadius = 8,
  delay,
}: {
  width: number;
  height: number;
  borderRadius?: number;
  delay?: number;
}) => {
  return (
    <Skeleton
      style={{
        width,
        minWidth: width,
        maxWidth: width,
        minHeight: height,
        maxHeight: height,
        height,
        borderRadius,
      }}
      delay={delay}
    />
  );
};

const Skeleton = ({
  style,
  delay,
  dark: inputDark,
}: {
  style?: any;
  delay?: number;
  dark?: boolean;
} = {}) => {
  const dark =
    inputDark != null
      ? {
          bg: inputDark ? "#111111" : "#e0e0e0",
          low: inputDark ? "rgba(255,255,255,0.1)" : "rgba(255,255,255,0.4)",
        }
      : {
          bg: AC.secondarySystemBackground,
          low: AC.tertiaryLabel,
        };

  return (
    <View
      style={[
        {
          background: dark.bg,
          position: "relative",
          overflow: "hidden",
        },
        style,
      ]}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `linear-gradient(90deg, transparent, ${String(dark.low)}, transparent)`,
          animation: `shimmer 1.5s infinite linear ${delay || 0}ms`,
        }}
      />
      <style>
        {`
          @keyframes shimmer {
            0% {
              transform: translateX(-100%);
            }
            100% {
              transform: translateX(100%);
            }
          }
        `}
      </style>
    </View>
  );
};

export default Skeleton;
