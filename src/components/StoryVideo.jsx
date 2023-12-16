import { Dimensions, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import VideoPlayer from "expo-video-player";
import { useNavigation } from '@react-navigation/native';
import { BASE_URL } from '../../CONSTANTS';


const StoryVideo = ({postVideo, videoAuther,videoDescription}) => {
const navigation=useNavigation()
  const video = React.useRef(null);


  return (
    <VideoPlayer
    style={{
      height: Dimensions.get("screen").height * 0.45,
    }}
    fullscreen={{
      enterFullscreen: () => {
        video.current.setStatusAsync({
          shouldPlay: false,
        });
        navigation.navigate("PostView", {
          url: `${BASE_URL}/images/${postVideo}`,
          message: "",
          mediatype: "video",
          description:videoDescription ,
          //video: props.video,
          autherName:  videoAuther,
          screen: "home",
        });
      },
      exitFullscreen: (e) => console.log(e),
    }}
    defaultControlsVisible={true}
    videoProps={{
      isLooping: false,
      ref: video,
      source: {
        uri: `${BASE_URL}/images/${postVideo}`,
      },
      shouldPlay: false,
      resizeMode: "contain",
    }}
  />
  )
}

export default StoryVideo

const styles = StyleSheet.create({})