import React from "react";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import FontAwesome from "react-native-vector-icons/FontAwesome.js";
import BottomTab from "./BottomTab.js";
import ButtonSmall from "./ButtonSmall.js";
import Post from "./Post.js";
import AddButton from "./AddButton.js";

export default function Home() {
  return (
    <SafeAreaView style={styles.pageContainer}>
      <View style={styles.headContainer}>
        <Image
          style={styles.headerAvatar}
          source={require("../assets/avatar-placeholder.png")}
        />
        <ButtonSmall title={"Admin/CRM"} />
        <FontAwesome name="bell" size={20} color="#707070" />
      </View>
      <View style={styles.hairLine} />
      <ScrollView style={styles.pageContainer}>
        <Post />
        <Post />
        <Post />
      </ScrollView>
      <AddButton />
      <BottomTab />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  pageContainer: {
    alignContent: "center",
    backgroundColor: "#eee",
    marginBottom: 121,
  },
  headContainer: {
    backgroundColor: "#fff",
    paddingHorizontal: 17,
    marginTop: 27,
    alignItems: "center",
    alignContent: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    height: 50,
  },
  headerAvatar: {
    marginRight: 155,
    borderRadius: 100,
    width: 35,
    height: 35,
  },
  hairLine: {
    width: "100%",
    height: 2,
    backgroundColor: "#eee",
  },
});
