import { Text, TouchableOpacity, View } from 'react-native';
import React from 'react';
import { screenHeight } from '../utils/ScreenDimensions';
import {
  buttonTitle,
  buttonContainer,
} from '../screens/Decorations/ModalStyle';
import {
  handleAdminDownload,
  handleUserDownload,
} from '../utils/BiddingListDownload';
import Color from '../../assets/colors/Color';

const DownloadBidding = ({ item, currentUser, title }) => {
  const handleDownload = async (item) => {
    if (
      currentUser[0]?.privilege === 'Owner' ||
      currentUser[0]?.privilege === 'Lead'
    ) {
      handleAdminDownload(item);
    } else {
      handleUserDownload(item);
    }
  };
  return (
    <View
      style={{
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
      }}
    >
      <TouchableOpacity
        style={{
          ...buttonContainer,
          width: '48%',
          marginTop: 0,
          paddingVertical: screenHeight * 0.012,
        }}
        onPress={() => handleDownload(item)}
      >
        <Text style={buttonTitle}>{title}</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={{
          ...buttonContainer,
          width: '48%',
          marginTop: 0,
          backgroundColor: Color.White,
          borderWidth: 1,
          paddingVertical: screenHeight * 0.011,
        }}
        onPress={() => handleDownload(item)}
      >
        <Text style={{ ...buttonTitle, color: Color.Black }}>Share</Text>
      </TouchableOpacity>
    </View>
  );
};

export default DownloadBidding;
