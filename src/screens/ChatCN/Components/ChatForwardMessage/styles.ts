import { StyleSheet } from "react-native";
import { theme } from "../../../../theme";

// Stylesheet for this function/Complete Profile screen. Many other styles are inline as well.
export const useStyles = (color: string) => {
  return StyleSheet.create({
    message: {
      alignSelf: "flex-start",
      padding: 10,
      margin: 10,
      minWidth: 60,
      textAlign: "right",
      display: "flex",
      flexDirection: "column",
      backgroundColor: theme.colors.palette.lighterGray,
    },
    sender: {
      marginLeft: "auto",
      borderRightWidth: 5,
      borderRightColor: color,
      borderStyle: "solid",
    },
    receiver: {
      textAlign: "left",
      borderLeftWidth: 5,
      borderLeftColor: color,
      borderStyle: "solid",
    },
    receiverTimestamp: {
      textAlign: "left",
    },
    senderTimestamp: {
      textAlign: "right",
    },
    timestamp: {
      color: "gray",
      padding: 10,
      paddingHorizontal: 0,
      fontSize: 9,
    },
    forward: {
      color: theme.colors.palette.gray,
      textAlign: "left",
      fontStyle: "italic",
    }
  });
};
