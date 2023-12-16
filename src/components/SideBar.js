import React from "react";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Keyboard,
  FlatList,
} from "react-native";
import Header from "./Header";
export default function SideBar() {
  return (
    <SafeAreaView>
      <View>
        <Header
          style={styles.headIcon}
          title={<Image source={require("../../assets/back-icon.png")} />}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  headIcon: {
    width: 17.14,
    height: 15,
  },
});
