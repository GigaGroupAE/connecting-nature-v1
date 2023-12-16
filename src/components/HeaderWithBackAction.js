import * as React from "react";
import { StyleSheet, Text, View, Image, TouchableOpacity } from "react-native";
import AntDesign from "react-native-vector-icons/AntDesign";
import Ionicons from "react-native-vector-icons/Ionicons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import Color from "../../assets/colors/Color";

// import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";

export default function HeaderWithBackAction(props) {
  const navigation = useNavigation();
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => props.onback()}>
        <AntDesign name="arrowleft" size={28} color={Color.White} />
      </TouchableOpacity>
      <Text style={styles.title}>{props.title}</Text>
      {/* <Image
        style={{ width: "26%", height: "90%", marginLeft: 15 }}
        source={require("../../assets/intranet-logo.png")}
      /> */}
      <View style={styles.leftIcons}>
        <TouchableOpacity>
          <Ionicons name="search" size={25} color={Color.White} />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate("NotificationsScreen")}
        >
          <MaterialCommunityIcons
            name="bell-outline"
            size={25}
            color={Color.White}
            style={{ marginLeft: 26 }}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Color.Blue,
    width: "100%",
    alignContent: "center",
    alignItems: "center",
    flexDirection: "row",
    paddingHorizontal: 19,
    paddingVertical: 10,
    borderBottomWidth: 2,
    borderColor: Color.VeryLightGrey,
  },
  title: {
    marginLeft: 15,
    color: Color.White,
    lineHeight: 30,
    fontSize: 20,
    fontFamily: "Roboto_600SemiBold",
  },
  leftIcons: {
    position: "absolute",
    right: 19,
    flexDirection: "row",
    justifyContent: "space-between",
  },
});
