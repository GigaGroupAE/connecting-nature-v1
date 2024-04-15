import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  Dimensions,
  Pressable,
  StatusBar,
} from 'react-native';

import Upcomingcall from '../../../assets/UpcomingCall.png';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import Color from '../../../assets/colors/Color';
import { BASE_URL } from '../../../CONSTANTS';
import { AntDesign, Entypo } from 'react-native-vector-icons';
import { useUserState } from './../../slices/userSlice';
import NewChatButton from '../../components/NewChatButton';
import { theme } from '../../../theme';
import { useStateContext } from '../../contexts/ContextProvider';
import { calculateTimeDifference } from '../../utils/timeDifference';
import NoMessage from '../ChatListCN/NoMessage';
import { axiosInstance } from '../../../axiosInstance';
import { useQuery } from 'react-query';
import MessagePreview from '../../components/MessagePreview';
import NotificationsSkeleton from '../../components/NotificationsSkeleton';
const HEIGHT = Dimensions.get('screen').height - StatusBar.currentHeight;
const WIDTH = Dimensions.get('screen').width;

const fetchMessages = async () => {
  try {
    const { data } = await axiosInstance.get('/groups/getcrmmessages');
    return data;
  } catch (error) {}
};

export default function DirectChat(props, { route }) {
  const { setgroup } = useStateContext();

  const [isSearch, setIsSearch] = useState(false);

  const navigation = useNavigation();
  const userState = useUserState();

  const {
    data: Messages = [],
    isLoading: loading,
    refetch,
  } = useQuery('crmmessages', fetchMessages);

  useFocusEffect(
    React.useCallback(() => {
      refetch();
    }, []),
  );

  // const navigate = useNavigation();
  const setPhotoForDirectChat = (props) => {
    if (props.members[0].member.phoneNumber === userState.phoneNumber) {
      const profile = props.members[1].member.profile;
      return `${BASE_URL}/images/${profile}`;
    } else {
      const profile = props.members[0].member.profile;
      return `${BASE_URL}/images/${profile}`;
    }
  };
  // const selectcontact = (props) => {
  //   let first = false;
  //   let second = false;
  //   let foundGroup = {};
  //   const individualGroups = Messages;
  //   individualGroups.map((group) => {
  //     if (
  //       group.members[0].phoneNumber === userState.phoneNumber ||
  //       group.members[0].phoneNumber === props.phoneNumber
  //     ) {
  //       first = true;
  //       if (
  //         group.members[1].phoneNumber === userState.phoneNumber ||
  //         group.members[1].phoneNumber === props.phoneNumber
  //       ) {
  //         second = true;
  //         foundGroup = group;
  //       }
  //     }
  //   });
  //   if (first === true && second === true) {
  //     setgroup(foundGroup);
  //     navigation.navigate('ChatCRM', { group: foundGroup });
  //   } else {
  //     let members = [];

  //     members = [
  //       {
  //         member: userState.id,
  //       },
  //       {
  //         member: props._id,
  //       },
  //     ];
  //     const formData = new FormData();
  //     formData.append('name', userState.fullName);
  //     formData.append('type', 'individual');
  //     formData.append('title', 'test');
  //     formData.append('members', JSON.stringify(members));
  //     axios
  //       .post(`${BASE_URL}/groups/creategroup`, formData, {
  //         headers: {
  //           'Content-Type': 'multipart/form-data',
  //           Accept: 'application/json',
  //           'auth-token': userState.token,
  //         },
  //       })
  //       .then((response) => {
  //         axios
  //           .get(`${BASE_URL}/groups/getgroups`, {
  //             headers: {
  //               'auth-token': userState.token,
  //             },
  //           })
  //           .then((res) => {
  //             const newgroup = res.data.filter((singlegroup) => {
  //               return singlegroup._id === response.data._id;
  //             });
  //             setgroup(newgroup[0]);
  //             navigation.navigate('ChatCRM', { group: newgroup[0] });
  //           })
  //           .catch((e) => console.log(e));
  //       })
  //       .catch((e) => console.log(e));
  //   }
  // };

  const selectcontact = async (props) => {
    try {
      const { data } = await axiosInstance.post(
        `/groups/get-orCreateGroup/${props?._id}`,
      );
      setgroup(data?.group);
      navigation.navigate('ChatCRM', { group: data?.group });
    } catch (error) {
      console.log(error);
    }
  };

  const onChangeSearch = (query) => setSearchQuery(query);
  const [searchQuery, setSearchQuery] = useState('');

  const [activeTeam, setActiveTeam] = useState('Chat');
  const handleNewChat = () => {
    navigation.navigate('SelectContact', {
      selectedContact: selectcontact,
      IntranetChat: 'IntranetChat',
    });
  };

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

  return (
    <View
      style={{
        height: '100%',
      }}
    >
      <View style={isSearch ? styles.searchHeader : styles.header}>
        <View style={styles.mainHeader}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <AntDesign
              name="arrowleft"
              size={28}
              color={Color.White}
              style={{ alignSelf: 'center', alignItems: 'center' }}
            />
          </TouchableOpacity>
          {!isSearch && <Text style={styles.title}>Intranet Chat</Text>}
          {isSearch && (
            <TextInput
              style={styles.input}
              placeholder="Search"
              onChangeText={onChangeSearch}
              value={searchQuery}
              autoFocus
            />
          )}
          {!isSearch && (
            <TouchableOpacity style={styles.threeDots} onPress={() => {}}>
              <Entypo
                name="dots-three-vertical"
                size={20}
                color={Color.White}
              />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <View style={styles.teamsHeader}>
        <Pressable
          style={[styles.btn, activeTeam === 'Chat' ? styles.activeBtn : {}]}
          onPress={() => {
            setActiveTeam('Chat');
          }}
        >
          <Text
            style={[
              styles.btnText,
              activeTeam === 'Chat' ? { color: Color.White } : {},
            ]}
          >
            Chat
          </Text>
        </Pressable>
        <Pressable
          style={[styles.btn, activeTeam === 'Calls' ? styles.activeBtn : {}]}
          onPress={() => {
            setActiveTeam('Calls');
          }}
        >
          <Text
            style={[
              styles.btnText,
              activeTeam === 'Calls' ? { color: Color.White } : {},
            ]}
          >
            Calls
          </Text>
        </Pressable>
      </View>

      <View style={styles.container}>
        {activeTeam === 'Chat' ? (
          <View>
            {loading ? (
              <NotificationsSkeleton />
            ) : (
              <View>
                {Messages?.length === 0 ? (
                  <View style={{ height: '100%' }}>
                    <NoMessage onpress={handleNewChat} />
                  </View>
                ) : (
                  <FlatList
                    data={sortedMessages}
                    keyExtractor={(item) => item._id}
                    renderItem={({ item }) => {
                      const { messages } = item;
                      const latestMessage =
                        messages?.length > 0
                          ? messages[messages.length - 1]
                          : null;
                      const timePassed = calculateTimeDifference(
                        latestMessage?.createdAt,
                      );
                      return (
                        <View>
                          <Pressable
                            android_ripple={{ color: Color.LightGrey }}
                            style={styles.mainBody}
                            onPress={() => {
                              setgroup(item);
                              navigation.navigate('ChatCRM', {
                                group: item,
                              });
                            }}
                          >
                            <View style={styles.singleNotification}>
                              <Image
                                style={styles.userAvatar}
                                source={{ uri: setPhotoForDirectChat(item) }}
                              />
                              <View style={styles.mainContent}>
                                <View style={styles.listHead}>
                                  <Text style={styles.userName}>
                                    {item.members[0].member.phoneNumber ===
                                    userState.phoneNumber
                                      ? item.members[1].member.fullName
                                      : item.members[0].member.fullName}
                                  </Text>
                                  <Text style={styles.timeText}>
                                    {timePassed}
                                  </Text>
                                </View>
                                <MessagePreview item={item} />
                              </View>
                            </View>
                          </Pressable>
                        </View>
                      );
                    }}
                  />
                )}
              </View>
            )}
          </View>
        ) : (
          <View
            style={{
              flex: 1,
              alignItems: 'center',
              width: '100%',
            }}
          >
            <Image
              source={Upcomingcall}
              style={{
                width: WIDTH * 0.5,
                height: '30%',
              }}
            />
            <View style={{ position: 'absolute', top: '25%' }}>
              <Text style={styles.nochatText}>
                Stay tuned for the upcoming Calls feature! You'll be able to
              </Text>
              <Text style={styles.nochatText}>
                make voice and video calls with your contacts
              </Text>
            </View>
          </View>
        )}
      </View>

      {activeTeam === 'Chat' ? (
        <NewChatButton
          onPress={() =>
            navigation.navigate('SelectContact', {
              selectedContact: selectcontact,
              IntranetChat: 'IntranetChat',
            })
          }
        />
      ) : null}
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    backgroundColor: Color.White,
    width: '100%',
    height: '100%',
    flex: 1,
  },
  mainHeader: {
    backgroundColor: Color.Blue,
    alignContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: 10,
    paddingVertical: 14,
    borderBottomWidth: 0.5,
    borderColor: Color.DarkBlue,
    justifyContent: 'space-between',
  },
  input: {
    width: '80%',
    backgroundColor: Color.LightBlue,
    paddingVertical: 2,
    paddingHorizontal: 20,
    borderRadius: Dimensions.get('screen').height * 0.1,
  },
  mainBody: {
    marginTop: 5,
    borderColor: Color.VeryLightGrey,
  },
  singleNotification: {
    paddingHorizontal: 13,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 13,
    width: '100%',
  },
  userAvatar: {
    width: Dimensions.get('screen').height * 0.06,
    height: Dimensions.get('screen').height * 0.06,
    borderRadius: Dimensions.get('screen').height * 0.1,
    backgroundColor: Color.VeryLightGrey,
  },

  listHead: {
    flexDirection: 'row',
    width: '100%',
    alignContent: 'center',
    alignItems: 'center',
  },
  userName: {
    fontFamily: 'Roboto_600SemiBold',
    fontSize: 14,
    color: Color.Black,
    marginLeft: 11,
    width: '80%',
    lineHeight: 30,
  },
  categoryText: {
    fontFamily: 'Roboto_400Regular',
    fontSize: 12,
    color: Color.Blue,
    marginLeft: 9,
  },
  timeText: {
    position: 'absolute',
    right: 0,
    fontFamily: 'Roboto_400Regular',
    fontSize: 11,
    color: Color.Grey,
    opacity: 0.7,
  },
  messageContainer: {
    width: '90%',
  },
  messageText: {
    fontFamily: 'Roboto_400Regular',
    fontSize: 12,
    lineHeight: 22,
    color: Color.Grey,
    marginLeft: 11,
  },
  bodyHeadContainer: {
    paddingHorizontal: 19,
    // marginLeft: 10,
    paddingVertical: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderColor: Color.VeryLightGrey,
    borderWidth: 1,
  },

  bodyHeadText: {
    fontFamily: 'Roboto',
    fontSize: 16,
    fontWeight: '600',
    color: '#4582C3',
  },
  title: {
    color: Color.White,
    fontSize: 20,
    fontFamily: 'Roboto_600SemiBold',
    marginLeft: 10,
    marginTop: 2,
    lineHeight: 30,
    textAlignVertical: 'center',
    width: '70%',
  },
  //* Teams Screen CSS
  teamsHeader: {
    height: HEIGHT * 0.055,
    // borderBottomWidth: StyleSheet.hairlineWidth,
    // borderColor: "rgba(154, 154, 154, 0.5)",
    flexDirection: 'row',
    backgroundColor: Color.Blue,
    //alignItems: "center",
    justifyContent: 'space-around',
  },
  btn: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnText: {
    fontFamily: 'Roboto_600SemiBold',
    color: '#D9D9D9',
    fontSize: 16,
  },
  activeBtn: {
    borderBottomWidth: 2,
    borderColor: Color.White,
    // backgroundColor: Color.DarkBlue,
  },
  list: {
    height: HEIGHT * 0.86,
    backgroundColor: '#fff',
  },
  card: {
    height: HEIGHT * 0.12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(154, 154, 154, 0.5)',
    flexDirection: 'row',
    //for vertically centre content
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  avatar: {
    height: 70,
    width: 70,
    borderRadius: 70 / 2,
    marginHorizontal: WIDTH * 0.02,
  },
  fullName: { fontFamily: theme.fonts.family.semiBold },
  invitationAccepted: {
    fontFamily: theme.fonts.family.regular,
    color: 'rgba(112, 112, 112, 0.7)',
  },
  influencer: {
    color: Color.Blue,
    fontFamily: theme.fonts.family.regular,
  },
  btnContainer: {
    marginRight: WIDTH * 0.02,
    flexDirection: 'row',
  },
  btnPressed: {
    opacity: 0.3,
  },
  action: {
    marginHorizontal: 10,
  },
  actionText: {
    fontFamily: theme.fonts.family.regular,
    textDecorationLine: 'underline',
    color: Color.Blue,
  },
  threeDots: {
    // paddingHorizontal: 5,
    marginLeft: 15,
  },
  nochatText: {
    fontFamily: 'Roboto_400Regular',
    fontSize: 12,
    color: Color.LightGrey,
    opacity: 0.9,
    alignSelf: 'center',
  },
  btn: {
    paddingVertical: HEIGHT * 0.012,
    backgroundColor: Color.Blue,
    paddingHorizontal: WIDTH * 0.07,
    color: Color.White,
    fontFamily: 'Roboto_500Medium',
    fontWeight: '600',
    borderRadius: HEIGHT * 0.01,
  },
  messageType: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 11,
  },
});
