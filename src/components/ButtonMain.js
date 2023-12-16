import { StyleSheet, TouchableOpacity, Text } from "react-native";
import Color from "../../assets/colors/Color";

export default function ButtonMain(props) {
  return (
    <TouchableOpacity
      disabled={props.disabled}
      style={styles.container}
      onPress={() => props.callback(true)}
    >
      <Text style={styles.title}>{props.title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Color.Blue,
    marginTop: 25,
    width: 180,
    height: 48,
    borderRadius: 8,
  },
  title: {
    padding: 11,
    alignSelf: "center",
    color: Color.White,
    fontFamily: "Roboto_600SemiBold",
    fontSize: 18,
  },
});
