import { Image, TouchableOpacity } from 'react-native';
import React from 'react';
import { BASE_URL } from '../../../CONSTANTS';
import { useNavigation } from '@react-navigation/native';

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
      <Image
        style={imageStyle}
        source={{
          uri: `${BASE_URL}/images/${post?.media?.name}`,
        }}
      />
    </TouchableOpacity>
  );
};

export default PostImage;
