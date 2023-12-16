import { StyleSheet } from "react-native";

// Stylesheet for this function/Complete Profile screen. Many other styles are inline as well.
export const useStyles = (color) => {
  return StyleSheet.create({
    message: {
      alignSelf: "flex-start",
      padding: 10,
      margin: 10,
      minWidth: 60,
      textAlign: "right",
      display: "flex",
      flexDirection: "column",
      backgroundColor: "#E5F2FF",
      fontFamily: "Roboto",
      width: "75%",
    },
    receiver: {
      marginLeft: "auto",
      borderTopLeftRadius: 15,
      borderBottomLeftRadius: 15,
      borderRightWidth: 4,
      borderRightColor: color,
      borderStyle: "solid",
      fontFamily: "Roboto",
    },
    sender: {
      textAlign: "left",
      borderTopLeftRadius: 15,
      borderBottomLeftRadius: 15,
      borderRightWidth: 4,
      borderLeftColor: color,
      borderStyle: "solid",
    },
    receiverTimestamp: {
      textAlign: "left",
    },
    senderTimestamp: {
      textAlign: "right",
      fontFamily: "Roboto",
    },
    timestamp: {
      color: "gray",
      padding: 5,
      paddingHorizontal: 0,
      fontSize: 8,
      fontFamily: "Roboto",
    },
  });
};
