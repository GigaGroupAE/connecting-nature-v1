import React, { useEffect, useRef } from "react";
import { View, StyleSheet, Animated } from "react-native";
import Color from "../../../assets/colors/Color";

const SInglePostSkeleton = () => {
  const shimmerAnimation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    shimmer();
  }, []);

  const shimmer = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(shimmerAnimation, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(shimmerAnimation, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ]),
      { iterations: -1 }
    ).start();
  };

  const shimmerOpacity = shimmerAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.7],
  });

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.postContainer,
          { opacity: shimmerOpacity, marginBottom: 10 },
        ]}
      >
        <View style={styles.userInfo}>
          <Animated.View
            style={[styles.userImagePlaceholder, { opacity: shimmerOpacity }]}
          />
          <Animated.View
            style={[styles.userNamePlaceholder, { opacity: shimmerOpacity }]}
          />
        </View>
        <Animated.View style={[styles.content, { opacity: shimmerOpacity }]} />
        <Animated.View style={[styles.footer, { opacity: shimmerOpacity }]} />
      </Animated.View>

      {[1, 2, 3, 4, 5, 6].map((index) => (
        <Animated.View
          key={index}
          style={[
            styles.postContainer,
            { opacity: shimmerOpacity, marginBottom: index === 3 ? 0 : 10 },
          ]}
        >
          <View style={styles.userInfo}>
            <Animated.View
              style={[styles.userImagePlaceholder, { opacity: shimmerOpacity }]}
            />
            <Animated.View
              style={[
                styles.PostCommentPlaceholder,
                { opacity: shimmerOpacity },
              ]}
            />
          </View>
        </Animated.View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    backgroundColor: Color.White,
    marginBottom: 10,
    borderRadius: 8,
  },
  postContainer: {
    marginBottom: 10,
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  userImagePlaceholder: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 10,
    backgroundColor: Color.LightGrey,
  },
  userNamePlaceholder: {
    flex: 1,
    height: 40,
    backgroundColor: Color.LightGrey,
    borderRadius: 4,
  },
  content: {
    height: 150,
    width: "100%",
    marginBottom: 10,
    backgroundColor: Color.LightGrey,
    borderRadius: 4,
  },
  footer: {
    height: 40,
    width: "100%",
    backgroundColor: Color.LightGrey,
    borderRadius: 4,
  },
  PostCommentPlaceholder: {
    height: "100%",
    backgroundColor: Color.LightGrey,
    borderRadius: 4,
    width: "70%",
  },
});

export default SInglePostSkeleton;
