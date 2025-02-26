import * as AC from "@bacons/apple-colors";
import { Text, View, ViewProps } from "react-native";

import SkeletonLoading from "@/components/ui/Skeleton";

export function CardHeader({
  icon,
  title,
}: {
  icon: React.ReactNode;
  title: string;
}) {
  return (
    <View style={{ flexDirection: "row", gap: 8, alignItems: "center" }}>
      <View
        style={{
          borderRadius: 8,
          backgroundColor: "#000",
          flexDirection: "row",
          alignItems: "center",

          padding: 4,
          gap: 8,
          aspectRatio: 1,
        }}
      >
        {icon}
      </View>

      <Text
        style={{
          fontSize: 16,
          fontWeight: "bold",
        }}
      >
        {title}
      </Text>
    </View>
  );
}

const borderColor = process.env.EXPO_OS === "android" ? "transparent" : AC.separator;

export function Card({
  style,
  title,
  children,
  fillSpace,
}: ViewProps & { fillSpace?: boolean; title?: string }) {
  return (
    <View style={[!fillSpace && { paddingHorizontal: 16 }, { gap: 8 }]}>
      {title && (
        <Text
          style={[
            fillSpace && { paddingHorizontal: 16 },
            {
              fontSize: 24,
              color: AC.label,
              fontWeight: "500",
            },
          ]}
        >
          {title}
        </Text>
      )}
      <View
        style={[
          {
            padding: 16,
            borderCurve: "continuous",
            borderRadius: fillSpace ? 0 : 12,
            gap: 8,
            flexShrink: 0,
            overflow: "hidden",
            backgroundColor: "white",
            borderWidth: fillSpace ? 0 : 1,
            borderColor,
          },

          style,
        ]}
      >
        {children}
      </View>
    </View>
  );
}

export function CardSkeleton() {
  return (
    <Card title="Loading...">
      <SkeletonLoading />
      <SkeletonLoading style={{ width: "75%" }} />
    </Card>
  );
}
