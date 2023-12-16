import React from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  Dimensions,
} from "react-native";
import Color from "../../assets/colors/Color";

export default function ButtonFollow(props) {
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={props.onPress}>
        <Text style={styles.title}>{props.title}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Color.Blue,
    marginTop: 16,
    width: "35%",
    paddingVertical: 6,
    alignSelf: "center",
    borderRadius: Dimensions.get("screen").height * 0.01,
  },
  title: {
    alignSelf: "center",
    color: Color.White,
    fontFamily: "Roboto_600SemiBold",
    fontSize: 14,
  },
});
