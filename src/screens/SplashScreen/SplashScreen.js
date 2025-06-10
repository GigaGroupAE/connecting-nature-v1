import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  Animated,
  Image,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Color from '../../../assets/colors/Color';

const FadeInView = (props) => {
  const fadeAnim = useRef(new Animated.Value(0)).current; // Initial value for opacity: 0

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 3000,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  return (
    <Animated.View // Special animatable View
      style={{
        ...props.style,
        opacity: fadeAnim, // Bind opacity to animated value
      }}
    >
      {props.children}
    </Animated.View>
  );
};

const SplashScreen = () => {
  return (
    <SafeAreaView style={styles.mainContainer}>
      <FadeInView>
        <Image
          style={styles.mainLogo}
          source={require('../../../assets/cn-white-logo.png')}
        />
      </FadeInView>
      <Text style={styles.footer}>Giga Group Management</Text>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    alignContent: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Color.Blue,
    height: Dimensions.get('screen').height,
    width: Dimensions.get('screen').width,
  },
  mainLogo: {
    width: Dimensions.get('screen').height * 0.2,
    height: Dimensions.get('screen').height * 0.2,
    marginBottom: '40%',
  },
  footer: {
    position: 'absolute',
    bottom: '5%',
    fontFamily: 'Roboto_500Medium',
    color: Color.White,
    fontSize: 12,
  },
});

export default SplashScreen;
