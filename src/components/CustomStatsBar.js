import { StyleSheet, Text, View, StatusBar } from "react-native";
import React from "react";
import {
  SafeAreaView,
  SafeAreaProvider,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
const CustomStatsBar = ({
  backgroundColor,
  barStyle = "dark-content",
  //add more props StatusBar
}) => {
  const insets = useSafeAreaInsets();

  return (
    <View style={{ height: insets.top, backgroundColor }}>
      <StatusBar
        animated={true}
        backgroundColor={backgroundColor}
        barStyle={barStyle}
      />
    </View>
  );
};

export default CustomStatsBar;

const styles = StyleSheet.create({});
