import { StyleSheet } from "react-native";
import { theme } from "../../../theme";

export const useStyles = () => {
  return StyleSheet.create({
    h1: {
      fontSize: theme.fonts.size.h1,
      fontWeight: theme.fonts.weight.bold,
      fontFamily: theme.fonts.family.bold,
      color: theme.colors.palette.black,
    },
    h2: {
      fontSize: theme.fonts.size.h2,
      fontWeight: theme.fonts.weight.bold,
      fontFamily: theme.fonts.family.bold,
      color: theme.colors.palette.black,
    },
    h3: {
      fontSize: theme.fonts.size.h3,
      fontWeight: theme.fonts.weight.bold,
      fontFamily: theme.fonts.family.bold,
      color: theme.colors.palette.black,
    },
    h4: {
      fontSize: theme.fonts.size.h4,
      fontWeight: theme.fonts.weight.bold,
      fontFamily: theme.fonts.family.bold,
      color: theme.colors.palette.black,
    },
    h5: {
      fontSize: theme.fonts.size.h5,
      fontWeight: theme.fonts.weight.bold,
      fontFamily: theme.fonts.family.bold,
      color: theme.colors.palette.black,
    },
    h6: {
      fontSize: theme.fonts.size.h6,
      fontWeight: theme.fonts.weight.bold,
      fontFamily: theme.fonts.family.bold,
      color: theme.colors.palette.black,
    },
    p: {
      fontSize: theme.fonts.size.p,
      fontWeight: theme.fonts.weight.regular,
      fontFamily: theme.fonts.family.regular,
      color: theme.colors.palette.black,
    },
  });
};
