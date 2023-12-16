import React from "react";
import {
  View,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
  Text,
} from "react-native";
import Color from "../../assets/colors/Color";

export default function ButtonMessage(props) {
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
    backgroundColor: Color.White,
    marginTop: 16,
    width: "35%",
    paddingVertical: 6,
    alignSelf: "center",
    borderRadius: Dimensions.get("screen").height * 0.01,
    borderWidth: 0.7,
    borderColor: Color.Black,
  },
  title: {
    alignSelf: "center",
    color: Color.Black,
    fontFamily: "Roboto_600SemiBold",
    fontSize: 14,
  },
});
