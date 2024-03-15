import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import React from 'react';
import noPostIcon from '../../assets/newPost.png';
import Color from '../../assets/colors/Color';

const Height = Dimensions.get('screen').height;
const Width = Dimensions.get('screen').width;

const NoDataIndicater = ({ title, subTitle }) => {
  return (
    <View
      style={{
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Color.White,
      }}
    >
      <View
        style={{
          alignItems: 'center',
        }}
      >
        <Image source={noPostIcon} style={styles.bellIcon} />
        <Text style={styles.heading}>{title}</Text>
        <Text style={styles.subHeading}>{subTitle}</Text>
      </View>
    </View>
  );
};

export default NoDataIndicater;

const styles = StyleSheet.create({
  heading: {
    fontFamily: 'Roboto_700Bold',
    color: Color.Black,
    fontSize: Height * 0.019,
    paddingVertical: Height * 0.01,
  },
  subHeading: {
    fontFamily: 'Roboto_500Medium',
    color: Color.Black,
    fontSize: Height * 0.016,
    textAlign: 'center',
  },
  bellIcon: {
    width: Width * 0.3,
    height: Height * 0.13,
    resizeMode: 'contain',
  },
  // button: {
  //   backgroundColor: Color.Blue,
  //   marginTop: Height * 0.05,
  //   paddingHorizontal: Width * 0.06,
  //   paddingVertical: Height * 0.013,
  //   borderRadius: Height * 0.01,
  // },
  // buttonTitle: {
  //   fontFamily: 'Roboto_600SemiBold',
  //   color: Color.White,
  //   fontSize: Height * 0.02,
  // },
});
