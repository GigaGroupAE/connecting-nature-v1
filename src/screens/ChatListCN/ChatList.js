import React, { useState, useCallback, useEffect } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  Dimensions,
  Modal,
  Pressable,
} from "react-native";
import HeaderNormal from "../../components/HeaderNormal";
import BottomTab from "../../components/BottomTab";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import Color from "../../../assets/colors/Color";
import axios from "axios";
import { BASE_URL } from "../../../CONSTANTS";
import { useUserState } from "../../slices/userSlice";
import { useStateContext } from "../../contexts/ContextProvider";
import { calculateTimeDifference } from "../../utils/timeDifference";
import {
  FontAwesome,
  Ionicons,
  MaterialIcons,
} from "react-native-vector-icons";
import NoMessage from "./NoMessage";

const Height = Dimensions.get("screen").height;
const Width = Dimensions.get("screen").width;

export default function ChatList() {
  const [Messages, setMessages] = useState([]);
  const [modalVisible, setmodalVisible] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [IsshowInput, setIsShowInput] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const navigation = useNavigation();
  const userState = useUserState();
  const { group, setgroup, loading, setLoading } = useStateContext();
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${BASE_URL}/chat/get-my-chats`, {
          headers: {
            "auth-token": userState.token,
          },
        });
        setMessages([...res.data.myChats]);
        setLoading(false);
        setRefresh(false); // Reset the refresh state after fetching data
      } catch (error) {
        console.log(error);
        setLoading(false);
      }
    };

    const unsubscribe = navigation.addListener("focus", () => {
      setRefresh(true);
    });

    fetchData();

    return () => {
      unsubscribe();
    };
  }, [navigation, refresh]);

  const handleonbackpress = () => {
    navigation.goBack();
  };
  const setPhotoForDirectChat = (props) => {
    if (props.members[0].phoneNumber === userState.phoneNumber) {
      const profile = props.members[1].profile;

      return `${BASE_URL}/images/${profile}`;
    } else {
      const profile = props.members[0].profile;
      return `${BASE_URL}/images/${profile}`;
    }
  };

  const handleCancel = useCallback(() => {
    setmodalVisible(false);
  }, []);

  const scrollToTop = useCallback(() => {}, []);

  const handleShowInput = useCallback(() => {
    setIsShowInput(true);
  }, []);

  const handleHideInput = useCallback(() => {
    setIsShowInput(false);
    setSearchQuery("");
  }, []);
  const latestChat = Messages.sort((a, b) => {
    const dateA =
      a.messages.length > 0
        ? a.messages[a.messages.length - 1].createdAt
        : null;
    const dateB =
      b.messages.length > 0
        ? b.messages[b.messages.length - 1].createdAt
        : null;

    if (!dateA || !dateB) {
      return 0;
    }

    const timeDifferenceA = Math.abs(new Date() - new Date(dateA));
    const timeDifferenceB = Math.abs(new Date() - new Date(dateB));

    return timeDifferenceA - timeDifferenceB;
  });

  return (
    <SafeAreaView style={{ backgroundColor: Color.White, height: "100%" }}>
      <HeaderNormal
        title={"Chats"}
        onback={handleonbackpress}
        handleShowInput={handleShowInput}
      />
      {IsshowInput ? (
        <View
          style={{
            backgroundColor: Color.White,
            width: "100%",
          }}
        >
          <View style={styles.chatSearchContainer}>
            <TouchableOpacity onPress={handleHideInput}>
              <Entypo name="cross" size={28} color={Color.Grey} />
            </TouchableOpacity>
            <View style={styles.searchContainer}>
              <TextInput
                autoFocus
                placeholder="Search"
                value={searchQuery}
                onChangeText={setSearchQuery}
                style={styles.textBox}
              />
            </View>
          </View>
        </View>
      ) : null}
      <View>
        {!loading && Messages?.length == 0 ? (
          <NoMessage />
        ) : (
          <View style={styles.container}>
            <FlatList
              data={latestChat}
              keyExtractor={(item) => item._id}
              showsVerticalScrollIndicator={false}
              renderItem={({ item }) => {
                let latestMessage = null;

                if (item.messages.length > 0) {
                  latestMessage =
                    item.messages[item.messages.length - 1].createdAt;
                }

                let timePassed = latestMessage
                  ? calculateTimeDifference(latestMessage)
                  : "";

                let masgTitle = "";

                // item.messages[item.messages.length - 1]?.type === "document"
                //   ? (masgTitle =
                //       item.messages[item.messages.length - 1]?.content?.name
                //         ?.length > 35
                //         ? item.messages[
                //             item.messages.length - 1
                //           ]?.content?.name.slice(0, 35) + "..."
                //         : item.messages[item.messages.length - 1]?.content.name)
                //   : (masgTitle =
                //       item.messages[item.messages.length - 1]?.content?.length >
                //       35
                //         ? item.messages[
                //             item.messages.length - 1
                //           ]?.content.slice(0, 35) + "..."
                //         : item.messages[item.messages.length - 1]?.content);
                let messageTye;
                if (item.messages.length > 0) {
                  messageTye = item.messages[item.messages.length - 1].type;
                }

                let removeLineBreak;
                if (messageTye === "text") {
                  const lastMessageContent =
                    item.messages[item.messages.length - 1].content;
                  removeLineBreak = lastMessageContent.replace(/[\r\n]+/g, " ");
                  if (removeLineBreak.length > 40) {
                    removeLineBreak = removeLineBreak.slice(0, 38) + "...";
                  }
                }

                return (
                  <Pressable
                    style={styles.mainBody}
                    onPress={() => {
                      setgroup(item);
                      navigation.navigate("ChatCN", {
                        group: item,
                      });
                    }}
                    delayLongPress={1000}
                  >
                    <View style={styles.singleNotification}>
                      <Image
                        style={styles.userAvatar}
                        source={{ uri: setPhotoForDirectChat(item) }}
                      />

                      <View style={styles.mainContent}>
                        <View style={styles.listHead}>
                          <Text style={styles.userName}>
                            {item.members[0].phoneNumber ===
                            userState.phoneNumber
                              ? item.members[1].fullName
                              : item.members[0].fullName}
                          </Text>
                          <Text style={styles.timeText}>{timePassed}</Text>
                        </View>
                        {messageTye === "text" ? (
                          <Text style={styles.msgText}>{removeLineBreak}</Text>
                        ) : null}
                        {messageTye === "video" ? (
                          <View style={styles.messageType}>
                            <FontAwesome
                              name="video-camera"
                              style={{ fontSize: 14, color: Color.Grey }}
                            />
                            <Text style={{ ...styles.msgText, marginLeft: 6 }}>
                              Video
                            </Text>
                          </View>
                        ) : null}
                        {messageTye === "image" ? (
                          <View style={styles.messageType}>
                            <FontAwesome
                              name="photo"
                              style={{ fontSize: 14, color: Color.Grey }}
                            />
                            <Text style={{ ...styles.msgText, marginLeft: 6 }}>
                              Photo
                            </Text>
                          </View>
                        ) : null}
                        {messageTye === "document" ? (
                          <View style={styles.messageType}>
                            <Ionicons
                              name="document"
                              style={{ fontSize: 14, color: Color.Grey }}
                            />
                            <Text style={{ ...styles.msgText, marginLeft: 6 }}>
                              Document
                            </Text>
                          </View>
                        ) : null}

                        {messageTye === "audio" ? (
                          <View style={styles.messageType}>
                            <MaterialIcons
                              name="keyboard-voice"
                              style={{ fontSize: 18, color: Color.Grey }}
                            />
                            <Text style={{ ...styles.msgText, marginLeft: 4 }}>
                              Voice
                            </Text>
                          </View>
                        ) : null}
                      </View>
                    </View>
                  </Pressable>
                );
              }}
            />
            <Modal
              animationType="slide"
              transparent={true}
              visible={modalVisible}
              onRequestClose={() => {
                setmodalVisible(!modalVisible);
              }}
            >
              <View style={styles.ConfrmModel}>
                <View>
                  <Text
                    style={{
                      fontFamily: "Roboto_400Regular",
                      fontWeight: "400",
                    }}
                  >
                    Do you really want to delete the Chat?
                  </Text>
                </View>
                <View style={styles.model}>
                  <TouchableOpacity onPress={() => handleDelete()}>
                    <Text style={styles.btn}>Yes Delete</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => handleCancel()}>
                    <Text
                      style={{
                        ...styles.btn,
                        backgroundColor: Color.White,
                        color: Color.Black,
                        borderWidth: 1,
                      }}
                    >
                      No, Cancel
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Modal>
          </View>
        )}
      </View>

      <BottomTab activeMenu={"Chat"} scrollToTop={scrollToTop} />
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: {
    display: "flex",
    backgroundColor: Color.White,
    width: "100%",
    marginBottom: "28%",
    paddingBottom: 10,
    alignContent: "flex-start",
    justifyContent: "flex-start",
  },
  mainBody: {
    paddingHorizontal: 19,
    paddingVertical: 5,
    borderWidth: 0.5,

    borderColor: Color.VeryLightGrey,
  },
  singleNotification: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 5,
    width: "95%",
    // justifyContent: "center",
  },
  userAvatar: {
    width: Dimensions.get("screen").height * 0.07,
    height: Dimensions.get("screen").height * 0.07,
    borderRadius: Dimensions.get("screen").height * 0.1,
  },

  listHead: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  userName: {
    fontFamily: "Roboto_500Medium",
    fontSize: 14,
    color: Color.Black,
    marginLeft: 11,
  },
  categoryText: {
    fontFamily: "Roboto_400Regular",
    fontSize: 12,
    color: Color.Blue,
    marginLeft: 9,
  },
  timeText: {
    position: "absolute",
    fontFamily: "Roboto_400Regular",
    fontSize: 12,
    color: Color.Black,
    right: "10%",
  },
  messageContainer: {
    width: "90%",
  },
  messageText: {
    fontFamily: "Roboto_400Regular",
    fontSize: 13,
    lineHeight: 22,
    color: Color.Black,
    marginLeft: 11,
  },
  bodyHeadContainer: {
    paddingHorizontal: 19,
    paddingVertical: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderColor: Color.VeryLightGrey,
    borderWidth: 1,
  },

  bodyHeadText: {
    fontFamily: "Roboto",
    fontSize: 16,
    fontWeight: "600",
    color: "#4582C3",
  },
  nochatText: {
    fontFamily: "Roboto_400Regular",
    fontSize: 12,
    color: Color.LightGrey,
    opacity: 0.9,
    alignSelf: "center",
  },
  mainContent: {
    width: "100%",
    justifyContent: "space-around",
    // alignItems: "center",
  },
  msgText: {
    fontFamily: "Roboto_400Regular",
    fontSize: 12,
    lineHeight: 22,
    color: Color.Black,
    marginLeft: 11,
  },
  btn: {
    paddingVertical: Height * 0.012,
    backgroundColor: Color.Blue,
    paddingHorizontal: Width * 0.07,
    color: Color.White,
    fontFamily: "Roboto_500Medium",
    fontWeight: "600",
    borderRadius: Height * 0.01,
  },
  ConfrmModel: {
    alignSelf: "center",

    flex: 0.3,
    justifyContent: "center",
    alignItems: "center",
    marginTop: Height * 0.4,

    backgroundColor: Color.White,
    shadowColor: Color.Grey,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
    elevation: 8,
    alignSelf: "center",
    paddingVertical: Height * 0.019,
    // marginTop: 10,
    borderRadius: 6,
  },
  model: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: Height * 0.03,
    width: Width * 0.9,
  },
  chatSearchContainer: {
    flexDirection: "row",
    alignContent: "center",
    alignItems: "center",
    marginTop: 10,
    marginHorizontal: 10,
  },
  searchContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 4,
    marginLeft: 10,
    borderRadius: Dimensions.get("screen").height * 0.1,
    backgroundColor: "#F1F1F1",
  },
  textBox: {
    fontSize: 14,
    marginTop: 3,
    fontFamily: "Roboto_400Regular",
    width: "82%",
  },
  heading: {
    fontFamily: "Roboto_700Bold",
    color: Color.DarkGrey,
    fontSize: Height * 0.019,
    paddingVertical: Height * 0.01,
  },
  subHeading: {
    fontFamily: "Roboto_500Medium",
    color: Color.DarkGrey,
    fontSize: Height * 0.016,
  },
  bellIcon: {
    width: Width * 0.3,
    height: Height * 0.14,
    resizeMode: "contain",
  },
  button: {
    backgroundColor: Color.Blue,
    marginTop: Height * 0.05,
    paddingHorizontal: Width * 0.06,
    paddingVertical: Height * 0.012,
    borderRadius: Height * 0.01,
  },
  buttonTitle: {
    fontFamily: "Roboto_600SemiBold",
    color: Color.White,
    fontSize: Height * 0.02,
  },
  messageType: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 11,
  },
});
