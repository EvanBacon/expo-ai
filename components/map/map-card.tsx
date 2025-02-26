import { View } from "react-native";
import { Card } from "../card";
import Skeleton from "../ui/Skeleton";
import { FlyoverCard } from "./flyover-map-spots";
import { PointOfInterestData } from "./googleapis-maps";

export function MapSkeleton() {
  return (
    <Card title="Searching area..." fillSpace={process.env.EXPO_OS !== "web"}>
      <View style={{ borderRadius: 10, height: 240 }} />
      <Skeleton
        dark={false}
        style={{ borderRadius: 10, height: 96 }}
        delay={200}
      />
    </Card>
  );
}

export function MapCard({
  city,
  data,
}: {
  city: string;
  data: PointOfInterestData[];
}) {
  return (
    <Card
      fillSpace={process.env.EXPO_OS !== "web"}
      title={`Results for ${city}`}
      style={{ padding: 0 }}
    >
      <FlyoverCard
        locations={data
          .sort((a, b) => {
            return b.user_ratings_total - a.user_ratings_total;
          })

          .map((point) => ({
            icon: point.icon,
            rating: point.rating,
            // photo: point.photos?.[0]?.photo_reference,
            title: point.name,
            latitude: point.geometry.location.lat,
            longitude: point.geometry.location.lng,
            // Address
            address: point.formatted_address,
            isOpen: point.opening_hours?.open_now ?? false,
            userRatingsTotal: point.user_ratings_total,
            userRating: point.rating,
          }))}
      />
    </Card>
  );
}
