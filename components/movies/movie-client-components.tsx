"use client";

import React from "react";
import { TouchableOpacity, ViewStyle } from "react-native";

import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import type { MovieEntry } from "./movies-data";

export function MovieTouchable({
  movie,
  children,
  style,
}: {
  movie: Pick<
    MovieEntry,
    "poster_path" | "title" | "name" | "media_type" | "id"
  >;
  children: React.ReactNode;
  style?: ViewStyle;
}) {
  return (
    <TouchableOpacity
      delayLongPress={1000}
      style={style}
      activeOpacity={0.8}
      onPress={() => {
        if (process.env.EXPO_OS !== "web") {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }

        router.push({
          pathname: "/movie/[id]",
          params: { id: movie.id, media_type: movie.media_type },
        });
      }}
    >
      {children}
    </TouchableOpacity>
  );
}
