import React from "react";
import { StyleSheet, View, Pressable, Dimensions } from "react-native";
import { FontAwesome, Ionicons } from "react-native-vector-icons";
import Color from "../../assets/colors/Color";
import { screenHeight, screenWidth } from "../utils/ScreenDimensions";

export default function AddButton(props) {
  return (
    <>
      {props.activeScreen === "bottomTab" ? (
        <Pressable
          style={styles.tabStyle}
          android_ripple={{ color: Color.LightGrey, borderless: true }}
          onPress={() => {
            props.clicktrigger();
          }}
        >
          <Ionicons name="add-circle" size={33} color={Color.Black} />
        </Pressable>
      ) : (
        <View style={styles.mainContainer}>
          <Pressable
            android_ripple={{ color: Color.VeryLightGrey }}
            style={styles.addPost}
            onPress={() => {
              props.clicktrigger();
            }}
          >
            <FontAwesome name="plus" size={25} color={Color.White} />
          </Pressable>
        </View>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    position: "absolute",
    bottom: "12%",
    paddingHorizontal: 17,
    marginLeft: "75%",
  },
  addPost: {
    alignContent: "center",
    alignItems: "center",
    backgroundColor: Color.Blue,
    borderRadius: screenHeight * 0.1,
    width: screenWidth * 0.15,
    height: screenHeight * 0.07,
    justifyContent: "center",
  },
  tabStyle: {
    alignContent: "center",
    alignItems: "center",
  },
  tabCart: {
    alignContent: "center",
    alignItems: "center",
    borderRadius: Dimensions.get("screen").height * 0.1,
    padding: 17,
    marginTop: 0,
  },
  tabText: {
    fontFamily: "Roboto_500Medium",
    marginTop: 2,
    fontSize: 13,
    color: Color.Grey,
  },
  activeTabText: {
    fontFamily: "Roboto_600SemiBold",
    fontSize: 13,
    color: Color.Grey,
    alignSelf: "center",
  },
});
