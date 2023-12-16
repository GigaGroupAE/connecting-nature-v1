import React from "react";
import { StyleSheet, View, Button, Text, TouchableOpacity } from "react-native";
import { Video, AVPlaybackStatus, ResizeMode } from "expo-av";
import { useStateContext } from "../contexts/ContextProvider";

//icons
import AntDesign from "react-native-vector-icons/AntDesign.js";
import Entypo from "react-native-vector-icons/Entypo";

//video player
import VideoPlayer from "expo-video-player";

//draggable
import Draggable from "react-native-draggable";
import { useNavigation } from "@react-navigation/native";
import Color from "../../assets/colors/Color";

const MiniVideoPlayer = ({ uri }) => {
  const videoRef = React.useRef(null);
  const [status, setStatus] = React.useState({});

  const { setShowMiniWindow, videoDescription, videoAutherName } =
    useStateContext();

  const navigation = useNavigation();

  const handleHide = () => {
    setShowMiniWindow(false);
  };

  const playVideo = () => {
    videoRef.current.playAsync();
  };

  const pauseVideo = () => {
    videoRef.current.pauseAsync();
  };

  const gotoFullScreen = () => {
    navigation.navigate("PostView", {
      url: uri,
      message: "",
      mediatype: "video",
      autherName: videoAutherName,
      description: videoDescription,
      screen: "miniVideo",
    });
  };

  const shortTitle =
    videoDescription.length > 15
      ? videoDescription.slice(0, 10) + "..."
      : videoDescription;

  const shortName =
    videoAutherName.length > 10
      ? videoAutherName.slice(0, 10) + "..."
      : videoAutherName;
  return (
    <View style={styles.tile}>
      {/* VIDEO VIEW */}

      <TouchableOpacity style={styles.video} onPress={gotoFullScreen}>
        <Video
          style={{ height: "100%", width: "100%", paddingHorizontal: 20 }}
          ref={videoRef}
          source={{
            uri,
          }}
          useNativeControls={false}
          resizeMode="cover"
          isLooping
          onPlaybackStatusUpdate={(status) => setStatus(() => status)}
        />
      </TouchableOpacity>

      {/* TITLE AND DES */}
      <View
        style={{
          flexDirection: "row",
          width: "60%",
          // alignItems: "center",
          paddingHorizontal: 10,
        }}
      >
        <View style={{ paddingVertical: 8 }}>
          <Text style={{ fontFamily: "Roboto_500Medium", fontSize: 14 }}>
            {shortTitle}
          </Text>
          <Text style={{ fontFamily: "Roboto_400Regular", fontSize: 14 }}>
            {shortName}
          </Text>
        </View>

        <View
          style={{
            flexDirection: "row",
            paddingHorizontal: 40,
            alignItems: "center",
          }}
        >
          {status.isPlaying ? (
            <AntDesign
              style={styles.center}
              name="pause"
              size={24}
              onPress={pauseVideo}
              color="#000"
            />
          ) : (
            <Entypo
              style={styles.center}
              name="controller-play"
              size={24}
              onPress={playVideo}
              color="#000"
            />
          )}

          <Entypo
            style={[styles.center, styles.crossIcon]}
            name="cross"
            size={24}
            color="#000"
            onPress={handleHide}
          />
        </View>
      </View>
      {/* <Text
        style={[styles.center, styles.description]}
        onPress={gotoFullScreen}
      >
        {videoDescription}
      </Text> */}

      {/* PLAY AND PAUSE */}
      {/* {status.isPlaying ? (
        <AntDesign
          style={styles.center}
          name="pause"
          size={24}
          onPress={pauseVideo}
          color="#000"
        />
      ) : (
        <Entypo
          style={styles.center}
          name="controller-play"
          size={24}
          onPress={playVideo}
          color="#000"
        />
      )} */}

      {/* CROSS */}
      {/* <Entypo
        style={[styles.center, styles.crossIcon]}
        name="cross"
        size={24}
        color="#000"
        onPress={handleHide}
      /> */}
    </View>
  );
  // COMMENTED OUT IS OUR PREVIOUS MINI PLAYER
  // return (
  //   <Draggable
  //     x={10}
  //     y={20}
  //     renderColor="transparent"
  //     onShortPressRelease={() => console.log("tapped!!")}
  //     draggingStyle={{ backgroundColor: "red" }}
  //   >
  //     <View
  //       style={[styles.miniWindow]}
  //     >
  //       <VideoPlayer
  //         style={styles.miniWindow}
  //         fullscreen={{
  //           enterFullscreen: () => {
  //             navigation.navigate("PostView", {
  //               url: uri,
  //               message: "",
  //               mediatype: "video",
  //             });
  //           },
  //           exitFullscreen: () => {},
  //         }}
  //         videoProps={{
  //           shouldPlay: true,
  //           source: {
  //             uri,
  //           },
  //         }}
  //       />

  //       <View style={styles.closeButton}>
  //         <AntDesign
  //           name="close"
  //           style={styles.cross}
  //           size={20}
  //           onPress={handleHide}
  //         />
  //       </View>
  //     </View>
  //   </Draggable>
  // );
};

export default MiniVideoPlayer;

const styles = StyleSheet.create({
  tile: {
    height: "100%",
    width: "100%",
    backgroundColor: Color.LightBg,
    display: "flex",
    flexDirection: "row",
    position: "absolute",
    bottom: 0,
  },
  video: {
    height: "100%",
    width: "38%",
    // paddingHorizontal: 20,s
    // paddingVertical: 6,
  },
  center: {
    alignSelf: "center",
  },
  crossIcon: {
    // margin: 20,
    paddingHorizontal: 15,
  },
  description: {
    flex: 1,
    paddingLeft: 5,
    fontFamily: "Roboto_500Medium",
  },
});

//COMMENTED BELOW ARE OUR PREV STYles
// const styles = StyleSheet.create({
//   miniWindow: {
//     //position: "absolute",
//     height: 150,
//     width: 200,
//   },
//   video: {
//     height: "100%",
//     width: "100%",
//   },
//   closeButton: {
//     position: "absolute",
//     top: 0,
//     right: 0,
//     margin: 10,
//   },
//   cross: {
//     color: "white",
//   },

// });
