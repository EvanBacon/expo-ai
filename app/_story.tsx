import { ChatContainer } from "@/components/chat-container";
import { MoviesCard, MoviesSkeleton } from "@/components/movies/movie-card";
import { WeatherCard } from "@/components/weather";
import { ScrollView } from "react-native";

export default function Storybook() {
  return (
    <ChatContainer style={{ justifyContent: "center", alignItems: "center" }}>
      <ScrollView contentContainerStyle={{ paddingVertical: 20, gap: 8 }}>
        <MoviesCard
          data={require("@/fixtures/trending-movies.json")}
          title="Trending movies"
        />
        <MoviesSkeleton />
        <WeatherCard city="Austin" />
        <WeatherCard
          city="Austin"
          data={require("@/fixtures/weather-austin.json")}
        />
      </ScrollView>
    </ChatContainer>
  );
}
