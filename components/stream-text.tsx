"use client";

// import { Text } from "react-native";
import { StreamableValue, readStreamableValue } from "ai/rsc";
import { useEffect, useState } from "react";
import MarkdownText from "./markdown-text";

export const useStreamableText = (
  content: string | StreamableValue<string>
) => {
  const [rawContent, setRawContent] = useState(
    typeof content === "string" ? content : ""
  );

  useEffect(() => {
    (async () => {
      if (typeof content === "object") {
        let value = "";

        for await (const delta of readStreamableValue(content)) {
          if (typeof delta === "string") {
            setRawContent((value = value + delta));
          }
        }
      }
    })();
  }, [content]);

  return rawContent;
};

export function BotMessage({
  content,
}: {
  content: string | StreamableValue<string>;
}) {
  const text = useStreamableText(content);

  return (
    <MarkdownText
    // style={{
    //   color: "white",
    //   paddingHorizontal: 16,

    //   fontSize: 16,
    // }}
    >
      {text}
    </MarkdownText>
  );
}
