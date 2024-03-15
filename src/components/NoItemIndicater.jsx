import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';
import React from 'react';

import Color from '../../assets/colors/Color';
import { screenHeight, screenWidth } from '../utils/ScreenDimensions';

const NoItemIndicater = ({
  title,
  description,
  image,
  buttonTitle,
  buttonAction,
  buttonColor,
}) => {
  return (
    <View
      style={{
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Color.White,
        flex: 1,
      }}
    >
      <View
        style={{
          alignItems: 'center',
        }}
      >
        <Image source={image} style={styles.bellIcon} />
        <Text style={styles.heading}>{title}</Text>
        <Text style={styles.subHeading}>{description}</Text>
        {buttonTitle && (
          <TouchableOpacity
            style={{ ...styles.button, backgroundColor: buttonColor }}
            onPress={buttonAction}
          >
            <Text style={styles.buttonTitle}>{buttonTitle}</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  heading: {
    fontFamily: 'Roboto_700Bold',
    color: Color.Black,
    fontSize: screenHeight * 0.019,
    paddingVertical: screenHeight * 0.01,
  },
  subHeading: {
    fontFamily: 'Roboto_500Medium',
    color: Color.Black,
    fontSize: screenHeight * 0.016,
    textAlign: 'center',
    width: screenWidth * 0.8,
  },
  bellIcon: {
    width: screenWidth * 0.3,
    height: screenHeight * 0.13,
    resizeMode: 'contain',
  },
  button: {
    backgroundColor: Color.Blue,
    marginTop: screenHeight * 0.05,
    paddingHorizontal: screenWidth * 0.06,
    paddingVertical: screenHeight * 0.013,
    borderRadius: screenHeight * 0.01,
  },
  buttonTitle: {
    fontFamily: 'Roboto_600SemiBold',
    color: Color.White,
    fontSize: screenHeight * 0.02,
  },
});

export default NoItemIndicater;
