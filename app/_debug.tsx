import {
  getRequestHeaders,
  pingServer,
  pingServerError,
} from "@/components/debug/debug-actions";
import { BodyScrollView } from "@/components/ui/BodyScrollView";
import * as Form from "@/components/ui/Form";
import * as AC from "@bacons/apple-colors";
import Constants from "expo-constants";
import { Stack } from "expo-router";
import React, { useState } from "react";
import { Text, View } from "react-native";

import * as Clipboard from "expo-clipboard";

export { ErrorBoundary } from "expo-router";

function getBestDashboardUrl(): any {
  // TODO: There might be a better way to do this, using the project ID.
  const projectId = Constants.expoConfig?.extra?.eas?.projectId;
  if (projectId) {
    // https://expo.dev/projects/[uuid]
    return `https://expo.dev/projects/${projectId}`;
  }
  const owner = Constants.expoConfig?.owner ?? "[account]";
  const slug = Constants.expoConfig?.slug ?? "[project]";

  return `https://expo.dev/accounts/${owner}/projects/${slug}`;
}

function guessDeploymentIdFromOrigin(): string | null {
  // https://expo.dev/accounts/bacon/projects/expo-ai/hosting/deployments/o70t5q6t0r/requests
  const origin = Constants.expoConfig?.extra?.router?.origin;
  if (!origin) {
    return null;
  }
  try {
    const url = new URL(origin);
    // Should be like: https://exai--xxxxxx.expo.app
    // We need to extract the `xxxxxx` part if the URL matches `[\w\d]--([])`.
    return url.hostname.match(/(?:[^-]+)--([^.]+)\.expo\.app/)?.[1] ?? null;
  } catch {
    return null;
  }
}

function getDeploymentUrl(): any {
  const id = guessDeploymentIdFromOrigin();
  if (!id) {
    return getBestDashboardUrl() + "/hosting/deployments";
  }
  return (
    getBestDashboardUrl() +
    "/hosting/deployments/" +
    guessDeploymentIdFromOrigin() +
    "/requests"
  );
}

export default function DebugRoute() {
  const [error, setError] = useState<Error | null>(null);
  const [headers, setHeaders] = useState<Record<
    string,
    string | string[]
  > | null>(null);
  return (
    <>
      <BodyScrollView
        contentContainerStyle={{
          padding: 16,
          gap: 24,
          paddingBottom: 64,
        }}
        contentInset={{
          bottom: 24,
        }}
      >
        <Form.Section
          title="window.location"
          footer="Embedded origin URL that Expo Router uses to invoke React Server Functions. This should be hosted and available to the client."
        >
          <Form.Text
            onPress={() => Clipboard.setStringAsync(window.location?.href)}
            hint={window.location?.href}
          >
            Origin
          </Form.Text>
        </Form.Section>

        <Form.Section title="Views">
          <Form.Link href="/movie/693134?media_type=movie">
            /movie/693134?media_type=movie
          </Form.Link>
          <Form.Link href="/movie/513?media_type=tv">
            /movie/513?media_type=tv
          </Form.Link>
          <Form.Link href="/movie/actor/34947">/movie/actor/34947</Form.Link>
          <Form.Link href="/_sitemap">/_sitemap</Form.Link>
        </Form.Section>

        <Form.Section
          title="Server"
          footer="Call a React server action from your app to test the connection."
        >
          <Form.Link
            systemImage={"aqi.medium"}
            target="_blank"
            href={getDeploymentUrl()}
          >
            Dashboard
          </Form.Link>

          <Form.Text
            systemImage={"bolt.fill"}
            onPress={async () => {
              try {
                const response = await pingServer();
                alert(response);
              } catch (error: unknown) {
                if (error instanceof Error) {
                  setError(error);
                  alert(`Error: ${error}`);
                }
              }
            }}
          >
            Ping Server
          </Form.Text>
          <Form.Text
            style={{ color: AC.systemRed }}
            systemImage={{ name: "bolt.fill", color: AC.systemRed }}
            onPress={async () => {
              try {
                await pingServerError();
              } catch (error: unknown) {
                if (error instanceof Error) {
                  setError(error);
                  alert(`Error: ${error}`);
                }
              }
            }}
          >
            Ping Server with Error
          </Form.Text>
        </Form.Section>

        {error && <NetworkErrorView error={error} />}

        <Form.Section title="Request Headers">
          <Form.Text
            systemImage={{ name: "bolt.fill" }}
            onPress={async () => {
              try {
                setHeaders(await getRequestHeaders());
              } catch (error: unknown) {
                if (error instanceof Error) {
                  setError(error);
                  alert(`Error: ${error}`);
                }
              }
            }}
          >
            Fetch headers
          </Form.Text>
          {headers && (
            <View>
              <Form.Text>{JSON.stringify(headers, null, 2)}</Form.Text>
            </View>
          )}
        </Form.Section>

      </BodyScrollView>

      <Stack.Screen options={{ title: "Debug" }} />
    </>
  );
}

function NetworkErrorView({ error }: { error: Error }) {
  if (error instanceof Error) {
    const headers =
      "headers" in error && error.headers instanceof Headers
        ? Object.fromEntries(error.headers.entries())
        : null;

    return (
      <>
        <Form.Section
          title="Server Error"
          footer={"Error thrown by the server while making the test request."}
        >
          <Form.Text numberOfLines={10} hint={error.message}>
            Message
          </Form.Text>
          {"statusCode" in error && (
            <Form.Text hint={String(error.statusCode)}>Status</Form.Text>
          )}
          <Text numberOfLines={50}>Stack: {error.stack}</Text>
          <Text>{Object.keys(error).join(", ")}</Text>
        </Form.Section>
        {headers && (
          <Form.Section title="Error response headers">
            {Object.entries(headers).map(([key, value]) => (
              <Form.Text
                numberOfLines={10}
                onPress={() => {
                  Clipboard.setStringAsync(`${key}=${value}`);
                }}
                key={key}
                hint={value}
              >
                {key}
              </Form.Text>
            ))}
          </Form.Section>
        )}
      </>
    );
  }
  return <Text>{error}</Text>;
}
