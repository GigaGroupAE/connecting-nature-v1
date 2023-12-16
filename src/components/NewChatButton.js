import React from "react";
import { StyleSheet, Text, View, Image, TouchableOpacity } from "react-native";
import { FontAwesome, MaterialIcons } from "react-native-vector-icons";
import Color from "../../assets/colors/Color";

export default function NewChatButton(props) {
  return (
    <View style={styles.mainContainer}>
      <TouchableOpacity
        style={styles.addPost}
        onPress={() => {
          props.onPress();
        }}
      >
        <MaterialIcons name="chat" size={25} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    position: "absolute",
    bottom: "4%",
    paddingHorizontal: 17,
    marginLeft: "75%",
    right: 5,
  },
  addPost: {
    alignContent: "center",
    alignItems: "center",
    backgroundColor: Color.Blue,
    elevation: 4,
    borderRadius: 50,
    padding: 16,
    // width: "100%",
    // height: "100%",
  },
});
