"use client";
import React, { useId } from "react";
import { Text as RNText, View } from "react-native";
import { Circle, Defs, LinearGradient, Stop, Svg } from "react-native-svg";

const colors = ["#EA615B", "#D3D553", "#63CD82"];
const colorsDarkened = ["#C74D48", "#B0B04B", "#4E9E6E"];

function interoplateColor(percentage: number) {
  const colorIndex = Math.min(
    Math.floor(percentage / (100 / colors.length)),
    colors.length - 1
  );
  return [colors[colorIndex], colorsDarkened[colorIndex]];
}

function interpolateRange(
  value: number,
  inMin: number,
  inMax: number,
  outMin: number,
  outMax: number
) {
  return ((value - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;
}

export const CircularProgressBar = ({
  size,
  strokeWidth,
  percentage,
}: {
  size: number;
  strokeWidth: number;
  percentage: number;
}) => {
  const radius = (size - strokeWidth) / 2;
  const backdropCircumference = radius * 1.5 * Math.PI;
  const circumference = radius * 2 * Math.PI;
  const maxValue = circumference * 0.25;

  // maxValue <-> circumference
  // 185.354 (circumference) equals nothing showing.

  const offset = interpolateRange(percentage, 0, 100, circumference, maxValue);
  const fontSize = size / 3;
  const [primaryColor, darkerColor] = interoplateColor(percentage);

  const id = useId();
  return (
    <View
      style={{
        padding: 5,
        backgroundColor: "#0D1C21",
        borderRadius: 666,
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
      }}
    >
      <Svg height={size} width={size} viewBox={`0 0 ${size} ${size}`}>
        <Defs>
          <LinearGradient
            id={`progressGradient-${id}`}
            x1="0%"
            y1="0%"
            x2="100%"
            y2="0%"
          >
            <Stop offset="0%" stopColor={primaryColor} />
            <Stop offset="100%" stopColor={darkerColor} />
          </LinearGradient>
        </Defs>

        {/* Background circle */}
        <Circle
          opacity={0.3}
          stroke={primaryColor}
          fill="none"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          strokeDasharray={backdropCircumference}
          strokeDashoffset={0}
          strokeLinecap="round"
          transform={`rotate(135 ${size / 2} ${size / 2})`}
        />
        {/* Foreground circle */}
        <Circle
          fill="none"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={`url(#progressGradient-${id})`}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          transform={`rotate(135 ${size / 2} ${size / 2})`}
        />
      </Svg>
      <View
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <RNText
          style={{
            textAlign: "center",
            fontWeight: "bold",
            fontSize,
            color: "white",
          }}
        >
          {parseInt(String(percentage), 10)}
        </RNText>
      </View>
    </View>
  );
};
