"use client";

import * as AC from "@bacons/apple-colors";
import * as Haptics from "expo-haptics";
import React, { useEffect } from "react";
import Markdown from "react-native-markdown-display";

export default function MarkdownText({
  done,
  ...props
}: React.ComponentProps<typeof Markdown> & { done?: boolean }) {
  useEffect(() => {
    if (process.env.EXPO_OS === "ios") {
      if (done) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      } else {
        Haptics.selectionAsync();
      }
    }
  }, [done]);
  return (
    <>
      <Markdown
        debugPrintTree={false}
        style={{
          body: {
            color: AC.label,
            paddingHorizontal: 16,
          },
          paragraph: {
            fontSize: 16,
          },
          em: {
            fontStyle: "italic",
          },
          code_inline: {
            backgroundColor: AC.systemGray5,
            paddingHorizontal: 2,
            borderRadius: 2,
            paddingVertical: 0,
          },
          strong: {},
          blockquote: {
            backgroundColor: AC.systemGray3,
          },
          fence: {
            borderWidth: 0,
            backgroundColor: AC.systemGroupedBackground,
          },
        }}
        {...props}
      />
      {/* TODO: Add a toolbar to the end of the text message when it's complete. */}
    </>
  );
}
