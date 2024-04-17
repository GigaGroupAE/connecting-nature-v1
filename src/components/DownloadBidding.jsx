import { Text, TouchableOpacity } from 'react-native';
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

const DownloadBidding = ({ item, currentUser }) => {
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
    <TouchableOpacity
      style={{
        ...buttonContainer,
        width: '48%',
        marginTop: 0,
        paddingVertical: screenHeight * 0.012,
      }}
      onPress={() => handleDownload(item)}
    >
      <Text style={buttonTitle}>Download CSV</Text>
    </TouchableOpacity>
  );
};

export default DownloadBidding;
