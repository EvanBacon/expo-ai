"use server";

import { FadeIn } from "@/components/ui/FadeIn";
import TouchableBounce from "@/components/ui/TouchableBounce";
import { tw } from "@/util/tw";
import * as AC from "@bacons/apple-colors";
import { ErrorBoundary, Link, Stack } from "expo-router";
import { Try } from "expo-router/build/views/Try";
import React from "react";
import { Image, ImageStyle, ScrollView, Text, View } from "react-native";
import { z } from "zod";

const label = process.env.EXPO_OS === "android" ? "rgba(0, 0, 0, 1)" : AC.label;
const secondarySystemGroupedBackground = process.env.EXPO_OS === "android" ? "rgba(255, 255, 255, 1)" : AC.secondarySystemGroupedBackground;

const PersonSchema = z.object({
  id: z.number(),
  name: z.string().nullish(),
  profile_path: z.string().nullish(),
  character: z.string().nullish(),
});

const MediaSchema = z.object({
  id: z.number(),
  title: z.string().nullish(),
  name: z.string().nullish(),
  poster_path: z.string().nullish(),
  backdrop_path: z.string().nullish(),
  vote_average: z.number().nullish(),
  tagline: z.string().nullish(),
  overview: z.string().nullish(),
  adult: z.boolean().nullish(),
  release_date: z.string().nullish(),
  first_air_date: z.string().nullish(),
  runtime: z.number().nullish(),
  episode_run_time: z.array(z.number()).nullish(),
  budget: z.number().nullish(),
  revenue: z.number().nullish(),
  production_countries: z.array(z.object({ name: z.string() })).nullish(),
  spoken_languages: z.array(z.object({ name: z.string() })).nullish(),
  genres: z.array(z.object({ name: z.string() })).nullish(),
});

type Person = z.infer<typeof PersonSchema>;
type Media = z.infer<typeof MediaSchema>;

type MediaType = "movie" | "tv";

export async function renderMedia(id: string, type: MediaType = "movie") {
  return (
    <>
      <Stack.Screen
        options={{
          title: "",
        }}
      />

      <MediaDetails id={id} type={type} />

      <Try catch={ErrorBoundary}>
        <React.Suspense fallback={<ListSkeleton />}>
          <MediaCast id={id} type={type} />
        </React.Suspense>
      </Try>

      <Try catch={ErrorBoundary}>
        <React.Suspense fallback={<ListSkeleton />}>
          <SimilarMedia id={id} type={type} />
        </React.Suspense>
      </Try>
    </>
  );
}

function HorizontalList({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <View style={{ marginBottom: 24 }}>
      <Text
        style={{
          fontSize: 20,
          fontWeight: "600",
          color: label,
          marginBottom: 12,
          paddingHorizontal: 16,
        }}
      >
        {title}
      </Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 12, gap: 8 }}
      >
        {children}
      </ScrollView>
    </View>
  );
}

function MediaHero({ media, type }: { media: any; type: MediaType }) {
  return (
    <View style={{ marginBottom: 24 }}>
      <Image
        source={{
          uri: `https://image.tmdb.org/t/p/w500${media.backdrop_path}`,
        }}
        style={{
          width: "100%",
          height: 300,
          resizeMode: "cover",
        }}
      />
      <View style={{ padding: 16, marginTop: -60, flexDirection: "row" }}>
        <Image
          source={{
            uri: `https://image.tmdb.org/t/p/w500${media.poster_path}`,
          }}
          style={{
            width: 100,
            height: 150,
            borderRadius: 8,
            marginRight: 16,
          }}
        />
        <View style={{ flex: 1, justifyContent: "flex-end" }}>
          <Text
            style={{
              fontSize: 24,
              fontWeight: "bold",
              color: label,
              marginBottom: 8,
            }}
          >
            {type === "movie" ? media.title : media.name}
          </Text>
          <Text style={{ fontSize: 15, color: label, opacity: 0.8 }}>
            {media.tagline}
          </Text>
        </View>
      </View>
    </View>
  );
}

function CastCard({ person }: { person: Person }) {
  return (
    <Link href={`/movie/actor/${person.id}`} asChild>
      <TouchableBounce
        sensory
        style={{ width: 100, maxWidth: 100, marginHorizontal: 4 }}
      >
        <Image
          source={{
            uri: person.profile_path
              ? `https://image.tmdb.org/t/p/w200${person.profile_path}`
              : "https://via.placeholder.com/100x150",
          }}
          style={[
            {
              width: 100,
              height: 150,
              borderRadius: 8,
              backgroundColor: secondarySystemGroupedBackground,
            },
            tw`transition-transform hover:scale-95` as ImageStyle,
          ]}
        />
        <Text
          style={{ fontSize: 14, color: label, marginTop: 4, maxWidth: 100 }}
          numberOfLines={1}
        >
          {person.name}
        </Text>
        <Text
          style={{ fontSize: 12, color: label, opacity: 0.7, maxWidth: 100 }}
          numberOfLines={2}
        >
          {person.character}
        </Text>
      </TouchableBounce>
    </Link>
  );
}

function MediaCard({ media, type }: { media: Media; type: MediaType }) {
  return (
    <Link
      href={{
        pathname: `/movie/[id]`,
        params: { id: media.id, media_type: type },
      }}
      asChild
    >
      <TouchableBounce style={{ marginHorizontal: 4 }}>
        <View style={[{ width: 140 }, tw`transition-transform hover:scale-95`]}>
          <Image
            source={{
              uri: `https://image.tmdb.org/t/p/w300${media.poster_path}`,
            }}
            style={{
              width: 140,
              height: 210,
              borderRadius: 8,
              backgroundColor: secondarySystemGroupedBackground,
            }}
          />
          <Text
            style={{ fontSize: 14, color: label, marginTop: 4 }}
            numberOfLines={2}
          >
            {type === "movie" ? media.title : media.name}
          </Text>
          <Text style={{ fontSize: 12, color: label, opacity: 0.7 }}>
            ★ {media.vote_average?.toFixed(1) || "N/A"}
          </Text>
        </View>
      </TouchableBounce>
    </Link>
  );
}

async function MediaDetails({ id, type }: { id: string; type: MediaType }) {
  const response = await fetch(
    `https://api.themoviedb.org/3/${type}/${id}?api_key=${process.env.TMDB_API_KEY}`
  );
  const rawData = await response.json();

  if (!response.ok) {
    throw new Error(`Failed to fetch ${type}`);
  }

  const media = MediaSchema.parse(rawData);
  const releaseDate = type === "movie" ? media.release_date : media.first_air_date;

  return (
    <>
      <Stack.Screen
        options={{
          title: (type === "movie" ? media.title : media.name) || "",
        }}
      />

      <FadeIn>
        <MediaHero media={media} type={type} />
      </FadeIn>

      <FadeIn>
        <View style={{ marginBottom: 24, paddingHorizontal: 16 }}>
          <Text style={{ fontSize: 16, color: label, lineHeight: 24 }}>
            {media.overview}
          </Text>
        </View>
      </FadeIn>

      <FadeIn>
        <View style={{ marginBottom: 24, paddingHorizontal: 16 }}>
          <Text
            style={{
              fontSize: 20,
              fontWeight: "600",
              color: label,
              marginBottom: 12,
            }}
          >
            About
          </Text>
          <View
            style={{
              backgroundColor: "rgba(120,120,128,0.12)",
              borderRadius: 10,
            }}
          >
            {[
              {
                label: type === "movie" ? "Release Date" : "First Air Date",
                value: releaseDate ? new Date(releaseDate).toLocaleDateString() : "N/A",
              },
              {
                label: "Age Rating",
                value: media.adult ? "Adult" : "All Ages",
              },
              {
                label: type === "movie" ? "Runtime" : "Episode Runtime",
                value:
                  type === "movie"
                    ? `${media.runtime} minutes`
                    : `${media.episode_run_time?.[0] || "N/A"} minutes`,
              },
              {
                label: "Budget",
                value: media.budget
                  ? `$${(media.budget / 1000000).toFixed(1)}M`
                  : "N/A",
              },
              {
                label: "Revenue",
                value: media.revenue
                  ? `$${(media.revenue / 1000000).toFixed(1)}M`
                  : "N/A",
              },
              {
                label: "Countries",
                value: (media.production_countries || [])
                  .map((c: { name: string }) => c.name)
                  .join(", ") || "N/A",
              },
              {
                label: "Languages",
                value: (media.spoken_languages || [])
                  .map((l: { name: string }) => l.name)
                  .join(", ")
              },
              {
                label: "Genres",
                value: (media.genres || [])
                  .map((g: { name: string }) => g.name)
                  .join(", ") || "N/A",
              },
            ].map((item, index, array) => (
              <View
                key={item.label}
                style={{
                  padding: 12,
                  flexDirection: "row",
                  justifyContent: "space-between",
                  borderBottomWidth: index === array.length - 1 ? 0 : 0.5,
                  borderBottomColor: "rgba(120,120,128,0.2)",
                }}
              >
                <Text
                  style={{ fontSize: 16, color: label, opacity: 0.8, flex: 1 }}
                >
                  {item.label}
                </Text>
                <Text style={{ fontSize: 16, color: label, flex: 2 }}>
                  {item.value}
                </Text>
              </View>
            ))}
          </View>
        </View>
      </FadeIn>
    </>
  );
}

async function MediaCast({ id, type }: { id: string; type: MediaType }) {
  const response = await fetch(
    `https://api.themoviedb.org/3/${type}/${id}/credits?api_key=${process.env.TMDB_API_KEY}`
  );
  const rawData = await response.json();
  
  const credits = z.object({
    cast: z.array(PersonSchema),
  }).parse(rawData);

  return (
    <HorizontalList title="Cast & Crew">
      {credits.cast.slice(0, 10).map((person) => (
        <CastCard key={person.id} person={person} />
      ))}
    </HorizontalList>
  );
}

async function SimilarMedia({ id, type }: { id: string; type: MediaType }) {
  const response = await fetch(
    `https://api.themoviedb.org/3/${type}/${id}/similar?api_key=${process.env.TMDB_API_KEY}`
  );
  const rawData = await response.json();

  const similar = z.object({
    results: z.array(MediaSchema),
  }).parse(rawData);

  return (
    <HorizontalList title="More Like This">
      {similar.results.slice(0, 10).map((media) => (
        <MediaCard key={media.id} media={media} type={type} />
      ))}
    </HorizontalList>
  );
}

function ListSkeleton() {
  return (
    <View style={{ marginBottom: 24 }}>
      <View
        style={{
          height: 24,
          width: 200,
          backgroundColor: "rgba(120,120,128,0.12)",
          marginBottom: 12,
          marginHorizontal: 16,
        }}
      />
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 12 }}
      >
        {[1, 2, 3, 4].map((i) => (
          <View
            key={i}
            style={{
              width: 140,
              height: 210,
              backgroundColor: "rgba(120,120,128,0.12)",
              marginHorizontal: 4,
              borderRadius: 8,
            }}
          />
        ))}
      </ScrollView>
    </View>
  );
}
