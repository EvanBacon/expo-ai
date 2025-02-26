import Stack from "@/components/ui/Stack";
import TouchableBounce from "@/components/ui/TouchableBounce";
import * as AC from "@bacons/apple-colors";
import * as AppIcon from "expo-quick-actions/icon";
import React from "react";
import { Image, ScrollView, useColorScheme, View } from "react-native";

import MaskedView from "@react-native-masked-view/masked-view";

const backgroundImage =
  process.env.EXPO_OS === "web"
    ? `backgroundImage`
    : `experimental_backgroundImage`;

export default function Page() {
  const icons = [
    [
      require("@/assets/icons/bouquet.png"),
      require("@/assets/icons/floral.png"),
    ],
    require("@/assets/icons/scifi.png"),
    require("@/assets/icons/awe.png"),
    require("@/assets/icons/water.png"),
    require("@/assets/icons/coffee.png"),
    require("@/assets/icons/sunrise.png"),
  ];

  const isDark = useColorScheme() === "dark";
  return (
    <>
      <Stack.Screen
        options={{
          title: "App Icon",
          // @ts-expect-error
          headerLargeStyle: {
            backgroundColor: AC.systemBackground,
          },
        }}
      />
      <ScrollView
        style={{
          backgroundColor: AC.systemBackground,
        }}
        horizontal
        contentContainerStyle={{
          padding: 24,
          gap: 32,
        }}
      >
        {icons.map((icons, index) => {
          const [icon, darkIcon = icon] = Array.isArray(icons)
            ? icons
            : [icons, icons];
          return (
            <TouchableBounce
              sensory
              key={icon}
              onPress={() => {
                AppIcon.setIcon?.(index === 0 ? null : String(index - 1));
              }}
            >
              <View
                style={{
                  borderCurve: "continuous",
                  overflow: "hidden",
                  borderRadius: 20,
                  maxWidth: 72,
                  maxHeight: 72,
                  boxShadow: "0px 4px 24px rgba(0, 0, 0, 0.1)",
                }}
              >
                <Image
                  source={isDark ? darkIcon ?? icon : icon}
                  style={{
                    height: 72,
                    width: 72,
                  }}
                />
              </View>

              <MaskedView
                style={{
                  height: 72,
                  transform: [{ translateY: 12 }],
                }}
                maskElement={
                  <View
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      width: "100%",
                      height: "100%",
                      [backgroundImage]: `linear-gradient(to bottom, rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0) 50%)`,
                    }}
                  />
                }
              >
                <Image
                  source={isDark ? darkIcon : icon}
                  // @ts-expect-error
                  style={{
                    borderRadius: 20,
                    aspectRatio: 1,
                    transform: [{ scaleY: -1 }],
                    maxWidth: 72,

                    maxHeight: 72,
                    // TODO: Not supported on iOS yet
                    filter: [{ blur: 10 }],
                  }}
                />
              </MaskedView>
            </TouchableBounce>
          );
        })}
      </ScrollView>
      <SideGradient />
      <SideGradient right />
    </>
  );
}

function SideGradient({ right }: { right?: boolean }) {
  const isDark = useColorScheme() === "dark";
  return (
    <View
      style={{
        width: 20,
        position: "absolute",
        top: 0,
        bottom: 0,
        ...(right ? { right: 0 } : { left: 0 }),
        [backgroundImage]: [
          {
            type: "linearGradient",
            direction: `to ${right ? "left" : "right"}`,
            colorStops: [
              { color: AC.secondarySystemBackground, positions: ["0%"] },
              {
                color: isDark
                  ? "rgba(28.05, 28.05, 30.6, 0)"
                  : "rgba(242.25, 242.25, 247.35, 0)",
                positions: ["100%"],
              },
            ],
          },
        ],
      }}
    />
  );
}
