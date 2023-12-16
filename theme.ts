import { TextStyle } from "react-native";
import { DefaultTheme } from "react-native-paper";
import { Theme } from "react-native-paper/lib/typescript/types";

// colors to be used throughout the project
const palette = {
  white: "#FFFFFF",
  black: "#000000",
  blue: "#4582C3",
  lightBlue: "#A6CFFF",
  lighterBlue: "#E4F1FF",
  gray: "#999999",
  darkGray: "#707070",
  lightGray: "#C4C4C4",
  lighterGray: "#D8D8D8",
  lightestGray: "#F5F5F5",
  almostWhite: "#FDFDFD",
  red: "#E70000",
  green: "#45C359",
};

export type MainTheme = Theme & {
  colors: {
    palette: {
      white: string;
      black: string;
      blue: string;
      lightBlue: string;
      lighterBlue: string;
      gray: string;
      darkGray: string;
      lightGray: string;
      lighterGray: string;
      red: string;
      green: string;
    };
  };
  fonts: {
    size: {
      h1: number;
      h2: number;
      h3: number;
      h4: number;
      h5: number;
      h6: number;
      p: number;
    };
    weight: {
      thin: TextStyle["fontWeight"];
      extraLight: TextStyle["fontWeight"];
      light: TextStyle["fontWeight"];
      regular: TextStyle["fontWeight"];
      medium: TextStyle["fontWeight"];
      semiBold: TextStyle["fontWeight"];
      bold: TextStyle["fontWeight"];
    };
    family: {
      thin: string;
      extraLight: string;
      light: string;
      regular: string;
      medium: string;
      semiBold: string;
      bold: string;
    };
  };
};

// named styles as a theme, to be imported as context to screens
export const theme: MainTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: palette.blue,
    background: palette.white,
    surface: palette.white,
    accent: palette.lightBlue,
    text: palette.darkGray,
    onSurface: palette.lightBlue,
    notification: palette.lightBlue,
    palette,
  },
  fonts: {
    ...DefaultTheme.fonts,
    size: {
      h1: 32,
      h2: 24,
      h3: 20,
      h4: 18,
      h5: 16,
      h6: 14,
      p: 12,
    },
    weight: {
      thin: "100",
      extraLight: "200",
      light: "300",
      regular: "400",
      medium: "500",
      semiBold: "600",
      bold: "700",
    },
    family: {
      thin: "Roboto_300Light",
      extraLight: "Roboto_300Light",
      light: "Roboto_300Light",
      regular: "Roboto_400Regular",
      medium: "Roboto_500Medium",
      semiBold: "Roboto_700Bold",
      bold: "Roboto_700Bold",
    },
  },
};
