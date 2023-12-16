import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Pressable,
} from "react-native";
import { Ionicons, MaterialCommunityIcons } from "react-native-vector-icons";
import Color from "../../../assets/colors/Color";
import { useUserState } from "../../slices/userSlice";
import { ActivityIndicator } from "react-native";
import { useNavigation } from "@react-navigation/native";
import VideoPlayer from "expo-video-player";
import { BASE_URL } from "../../../CONSTANTS";

const Width = Dimensions.get("screen").width;
const Height = Dimensions.get("screen").height;

const VideoMessageCn = (props) => {
  const video = React.useRef(null);

  const [longPress, setLongPress] = useState(false);
  const userState = useUserState();
  const navigation = useNavigation();
  const { forwardFrom, forwardChat, forwardType, forwardContent, socket } =
    props;
  const [modalVisible, setmodalVisible] = useState(false);
  const handleNavigation = () => {
    navigation.navigate("MsgShare");
  };

  const handleDelet = () => {
    setmodalVisible(true);
  };

  return (
    <View
      onLongPress={() => {
        props.longPress();
        setLongPress(true);
      }}
      style={[
        longPress && props.LongPressed
          ? {
              backgroundColor: Color.LightBlue,
              // opacity: 0.7,
            }
          : null,
      ]}
    >
      <View>
        {/* <View style={styles.textMessageMainContainer}> */}
        {/* TODO :: SINCE 2 USERS CAN HAVE THE SAME NAME SO CHANGETHE LOGIC TO CHECK WITH PHONE NUMBERS */}
        <View
          style={[
            userState.id === props.phoneNumber
              ? styles.receiverTextMessageMainContainer
              : styles.senderTextMessageMainContainer,
          ]}
        >
          <View
            style={[
              userState.id === props.phoneNumber
                ? styles.receiverTextMessageContainer
                : styles.senderTextMessageContainer,
            ]}
          >
            <Pressable
              key={props.index}
              onPress={props.onPress}
              onLongPress={() => handleDelet()}
              android_ripple={{ foreground: true, color: Color.LightGrey }}
            >
              {props.image !== "" && (
                <View
                  style={{
                    backgroundColor: "red",
                    overflow: "hidden",
                    backgroundColor: Color.White,
                    borderWidth: 5,
                    borderColor: Color.VeryLightGrey,
                    borderTopLeftRadius: 15,
                    borderBottomLeftRadius: 15,
                    borderBottomRightRadius: 15,
                  }}
                >
                  <VideoPlayer
                    style={{ width: 205, height: 300, borderRadius: 20 }}
                    fullscreen={{
                      enterFullscreen: () => {
                        video.current.setStatusAsync({
                          shouldPlay: false,
                        });
                        navigation.navigate("PostView", {
                          url: `${props.image}`,
                          message: "",
                          mediatype: "video",
                          description: "",
                          //video: props.video,
                          screen: "message",
                        });
                      },
                      exitFullscreen: (e) => console.log(e),
                    }}
                    defaultControlsVisible={true}
                    // timeVisible={false}
                    // slider={false}
                    videoProps={{
                      isLooping: false,
                      ref: video,
                      source: {
                        uri: `${props.image}`,
                      },
                      shouldPlay: false,
                      resizeMode: "contain",
                    }}
                  />
                </View>
              )}
            </Pressable>
            {props.message && (
              <Text style={[styles.message]}>{props.message}</Text>
            )}
            <View
              style={[
                props.message
                  ? styles.timeContainer
                  : styles.OverlayTimeContainer,
              ]}
            >
              <Text style={[props.message ? styles.time : styles.overlayTime]}>
                {props.time}
              </Text>
              {props.message ? (
                <Ionicons
                  name="checkmark"
                  size={14}
                  style={{ marginHorizontal: 2, color: Color.Grey }}
                />
              ) : (
                <Ionicons
                  name="checkmark"
                  size={14}
                  style={{ marginHorizontal: 2, color: Color.LightGrey }}
                />
              )}
            </View>
          </View>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate("MsgShare", {
                forwardFrom: forwardFrom,
                forwardChat: forwardChat,
                forwardType: forwardType,
                forwardContent: forwardContent,
                socket: socket,
              })
            }
            android_ripple={{ color: Color.DarkGrey, radius: 20 }}
            style={[
              userState.id === props.phoneNumber
                ? styles.shareMessage
                : styles.receiverShareMessage,
            ]}
          >
            <View>
              <MaterialCommunityIcons
                name="share"
                size={22}
                style={{ color: "white" }}
              />
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  senderTextMessageMainContainer: {
    flex: 1,
    flexDirection: "row",
    alignContent: "center",
    alignItems: "center",
  },
  receiverTextMessageMainContainer: {
    flex: 1,
    flexDirection: "row",
    alignContent: "center",
    alignItems: "center",
    justifyContent: "flex-end",
  },
  senderTextMessageContainer: {
    maxWidth: "80%",
  },
  receiverTextMessageContainer: {
    maxWidth: "80%",
  },
  timeContainer: {
    flexDirection: "row",
    alignSelf: "flex-end",
    marginTop: "-1%",
    marginVertical: "1%",
  },
  OverlayTimeContainer: {
    position: "absolute",
    bottom: 10,
    right: 0,
    flexDirection: "row",
    alignSelf: "flex-end",
  },
  time: {
    fontSize: 12,
    color: Color.Grey,
    fontFamily: "Roboto",
    marginLeft: "10%",
  },
  overlayTime: {
    fontSize: 12,
    color: Color.LightGrey,
    fontFamily: "Roboto",
    marginLeft: "10%",
  },
  shareMessage: {
    position: "absolute",
    right: Width * 0.62,
    // bottom: -15,
    backgroundColor: "#CFCFCF",
    marginLeft: 9,
    borderRadius: 50,
    padding: 3,
  },
  receiverShareMessage: {
    position: "absolute",
    // right: -40,
    // bottom: -15,
    backgroundColor: "#CFCFCF",
    marginLeft: 9,
    borderRadius: 50,
    padding: 3,
    left: Width * 0.61,
  },
  senderImageMessage: {
    backgroundColor: Color.White,
    borderWidth: 5,
    borderColor: Color.VeryLightGrey,
    borderTopRightRadius: 15,
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
    height: Dimensions.get("screen").height * 0.4,
    width: Dimensions.get("screen").width * 0.6,
  },
  receiverImageMessage: {
    backgroundColor: Color.White,
    borderWidth: 5,
    borderColor: Color.LightBlue,
    borderTopLeftRadius: 15,
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
    height: Dimensions.get("screen").height * 0.4,
    width: Dimensions.get("screen").width * 0.6,
  },
});

export default VideoMessageCn;
