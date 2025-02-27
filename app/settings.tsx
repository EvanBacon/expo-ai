import * as Form from "@/components/ui/Form";
import * as AC from "@bacons/apple-colors";
import React from "react";

import { IconSymbol } from "@/components/ui/IconSymbol";

import * as AppIcon from "expo-quick-actions/icon";
export { ErrorBoundary } from "expo-router";

// @ts-expect-error
const HERMES_RUNTIME = global.HermesInternal?.getRuntimeProperties?.() ?? {};
const HERMES_VERSION = HERMES_RUNTIME["OSS Release Version"];
const isStaticHermes = HERMES_RUNTIME["Static Hermes"];

export default function DebugRoute() {
  return (
    <>
      <Form.List
        contentContainerStyle={{
          padding: 16,
          gap: 24,
          paddingBottom: 64,
        }}
        contentInset={{
          bottom: 24,
        }}
      >
        {process.env.EXPO_OS !== "web" && AppIcon?.isSupported && (
          <Form.Section title="Style">
            <Form.Link href="/settings/icon">App Icon</Form.Link>
          </Form.Section>
        )}

        {HERMES_VERSION && (
          <Form.Section title="Hermes">
            <Form.Text hint={HERMES_VERSION}>Version</Form.Text>
            <Form.Text
              hint={
                !!isStaticHermes ? (
                  <IconSymbol
                    name="checkmark.circle.fill"
                    color={AC.systemGreen}
                  />
                ) : (
                  <IconSymbol name="slash.circle" color={AC.systemGray} />
                )
              }
            >
              Static Hermes
            </Form.Text>
          </Form.Section>
        )}

        <Form.Section>
          <Form.Link href="/_debug" systemImage={"ladybug"}>
            Debug
          </Form.Link>
          <Form.Link href="/_sitemap">/_sitemap</Form.Link>
        </Form.Section>
      </Form.List>
    </>
  );
}
