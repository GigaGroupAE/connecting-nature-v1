import { Image, StyleSheet, TouchableOpacity, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { BASE_URL } from "../../../CONSTANTS";
import { scale } from "react-native-size-matters";
import VideoPlayer from "expo-video-player";
import Color from "../../../assets/colors/Color";
import { useRef } from "react";

const FileMedia = ({ data }) => {
  const navigation = useNavigation();
  const video = useRef(null);

  const handleImagePress = () => {
    navigation.navigate("ViewImage", {
      url: `${BASE_URL}/images/messageMedia/${data?.content}`,
      message: "",
    });
  };

  return (
    <View style={styles.container}>
      {data?.type === "image" && (
        <TouchableOpacity onPress={handleImagePress}>
          <Image
            source={{
              uri: `${BASE_URL}/images/messageMedia/${data?.content}`,
            }}
            style={styles.image}
          />
        </TouchableOpacity>
      )}

      {data?.type === "video" && (
        <View style={styles.videoContainer}>
          <VideoPlayer
            style={styles.video}
            fullscreen={{
              enterFullscreen: () => {
                video.current.setStatusAsync({
                  shouldPlay: false,
                });
                navigation.navigate("PostView", {
                  url: `${BASE_URL}/images/messageMedia/${data?.content}`,
                  message: "",
                  mediatype: "video",
                  description: "",
                  screen: "message",
                });
              },
              exitFullscreen: (e) => console.log(e),
            }}
            defaultControlsVisible={true}
            videoProps={{
              isLooping: false,
              ref: video,
              source: {
                uri: `${BASE_URL}/images/messageMedia/${data?.content}`,
              },
              shouldPlay: false,
              resizeMode: "cover",
            }}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // paddingVertical: scale(4),

    overflow: "hidden",
  },
  image: {
    width: scale(118),
    height: scale(115),
    resizeMode: "cover",
  },
  videoContainer: {
    overflow: "hidden",
    // borderRadius: scale(10),
  },
  video: {
    width: scale(118),
    height: scale(115),
  },
  documentContainer: {
    width: scale(160),
    height: scale(110),
    borderRadius: scale(10),
  },
  documentPressable: {
    borderRadius: scale(10),
    height: "100%",
    borderWidth: 0.7,
    borderColor: Color.DarkGrey,
  },
  documentIconContainer: {
    backgroundColor: Color.Blue,
    borderTopLeftRadius: scale(10),
    borderTopRightRadius: scale(10),
    alignItems: "center",
    justifyContent: "center",
    height: "65%",
  },
  documentIcon: {
    fontSize: scale(60),
    color: Color.White,
  },
  documentInfoContainer: {
    flexDirection: "row",
    backgroundColor: Color.White,
    height: "35%",
    borderBottomRightRadius: scale(10),
    borderBottomLeftRadius: scale(10),
    paddingHorizontal: scale(10),
    paddingVertical: scale(4),
    alignItems: "center",
  },
  documentInfoText: {
    fontSize: scale(11),
    color: "grey",
    paddingHorizontal: scale(3),
    alignSelf: "center",
  },
});

export default FileMedia;
