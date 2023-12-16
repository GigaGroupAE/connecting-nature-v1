import { Dimensions, FlatList, StyleSheet, Text, View } from "react-native";
import React from "react";
import Color from "../../../../../assets/colors/Color";

const Height = Dimensions.get("screen").height;
const Width = Dimensions.get("screen").width;

const NotificationType = (props) => {
  const { data } = props;

  return (
    <View
      style={{
        alignSelf: "center",
        alignItems: "center",
        backgroundColor: Color.LightBlue,
        paddingHorizontal: Width * 0.06,
        paddingVertical: Height * 0.007,
        marginVertical: Height * 0.01,
      }}
    >
      <Text style={styles.special}>{data.heading}</Text>
      {data.subheading ? (
        <Text style={{ fontFamily: "Roboto" }}>{data.subheading}</Text>
      ) : null}
    </View>
  );
};

export default NotificationType;

const styles = StyleSheet.create({
  special: {
    fontWeight: "800",
  },
});
