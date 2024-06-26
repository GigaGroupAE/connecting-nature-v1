import { StyleSheet, View, Image } from 'react-native';
import React from 'react';
import { FontAwesome } from 'react-native-vector-icons';
import { screenHeight } from '../../utils/ScreenDimensions';

const MessageType = ({ title }) => {
  const getFileType = () => {
    const extension = title.split('.').pop().toLowerCase();
    switch (extension) {
      case 'pdf':
        return (
          <Image
            source={require('../../../assets/pdfIcon.png')}
            style={styles.iconImage}
          />
        );

      case 'docx':
        return (
          <Image
            source={require('../../../assets/msWord.png')}
            style={styles.iconImage}
          />
        );
      case 'xlsx':
        return (
          <Image
            source={require('../../../assets/msExcel.png')}
            style={styles.iconImage}
          />
        );

      default:
        return <FontAwesome name="file-o" size={30} />;
    }
  };

  return <View>{getFileType()}</View>;
};

export default MessageType;

const styles = StyleSheet.create({
  iconImage: {
    // width: scale(29),
    // height: scale(35),
    width: screenHeight * 0.03,
    height: screenHeight * 0.03,
    resizeMode: 'contain',
    marginRight: 3,
  },
});
