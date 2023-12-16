import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import Color from "../../../../assets/colors/Color";

const WIDTH = Dimensions.get("window").width;
const HEIGHT_MODAL = 150;

const DeleteNotification = (props) => {
  return (
    <View style={styles.container}>
      {/* <View
        style={{
          backgroundColor: Color.Black,
          width: "100%",
          height: "100%",
          opacity: 0.5,
        }}
      /> */}
      <TouchableOpacity style={styles.modal} onPress={props.oncancel}>
        <Text>Testing</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: Color.Black,
    // opacity: 0.3,

    // alignContent: "center",
    // justifyContent: "center",
  },
  modal: {
    width: Dimensions.get("screen").width,
    height: HEIGHT_MODAL,
    padding: 10,
    backgroundColor: Color.White,
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    position: "absolute",
    bottom: 0,
    elevation: 20,
    shadowColor: Color.Black,
    borderWidth: 2,
    borderColor: Color.LightBg,
  },
});

export default DeleteNotification;
