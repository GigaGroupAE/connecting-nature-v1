import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import Color from '../../../assets/colors/Color';

const ArchivedBiddingSkeletn = () => {
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
      { iterations: -1 },
    ).start();
  };

  const shimmerOpacity = shimmerAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.7],
  });

  return (
    <View style={styles.container}>
      {[...Array(15)].map((index) => (
        <Animated.View
          key={index}
          style={[
            styles.postContainer,
            { opacity: shimmerOpacity, marginBottom: index === 3 ? 8 : 8 },
          ]}
        >
          <Animated.View style={[styles.footer, { opacity: shimmerOpacity }]} />
        </Animated.View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  footer: {
    height: 130,
    width: '95%',
    backgroundColor: Color.LightGrey,
    borderRadius: 4,
    alignSelf: 'center',
  },
});

export default ArchivedBiddingSkeletn;
