import React from "react";
import {
  StyleSheet,
  Image,
  View,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import VideoPlayer from "expo-video-player";
import { BASE_URL } from "../../CONSTANTS";
import { useNavigation } from "@react-navigation/native";
import { useStateContext } from "../contexts/ContextProvider";

const GradientBottomImage = ({ source, style, borderRadius = 8, story }) => {
  const video = React.useRef(null);
  const navigation = useNavigation();
  const { setSelectedStory } = useStateContext();
  const handleNavigation = (story) => {
    video.current.setStatusAsync({
      shouldPlay: false,
    });
    navigation.navigate("StoryComment");
    setSelectedStory(story);
  };
  return (
    <View style={[style, { borderRadius }]}>
      {story.media.type === "image/jpeg" ? (
        <Image
          source={source}
          style={[StyleSheet.absoluteFill, { borderRadius }]}
        />
      ) : (
        <TouchableOpacity
          style={[
            StyleSheet.absoluteFill,
            { borderRadius, overflow: "hidden" },
          ]}
          onPress={() => console.log("clicked")}
        >
          <VideoPlayer
            style={{ height: 130 }}
            fullscreen={{
              enterFullscreen: () => {
                handleNavigation(story);
              },
              exitFullscreen: (e) => console.log(e),
            }}
            defaultControlsVisible={false}
            videoProps={{
              isLooping: false,
              ref: video,
              source: {
                uri: `${BASE_URL}/images/${story.media.name}`,
              },
              shouldPlay: false,
              resizeMode: "cover",
            }}
          />
        </TouchableOpacity>
      )}
    </View>
  );
};

export default GradientBottomImage;
