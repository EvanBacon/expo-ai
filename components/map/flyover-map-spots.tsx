"use client";

import { BlurView } from "expo-blur";
import { useEffect, useRef, useState } from "react";
import { Linking, NativeScrollEvent, NativeSyntheticEvent, Platform, ScrollView, Text, View } from "react-native";

import { FlyoverMap } from "@/components/map/flyover-map";
import TouchableBounce from "@/components/ui/TouchableBounce";

import * as AC from "@bacons/apple-colors";
import { IconSymbol } from "../ui/IconSymbol";

const useWebOnScroll = ({
  onScroll,
  onScrollEnd,
}: {
  onScroll?: React.ComponentProps<typeof ScrollView>["onScroll"];
  onScrollEnd: (event: NativeSyntheticEvent<NativeScrollEvent>) => void;
}) => {
  const lastScrollEvent = useRef<number | null>(null);
  const scrollEndTimeout = useRef<NodeJS.Timeout | null>(null);

  const handleWebScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    onScroll?.(event);

    const timestamp = Date.now();

    if (scrollEndTimeout.current) {
      clearTimeout(scrollEndTimeout.current);
    }

    if (lastScrollEvent.current) {
      // Scroll ended
      scrollEndTimeout.current = setTimeout(() => {
        if (lastScrollEvent.current === timestamp) {
          lastScrollEvent.current = null;
          onScrollEnd && onScrollEnd(event);
        }
      }, 500);
    }

    lastScrollEvent.current = timestamp;
  };

  useEffect(() => {
    return () => {
      scrollEndTimeout.current && clearTimeout(scrollEndTimeout.current);
    };
  }, []);

  return handleWebScroll;
};

export function FlyoverCard({
  locations,
}: {
  locations: {
    icon: string;
    title: string;
    latitude: number;
    longitude: number;
    altitude?: number;
    rating: number;
    address: string;
    isOpen: boolean;
    userRatingsTotal: number;
    userRating: number;
  }[];
}) {
  const [location, setLocation] = useState(locations[0]);
  const [width, setWidth] = useState(0);

  const handleWebScroll = useWebOnScroll({
    onScrollEnd(event) {
      if (process.env.EXPO_OS !== "web") return;
      const index = Math.round(event.nativeEvent.contentOffset.x / width);
      const nextLocation = locations[index];
      if (nextLocation.title !== location.title) {
        setLocation(nextLocation);
      }
    },
  });

  return (
    <View
      onLayout={(event) => {
        setWidth(event.nativeEvent.layout.width);
      }}
      style={{
        flex: 1,
        minHeight: 400,
        maxHeight: 400,
      }}
    >
      {location && (
        <FlyoverMap
          center={location}
          altitude={process.env.EXPO_OS === "web" ? 1000 : 500}
        />
      )}
      <ScrollView
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: 128,
        }}
        scrollEventThrottle={16}
        onScroll={Platform.select({
          web: handleWebScroll,
          default: undefined,
        })}
        onMomentumScrollEnd={(event) => {
          const index = Math.round(event.nativeEvent.contentOffset.x / width);
          const nextLocation = locations[index];
          if (nextLocation.title !== location.title) {
            setLocation(nextLocation);
          }
        }}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: 24,
        }}
      >
        {locations.map((value, index) => (
          <View
            key={index}
            style={{
              backgroundColor: "transparent",
              flex: 1,
              width,
              paddingHorizontal: 16,
            }}
          >
            <TouchableBounce
              sensory
              style={{
                flex: 1,
              }}
              onPress={() => {
                // Open Maps URL
                if (process.env.EXPO_OS === "ios") {
                  const { title, latitude, longitude } = value;
                  Linking.openURL(
                    `http://maps.apple.com/?q=${title}&ll=${latitude},${longitude}`
                  );
                } else {
                  const { title, latitude, longitude } = value;
                  // Open Google Maps
                  Linking.openURL(
                    `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}&query_place_id=${title}`
                  );
                }
              }}
            >
              <BlurView
                experimentalBlurMethod="dimezisBlurView"
                tint="systemMaterial"
                style={{
                  //   backgroundColor: '#191A20',
                  borderRadius: 10,
                  borderCurve: "continuous",
                  width: width - 32,
                  overflow: "hidden",
                  padding: 16,
                  justifyContent: "center",
                }}
              >
                <View
                  style={{
                    gap: 8,
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                >
                  <View
                    style={{
                      maxWidth: "80%",
                      gap: 4,
                    }}
                  >
                    <Text
                      numberOfLines={1}
                      style={{
                        color: AC.label,
                        flexWrap: "wrap",
                        paddingRight: 16,
                        fontSize: 16,
                        fontWeight: "600",
                      }}
                    >
                      {value.title}
                    </Text>
                    <Text
                      numberOfLines={2}
                      style={{
                        color: AC.secondaryLabel,
                        fontSize: 14,
                      }}
                    >
                      {value.address}
                    </Text>

                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 6,
                      }}
                    >
                      <Text
                        style={{
                          color: value.isOpen ? AC.systemGreen : AC.systemRed,
                        }}
                      >
                        {value.isOpen ? "Open" : "Closed"}
                      </Text>

                      <IconSymbol
                        name="star.fill"
                        color={AC.systemYellow}
                        size={14}
                      />
                      <Text style={{ color: AC.label }}>
                        {value.userRating} ({value.userRatingsTotal})
                      </Text>
                    </View>
                  </View>
                </View>
              </BlurView>
            </TouchableBounce>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}
