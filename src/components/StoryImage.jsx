import { TouchableOpacity } from 'react-native';
import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { BASE_URL } from '../../CONSTANTS';
import { Image } from 'expo-image';

const StoryImage = ({ mediaDesciption, media, id, imageStyle }) => {
  const navigation = useNavigation();
  return (
    <TouchableOpacity
      key={id}
      onPress={() =>
        navigation.navigate('PostView', {
          url: `${media}`,
          message: mediaDesciption,
        })
      }
    >
      <Image
        style={imageStyle}
        source={{
          uri: `${media}`,
        }}
        contentFit="cover"
      />
    </TouchableOpacity>
  );
};

export default StoryImage;
