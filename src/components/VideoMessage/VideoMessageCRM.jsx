import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Pressable,
} from "react-native";
import { Ionicons, MaterialCommunityIcons } from "react-native-vector-icons";
import Color from "../../../assets/colors/Color";
import { useUserState } from "../../slices/userSlice";
import { useNavigation } from "@react-navigation/native";
import VideoPlayer from "expo-video-player";
import { calculateTimeDifference } from "../../utils/timeDifference";

const Width = Dimensions.get("screen").width;
const Height = Dimensions.get("screen").height;

const VideoMessageCRM = (props) => {
  const video = React.useRef(null);
  const [longPress, setLongPress] = useState(false);
  const userState = useUserState();
  const navigation = useNavigation();

  const {  socket,item } =
    props;
    let timePassed = calculateTimeDifference(item.date);


  const [modalVisible, setmodalVisible] = useState(false);

  const handleDelete = () => {
    if (userState.id === props.sender) {
      props.longPress();
      console.log("delete");
    }
  };

  return (
    <Pressable
      style={[
        longPress && props.LongPressed
          ? {
              backgroundColor: Color.LightBlue,
              // opacity: 0.7,
            }
          : null,
      ]}
      onLongPress={handleDelete}
    >
      <View>
        {/* <View style={styles.textMessageMainContainer}> */}
        {/* TODO :: SINCE 2 USERS CAN HAVE THE SAME NAME SO CHANGETHE LOGIC TO CHECK WITH PHONE NUMBERS */}
        <View
          style={[
            userState.id === item?.from?._id
              ? styles.receiverTextMessageMainContainer
              : styles.senderTextMessageMainContainer,
          ]}
        >
          <View
            style={[
              userState.id === item?.from?._id
                ? styles.receiverTextMessageContainer
                : styles.senderTextMessageContainer,
            ]}
          >
            {           userState.id === item?.from?._id? (
              <View>
                {props?.groupTitle !== "test" ? (
                  <View>
                    <Text style={styles.senderName}>{item.from.fullName}</Text>
                  </View>
                ) : null}
              </View>
            ) : null}
            <Pressable
              key={props.index}
              onPress={props.onPress}
              android_ripple={{ foreground: true, color: Color.LightGrey }}
              onLongPress={handleDelete}
            >
              {props.image !== "" && (
                <Pressable
                  style={{
                    overflow: "hidden",
                    backgroundColor: Color.White,
                    borderTopLeftRadius: 12,
                    borderBottomLeftRadius: 8,
                    borderBottomRightRadius: 8,
                    zIndex: 100,
                  }}
                  onLongPress={() => console.log("long presss")}
                  onPress={() => console.log("clicked")}
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
                        uri: `${props.image}`,
                      },
                      shouldPlay: false,
                      resizeMode: "contain",
                    }}
                    onLongPress={() => {
                      console.log("Long press on video");
                      // Handle the long press event on the video here
                    }}
                  />
                </Pressable>
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
                {timePassed}
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
            style={[
              userState.id === item?.from?._id
                ? styles.shareMessage
                : styles.receiverShareMessage,
            ]}
            onPress={() =>
              navigation.navigate("MessageForwardCRM", {
                forwardFrom: userState?.id,
                forwardChat:"chatId",
                forwardType: "video",
                forwardContent:item.content,
                socket: socket,
              })
            }
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
    </Pressable>
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
    borderTopRightRadius: 15,
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
    // backgroundColor: "#e0f2fe",
    backgroundColor: Color.White,
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

  senderName: {
    fontFamily: "Roboto_500Medium",
    fontSize: Height * 0.017,

    color: Color.Blue,
    paddingHorizontal: Width * 0.03,
    paddingVertical: Height * 0.012,
  },
});

export default VideoMessageCRM;
