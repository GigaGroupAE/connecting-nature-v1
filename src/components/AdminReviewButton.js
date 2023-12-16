import { StyleSheet, TouchableOpacity, Text, Dimensions } from "react-native";
import Color from "../../assets/colors/Color";

export default function AdminReviewButton(props) {
  let height = Dimensions.get("screen").height;
  let width = Dimensions.get("screen").width;
  return (
    <TouchableOpacity
      style={{
        backgroundColor: Color.Blue,
        width: "100%",
        alignItems: "center",
      }}
      onPress={() => props.click()}
    >
      <Text
        style={{
          paddingVertical: height * 0.01,
          alignSelf: "center",
          color: Color.White,
          fontFamily: "Roboto_500Medium",
          fontSize: height * 0.02,
        }}
      >
        {props.title}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  // container: {
  //   backgroundColor: "#4582C3",
  //   marginTop: 42,
  //   width: 318,
  //   height: 48,
  //   borderRadius: 8,
  // },
  // title: {
  //   padding: 11,
  //   alignSelf: "center",
  //   color: "#fff",
  //   fontFamily: "Roboto",
  //   fontSize: 18,
  //   fontWeight: "bold",
  // },
});
