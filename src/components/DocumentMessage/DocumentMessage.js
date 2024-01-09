import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Linking,
  Pressable,
} from "react-native";
import { MaterialCommunityIcons } from "react-native-vector-icons";
import { BASE_URL } from "../../../CONSTANTS";
import { useUserState } from "../../slices/userSlice";
import Color from "../../../assets/colors/Color";
import MessageType from "./MessageType";
import { useNavigation } from "@react-navigation/native";
import { scale } from "react-native-size-matters";

const Height = Dimensions.get("screen").height;
const Width = Dimensions.get("screen").width;

const DocumentMessage = (props) => {
  const userState = useUserState();
  const navigation = useNavigation();

  const {  socket,item } =
  props;
  const [document, setDocument] = React.useState(item.content);

  const shortTitle =
    document?.name?.length > 25
      ? document?.name.slice(0, 25) + "..."
      : document?.name;

  const [modalVisible, setmodalVisible] = useState(false);

  const handleDelete = () => {
    if (userState.id === props.sender) {
      props.longPress();
    }
  };

  return (
    <View>
      <Pressable
        style={[
          userState.id === item?.from?._id
            ? styles.receiverTextMessageMainContainer
            : styles.senderTextMessageMainContainer,
        ]}
        android_ripple={{ foreground: true, color: Color.LightGrey }}
        // onLongPress={props.longPress}
        onPress={() => console.log("pressed ")}
      >
        <View
          style={[
            userState.id === item?.from?._id
              ? styles.receiverTextMessageContainer
              : styles.senderTextMessageContainer,
          ]}
          onLongPress={handleDelete}
        >
          <View
            style={[
              userState.id === item?.from?._id
                ? styles.receiverDocumentContainer
                : styles.senderDocumentContainer,
            ]}
          >
            {           userState.id === item?.from?._id ? (
              <View>
                {props?.groupTitle !== "test" ? (
                  <View>
                    <Text style={styles.senderName}>{item.from.fullName}</Text>
                  </View>
                ) : null}
              </View>
            ) : null}
            <Pressable>
              <Pressable
                onLongPress={handleDelete}
                style={{
                  flexDirection: "row",
                  paddingHorizontal: 4,
                }}
                onPress={() => {
                  Linking.openURL(`${BASE_URL}/messageMedia/${item.content?.path}`);
                }}
              >
                <MessageType title={item.content?.name} />

                <View
                  style={{
                    alignContent: "center",
                    justifyContent: "center",
                    overflow: "hidden",
                  }}
                >
                  <Text
                    style={{
                      fontFamily: "Roboto",
                      fontSize: Height * 0.019,
                      alignSelf: "center",
                      paddingLeft: scale(5),
                    }}
                  >
                    {document.name ? shortTitle : "Testing"}
                  </Text>
                  <Text
                    style={{
                      fontSize: 11,
                      color: "grey",
                      paddingLeft: scale(5),
                    }}
                  >
                    {document.size
                      ? document.size >= 1000000
                        ? document.size / 1000000 + " " + "MB" + " " + "-" + " "
                        : document.size / 1000 + " " + "kB" + " " + "-" + " "
                      : "somesize"}
                  </Text>
                </View>
              </Pressable>
            </Pressable>
          </View>
        </View>
        <TouchableOpacity
          onPress={() =>
            navigation.navigate("MessageForwardCRM", {
              forwardFrom: userState?.id,
              forwardChat: "chatId",
              forwardType: "document",
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
      </Pressable>
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
    backgroundColor: Color.White,
    maxWidth: "80%",
    width: "75%",
    borderRadius: 15,
    marginVertical: 4,
    paddingHorizontal: 5,
  },
  receiverTextMessageContainer: {
    backgroundColor: Color.White,
    maxWidth: "80%",
    width: Width * 0.75,
    borderRadius: 15,
    paddingHorizontal: 5,
    marginVertical: 4,
  },
  textMessageMainContainer: {
    flex: 1,
    flexDirection: "row",
    alignContent: "center",
    alignItems: "center",
  },
  textMessageContainer: {
    alignItems: "baseline",
    width: Dimensions.get("screen").width * 0.64,
    // alignSelf: "flex-start",
    backgroundColor: "white",
    maxWidth: "80%",
    borderLeftWidth: 4,
    borderColor: "#4582C3",
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
    marginVertical: 4.5,
    paddingHorizontal: 5,
  },
  username: {
    fontSize: 14,
    fontWeight: "bold",
    marginLeft: 5,
    fontFamily: "Roboto",
    paddingVertical: 3,
    color: "#4582C3",
  },
  message: {
    fontSize: 14,
    marginLeft: 5,
    lineHeight: 18,
    fontFamily: "Roboto",
    paddingVertical: 3,
  },
  timeContainer: {
    flexDirection: "row",
    alignSelf: "flex-end",
    marginVertical: "1%",
  },
  time: {
    fontSize: 12,
    color: Color.Grey,
    fontFamily: "Roboto",
    marginLeft: "10%",
  },
  shareMessage: {
    position: "absolute",
    right: Width * 0.76,
    // bottom: -15,
    backgroundColor: "#CFCFCF",
    marginLeft: 9,
    borderRadius: 50,
    padding: 3,
  },
  receiverShareMessage: {
    // bottom: -15,
    backgroundColor: "#CFCFCF",
    marginLeft: 9,
    borderRadius: 50,
    padding: 3,
  },
  receiverDocumentContainer: {
    marginTop: 5,
    backgroundColor: Color.LightBg,
    paddingVertical: 10,
    borderRadius: 15,
    paddingHorizontal: 8,
    borderWidth: 4,
    borderColor: Color.LightBlue,
  },
  senderDocumentContainer: {
    marginTop: 5,
    backgroundColor: Color.LightBg,
    // paddingVertical: Height * 0.004,
    borderRadius: 15,
    paddingHorizontal: 8,
    borderWidth: 4,
    borderColor: Color.VeryLightGrey,
    height: Height * 0.09,
  },
  senderName: {
    fontFamily: "Roboto_500Medium",
    fontSize: Height * 0.017,
    color: Color.Blue,
    marginBottom: Height * 0.007,
  },
});

export default DocumentMessage;
