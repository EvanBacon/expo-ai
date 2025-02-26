import * as AC from "@bacons/apple-colors";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider as RNTheme,
  Theme,
} from "@react-navigation/native";
import { useColorScheme } from "react-native";

// Use exact native P3 colors and equivalents on Android/web.
// This lines up well with React Navigation.
const BaconDefaultTheme: Theme = {
  dark: false,
  colors: {
    primary: AC.systemBlue as unknown as string,
    background: AC.systemGroupedBackground as unknown as string,
    card: AC.secondarySystemGroupedBackground as unknown as string,
    text: AC.label as unknown as string,
    border: AC.separator as unknown as string,
    notification: AC.systemRed as unknown as string,
  },
  fonts: DefaultTheme.fonts,
};

const BaconDarkTheme: Theme = {
  dark: true,
  colors: {
    ...BaconDefaultTheme.colors,
  },
  fonts: DarkTheme.fonts,
};

export default function ThemeProvider(props: { children: React.ReactNode }) {
  const colorScheme = useColorScheme();
  return (
    <RNTheme
      // This isn't needed on iOS or web, but it's required on Android since the dynamic colors are broken
      // https://github.com/facebook/react-native/issues/32823
      value={colorScheme === "dark" ? BaconDarkTheme : BaconDefaultTheme}
    >
      {props.children}
    </RNTheme>
  );
}
