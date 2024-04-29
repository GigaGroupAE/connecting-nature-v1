/* eslint-disable @typescript-eslint/indent */
import React, { useState, useEffect } from 'react';

import { Entypo, MaterialCommunityIcons } from '@expo/vector-icons';
import {
  View,
  StyleSheet,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  Keyboard,
  FlatList,
  Dimensions,
  ActivityIndicator,
  ImageBackground,
  Animated,
  TouchableOpacity,
  Pressable,
} from 'react-native';
import ChatScreenHeader from './Components/ChatScreenHeader/ChatScreenHeader';
import { io } from 'socket.io-client';

import { BASE_URL } from '../../../CONSTANTS';
import { useUserState } from './../../slices/userSlice';
import { Audio } from 'expo-av';
import { useNavigation } from '@react-navigation/native';
import RecordingVoiceMessage from '../../components/RecordingVoiceMessage/RecordingVoiceMessage';
import ImageMessage from '../../components/ImageMessage/ImageMessage';
import DocumentMessage from '../../components/DocumentMessage/DocumentMessage';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';

import axios from 'axios';
import 'react-native-get-random-values';
//utility function for showing appropriate times
import { calculateTimeDifference } from '../../utils/timeDifference';
import moment from 'moment';
import Color from '../../../assets/colors/Color';
import NormalMessage from '../../components/NormalMessage/NormalMessage';
import ChatBottomBar from './Components/ChatBottomBar/ChatBottomBar';
import OrderMessage from './Components/OrderMessage/OrderMessage';

import { useStateContext } from '../../contexts/ContextProvider.js';
import CampaignChatHeader from './Components/ChatScreenHeader/CampaignChatHeader';
import NotificationType from './Components/typeNotification/NotificationType';
import { axiosInstance } from '../../../axiosInstance';
import Members from '../DoDay/Members/Members';
import { SaveFormat, manipulateAsync } from 'expo-image-manipulator';
import VideoMessageCRM from '../../components/VideoMessage/VideoMessageCRM';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import CustomStatsBar from '../../components/CustomStatsBar';
const ChatPage = (props) => {
  const [isImage, setIsImage] = useState(false);
  const [showInput, setShowInput] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { group, setActiveCampaign, setGlobalSocket } = useStateContext();
  const {
    loading,
    setLoading,
    showSnackbar,
    setPrivilege,
    showmembers,
    setShowMembers,
    setImgloading,
    imgloading,
  } = useStateContext();
  const [chatMessages, setChatMessages] = useState(null);

  const [isLongPressed, setIsLongPressed] = useState(false);
  const [deleteId, setdeleteId] = useState('');
  const [messagesId, setmessagesId] = useState([]);

  const handlePressedCancel = () => {
    if (isLongPressed === true) {
      setIsLongPressed(false);
    }
  };

  const userState = useUserState();

  function hideMembers() {
    setShowMembers(false);
  }
  const closeModal = () => {
    setShowMembers(false);
  };

  const [socket, setSocket] = useState(null);

  const navigation = useNavigation();

  useEffect(() => {
    setPrivilege(userState.id, group.members);
    //fetching initial messages

    const fetchData = async () => {
      const { data } = await axiosInstance.get(
        `/groups/group-messages/${group._id}`,
      );
      setChatMessages(data.messages);
    };
    fetchData();
  }, []);
  const members = props?.route?.params?.group?.members.flatMap(
    (member) => member.member,
  );

  const memberToNotify = members?.filter((mem) => {
    return mem._id !== userState.id;
  });

  const handleTakePicture = async (image) => {
    let compressImage;
    let manipResult;

    manipResult = await manipulateAsync(image.uri, [], {
      compress: 0.8,
      format: SaveFormat.JPEG,
    });
    compressImage = await FileSystem.getInfoAsync(manipResult.uri);
    try {
      const formdata = new FormData();
      formdata.append('media', {
        name: `${userState.fullName}.jpg`,
        uri: compressImage.uri,
        type: 'image/jpg',
      });
      axios
        .post(`${BASE_URL}/groups/saveMedia`, formdata, {
          headers: {
            'Content-Type': 'multipart/form-data',
            Accept: 'application/json',
          },
        })
        .then((res) => {
          socket.emit('send_message', {
            from: userState.id,
            group: props.route.params.group._id,
            type: 'image',
            content: res.data.path,
          });
        })
        .catch((e) => {});
    } catch (e) {}
  };
  const [recording, setRecording] = useState(false);

  const [animation, setAnimation] = useState(new Animated.Value(0));
  const [doc, setdoc] = useState(null);

  const supportedImageFormats = ['image/jpeg', 'image/png', 'image/jpg'];
  const pick = async () => {
    setImgloading(true);
    let result = await DocumentPicker.getDocumentAsync({
      quality: 0.5,
      allowsMultipleSelection: false,
    });

    if (result?.canceled === false) {
      let compressImage;
      let manipResult;
      if (supportedImageFormats.includes(result?.assets[0].mimeType)) {
        manipResult = await manipulateAsync(result?.assets[0].uri, [], {
          compress: 0.8,
          format: SaveFormat.JPEG,
        });
        compressImage = await FileSystem.getInfoAsync(manipResult.uri);
        handleSendImageMessage(compressImage.uri);
        setImgloading(false);
      } else if (result?.assets[0].mimeType === 'video/mp4') {
        handleSenVideoMessage(result?.assets[0]);
        setImgloading(false);
      } else {
        setdoc();
        handleSendDocumentMessage({
          type: result?.assets[0].mimeType,
          uri: result?.assets[0].uri,
          size: result?.assets[0].size,
          name: result?.assets[0].name,
        });
        setImgloading(false);
      }
    } else if (result.type === 'cancel') {
      setImgloading(false);
    } else {
    }
  };

  const pickDoc = async () => {
    setImgloading(true);
    let result = await DocumentPicker.getDocumentAsync({
      quality: 0.5,
      allowsMultipleSelection: false,
    });

    if (result?.canceled === false) {
      let compressImage;
      let manipResult;
      if (supportedImageFormats.includes(result?.assets[0].mimeType)) {
        manipResult = await manipulateAsync(result?.assets[0].uri, [], {
          compress: 0.8,
          format: SaveFormat.JPEG,
        });
        compressImage = await FileSystem.getInfoAsync(manipResult.uri);
        handleSendImageMessage(compressImage.uri);
        setImgloading(false);
      } else if (result?.assets[0].mimeType === 'video/mp4') {
        handleSenVideoMessage(result?.assets[0]);
        setImgloading(false);
      } else {
        setdoc();
        handleSendDocumentMessage({
          type: result?.assets[0].mimeType,
          uri: result?.assets[0].uri,
          size: result?.assets[0].size,
          name: result?.assets[0].name,
        });
        setImgloading(false);
      }
    } else if (result.type === 'cancel') {
      setImgloading(false);
    }
  };

  const handleSenVideoMessage = async (videoprop) => {
    setImgloading(true);

    try {
      const formdata = new FormData();
      formdata.append('media', {
        name: videoprop.name,
        uri: videoprop.uri,
        type: videoprop.mimeType,
      });

      axios
        .post(`${BASE_URL}/chat/saveMedia`, formdata, {
          headers: {
            'Content-Type': 'multipart/form-data',
            Accept: 'application/json',
          },
        })
        .then((res) => {
          socket.emit('send_message', {
            from: userState.id,
            group: props.route.params.group._id,
            type: 'video',
            content: res.data.path,
          });
          setImgloading(false);
          if (props?.route?.params?.group.type === 'individual') {
            handleLocalNotification(
              props?.route?.params?.group?.members[1]?.member.expoPushToken,
            );
            // console.log(props?.route?.params?.group);
          } else {
            handleGroupNotification(props?.route?.params?.group?.title);
          }
        })
        .catch((e) => {
          setImgloading(false);
        });
    } catch (e) {
      setImgloading(false);
    }
  };
  const boxInterpolation = animation.interpolate({
    inputRange: [0, 1],
    outputRange: ['rgb(224,0,99)', 'rgb(100,0,0)'],
  });

  const handleSendDocumentMessage = async (docprops) => {
    try {
      const formdata = new FormData();
      formdata.append('media', {
        name: docprops.name,
        uri: docprops.uri,
        type: docprops.type,
      });
      axios
        .post(`${BASE_URL}/groups/saveMedia`, formdata, {
          headers: {
            'Content-Type': 'multipart/form-data',
            Accept: 'application/json',
          },
        })
        .then((res) => {
          socket.emit('send_message', {
            from: userState.id,
            type: 'document',
            group: props.route.params.group._id,
            content: {
              path: res.data.path,
              name: docprops.name,
              size: docprops.size,
            },
          });
          if (props?.route?.params?.group.type === 'individual') {
            handleLocalNotification(
              props?.route?.params?.group?.members[1]?.member.expoPushToken,
            );
            // console.log(props?.route?.params?.group);
          } else {
            handleGroupNotification(props?.route?.params?.group?.title);
          }
        })
        .catch((e) => {});
    } catch (e) {}
  };
  const [voice, setvoice] = useState();
  const handleSendAudioMessage = (uri) => {
    try {
      const formdata = new FormData();
      formdata.append('media', {
        name: `${userState.phoneNumber}.m4a`,
        uri: uri,
        type: 'audio/mpeg',
      });
      axios
        .post(`${BASE_URL}/groups/saveMedia`, formdata, {
          headers: {
            'Content-Type': 'multipart/form-data',
            Accept: 'application/json',
          },
        })
        .then((res) => {
          socket.emit('send_message', {
            from: userState.id,
            group: props.route.params.group._id,
            type: 'audio',
            content: res.data.path,
          });

          if (props?.route?.params?.group.type === 'individual') {
            handleLocalNotification(
              props?.route?.params?.group?.members[1]?.member.expoPushToken,
            );
            // console.log(props?.route?.params?.group);
          } else {
            handleGroupNotification(props?.route?.params?.group?.title);
          }
        })
        .catch((e) => {});
    } catch (e) {}
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
        Audio.RecordingOptionsPresets.HIGH_QUALITY,
      ).catch((err) => console.log(err));
      setvoice(recording);
    } catch (err) {
      console.error('Failed to start recording', err);
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
      handleSendAudioMessage(uri);
    } catch (err) {}
  }

  const handleSendImageMessage = async (imageprop) => {
    setImgloading(true);

    try {
      const formdata = new FormData();
      formdata.append('media', {
        name: `${userState.fullName}.jpg`,
        uri: imageprop,
        type: 'image/jpg',
      });
      axios
        .post(`${BASE_URL}/groups/saveMedia`, formdata, {
          headers: {
            'Content-Type': 'multipart/form-data',
            Accept: 'application/json',
          },
        })
        .then((res) => {
          socket.emit('send_message', {
            from: userState.id,
            group: props.route.params.group._id,
            type: 'image',
            content: res.data.path,
          });
          setImgloading(false);
          if (props?.route?.params?.group.type === 'individual') {
            handleLocalNotification(
              props?.route?.params?.group?.members[1]?.member.expoPushToken,
            );
          } else {
            handleGroupNotification(props?.route?.params?.group?.title);
          }
        })
        .catch((e) => {
          setImgloading(false);
        });
    } catch (e) {
      setImgloading(false);
    }
  };

  const sendtext = (text) => {
    setLoading(true);
    Keyboard.dismiss();
    socket.emit('send_message', {
      from: userState.id,
      group: props.route.params.group._id,
      type: 'text',
      content: text,
    });

    if (props?.route?.params?.group.type === 'individual') {
      handleLocalNotification(
        props?.route?.params?.group?.members[1]?.member.expoPushToken,
      );
      // console.log(props?.route?.params?.group);
    } else {
      handleGroupNotification(props?.route?.params?.group?.title);
    }

    setLoading(false);
  };

  const sendNotificationMessage = (content) => {
    socket.emit('send_message', {
      from: userState.id,
      group: props.route.params.group._id,
      type: 'notification',
      content,
    });
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axiosInstance.get(
          `/campaigns/get-by-query?group=${group._id}`,
        );
        if (data.success) {
          setActiveCampaign(data?.campaign);
        }
      } catch (error) {}
    };
    fetchData();
  }, []);
  useEffect(() => {
    let newSocket = io(BASE_URL, { auth: { token: userState.token } });
    newSocket.on('connect', () => {
      newSocket.emit('join', { id: props.route.params.group._id });
    });
    newSocket.on('receive_message', (data) => {
      setChatMessages((prev) => [
        {
          content: data.content,
          type: data.type,
          date: data.date,
          from: data.from,
          _id: data._id,
        },
        ...prev,
      ]);
    });

    newSocket.on('update_message', (data) => {
      let tempMessages = chatMessages;
      tempMessages = tempMessages.map((m) => {
        if (m.id === data.MessageID) {
          return { ...m, status: 'ACCEPTED' };
        } else {
          return m;
        }
      });

      setChatMessages([
        ...(tempMessages &&
          tempMessages.sort((a, b) => (a.date < b.date ? 1 : -1))),
      ]);
    });
    newSocket.on('Delete_message', (data, message) => {
      setChatMessages(message.sort((a, b) => (a.date < b.date ? 1 : -1)));
    });

    //this is for the do-day portal screen
    newSocket.on('receive_points', (data) => {
      if (data.error) {
        showSnackbar(data.message);
        return;
      }

      setActiveCampaign(data.campaign);
    });

    setSocket(newSocket);
    setGlobalSocket(newSocket);

    return () => {
      newSocket.disconnect();
      setGlobalSocket(null);
    };
  }, []);

  const handleCamera = () => {
    navigation.navigate('Camera', {
      handleTakePicture: handleTakePicture,
    });
  };
  const updateMessage = (item) => {
    socket.emit('update_Message', {
      id: props.route.params.group._id,
      MessageID: item.id,
      user: userState._id,
    });
  };

  // Function to update the showInput state
  const handleShowInput = (value) => {
    setShowInput(value);
  };

  const handleLocalNotification = async (token) => {
    try {
      const config = {
        headers: {
          'auth-token': userState.token,
        },
      };
      const notification = await axios.post(
        `${BASE_URL}/chat/notifychat`,
        {
          fullName: userState.fullName,
          expoPushtoken: token,
        },
        config,
      );
    } catch (error) {
      console.log('error in local notofications', error);
    }
  };

  const handleGroupNotification = async (title) => {
    try {
      const config = {
        headers: {
          'auth-token': userState.token,
        },
      };
      const notification = await axios.post(
        `${BASE_URL}/groups/notifyGroup`,
        {
          user: memberToNotify,
          senderName: userState.fullName,
          groupTitle: title,
        },
        config,
      );
    } catch (error) {}
  };

  const handleDelete = (id, from) => {
    if (userState?.id === from?._id) {
      setdeleteId(id);
      setIsLongPressed(true);
    }
  };
  const handleDeleteMessage = async () => {
    setmessagesId((messagesId) => [...messagesId, deleteId]);

    try {
      socket.emit('Delete_message', {
        groupId: props.route.params.group._id,
        id: deleteId,
      });

      setIsLongPressed(false);
    } catch (error) {}
  };

  return (
    <SafeAreaProvider style={styles.container}>
      <CustomStatsBar backgroundColor={Color.Blue} />

      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <>
          {!isLongPressed && group?.type === 'campaign' ? (
            <CampaignChatHeader
              sendNotificationMessage={sendNotificationMessage}
              socket={socket}
              handleShowInput={handleShowInput}
            />
          ) : (
            <>
              {!isLongPressed ? (
                <ChatScreenHeader handleShowInput={handleShowInput} />
              ) : null}
            </>
          )}

          {isLongPressed && (
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                height: '7.4%',
                width: '100%',
                backgroundColor: Color.Blue,
                paddingHorizontal: 15,
              }}
            >
              <Pressable
                onPress={handlePressedCancel}
                style={{ alignSelf: 'center' }}
              >
                <Entypo
                  name="cross"
                  color={Color.White}
                  size={25}
                  style={{ marginTop: 0, paddingRight: '55%' }}
                />
              </Pressable>
              <Pressable
                android_ripple={{ color: Color.LightGrey, borderless: true }}
                style={{ alignSelf: 'center' }}
                onPress={handleDeleteMessage}
              >
                <MaterialCommunityIcons
                  name="delete"
                  color={Color.White}
                  size={25}
                  style={{ marginTop: 0 }}
                />
              </Pressable>
            </View>
          )}

          {showInput ? (
            <View
              style={{
                backgroundColor: Color.White,

                width: '100%',
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

          <ImageBackground
            source={require('../../../assets/chat-bg-light-blue.png')}
            resizeMode="cover"
            style={styles.container}
          >
            {showmembers && group?.type === 'campaign' && (
              <Members onCancel={hideMembers} closeModal={closeModal} />
            )}

            <View style={styles.container}>
              <FlatList
                style={{
                  marginHorizontal: 10,
                }}
                inverted
                showsVerticalScrollIndicator={false}
                keyExtractor={(item) => item._id}
                extraData={chatMessages}
                data={
                  searchQuery === ''
                    ? chatMessages
                    : chatMessages.filter((message, index) => {
                        if (typeof message.content === 'string') {
                          if (message.content.match(searchQuery)) {
                            return message;
                          }
                        } else return null;
                      })
                }
                renderItem={({ item, index }) => {
                  const timePassed = calculateTimeDifference(item.date);

                  return (
                    <View>
                      <View>
                        {item.time < '24h ago' ? (
                          <View
                            style={{
                              alignSelf: 'center',
                              backgroundColor: 'white',
                              borderRadius: 8,
                              height: 30,
                              width: 80,
                              marginTop: 10,
                              marginBottom: 10,
                              justifyContent: 'center',
                              alignItems: 'center',
                              elevation: 1,
                            }}
                          >
                            <Text
                              style={{
                                fontFamily: 'Roboto',
                                color: Color.Grey,
                                fontSize: 12,
                              }}
                            >
                              Today
                            </Text>
                          </View>
                        ) : null}
                      </View>
                      <View>
                        {item.type === 'text' ? (
                          <NormalMessage
                            groupTitle={props.route?.params?.group?.title}
                            longPress={handleDelete}
                            image={''}
                            socket={socket}
                            onPress={() =>
                              props.navigation.navigate('ViewImage', {
                                url: `${BASE_URL}/messageMedia/${item.content}`,
                                message: item.content,
                              })
                            }
                            item={item}
                          />
                        ) : null}

                        {item.type === 'notification' ? (
                          <NotificationType data={item.content} />
                        ) : null}
                        {item.type === 'order' ? (
                          <View style={isImage ? null : { marginBottom: 5 }}>
                            <OrderMessage
                              username={item.from.fullName}
                              time={timePassed ? timePassed : '1h'}
                              image={`${BASE_URL}/images/${item.content.image}`}
                              onPress={() => {
                                updateMessage(item);
                              }}
                              status={
                                item.status === 'pending'
                                  ? 'ACCEPT'
                                  : 'ACCEPTED'
                              }
                            />
                          </View>
                        ) : null}
                        {item.type === 'image' ? (
                          <View style={isImage ? null : { marginBottom: 5 }}>
                            <ImageMessage
                              groupTitle={props.route?.params?.group?.title}
                              image={`${BASE_URL}/messageMedia/${item.content}`}
                              phoneNumber={item.from}
                              longPress={handleDelete}
                              socket={socket}
                              item={item}
                              onPress={() =>
                                props.navigation.navigate('ViewImage', {
                                  url: `${BASE_URL}/messageMedia/${item.content}`,
                                  message: item.content,
                                })
                              }
                            />
                          </View>
                        ) : null}
                        {item?.type === 'video' ? (
                          <View style={isImage ? null : { marginBottom: 5 }}>
                            <VideoMessageCRM
                              groupTitle={props.route?.params?.group?.title}
                              image={`${BASE_URL}/messageMedia/${item.content}`}
                              phoneNumber={item.from}
                              longPress={handleDelete}
                              socket={socket}
                              item={item}
                              onPress={() =>
                                props.navigation.navigate('ViewImage', {
                                  url: `${BASE_URL}/messageMedia/${item.content}`,
                                  message: item.content,
                                })
                              }
                            />
                          </View>
                        ) : null}
                        {item?.type === 'document' ? (
                          <DocumentMessage
                            groupTitle={props.route?.params?.group?.title}
                            time={timePassed ? timePassed : '1h'}
                            title="Select"
                            phoneNumber={item?.from}
                            longPress={handleDelete}
                            socket={socket}
                            item={item}
                            sender={item.from._id}
                          />
                        ) : null}

                        {item.type === 'audio' ? (
                          <RecordingVoiceMessage
                            time={timePassed ? timePassed : '1h'}
                            groupTitle={props.route?.params?.group?.title}
                            socket={socket}
                            phoneNumber={item?.from}
                            item={item}
                            sender={item.from._id}
                            longPress={handleDelete}
                          />
                        ) : null}
                      </View>
                    </View>
                  );
                }}
              />

              <View style={{ marginLeft: '40%' }}>
                {imgloading && (
                  <ActivityIndicator size="large" color={Color.Blue} />
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
          </ImageBackground>
        </>
      </TouchableWithoutFeedback>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  image: {
    flex: 1,
    justifyContent: 'center',
  },
  messageInputView: {
    flexDirection: 'row',
    marginHorizontal: Dimensions.get('screen').height * 0.01,
    backgroundColor: Color.White,
    elevation: 6,
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
    borderRadius: Dimensions.get('screen').height * 0.1,
    width: '80%',
    alignItems: 'center',
    alignSelf: 'center',
  },
  messageInput: {
    height: Dimensions.get('screen').height * 0.06,
    flex: 1,
    paddingRight: 10,
    paddingLeft: 20,
    paddingVertical: 3,
    fontFamily: 'Roboto',
  },
  messageSendView: {
    // padding: 8,
    justifyContent: 'center',
    backgroundColor: Color.Blue,
    height: Dimensions.get('screen').height * 0.06,
    width: Dimensions.get('screen').height * 0.06,
    borderRadius: Dimensions.get('screen').height * 0.1,
  },
  cameraIcon: {
    paddingHorizontal: 6,
    marginRight: 12,
  },
  textMessageMainContainer: {
    flex: 1,
    flexDirection: 'row',
    alignContent: 'center',
    alignItems: 'center',
  },
  textMessageContainer: {
    alignItems: 'baseline',
    backgroundColor: 'white',
    maxWidth: '80%',
    borderLeftWidth: 4,
    borderColor: '#4582C3',
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
    marginVertical: 9,
    paddingHorizontal: 5,
  },
  username: {
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 5,
    fontFamily: 'Roboto',
    paddingVertical: 3,
    color: '#4582C3',
  },
  message: {
    fontSize: 14,
    marginLeft: 5,
    lineHeight: 18,
    fontFamily: 'Roboto',
    paddingVertical: 3,
  },
  timeContainer: {
    flexDirection: 'row',
    alignSelf: 'flex-end',
    paddingVertical: 3,
  },
  time: {
    fontSize: 11,
    color: 'grey',
    fontFamily: 'Roboto',
    marginTop: -5,
    alignSelf: 'flex-end',
    // padding: 5,
  },
  shareMessage: {
    backgroundColor: '#CFCFCF',
    marginLeft: 9,
    borderRadius: 50,
    padding: 3,
    // flex: 2,
  },
  imageMessage: {
    maxWidth: '100%',
    marginVertical: 0,
    // alignSelf: "flex-start",
  },
  chatSearchContainer: {
    flexDirection: 'row',
    alignContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    marginHorizontal: 10,
  },
  searchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 4,
    marginLeft: 10,
    borderRadius: Dimensions.get('screen').height * 0.1,
    backgroundColor: '#F1F1F1',
  },
  textBox: {
    fontSize: 14,
    marginTop: 3,
    fontFamily: 'Roboto_400Regular',
    width: '82%',
  },
});

export default ChatPage;
