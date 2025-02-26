"use server";

import ShowMore from "@/components/ui/ShowMore";
import * as AC from "@bacons/apple-colors";
import { Stack } from "expo-router";
import { Image, Text, View } from "react-native";
import { z } from "zod";

const PersonDetailsSchema = z.object({
  name: z.string(),
  profile_path: z.string().nullish(),
  known_for_department: z.string().nullish(),
  biography: z.string(),
  birthday: z.string().nullish(),
  deathday: z.string().nullish(),
  place_of_birth: z.string().nullish(),
});

export async function renderPersonDetails(id: string) {
  // Fetch person details
  const response = await fetch(
    `https://api.themoviedb.org/3/person/${id}?api_key=${process.env.TMDB_API_KEY}`
  );
  const rawData = await response.json();

  if (!response.ok) {
    throw new Error(`Failed to fetch person details`);
  }

  const person = PersonDetailsSchema.parse(rawData);

  const dates = [
    person.birthday && {
      label: "Born",
      value: `${new Date(person.birthday).toLocaleDateString()}${
        person.place_of_birth ? ` in ${person.place_of_birth}` : ""
      }`,
    },
    person.deathday && {
      label: "Died",
      value: new Date(person.deathday).toLocaleDateString(),
    },
  ]
    .filter(Boolean) as { label: string; value: string }[];

  return (
    <View style={{ flex: 1 }}>
      <Stack.Screen options={{ title: person.name }} />
      {/* Hero Section */}
      <View
        style={{
          height: 300,
          backgroundColor: AC.systemGray6,
          justifyContent: "flex-end",
          padding: 16,
        }}
      >
        {person.profile_path && (
          <View
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
            }}
          >
            <Image
              source={{
                uri: `https://image.tmdb.org/t/p/original${person.profile_path}`,
              }}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
              }}
            />
            <View
              style={{
                // subtle transparent to black gradient at the bottom of the image
                [process.env.EXPO_OS === "web"
                  ? `backgroundImage`
                  : `experimental_backgroundImage`]: `linear-gradient(180deg, rgba(0,0,0,0), rgba(0,0,0,0.8))`,

                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                height: 100,
              }}
            />
          </View>
        )}
        <Text
          style={{
            fontSize: 32,
            fontWeight: "bold",
            color: "white",
          }}
        >
          {person.name}
        </Text>
        <Text
          style={{
            fontSize: 18,
            color: "rgba(209, 209, 214, 1)",
          }}
        >
          {person.known_for_department}
        </Text>
      </View>

      {/* Overview Section */}
      <View style={{ padding: 16 }}>
        <Text
          style={{
            fontSize: 22,
            fontWeight: "600",
            color: AC.label,
            marginBottom: 12,
          }}
        >
          Overview
        </Text>

        <View
          style={{
            backgroundColor: AC.secondarySystemGroupedBackground,
            borderRadius: 10,
            marginBottom: 16,
          }}
        >
          {dates.map((item, index, array) => (
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
                  style={{ fontSize: 16, color: AC.secondaryLabel, flex: 1 }}
                >
                  {item.label}
                </Text>
                <Text
                  numberOfLines={1}
                  style={{ fontSize: 16, color: AC.label, flex: 2 }}
                >
                  {item.value}
                </Text>
              </View>
            ))}
        </View>

        <View>
          <ShowMore text={person.biography} />
        </View>
      </View>
    </View>
  );
}
