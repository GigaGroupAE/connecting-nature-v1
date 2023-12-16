import { StyleSheet, Text, View, Image, TouchableOpacity } from "react-native";
import Color from "../../assets/colors/Color";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";

export default function Header(props) {
  const navigation = useNavigation();
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>{props.title}</Text>
      <TouchableOpacity onPress={() => navigation.goBack()}>
        {props.icon}
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Color.White,
    paddingHorizontal: 19,
    borderBottomWidth: 2,
    borderColor: Color.VeryLightGrey,
    flexDirection: "row",
    alignContent: "center",
    alignItems: "center",
    justifyContent: "space-between",
  },
  title: {
    paddingVertical: 10,
    color: Color.Black,
    fontSize: 18,
    fontFamily: "Roboto_600SemiBold",
  },
});
