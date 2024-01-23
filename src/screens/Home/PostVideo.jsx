import { Dimensions, StyleSheet, Text, View } from "react-native"
import React from "react"
import VideoPlayer from "expo-video-player"
import { useNavigation } from "@react-navigation/native"
import { BASE_URL } from "../../../CONSTANTS"

const PostVideo = (props) => {
  const navigation = useNavigation()
  const video = React.useRef(null)

  const { post } = props

  return (
    <VideoPlayer
      style={{
        height: Dimensions.get("screen").height * 0.45,
      }}
      fullscreen={{
        enterFullscreen: () => {
          video.current.setStatusAsync({
            shouldPlay: false,
          })
          navigation.navigate("FullPostView", {
            url: `${BASE_URL}/images/${post?.media?.name}`,
            message: "",
            mediatype: "video",
            //video: props.video,
            screen: "home",
            post,
          })
        },
        exitFullscreen: (e) => console.log(e),
      }}
      defaultControlsVisible={true}
      videoProps={{
        isLooping: false,
        ref: video,
        source: {
          uri: `${BASE_URL}/images/${post?.media?.name}`,
        },
        shouldPlay: false,
        resizeMode: "contain",
      }}
    />
  )
}

export default PostVideo

const styles = StyleSheet.create({})
