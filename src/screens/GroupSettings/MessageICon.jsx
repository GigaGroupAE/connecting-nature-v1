import { View } from 'react-native';
import React from 'react';
import {
  AntDesign,
  MaterialCommunityIcons,
  FontAwesome,
} from 'react-native-vector-icons';

const MessageICon = ({ title }) => {
  const getFileType = () => {
    const extension = title.split('.').pop().toLowerCase();
    switch (extension) {
      case 'pdf':
        return <AntDesign name="pdffile1" size={22} style={{ color: 'red' }} />;
      case 'docx':
        return (
          <MaterialCommunityIcons
            name="file-word-outline"
            size={30}
            style={{ color: '#3D79D0' }}
          />
        );
      case 'xlsx':
        return (
          <AntDesign name="exclefile1" size={22} style={{ color: '#306B41' }} />
        );
      default:
        return <FontAwesome name="file-o" size={22} />;
    }
  };

  return <View>{getFileType()}</View>;
};

export default MessageICon;
