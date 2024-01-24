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
import { calculateTimeDifference } from "../../utils/timeDifference";
import { BASE_URL } from "../../../CONSTANTS";

const Width = Dimensions.get("screen").width;

const ImageMessageCn = (props) => {
  const userState = useUserState();
  const navigation = useNavigation();
  const { socket, item } = props;
  let timePassed = calculateTimeDifference(item.date);

  return (
    <Pressable
      onLongPress={() => props?.longPress(item._id, item?.from)}
      style={[
        props.LongPressed
          ? {
              backgroundColor: Color.LightBlue,
              // opacity: 0.7,
            }
          : null,
      ]}
    >
      <View>
        <View
          style={[
            userState.id === item.from
              ? styles.receiverTextMessageMainContainer
              : styles.senderTextMessageMainContainer,
          ]}
        >
          <View
            style={[
              userState.id === item.from
                ? styles.receiverTextMessageContainer
                : styles.senderTextMessageContainer,
            ]}
          >
            <Pressable
              key={props.index}
              onPress={props.onPress}
              android_ripple={{ foreground: true, color: Color.LightGrey }}
              onLongPress={() => props?.longPress(item._id, item?.from)}
            >
              {item.content !== "" && (
                <Image
                  style={[
                    userState.id === item.from
                      ? styles.receiverImageMessage
                      : styles.senderImageMessage,
                  ]}
                  source={{ uri: `${BASE_URL}/messageMedia/${item.content}` }}
                  resizeMode="cover"
                />
              )}
            </Pressable>
            <View
              style={[
                props?.message
                  ? styles.timeContainer
                  : styles.OverlayTimeContainer,
              ]}
            >
              <Text style={[props?.message ? styles.time : styles.overlayTime]}>
                {timePassed}
              </Text>
              {props?.message ? (
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
                forwardFrom: userState?.id,
                forwardChat: "chatId",
                forwardType: "image",
                forwardContent: item.content,
                socket: socket,
              })
            }
            android_ripple={{ color: Color.DarkGrey, radius: 20 }}
            style={[
              userState.id === item.from
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

export default ImageMessageCn;
