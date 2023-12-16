import React from "react";
import { View, Text, StyleSheet, Dimensions, Touchable } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";

export default function AddGroupLeaderBtn(props) {
  let height = Dimensions.get("screen").height;
  let width = Dimensions.get("screen").width;

  return (
    <View>
      <TouchableOpacity onPress={props.onPress}>
        <View
          style={{
            width: "100%",
            backgroundColor: "#D0E2F5",
            paddingVertical: height * 0.02,
            borderRadius: 8,
          }}
        >
          <Text
            style={{
              fontFamily: "Roboto",
              fontSize: height * 0.02,
              alignSelf: "center",
              fontWeight: "bold",
              color: "#4582C3",
            }}
          >
            Add Group Leader
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  //   main: {
  //     width: "100%",
  //     backgroundColor: "#4582C3",
  //   },
});
