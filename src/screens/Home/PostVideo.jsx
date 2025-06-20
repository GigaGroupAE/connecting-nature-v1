import { Dimensions } from 'react-native';
import React from 'react';
import VideoPlayer from 'expo-video-player';
import { useNavigation } from '@react-navigation/native';

const PostVideo = (props) => {
  const navigation = useNavigation();
  const video = React.useRef(null);

  const { post, setcomment } = props;

  return (
    <VideoPlayer
      style={{
        height: Dimensions.get('screen').height * 0.45,
      }}
      fullscreen={{
        enterFullscreen: () => {
          video.current.setStatusAsync({
            shouldPlay: false,
          });
          navigation.navigate('FullPostView', {
            url: `${post?.media?.name}`,
            message: '',
            mediatype: 'video',
            //video: props.video,
            screen: 'home',
            post,
            setcomment: setcomment,
          });
        },
      }}
      defaultControlsVisible
      videoProps={{
        isLooping: false,
        ref: video,
        source: {
          uri: `${post?.media?.name}`,
        },
        shouldPlay: false,
        resizeMode: 'contain',
      }}
    />
  );
};

export default PostVideo;
