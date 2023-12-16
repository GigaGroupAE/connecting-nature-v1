import { StyleSheet, TouchableOpacity, Text, Dimensions } from "react-native";
import Color from "../../assets/colors/Color";

export default function ButtonSmall(props) {
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => props.event(true)}
    >
      <Text style={styles.title}>{props.title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Color.Blue,
    width: 80,
    borderRadius: 6,
    alignItems: "center",
    marginRight: "3%",
  },
  title: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    alignSelf: "center",
    color: Color.White,
    fontFamily: "Roboto_500Medium",
    fontSize: Dimensions.get("screen").height * 0.02,
  },
});
