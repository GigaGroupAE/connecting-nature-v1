import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import HeaderNormal from '../../components/HeaderNormal';
import Color from '../../../assets/colors/Color';
import axios from 'axios';
import { BASE_URL } from '../../../CONSTANTS';
import { useUserState } from '../../slices/userSlice';
import { useStateContext } from '../../contexts/ContextProvider';
import { useNavigation, useRoute } from '@react-navigation/native';

const Height = Dimensions.get('screen').height;
const Width = Dimensions.get('screen').width;

const ShareScreen = (props) => {
  const { setLoading } = useStateContext();

  const route = useRoute();
  const { forwardFrom, forwardType, forwardContent, socket } = route.params;

  const userState = useUserState();

  const navigation = useNavigation();

  const [user, setuser] = useState([]);
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${BASE_URL}/user/new-chat-contacts`, {
          headers: {
            'auth-token': userState.token,
          },
        });

        const tempUsers = response.data.contacts.filter(
          (user) => user.phoneNumber !== userState.phoneNumber,
        );

        let normalUser = [];

        if (userState.type === 'user') {
          normalUser = tempUsers.filter(
            (typeUser) => typeUser.type !== 'celebrity',
          );
        } else {
          normalUser = tempUsers;
        }

        setuser([...normalUser]);
      } catch (error) {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${BASE_URL}/chat/get-my-chats`, {
          headers: {
            'auth-token': userState.token,
          },
        });
        setMessages([...res.data.myChats]);
        setLoading(false);
      } catch (error) {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter the users to check if thay also in messages
  const Users = user.filter(
    (contactlist) =>
      !messages.some((chatuser) =>
        chatuser.members.some(
          (member) => member.phoneNumber === contactlist.phoneNumber,
        ),
      ),
  );

  const handleForward = (item) => {
    socket.emit('send_messageCN', {
      from: forwardFrom,
      chat: item._id,
      type: forwardType,
      content: forwardContent,
    });
    navigation.goBack();
  };

  const handleForwardContact = async (item) => {
    try {
      const members = [userState.id, item._id];
      const data = {
        members: members,
        messages: [],
      };

      const response = await axios.post(`${BASE_URL}/chat/createchat`, data, {
        headers: {
          'auth-token': userState.token,
        },
      });

      if (response.status === 200) {
        const chatId = response.data._id;

        socket.emit('send_messageCN', {
          from: forwardFrom,
          chat: chatId,
          type: forwardType,
          content: forwardContent,
        });

        navigation.goBack();
      }
    } catch (error) {}
  };

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

  const recentChats = ({ item }) => {
    const setPhotoForDirectChat = (props) => {
      if (props.members[0].phoneNumber === userState.phoneNumber) {
        const profile = props.members[1].profile;

        return `${BASE_URL}/images/${profile}`;
      } else {
        const profile = props.members[0].profile;
        return `${BASE_URL}/images/${profile}`;
      }
    };
    return (
      <TouchableOpacity onPress={() => handleForward(item)}>
        <View style={{ backgroundColor: Color.White }}>
          <View style={styles.contentContainer}>
            <Image
              source={{ uri: setPhotoForDirectChat(item) }}
              style={styles.userImg}
            />
            <View
              style={{
                marginTop: Height * 0.008,
                flex: 0,
                alignSelf: 'center',
              }}
            >
              <Text style={styles.userName}>
                {item.members[0].phoneNumber === userState.phoneNumber
                  ? item.members[1].fullName
                  : item.members[0].fullName}
              </Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <ScrollView>
      <View style={{ backgroundColor: Color.White }}>
        <HeaderNormal title="Forward to.." />

        <View>
          <View style={{ backgroundColor: Color.VeryLightGrey }}>
            <Text style={styles.contactTitle}>Recent chats</Text>
          </View>
          <FlatList
            data={messages}
            keyExtractor={(item) => item._id}
            renderItem={recentChats}
          />
        </View>
        <View style={{}}>
          <View style={{ backgroundColor: Color.VeryLightGrey }}>
            <Text style={styles.contactTitle}>Other contacts</Text>
          </View>
          <FlatList
            data={Users}
            keyExtractor={(item) => item._id}
            renderItem={renderItem}
          />
        </View>
      </View>
    </ScrollView>
  );
};

export default ShareScreen;

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
