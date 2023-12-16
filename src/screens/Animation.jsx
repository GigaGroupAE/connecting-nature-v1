import { SafeAreaView, StyleSheet, Text, View } from "react-native";
import React from "react";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  useSharedValue,
  withTiming,
  useAnimatedStyle,
} from "react-native-reanimated";

const END_POSITION = 100;

const Animation = () => {
  const onLeft = useSharedValue(true);
  const position = useSharedValue(0);

  const panGesture = Gesture.Pan()
    .onUpdate((e) => {
      if (onLeft.value) {
        position.value = e.translationY;
      } else {
        position.value = END_POSITION + e.translationY;
      }
    })
    .onEnd((e) => {
      if (position.value > END_POSITION / 2) {
        position.value = withTiming(END_POSITION, { duration: 100 });
        onLeft.value = false;
      } else {
        position.value = withTiming(0, { duration: 100 });
        onLeft.value = true;
      }
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: position.value }],
  }));
  return (
    <SafeAreaView style={{ flex: 1, marginTop: 30 }}>
      <View style={{ backgroundColor: "red" }}>
        <Text>Animation</Text>
      </View>
      <GestureDetector gesture={panGesture}>
        <Animated.View style={[styles.box, animatedStyle]}>
          <Text>hy there</Text>
        </Animated.View>
      </GestureDetector>
    </SafeAreaView>
  );
};

export default Animation;

const styles = StyleSheet.create({});
