/* eslint-disable @typescript-eslint/indent */
import React, { useState } from "react";

import { Entypo, MaterialCommunityIcons } from "@expo/vector-icons";
import {
  View,
  StyleSheet,
  TextInput,
  TouchableWithoutFeedback,
  Keyboard,
  FlatList,
  Dimensions,
  ActivityIndicator,
  TouchableOpacity,
  Pressable,
} from "react-native";
import ChatScreenHeader from "./Components/ChatScreenHeader/ChatScreenHeader";
import { io } from "socket.io-client";
import { useEffect } from "react";
import { BASE_URL } from "../../../CONSTANTS";
import { useUserState } from "./../../slices/userSlice";
import * as ImagePicker from "expo-image-picker";
import { Audio } from "expo-av";
import { useNavigation } from "@react-navigation/native";
import * as DocumentPicker from "expo-document-picker";
import axios from "axios";
import "react-native-get-random-values";
import * as FileSystem from "expo-file-system";

//utility function for showing appropriate times
import { calculateTimeDifference } from "../../utils/timeDifference";
import Color from "../../../assets/colors/Color";
import ChatBottomBar from "./Components/ChatBottomBar/ChatBottomBar";
import { useStateContext } from "../../contexts/ContextProvider.js";
import NormalMessageCn from "../../components/NormalMessage/NormalMessageCn";
import ImageMessageCn from "../../components/ImageMessage/ImageMessageCn";
import RecordingVoiceMessageCn from "../../components/RecordingVoiceMessage/RecordingVoiceMessageCn";
import DocumentMessageCn from "../../components/DocumentMessage/DocumentMessageCn";
import { SaveFormat, manipulateAsync } from "expo-image-manipulator";
import VideoMessageCn from "../../components/VideoMessage/VideoMessageCn";
import moment from "moment";

const ChatPageCN = (props) => {
  var date = moment().utcOffset("+05:00");
  const { loading, setLoading, setImgloading, imgloading } = useStateContext();
  const [isLongPressed, setIsLongPressed] = useState(false);
  const [socket, setSocket] = useState(null);
  const [modalVisible, setmodalVisible] = useState(false);
  const [deleteId, setdeleteId] = useState("");
  const [messagesId, setmessagesId] = useState([]);
  useEffect(() => {
    let newSocket = io(BASE_URL, { auth: { token: userState.token } });
    newSocket.on("connect", () => {
      newSocket.emit("join", { id: props.route.params.group._id });
    });
    newSocket.on("receive_message", (data) => {
      setChatMessages((prevChatMessages) => {
        const updatedMessages = [...prevChatMessages, data];
        const filteredMessages = updatedMessages.filter(
          (message) => !messagesId.includes(message._id)
        );
        return filteredMessages.sort((a, b) => (a.date < b.date ? 1 : -1));
      });
    });
    newSocket.on("Deleted_messageCN", (data, message) => {
      setChatMessages(message.sort((a, b) => (a.date < b.date ? 1 : -1)));
    });
    setSocket(newSocket);
    return () => {
      newSocket.emit("leave", { id: props.route.params.group._id });
      newSocket.disconnect();
    };
  }, []);

  const userState = useUserState();
  const navigation = useNavigation();
  const handleTakePicture = (image) => {
    try {
      const formdata = new FormData();
      formdata.append("media", {
        name: `${userState.fullName}.jpg`,
        uri: image.uri,
        type: "image/jpg",
      });
      axios
        .post(`${BASE_URL}/chat/saveMedia`, formdata, {
          headers: {
            "Content-Type": "multipart/form-data",
            Accept: "application/json",
          },
        })
        .then((res) => {
          socket.emit("send_messageCN", {
            from: userState.id,
            chat: props.route.params.group._id,
            type: "image",
            content: res.data.path,
          });
        })
        .catch((e) => {
          console.log("working but error", e);
        });
    } catch (e) {
      console.log(e);
    }
  };
  const [recording, setRecording] = useState(false);
  const [chatMessages, setChatMessages] = useState(
    props?.route?.params?.group?.messages &&
      props?.route?.params?.group?.messages.sort((a, b) =>
        a.date < b.date ? 1 : -1
      )
  );

  const [searchQuery, setSearchQuery] = useState("");
  const [showInput, setShowInput] = useState(false);

  // Function to update the showInput state
  const handleShowInput = (value) => {
    setShowInput(value);
  };

  const [image, setImage] = useState(null);
  const pick = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.3,
    });

    if (result?.canceled === false) {
      // setImage([result.uri]);
      handleSendImageMessage(result?.assets[0]?.uri);
    }
  };

  const supportedImageFormats = [
    "image/jpeg",
    "image/png",
    "image/gif",
    "image/bmp",
    "image/tiff",
  ];
  let isDocumentPickingInProgress = false;

  const pickDoc = async () => {
    if (isDocumentPickingInProgress) {
      return;
    }

    isDocumentPickingInProgress = true;

    try {
      let result = await DocumentPicker.getDocumentAsync({
        quality: 0.5,
        allowsMultipleSelection: false,
      });

      if (result.canceled === false) {
        if (supportedImageFormats.includes(result?.assets[0].mimeType)) {
          let compressionQuality = 0.8;
          let compressImage;
          while (compressionQuality >= 0.1) {
            const manipResult = await manipulateAsync(
              result?.assets[0].uri,
              [],
              {
                compress: compressionQuality,
                format: SaveFormat.JPEG,
              }
            );
            compressImage = await FileSystem.getInfoAsync(manipResult.uri);
            if (compressImage.size <= 1024 * 1024) {
              break;
            }
            compressionQuality -= 0.1;
          }
          handleSendImageMessage(compressImage.uri);
          return;
        }

        if (result?.assets[0].mimeType === "video/mp4") {
          handleSenVideoMessage(result?.assets[0]);
        } else {
          handleSendDocumentMessage({
            type: result?.assets[0].mimeType,
            uri: result?.assets[0].uri,
            size: result?.assets[0].size,
            name: result?.assets[0].name,
          });
        }
      } else if (result.type === "cancel") {
        console.log("Document picking cancelled.");
      }
    } catch (error) {
      console.error("An error occurred during document picking:", error);
    } finally {
      isDocumentPickingInProgress = false;
    }
  };

  const handleSendDocumentMessage = async (docprops) => {
    try {
      const formdata = new FormData();
      formdata.append("media", {
        name: `${docprops.name}`,
        uri: docprops.uri,
        type: docprops.type,
      });
      axios
        .post(`${BASE_URL}/chat/saveMedia`, formdata, {
          headers: {
            "Content-Type": "multipart/form-data",
            Accept: "application/json",
          },
        })
        .then((res) => {
          socket.emit("send_messageCN", {
            from: userState.id,
            chat: props.route.params.group._id,
            type: "document",
            content: {
              path: res.data.path,
              name: docprops.name,
              size: docprops.size,
            },
          });
        })
        .catch((e) => {
          console.log("working but error", e);
        });
    } catch (e) {
      console.log(e);
    }
  };
  const [voice, setvoice] = useState();
  const handleSendAudioMessage = (uri) => {
    try {
      const formdata = new FormData();
      formdata.append("media", {
        name: `${userState.phoneNumber}.m4a`,
        uri: uri,
        type: "audio/mpeg",
      });
      axios
        .post(`${BASE_URL}/chat/saveMedia`, formdata, {
          headers: {
            "Content-Type": "multipart/form-data",
            Accept: "application/json",
          },
        })
        .then((res) => {
          socket.emit("send_messageCN", {
            from: userState.id,
            chat: props.route.params.group._id,
            type: "audio",
            content: res.data.path,
          });
          if (props?.route?.params?.group?.members[0]._id === userState.id) {
            console.log(props?.route?.params?.group?.members[0]._id);
            handleLocalNotification(
              props?.route?.params?.group?.members[1].expoPushToken
            );
          }
        })

        .catch((e) => {
          console.log("working but error", e);
        });
    } catch (e) {
      console.log(e);
    }
  };
  async function startRecording() {
    setRecording((recording) => !recording);
    try {
      await Audio.requestPermissionsAsync();
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      setvoice(recording);
    } catch (err) {
      console.error("Failed to start recording", err);
    }
  }

  async function stopRecording() {
    setRecording((recording) => !recording);
    setvoice(undefined);
    try {
      await voice.stopAndUnloadAsync();
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
      });
      const uri = voice.getURI();
      console.log("Recording stopped and stored at", uri);
      handleSendAudioMessage(uri);
    } catch (err) {
      console.log(err);
    }
  }

  const handleSendImageMessage = async (imageprop) => {
    setImgloading(true);
    try {
      const formdata = new FormData();
      formdata.append("media", {
        name: `${userState.fullName}.jpg`,
        uri: imageprop,
        type: "image/jpg",
      });

      axios
        .post(`${BASE_URL}/chat/saveMedia`, formdata, {
          headers: {
            "Content-Type": "multipart/form-data",
            Accept: "application/json",
          },
        })
        .then((res) => {
          socket.emit("send_messageCN", {
            from: userState.id,
            chat: props.route.params.group._id,
            type: "image",
            content: res.data.path,
          });
          setImgloading(false);
          if (props?.route?.params?.group?.members[0]._id === userState.id) {
            console.log(props?.route?.params?.group?.members[0]._id);
            handleLocalNotification(
              props?.route?.params?.group?.members[1].expoPushToken
            );
          }
        })
        .catch((e) => {
          setImgloading(false);
        });
    } catch (e) {
      console.log(e);
      setImgloading(false);
    }
  };

  const handleSenVideoMessage = async (videoprop) => {
    setImgloading(true);
    try {
      const formdata = new FormData();
      formdata.append("media", {
        name: videoprop.name,
        uri: videoprop.uri,
        type: "video/mp4",
      });
      axios
        .post(`${BASE_URL}/chat/saveMedia`, formdata, {
          headers: {
            "Content-Type": "multipart/form-data",
            Accept: "application/json",
          },
        })
        .then((res) => {
          socket.emit("send_messageCN", {
            from: userState.id,
            chat: props.route.params.group._id,
            type: "video",
            content: res.data.path,
          });

          setImgloading(false);
          if (props?.route?.params?.group?.members[0]._id === userState.id) {
            console.log(props?.route?.params?.group?.members[0]._id);
            handleLocalNotification(
              props?.route?.params?.group?.members[1].expoPushToken
            );
          }
        })
        .catch((e) => {
          console.log("working but error", e);
          setImgloading(false);
        });
    } catch (e) {
      console.log(e);
      setImgloading(false);
    }
  };

  const sendtext = (text) => {
    setLoading(true);
    socket.emit("send_messageCN", {
      from: userState.id,
      chat: props.route.params.group._id,
      type: "text",
      content: text,
    });
    if (props?.route?.params?.group?.members[0]._id === userState.id) {
      handleLocalNotification(
        props?.route?.params?.group?.members[1].expoPushToken
      );
    }
    setLoading(false);
  };

  const handleLocalNotification = async (token) => {
    try {
      const config = {
        headers: {
          "auth-token": userState.token,
        },
      };
      const notification = await axios.post(
        `${BASE_URL}/chat/notifychat`,
        {
          fullName: userState.fullName,
          expoPushtoken: token,
        },
        config
      );
    } catch (error) {
      console.log("error in local notofications", error);
    }
  };

  const handleCamera = () => {
    navigation.navigate("Camera", {
      handleTakePicture: handleTakePicture,
    });
  };

  const handleDelet = (id, from) => {
    if (userState?.id === from) {
      setdeleteId(id);
      setIsLongPressed(true);
    }
  };
  const handleDeleteMessage = async () => {
    setmessagesId((messagesId) => [...messagesId, deleteId]);

    try {
      socket.emit("Delete_messageCN", {
        chat: props.route.params.group._id,
        id: deleteId,
      });

      setIsLongPressed(false);
    } catch (error) {}
  };
  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <>
        {!isLongPressed && (
          <ChatScreenHeader
            groupState={props.route.params.group}
            handleShowInput={handleShowInput}
          />
        )}
        {isLongPressed && (
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              height: "7.4%",
              width: "100%",
              backgroundColor: Color.Blue,
              paddingHorizontal: 15,
            }}
          >
            <Pressable
              onPress={() => setIsLongPressed(false)}
              style={{ alignSelf: "center" }}
            >
              <Entypo
                name="cross"
                color={Color.White}
                size={25}
                // style={{ marginTop: 0, paddingRight: "55%" }}
              />
            </Pressable>
            <TouchableOpacity
              android_ripple={{ color: Color.LightGrey, borderless: true }}
              style={{ alignSelf: "center" }}
              onPress={handleDeleteMessage}
            >
              <MaterialCommunityIcons
                name="delete"
                color={Color.White}
                size={25}
                style={{ marginTop: 0 }}
              />
            </TouchableOpacity>
          </View>
        )}

        {showInput ? (
          <View
            style={{
              backgroundColor: Color.White,
              width: "100%",
            }}
          >
            <View style={styles.chatSearchContainer}>
              <TouchableOpacity onPress={() => setShowInput(false)}>
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

        <View style={styles.container}>
          {
            <FlatList
              showsVerticalScrollIndicator={false}
              style={{
                marginHorizontal: 10,
              }}
              inverted={true}
              keyExtractor={(item) => item._id}
              extraData={
                searchQuery === ""
                  ? chatMessages
                  : chatMessages.filter((message, index) => {
                      if (typeof message.content === "string") {
                        if (message.content.match(searchQuery)) {
                          return message;
                        }
                      }
                    })
              }
              data={
                searchQuery === ""
                  ? chatMessages
                  : chatMessages.filter((message, index) => {
                      if (typeof message.content === "string") {
                        if (message.content.match(searchQuery)) {
                          console.log("matched");
                          return message;
                        }
                      } else return null;
                    })
              }
              onEndReachedThreshold={0.1}
              onEndReached={() => {
                console.log("FETCHING NEW MESSAGES");
              }}
              renderItem={({ item, index }) => {
                let timePassed = calculateTimeDifference(item.date);

                return (
                  <View style={{ marginVertical: "1%" }}>
                    {item.type === "text" ? (
                      <NormalMessageCn
                        setmodalVisible={setmodalVisible}
                        longPress={handleDelet}
                        socket={socket}
                        item={item}
                      />
                    ) : null}
                    {item.type === "image" ? (
                      <TouchableOpacity>
                        <ImageMessageCn
                          socket={socket}
                          longPress={handleDelet}
                          item={item}
                          onPress={() =>
                            props.navigation.navigate("ViewImage", {
                              url: `${BASE_URL}/messageMedia/${item.content}`,
                              message: item.content,
                            })
                          }
                        />
                      </TouchableOpacity>
                    ) : null}
                    {item.type === "document" ? (
                      <DocumentMessageCn
                        title={"Select"}
                        socket={socket}
                        item={item}
                        longPress={handleDelet}
                      />
                    ) : null}

                    {item.type === "audio" ? (
                      <RecordingVoiceMessageCn
                        socket={socket}
                        item={item}
                        longPress={handleDelet}
                      />
                    ) : null}
                    {item.type === "video" ? (
                      <TouchableOpacity>
                        <VideoMessageCn
                          longPress={handleDelet}
                          socket={socket}
                          item={item}
                          onPress={() =>
                            props.navigation.navigate("ViewImage", {
                              url: `${BASE_URL}/messageMedia/${item.content}`,
                              message: item.content,
                            })
                          }
                        />
                      </TouchableOpacity>
                    ) : null}
                  </View>
                );
              }}
            />
          }
          <View style={{ marginLeft: "40%" }}>
            {imgloading && (
              <ActivityIndicator size={"large"} color={Color.Blue} />
            )}
          </View>

          <ChatBottomBar
            disabled={loading}
            pick={pick}
            pickDoc={pickDoc}
            startRecording={startRecording}
            stopRecording={stopRecording}
            handleCamera={handleCamera}
            sendtext={sendtext}
          />
        </View>
      </>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Color.White,
  },
  image: {
    flex: 1,
    justifyContent: "center",
  },

  message: {
    fontSize: 14,
    marginLeft: 5,
    lineHeight: 18,
    // fontFamily: "Roboto",
    paddingVertical: 3,
  },
  timeContainer: {
    flexDirection: "row",
    alignSelf: "flex-end",
    paddingVertical: 3,
  },
  time: {
    fontSize: 11,
    color: "grey",
    // fontFamily: "Roboto",
    marginTop: -5,
    alignSelf: "flex-end",
  },

  imageMessage: {
    maxWidth: "100%",
    marginVertical: 0,
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
});

export default ChatPageCN;
