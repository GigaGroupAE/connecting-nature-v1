import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from "react-native";
import { Button } from "react-native-paper";
import { Ionicons, MaterialCommunityIcons } from "react-native-vector-icons";
import Color from "../../../../../assets/colors/Color";
import { useUserState } from "../../../../slices/userSlice";

const OrderMessage = (props) => {
  const [longPress, setLongPress] = useState(false);
  const userState = useUserState();
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
            userState.fullName === props.username
              ? styles.receiverTextMessageMainContainer
              : styles.senderTextMessageMainContainer,
          ]}
        >
          <View
            style={[
              userState.fullName === props.username
                ? styles.receiverTextMessageContainer
                : styles.senderTextMessageContainer,
            ]}
          >
            <TouchableOpacity key={props.index}>
              {props.image !== "" && (
                <Image
                  style={[styles.imageMessage]}
                  source={{ uri: props.image }}
                  resizeMode="cover"
                />
              )}
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.container}
              onPress={props.onPress}
              disabled={props.status == "ACCEPTED" ? true : false}
            >
              <Text style={styles.title}>{props.status}</Text>
            </TouchableOpacity>
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

          <TouchableOpacity>
            <View
              style={[
                userState.fullName === props.username
                  ? styles.shareMessage
                  : styles.receiverShareMessage,
              ]}
            >
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
  container: {
    backgroundColor: Color.Blue,
    width: 120,
    borderRadius: 6,
    alignItems: "center",
    marginRight: "3%",
  },
  title: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    alignSelf: "center",
    color: Color.White,
    fontFamily: "Roboto_500Medium",
    fontSize: Dimensions.get("screen").height * 0.02,
  },
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
    borderBottomRightRadius: 15,
  },
  receiverTextMessageContainer: {
    maxWidth: "80%",
    borderTopLeftRadius: 15,
    borderBottomLeftRadius: 15,
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
    right: 250,
    bottom: -15,
    backgroundColor: "#CFCFCF",
    marginLeft: 9,
    borderRadius: 50,
    padding: 3,
  },
  receiverShareMessage: {
    position: "absolute",
    right: -40,
    bottom: -15,
    backgroundColor: "#CFCFCF",
    marginLeft: 9,
    borderRadius: 50,
    padding: 3,
  },
  imageMessage: {
    backgroundColor: Color.White,
    borderWidth: 5,
    borderColor: Color.White,
    borderRadius: 15,
    height: Dimensions.get("screen").height * 0.4,
    width: Dimensions.get("screen").width * 0.6,
  },
});

export default OrderMessage;
