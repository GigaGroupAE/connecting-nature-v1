import { StyleSheet } from "react-native";
import { theme } from "../../../theme";
import Color from "../../../assets/colors/Color";
export const useStyles = () => {
  return StyleSheet.create({
    default: {
      borderRadius: 8,
      shadowColor: Color.Black,
      shadowOffset: {
        width: 0,
        height: 3,
      },
      shadowOpacity: 0.27,
      shadowRadius: 4.65,
      elevation: 0,
      maxWidth: "100%",
    },
    defaultLabelStyle: {
      fontSize: 18,
      fontFamily: "Roboto_700Bold",
      fontWeight: "bold",
      color: Color.White,
    },
  });
};
