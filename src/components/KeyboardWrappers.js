import {
  Keyboard,
  KeyboardAvoidingView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableNativeFeedback,
  View,
} from "react-native";
import React, { Children } from "react";
import Color from "../../assets/colors/Color";

const KeybordWrapper = ({ children }) => {
  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: Color.White }}>
      <ScrollView>
        <View onPress={Keyboard.dismiss}>{children}</View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default KeybordWrapper;

const styles = StyleSheet.create({});
