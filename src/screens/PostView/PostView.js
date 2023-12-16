import React, { useRef, useEffect } from "react";
import {
  View,
  Text,
  ImageBackground,
  Dimensions,
  StyleSheet,
} from "react-native";
import GestureRecognizer from "react-native-swipe-gestures";
import { useNavigation } from "@react-navigation/native";
import VideoPlayer from "expo-video-player";
import { useStateContext } from "../../contexts/ContextProvider";
export default function PostView(props) {
  const video = useRef(null);
  const navigation = useNavigation();
  let deviceHeight = Dimensions.get("screen").height;
  let deviceWidth = Dimensions.get("screen").width;
  const {
    setVideoURI,
    setShowMiniWindow,
    setVideoDescriptionHandler,
    setvideoAutherName,
  } = useStateContext();

  useEffect(() => {
    setShowMiniWindow(false);
  }, []);

  return (
    <View>
      <View>
        {props.route.params.mediatype === "video" ? (
          <View>
            {props.route.params.screen === "message" ? (
              <GestureRecognizer
                onSwipeDown={() => {
                  navigation.goBack();
                }}
              >
                <VideoPlayer
                  style={{
                    height: Dimensions.get("screen").height,
                    width: Dimensions.get("screen").width,
                  }}
                  fullscreen={true}
                  defaultControlsVisible={true}
                  timeVisible={false}
                  slider={true}
                  videoProps={{
                    isLooping: false,
                    ref: video,
                    source: {
                      uri: props.route.params.url,
                    },
                    shouldPlay: true,
                    resizeMode: "contain",
                  }}
                />
              </GestureRecognizer>
            ) : (
              <GestureRecognizer
                onSwipeDown={() => {
                  setVideoURI(props.route.params.url);
                  setVideoDescriptionHandler(props.route.params.description);
                  setShowMiniWindow(true);
                  setvideoAutherName(props.route.params.autherName);
                  navigation.goBack();
                }}
              >
                <VideoPlayer
                  style={{
                    height: Dimensions.get("screen").height,
                    width: Dimensions.get("screen").width,
                  }}
                  fullscreen={true}
                  defaultControlsVisible={true}
                  timeVisible={false}
                  slider={true}
                  videoProps={{
                    isLooping: false,
                    ref: video,
                    source: {
                      uri: props.route.params.url,
                    },
                    shouldPlay: true,
                    resizeMode: "contain",
                  }}
                />
              </GestureRecognizer>
            )}
          </View>
        ) : (
          <ImageBackground
            resizeMode="contain"
            source={{ uri: props.route.params.url }}
            style={{ height: deviceHeight, width: deviceWidth }}
          />
        )}

        <Text>{props.route.params.message}</Text>
      </View>
      <View>
        <Text>{props.route.params.message}</Text>
      </View>
    </View>
  );
}
