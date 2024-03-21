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
import { calculateTimeDifference } from "../../utils/timeDifference";

const Width = Dimensions.get("screen").width;
const Hight = Dimensions.get("screen").height;

const NormalMessage = (props) => {
  const [longPress, setLongPress] = useState(false);
  const [pressIn, setPressIn] = useState(false);
  const userState = useUserState();
  const { socket, item } = props;

  const navigation = useNavigation();
  let timePassed = calculateTimeDifference(item.date);

  // console.log(item)

  return (
    <Pressable
      style={[
        longPress && props.LongPressed
          ? {
              backgroundColor: Color.LightBlue,
            }
          : null,
      ]}
      onLongPress={() => props?.longPress(item._id, item?.from)}
    >
      <View>
        {/* <View style={styles.textMessageMainContainer}> */}
        {/* TODO :: SINCE 2 USERS CAN HAVE THE SAME NAME SO CHANGE THE LOGIC TO CHECK WITH PHONE NUMBERS */}
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
            {/* For Chat One to One No need User Full Name as it is stick on the top that to whom we are chatting*/}
            {/* Otherwise for Group chat we need Name of the receiver (Left Side Messages) */}

            {/* {userState.fullName !== props.username && (
              <Text style={[styles.username]}>{props.username}</Text>
            )} */}
            {userState.id !== item?.from?._id ? (
              <View>
                {props?.groupTitle !== "test" ? (
                  <View>
                    <Text style={styles.senderName}>{item.from.fullName}</Text>
                  </View>
                ) : null}
              </View>
            ) : null}
            <Text style={[styles.message]}>{item.content}</Text>
            <View style={styles.timeContainer}>
              <Text style={styles.time}>{timePassed}</Text>
              <Ionicons
                name="checkmark"
                size={14}
                style={{ marginHorizontal: 2, color: "grey" }}
              />
            </View>
          </View>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate("MessageForwardCRM", {
                forwardFrom: userState.id,
                forwardChat: "chatId",
                forwardType: "text",
                forwardContent: item.content,
                socket: socket,
              })
            }
            style={[
              userState.id === item?.from?._id
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
    flexDirection: "row-reverse",
    alignContent: "center",
    alignItems: "center",
    // justifyContent: "flex-start",
  },
  senderTextMessageContainer: {
    backgroundColor: Color.White,
    maxWidth: "80%",
    borderLeftWidth: 4,
    borderColor: "#4582C3",
    borderTopRightRadius: 15,
    borderBottomRightRadius: 15,
    marginVertical: 4,
    paddingHorizontal: 5,
  },
  receiverTextMessageContainer: {
    backgroundColor: Color.White,
    maxWidth: "80%",
    borderRightWidth: 4,
    borderColor: "#4582C3",
    borderTopLeftRadius: 15,
    borderBottomLeftRadius: 15,
    paddingHorizontal: 5,
    marginVertical: 4,
  },
  username: {
    fontSize: 14,
    fontWeight: "bold",
    paddingHorizontal: 5,
    fontFamily: "Roboto",
    paddingVertical: 2,
    color: "#4582C3",
  },
  message: {
    fontSize: 15.5,
    paddingHorizontal: 5,
    fontFamily: "Roboto",
    paddingVertical: 4,
    lineHeight: 20,
  },
  timeContainer: {
    flexDirection: "row",
    alignSelf: "flex-end",
    marginTop: "-2%",
    marginVertical: 5,
  },
  time: {
    fontSize: 12,
    color: Color.Grey,
    fontFamily: "Roboto",
    marginLeft: "10%",
  },
  shareMessage: {
    backgroundColor: "#CFCFCF",
    marginLeft: 9,
    borderRadius: 50,
    padding: 3,
  },
  imageMessage: {
    maxWidth: "100%",
    height: Dimensions.get("screen").height * 0.4,
    width: Dimensions.get("screen").width * 0.6,
    marginVertical: 0,
  },
  shareMessage: {
    backgroundColor: "#CFCFCF",
    marginLeft: 9,
    borderRadius: 50,
    padding: 3,
    marginHorizontal: Width * 0.018,
  },
  receiverShareMessage: {
    backgroundColor: "#CFCFCF",
    marginLeft: 9,
    borderRadius: 50,
    padding: 3,

    marginHorizontal: Width * 0.018,
  },
  senderName: {
    fontFamily: "Roboto_500Medium",
    color: Color.DarkBlue,
    fontSize: Hight * 0.017,
    marginTop: Hight * 0.004,
  },
});

export default NormalMessage;
