"use client";

import React, { useCallback, useEffect, useRef } from "react";
import { AppState, StyleSheet } from "react-native";
import { MapView, Marker } from "./map-view";

export const FlyoverMap = ({
  center,
  altitude,
}: {
  center: { latitude: number; longitude: number };
  altitude?: number;
  speed?: number;
}) => {
  const mapRef = useRef<import("react-native-maps").default>(null);

  const heading = useRef(0);
  const previousCenter = useRef(center);
  const interval = useRef<ReturnType<typeof requestAnimationFrame>>();
  const animatingRef = useRef<ReturnType<typeof setTimeout>>();

  const pitch = 50;
  const speed = 0.2;

  const animateCamera = useCallback(() => {
    if (process.env.EXPO_OS === "web") return;
    if (!mapRef.current) return;

    mapRef.current.setCamera({
      center,
      pitch,
      altitude,
      heading: (heading.current = (heading.current - speed) % 360),
    });

    interval.current = requestAnimationFrame(animateCamera);
  }, [center, altitude]);

  useEffect(() => {
    const off = AppState.addEventListener("change", (state) => {
      if (state === "active") {
        animateCamera();
      } else {
        clearInterval(interval.current);
      }
    });

    return () => {
      off.remove();
    };
  }, [animateCamera]);

  useEffect(() => {
    if (mapRef.current && previousCenter.current !== center) {
      clearInterval(interval.current);
      clearTimeout(animatingRef.current);
      previousCenter.current = center;
      mapRef.current?.animateCamera(
        {
          center,
          pitch,
          altitude,
          heading: heading.current,
        },
        {
          duration: 1000,
        }
      );

      animatingRef.current = setTimeout(() => {
        animateCamera();
      }, 1000);
    } else {
      animateCamera();
    }

    return () => {
      clearInterval(interval.current);
    };
  }, [mapRef, animateCamera, altitude, center]);

  const isApple = process.env.EXPO_OS === "ios";
  return (
    <MapView
      ref={mapRef}
      style={styles.map}
      mapType={isApple ? "standard" : "none"}
      showsCompass={false}
      userInterfaceStyle="dark"
      onTouchStart={() => {
        clearInterval(interval.current);
      }}
      showsIndoorLevelPicker={false}
      showsMyLocationButton={false}
      initialRegion={{
        latitude: center.latitude,
        longitude: center.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      }}
    >
      {process.env.EXPO_OS === "web" && (
        <Marker
          coordinate={center}
          focusable={false}
          isTVSelectable={false}
          tappable={false}
        />
      )}
    </MapView>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "flex-end",
    alignItems: "center",
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  button: {
    backgroundColor: "rgba(255, 255, 255, 0.7)",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
    marginBottom: 20,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
});
