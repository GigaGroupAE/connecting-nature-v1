import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
  FlatList,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import HeaderNormal from '../../../../components/HeaderNormal';
import { BASE_URL } from '../../../../../CONSTANTS';
import { useUserState } from '../../../../slices/userSlice';
import { useStateContext } from '../../../../contexts/ContextProvider';
import axios from 'axios';
import Color from '../../../../../assets/colors/Color';
import { axiosInstance } from '../../../../../axiosInstance';
import { useQuery } from 'react-query';

const Height = Dimensions.get('screen').height;
const Width = Dimensions.get('screen').width;

const fetchMessages = async () => {
  try {
    const { data } = await axiosInstance.get('/groups/getcrmmessages');
    return data;
  } catch (error) {}
};

const MessageForwardCRM = (props) => {
  const route = useRoute();
  const { forwardFrom, forwardChat, forwardType, forwardContent, socket } =
    route.params;
  const { loading, setLoading } = useStateContext();
  const navigation = useNavigation();
  const userState = useUserState();
  const [user, setuser] = useState([]);
  // const [Messages, setMessages] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${BASE_URL}/user/new-chat-contacts`, {
          headers: {
            'auth-token': userState.token,
          },
        });

        let tempUsers = response.data.contacts.filter(
          (user) => user.phoneNumber !== userState.phoneNumber,
        );

        setuser([...tempUsers]);
        setLoading(false);
      } catch (error) {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const {
    data: Messages = [],

    refetch,
  } = useQuery('crmmessages', fetchMessages);

  // useEffect(() => {
  //   const fetchData = async () => {
  //     setLoading(true);
  //     try {
  //       const res = await axios.get(`${BASE_URL}/groups/getgroups`, {
  //         headers: {
  //           'auth-token': userState.token,
  //         },
  //       });

  //       let groups = res.data.filter((group) => {
  //         const currentuser = group.members.filter((m) => {
  //           return m.member?.phoneNumber === userState.phoneNumber;
  //         });
  //         return currentuser.length !== 0;
  //       });

  //       const individualGroups = groups.filter((group) => {
  //         return group.type === 'individual';
  //       });

  //       setMessages([...individualGroups]);
  //       setLoading(false);
  //     } catch (error) {
  //       setLoading(false);
  //     }
  //   };

  //   fetchData();
  // }, []);

  const handleForward = (item) => {
    socket.emit('send_message', {
      from: forwardFrom,
      group: item._id,
      type: forwardType,
      content: forwardContent,
    });
    navigation.navigate('ChatCRM', {
      group: item,
    });
  };

  const handleForwardContact = async (item) => {
    try {
      const members = [{ member: userState.id }, { member: item._id }];

      const formData = new FormData();
      formData.append('name', userState.fullName);
      formData.append('type', 'individual');
      formData.append('title', 'test');
      formData.append('members', JSON.stringify(members));

      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
          Accept: 'application/json',
          'auth-token': userState.token,
        },
      };

      const response = await axios.post(
        `${BASE_URL}/groups/creategroup`,
        formData,
        config,
      );

      const chatId = response.data._id;

      socket.emit('send_message', {
        from: forwardFrom,
        group: chatId,
        type: forwardType,
        content: forwardContent,
      });

      navigation.navigate('ChatCRM', { group: response.data });
    } catch (error) {}
  };

  const setPhotoForDirectChat = (props) => {
    if (props.members[0].member.phoneNumber === userState.phoneNumber) {
      const profile = props.members[1].member.profile;

      return `${BASE_URL}/images/${profile}`;
    } else {
      const profile = props.members[0].member.profile;
      return `${BASE_URL}/images/${profile}`;
    }
  };

  // Filter the users to check if thay also in messages
  const filteredUsersWithoutChat = user.filter((user) => {
    const hasMatchingMember = Messages.some((message) =>
      message.members.some(
        (member) => member.member.phoneNumber === user.phoneNumber,
      ),
    );
    return !hasMatchingMember;
  });

  const renderItem = ({ item }) => {
    return (
      <TouchableOpacity onPress={() => handleForwardContact(item)}>
        <View style={{ backgroundColor: Color.White }}>
          <View style={styles.contentContainer}>
            <Image
              source={{ uri: `${BASE_URL}/images/${item.profile}` }}
              style={styles.userImg}
            />
            <View
              style={{
                marginTop: Height * 0.008,
                flex: 0,
                alignSelf: 'center',
              }}
            >
              <Text style={styles.userName}>{item.fullName}</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <ScrollView>
      <HeaderNormal title="Forward to.." />

      <View>
        <View style={{ backgroundColor: Color.VeryLightGrey }}>
          <Text style={styles.contactTitle}>Recent chats</Text>
        </View>
        <FlatList
          data={Messages}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => {
            // console.log(item.messages[item.messages.length - 1]?.content);

            return (
              <TouchableOpacity onPress={() => handleForward(item)}>
                <View style={{ backgroundColor: Color.White }}>
                  <View style={styles.contentContainer}>
                    <Image
                      style={styles.userImg}
                      source={{ uri: setPhotoForDirectChat(item) }}
                    />
                    <View
                      style={{
                        marginTop: Height * 0.008,
                        flex: 0,
                        alignSelf: 'center',
                      }}
                    >
                      <Text style={styles.userName}>
                        {item.members[0].member.phoneNumber ===
                        userState.phoneNumber
                          ? item.members[1].member.fullName
                          : item.members[0].member.fullName}
                      </Text>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            );
          }}
        />
      </View>

      <View style={{}}>
        <View style={{ backgroundColor: Color.VeryLightGrey }}>
          <Text style={styles.contactTitle}>Other contacts</Text>
        </View>
        <FlatList
          data={filteredUsersWithoutChat}
          keyExtractor={(item) => item._id}
          renderItem={renderItem}
        />
      </View>
    </ScrollView>
  );
};

export default MessageForwardCRM;

const styles = StyleSheet.create({
  contentContainer: {
    flexDirection: 'row',
    paddingVertical: Height * 0.009,
    alignContent: 'center',

    paddingHorizontal: '3%',
    borderBottomColor: Color.LightGrey,
    borderBottomWidth: 0.7,
  },
  userImg: {
    borderRadius: Height * 0.1,
    resizeMode: 'contain',
    height: 50,
    width: 50,
  },
  userName: {
    fontFamily: 'Roboto_500Medium',
    marginLeft: Width * 0.02,
    fontSize: Height * 0.017,
  },
  userRole: {
    marginLeft: Width * 0.02,
    fontFamily: 'Roboto_500Medium',
    color: Color.Blue,
    marginTop: '-1.5%',
  },
  contactTitle: {
    paddingHorizontal: Width * 0.06,
    paddingVertical: Height * 0.01,
    fontSize: Height * 0.022,
    fontFamily: 'Roboto_500Medium',
  },
});
