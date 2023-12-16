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

const KeybordWrapper = ({ children }) => {
  return (
    <KeyboardAvoidingView style={{ flex: 1 }}>
      <ScrollView>
        <TouchableNativeFeedback onPress={Keyboard.dismiss}>
          {children}
        </TouchableNativeFeedback>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default KeybordWrapper;

const styles = StyleSheet.create({});
