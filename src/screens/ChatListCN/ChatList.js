import React, { useState, useCallback, useMemo } from 'react';
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
} from 'react-native';
import HeaderNormal from '../../components/HeaderNormal';
import BottomTab from '../../components/BottomTab';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import Color from '../../../assets/colors/Color';
import { BASE_URL } from '../../../CONSTANTS';
import { useUserState } from '../../slices/userSlice';
import { useStateContext } from '../../contexts/ContextProvider';
import { calculateTimeDifference } from '../../utils/timeDifference';
import NoMessage from './NoMessage';
import MessagePreview from '../../components/MessagePreview';
import { axiosInstance } from '../../../axiosInstance';
import { useQuery } from 'react-query';
import NotificationsSkeleton from '../../components/NotificationsSkeleton';
import { Entypo } from 'react-native-vector-icons';

const Height = Dimensions.get('screen').height;
const Width = Dimensions.get('screen').width;

const fetchMessages = async () => {
  const response = await axiosInstance.get('/chat/get-my-chats');
  return response.data.myChats;
};

export default function ChatList() {
  // const [Messages, setMessages] = useState([])
  const [modalVisible, setmodalVisible] = useState(false);
  const [IsshowInput, setIsShowInput] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const {
    data: Messages,
    isLoading: loading,
    refetch,
  } = useQuery('cnmessages', fetchMessages);

  const navigation = useNavigation();
  const userState = useUserState();
  const { setgroup } = useStateContext();
  const handleonbackpress = () => {
    navigation.goBack();
  };
  useFocusEffect(
    React.useCallback(() => {
      refetch();
    }, []),
  );

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
    setSearchQuery('');
  }, []);
  const sortedMessages = useMemo(() => {
    return Messages?.slice().sort((a, b) => {
      const dateA =
        a?.messages?.length > 0
          ? a.messages[a.messages.length - 1].createdAt
          : null;
      const dateB =
        b?.messages?.length > 0
          ? b.messages[b.messages.length - 1].createdAt
          : null;

      if (!dateA || !dateB) {
        return 0;
      }

      const timeDifferenceA = Math.abs(new Date() - new Date(dateA));
      const timeDifferenceB = Math.abs(new Date() - new Date(dateB));

      return timeDifferenceA - timeDifferenceB;
    });
  }, [Messages]);

  const handleDelete = () => {};

  const handleNavigation = async (item) => {
    const { messages } = item;

    const latestMessage =
      messages?.length > 0 ? messages[messages.length - 1] : null;

    const isMessageRead =
      latestMessage?.status === 'unchecked' &&
      userState?.id !== latestMessage?.from;
    if (isMessageRead) {
      try {
        const response = await axiosInstance.patch('/chat/updatachat', {
          messageId: latestMessage._id,
          newStatus: 'checked',
        });
      } catch (error) {}
    }
    setgroup(item);
    navigation.navigate('ChatCN', {
      group: item,
    });
  };

  return (
    <View style={{ backgroundColor: Color.White, height: '100%' }}>
      <HeaderNormal
        title="Chats"
        onback={handleonbackpress}
        handleShowInput={handleShowInput}
      />
      {IsshowInput ? (
        <View
          style={{
            backgroundColor: Color.White,
            width: '100%',
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
      {loading ? (
        <NotificationsSkeleton />
      ) : (
        <View>
          {!loading && Messages?.length == 0 ? (
            <NoMessage />
          ) : (
            <View style={styles.container}>
              <FlatList
                data={sortedMessages}
                keyExtractor={(item) => item._id}
                showsVerticalScrollIndicator={false}
                renderItem={({ item }) => {
                  const { messages } = item;
                  const latestMessage =
                    messages?.length > 0 ? messages[messages.length - 1] : null;
                  const timePassed = calculateTimeDifference(
                    latestMessage?.createdAt,
                  );
                  const isMessageRead =
                    latestMessage?.status === 'unchecked' &&
                    userState?.id !== latestMessage?.from;
                  return (
                    <Pressable
                      style={styles.mainBody}
                      onPress={() => handleNavigation(item)}
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
                          <View
                            style={{
                              flexDirection: 'row',
                              justifyContent: 'space-between',
                            }}
                          >
                            <MessagePreview item={item} />

                            {isMessageRead && !loading && (
                              <View
                                style={{
                                  backgroundColor: Color.Blue,
                                  width: 10,
                                  height: 10,
                                  borderRadius: 5,
                                  marginRight: '13%',
                                  marginTop: '2%',
                                }}
                              />
                            )}
                          </View>
                        </View>
                      </View>
                    </Pressable>
                  );
                }}
              />
              <Modal
                animationType="slide"
                transparent
                visible={modalVisible}
                onRequestClose={() => {
                  setmodalVisible(!modalVisible);
                }}
              >
                <View style={styles.ConfrmModel}>
                  <View>
                    <Text
                      style={{
                        fontFamily: 'Roboto_400Regular',
                        fontWeight: '400',
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
      )}

      <BottomTab activeMenu="Chat" scrollToTop={scrollToTop} />
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    display: 'flex',
    backgroundColor: Color.White,
    width: '100%',
    marginBottom: '28%',
    paddingBottom: 10,
    alignContent: 'flex-start',
    justifyContent: 'flex-start',
  },
  mainBody: {
    paddingHorizontal: 19,
    paddingVertical: 5,
    borderWidth: 0.5,
    borderColor: Color.VeryLightGrey,
  },
  mainBodyUnRead: {
    paddingHorizontal: 19,
    paddingVertical: 5,
    borderWidth: 0.5,

    borderColor: Color.VeryLightGrey,
    backgroundColor: Color.LightBlue,
  },
  singleNotification: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 5,
    width: '95%',
    // justifyContent: "center",
  },
  userAvatar: {
    width: Height * 0.07,
    height: Height * 0.07,
    borderRadius: Height * 0.1,
  },

  listHead: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  userName: {
    fontFamily: 'Roboto_500Medium',
    fontSize: 14,
    color: Color.Black,
    marginLeft: 11,
  },

  timeText: {
    position: 'absolute',
    fontFamily: 'Roboto_400Regular',
    fontSize: 12,
    color: Color.Black,
    right: '10%',
  },
  mainContent: {
    width: '100%',
    justifyContent: 'space-around',
    // alignItems: "center",
  },
  btn: {
    paddingVertical: Height * 0.012,
    backgroundColor: Color.Blue,
    paddingHorizontal: Width * 0.07,
    color: Color.White,
    fontFamily: 'Roboto_500Medium',
    fontWeight: '600',
    borderRadius: Height * 0.01,
  },
  ConfrmModel: {
    flex: 0.3,
    justifyContent: 'center',
    alignItems: 'center',
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
    alignSelf: 'center',
    paddingVertical: Height * 0.019,
    // marginTop: 10,
    borderRadius: 6,
  },
  model: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: Height * 0.03,
    width: Width * 0.9,
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
    borderRadius: Height * 0.1,
    backgroundColor: '#F1F1F1',
  },
  textBox: {
    fontSize: 14,
    marginTop: 3,
    fontFamily: 'Roboto_400Regular',
    width: '82%',
  },
});
