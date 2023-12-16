// I'm sure this component can be written in a cleaner way and with lesser lines,
// but I'm not sure how to do it. It's working as I want it to for now.

import React from "react";
import { StyleSheet, View, StatusBar, SafeAreaView } from "react-native";

const MyStatusBar = ({ backgroundColor, ...props }) => (
  <View style={[styles.statusBar, { backgroundColor }]}>
    <SafeAreaView>
      <StatusBar translucent backgroundColor={backgroundColor} {...props} />
    </SafeAreaView>
  </View>
);

const CustomStatusBar = () => {
  return <MyStatusBar backgroundColor="#4582C3" barStyle="light-content" />;
};

const styles = StyleSheet.create({
  statusBar: {
    // height: StatusBar.currentHeight,
  },
});

export default CustomStatusBar;
