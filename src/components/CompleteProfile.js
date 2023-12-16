import React from "react";
import { SafeAreaView, StyleSheet, View, Image } from "react-native";
import Header from "./Header.js";
import InputText from "./InputText.js";
import ButtonMain from "./ButtonMain.js";
import RadioButton from "./RadioButton.js";

export default function CompleteProfile() {
  return (
    <SafeAreaView>
      <Header title={"Complete Profile"} />
      <View style={styles.container}>
        <Image
          style={styles.profileImage}
          source={require("../assets/avatar-placeholder.png")}
        />
        <InputText title={"+92 333 7748766"} />
        <InputText title={"Full Name"} />
        <RadioButton option1={"Male"} option2={"Female"} />
        <ButtonMain title={"Get OTP"} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    alignContent: "center",
    alignItems: "center",
    justifyContent: "space-between",
  },
  profileImage: {
    marginBottom: 27,
    marginTop: 14,
    width: 120,
    height: 120,
    backgroundColor: "#EAEAEA",
    borderRadius: 100,
    alignItems: "center",
  },
});
