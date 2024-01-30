import { TouchableOpacity } from 'react-native';
import React from 'react';
import { BASE_URL } from '../../../CONSTANTS';
import { useNavigation } from '@react-navigation/native';
import { Image } from 'expo-image';

const PostImage = (props) => {
  const navigation = useNavigation();

  const { post, imageStyle, setcomment } = props;

  const handleNavigation = () => {
    navigation.navigate('FullPostView', {
      url: `${BASE_URL}/images/${post?.media?.name}`,
      message: '',
      post: post,
      screen: 'home',
      setcomment: setcomment,
    });
  };

  return (
    <TouchableOpacity key={post?._id} onPress={handleNavigation}>
      {/* <Image
        style={imageStyle}
        source={{
          uri: `${BASE_URL}/images/${post?.media?.name}`,
        }}
      /> */}

      <Image
        style={imageStyle}
        source={{
          uri: `${BASE_URL}/images/${post?.media?.name}`,
        }}
        contentFit="cover"
        transition={1000}
      />
    </TouchableOpacity>
  );
};

export default PostImage;
