import React from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import VideoPlayer from 'expo-video-player';
import { BASE_URL } from '../../CONSTANTS';
import { useNavigation } from '@react-navigation/native';
import { useStateContext } from '../contexts/ContextProvider';
import { Image } from 'expo-image';
import { screenHeight } from '../utils/ScreenDimensions';

const GradientBottomImage = ({ source, style, borderRadius = 8, story }) => {
  const video = React.useRef(null);
  const navigation = useNavigation();
  const { setSelectedStory } = useStateContext();
  const handleNavigation = (story) => {
    video.current.setStatusAsync({
      shouldPlay: false,
    });
    navigation.navigate('StoryComment');
    setSelectedStory(story);
  };

  const supportedImageFormats = ['image/jpeg', 'image/png', 'image/jpg'];

  return (
    <View style={[style, { borderRadius }]}>
      {supportedImageFormats.includes(story.media.type) ? (
        <Image
          source={source}
          style={[StyleSheet.absoluteFill, { borderRadius }]}
          contentFit="cover"
        />
      ) : (
        <TouchableOpacity
          style={[
            StyleSheet.absoluteFill,
            { borderRadius, overflow: 'hidden' },
          ]}
          onPress={() => {}}
        >
          <VideoPlayer
            style={{ height: screenHeight * 0.17 }}
            fullscreen={{
              enterFullscreen: () => {
                handleNavigation(story);
              },
            }}
            defaultControlsVisible={false}
            videoProps={{
              isLooping: false,
              ref: video,
              source: {
                uri: `${BASE_URL}/images/${story.media.name}`,
              },
              shouldPlay: false,
              resizeMode: 'cover',
            }}
          />
        </TouchableOpacity>
      )}
    </View>
  );
};

export default GradientBottomImage;
