import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Dimensions,
  Pressable,
} from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { List } from 'react-native-paper';
import AdminBottomTab from '../../components/AdminBottomTab';
import { Ionicons, MaterialIcons } from 'react-native-vector-icons';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import axios from 'axios';
import * as Contacts from 'expo-contacts';
import { useUserState } from './../../slices/userSlice';
import { useContactsStateActions } from '../../slices/contactslice.js';
import { BASE_URL } from '../../../CONSTANTS';
import Color from '../../../assets/colors/Color';
import CreateNew from '../../components/Modals/AdminHome/CreateNew';

import { useStateContext } from '../../contexts/ContextProvider';
import { ScrollView } from 'react-native-gesture-handler';
import AdminHomeManegeTab from './AdminHomeManegeTab';
import { scale } from 'react-native-size-matters';
import GroupMembersList from '../../components/GroupMembersList';
import { axiosInstance } from '../../../axiosInstance';
import { useQuery } from 'react-query';
import CustomStatsBar from '../../components/CustomStatsBar';
import { screenHeight } from '../../utils/ScreenDimensions';
import BiddingGroup from '../../components/BiddingGroup';
import { fetchChannels } from '../../utils/BiddingChannel';

const Height = Dimensions.get('screen').height;
const Width = Dimensions.get('screen').width;

const fetchGroups = async () => {
  try {
    const { data } = await axiosInstance.get('/groups/getgroups');
    return data;
  } catch (error) {
    console.log(error);
  }
};

export default function AdminHome(props) {
  const [visible, setVisible] = React.useState(false);
  const [isChatListOpen, setisChatListOpen] = useState({});
  const [groupDetails, setgroupDetails] = useState('');
  const [isBiddingOpen, setisBiddingOpen] = useState(false);

  const showModal = useCallback(() => {
    setVisible(true);
  }, []);

  const hideModal = useCallback(() => {
    setVisible(false);
  }, []);

  const containerStyle = {
    backgroundColor: 'white',
    borderRadius: Height * 0.01,
    paddingVertical: Height * 0.015,
    marginHorizontal: Width * 0.04,
  };
  const { setgroup } = useStateContext();

  const contactstateactions = useContactsStateActions();
  const {
    data: groups = [],
    isLoading: loading,
    refetch,
  } = useQuery('groups', fetchGroups);

  const { data: channal = [] } = useQuery('channal', fetchChannels);

  //fetch user contacts in this useEffect
  useEffect(() => {
    const fetchcontacts = async () => {
      try {
        const { status } = await Contacts.requestPermissionsAsync({});
        if (status === 'granted') {
          const { data } = await Contacts.getContactsAsync();

          if (data.length > 0) {
            let resolvedContacts = [];

            data.map((contact) => {
              try {
                resolvedContacts.push({
                  name: contact.name,
                  phoneNumber: contact?.phoneNumbers[0]?.number,
                });
              } catch (error) {}
            });
            resolvedContacts.sort((a, b) => {
              if (a.name > b.name) return 1;
              if (a.name < b.name) return -1;
              return 0;
            });
            contactstateactions.setContacts({ resolvedContacts });
          }
        }
      } catch (err) {
        console.log(err);
      }
    };
    fetchcontacts();
  }, []);
  const sections = [
    {
      id: '1',
      title: 'Managerial Groups',
    },
    {
      id: '2',
      title: 'Departmental Groups',
    },
    {
      id: '3',
      title: 'Outsourcing Groups',
    },
    {
      id: '4',
      title: 'Social Groups',
    },
    {
      id: '5',
      title: 'Connecting Nature (Do-Day)',
    },
  ];
  const navigation = useNavigation();
  useFocusEffect(
    React.useCallback(() => {
      refetch();
    }, []),
  );

  const userState = useUserState();

  const handleAdminChat = () => {
    let groupfound = false;
    const admingroup = groups.filter((group) => {
      return group.type === 'Admin';
    });

    admingroup.map((group) => {
      if (
        group.members[0].member.phoneNumber === userState.phoneNumber ||
        group.members[1].member.phoneNumber === userState.phoneNumber
      ) {
        if (group.type === 'Admin') {
          groupfound = true;
          setgroup(group);
          navigation.navigate('ChatCRM', { group: group });
        }
      }
    });
    if (groupfound === false) {
      axios
        .get(`${BASE_URL}/user/getusers`, {
          headers: {
            'auth-token': userState.token,
          },
        })
        .then((res) => {
          let user = res.data.filter((admin) => {
            return admin.type === 'Admin';
          });
          let members = [
            {
              member: userState.id,
            },
            {
              member: user[0]._id,
            },
          ];
          const formData = new FormData();
          formData.append('name', userState.fullName);
          formData.append('type', 'Admin');
          formData.append('title', 'Admin');
          formData.append('members', JSON.stringify(members));
          axios
            .post(`${BASE_URL}/groups/creategroup`, formData, {
              headers: {
                'Content-Type': 'multipart/form-data',
                Accept: 'application/json',
                'auth-token': userState.token,
              },
            })
            .then((res) => {
              setgroup(res.data);
              navigation.navigate('ChatCRM', { group: res.data });
            })
            .catch((e) => console.log(e));
        })
        .catch((e) => console.log(e));
    }
  };

  const handleExpandGroup = (id, group) => {
    setisChatListOpen({
      [id]: !isChatListOpen[id],
    });
    setgroupDetails(group);
    setisBiddingOpen(false);
  };

  return (
    <SafeAreaProvider style={styles.container}>
      <CustomStatsBar backgroundColor={Color.White} />
      <View
        style={{
          backgroundColor: Color.White,
          borderBottomColor: Color.LightGrey,
          borderBottomWidth: Width * 0.005,
        }}
      >
        <Image
          source={require('../../../assets/crmlogo.png')}
          style={styles.logo}
        />
      </View>
      <ScrollView
        style={{ height: '93%' }}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.main}>
          <View style={styles.bodyContainer}>
            <Pressable style={styles.CreateGroup} onPress={showModal}>
              <Text style={styles.CreateGroupText}>
                Create Groups, Campaign etc
              </Text>

              <Ionicons
                name="add-circle"
                style={{ fontSize: 25, color: Color.Blue }}
              />
            </Pressable>
          </View>
          <View
            style={{
              marginTop: Dimensions.get('screen').height * 0.0015,
            }}
          />
          <View>
            <Text style={styles.groupHeading}>GROUPS</Text>
            <View style={{ paddingHorizontal: Width * 0.045 }}>
              <Text
                style={{
                  ...styles.titleStyle,
                  paddingHorizontal: Width * 0.05,
                  marginVertical: Height * 0.01,
                }}
              >
                Bidding Channel
              </Text>
              <FlatList
                data={channal}
                renderItem={({ item }) => {
                  return (
                    <View>
                      <View style={styles.List}>
                        <TouchableOpacity
                          // onPress={() => navigation.navigate('BidChannal', item)}
                          onPress={() => setisBiddingOpen(!isBiddingOpen)}
                        >
                          <View style={styles.groupContainer}>
                            <Text style={styles.groupTitle}>{item.title}</Text>
                            <MaterialIcons
                              name={
                                isBiddingOpen
                                  ? 'keyboard-arrow-up'
                                  : 'keyboard-arrow-down'
                              }
                              style={{ fontSize: scale(20) }}
                            />
                          </View>
                        </TouchableOpacity>
                      </View>
                      {isBiddingOpen && <BiddingGroup item={item} />}
                    </View>
                  );
                }}
              />
            </View>
            <FlatList
              data={sections}
              renderItem={({ item, index }) => (
                <View key={index}>
                  <View style={styles.adminGroupListContainer}>
                    <List.Accordion
                      title={item.title}
                      key={index}
                      titleStyle={styles.titleStyle}
                      expanded
                      style={{
                        icon: {
                          display: 'none',
                        },
                      }}
                      right={(props) => (
                        <List.Icon
                          {...props}
                          icon="folder"
                          style={{ display: 'none' }}
                          key={index}
                        />
                      )}
                    >
                      {item.title === 'Managerial Groups'
                        ? groups.map((group, id) => {
                            if (group.type === 'Managerial')
                              return (
                                <>
                                  <View style={styles.List} key={id}>
                                    <TouchableOpacity
                                      onPress={() =>
                                        handleExpandGroup(id, group)
                                      }
                                    >
                                      <View style={styles.groupContainer}>
                                        <Text style={styles.groupTitle}>
                                          {group.title}
                                        </Text>

                                        <MaterialIcons
                                          name={
                                            isChatListOpen[id]
                                              ? 'keyboard-arrow-up'
                                              : 'keyboard-arrow-down'
                                          }
                                          style={{ fontSize: scale(20) }}
                                        />
                                      </View>
                                    </TouchableOpacity>
                                  </View>
                                  {isChatListOpen[id] && (
                                    <View
                                      style={{
                                        width: '95%',
                                        alignSelf: 'center',
                                      }}
                                    >
                                      <TouchableOpacity
                                        style={styles.enterChat}
                                        onPress={() => {
                                          setgroup(groupDetails);
                                          navigation.navigate('ChatCRM', {
                                            group: groupDetails,
                                          });
                                          setisChatListOpen(
                                            !isChatListOpen[id],
                                          );
                                        }}
                                      >
                                        <Text style={styles.buttonTitle}>
                                          Enter Group Chat
                                        </Text>
                                      </TouchableOpacity>
                                      <View
                                        style={{
                                          marginVertical: scale(10),
                                        }}
                                      >
                                        <GroupMembersList
                                          group={groupDetails}
                                        />
                                      </View>
                                    </View>
                                  )}
                                </>
                              );
                          })
                        : null}
                      {item.title === 'Departmental Groups'
                        ? groups.map((group, id) => {
                            if (group.type === 'Departmental') {
                              return (
                                <>
                                  <View style={styles.List} key={id}>
                                    <TouchableOpacity
                                      onPress={() =>
                                        handleExpandGroup(id, group)
                                      }
                                    >
                                      <View style={styles.groupContainer}>
                                        <Text style={styles.groupTitle}>
                                          {group.title}
                                        </Text>

                                        <MaterialIcons
                                          name={
                                            isChatListOpen[id]
                                              ? 'keyboard-arrow-up'
                                              : 'keyboard-arrow-down'
                                          }
                                          style={{ fontSize: scale(20) }}
                                        />
                                      </View>
                                    </TouchableOpacity>
                                  </View>
                                  {isChatListOpen[id] && (
                                    <View
                                      style={{
                                        width: '95%',
                                        alignSelf: 'center',
                                      }}
                                    >
                                      <TouchableOpacity
                                        style={styles.enterChat}
                                        onPress={() => {
                                          setgroup(groupDetails);
                                          navigation.navigate('ChatCRM', {
                                            group: groupDetails,
                                          });
                                          setisChatListOpen(
                                            !isChatListOpen[id],
                                          );
                                        }}
                                      >
                                        <Text style={styles.buttonTitle}>
                                          Enter Group Chat
                                        </Text>
                                      </TouchableOpacity>
                                      <View
                                        style={{
                                          marginVertical: scale(10),
                                        }}
                                      >
                                        <GroupMembersList
                                          group={groupDetails}
                                        />
                                      </View>
                                    </View>
                                  )}
                                </>
                              );
                            }
                          })
                        : null}
                      {item.title === 'Outsourcing Groups'
                        ? groups.map((group, id) => {
                            if (group.type === 'Outsource')
                              return (
                                <>
                                  <View style={styles.List} key={id}>
                                    <TouchableOpacity
                                      onPress={() =>
                                        handleExpandGroup(id, group)
                                      }
                                    >
                                      <View style={styles.groupContainer}>
                                        <Text style={styles.groupTitle}>
                                          {group.title}
                                        </Text>

                                        <MaterialIcons
                                          name={
                                            isChatListOpen[id]
                                              ? 'keyboard-arrow-up'
                                              : 'keyboard-arrow-down'
                                          }
                                          style={{ fontSize: scale(20) }}
                                        />
                                      </View>
                                    </TouchableOpacity>
                                  </View>
                                  {isChatListOpen[id] && (
                                    <View
                                      style={{
                                        width: '95%',
                                        alignSelf: 'center',
                                      }}
                                    >
                                      <TouchableOpacity
                                        style={styles.enterChat}
                                        onPress={() => {
                                          setgroup(groupDetails);
                                          navigation.navigate('ChatCRM', {
                                            group: groupDetails,
                                          });
                                        }}
                                      >
                                        <Text style={styles.buttonTitle}>
                                          Enter Group Chat
                                        </Text>
                                      </TouchableOpacity>
                                      <View
                                        style={{
                                          marginVertical: scale(10),
                                        }}
                                      >
                                        <GroupMembersList
                                          group={groupDetails}
                                        />
                                      </View>
                                    </View>
                                  )}
                                </>
                              );
                          })
                        : null}
                      {item.title === 'Social Groups'
                        ? groups.map((group, id) => {
                            if (group.type === 'Social')
                              return (
                                <>
                                  <View style={styles.List} key={id}>
                                    <TouchableOpacity
                                      onPress={() =>
                                        handleExpandGroup(id, group)
                                      }
                                    >
                                      <View style={styles.groupContainer}>
                                        <Text style={styles.groupTitle}>
                                          {group.title}
                                        </Text>

                                        <MaterialIcons
                                          name={
                                            isChatListOpen[id]
                                              ? 'keyboard-arrow-up'
                                              : 'keyboard-arrow-down'
                                          }
                                          style={{ fontSize: scale(20) }}
                                        />
                                      </View>
                                    </TouchableOpacity>
                                  </View>
                                  {isChatListOpen[id] && (
                                    <View
                                      style={{
                                        width: '95%',
                                        alignSelf: 'center',
                                      }}
                                    >
                                      <TouchableOpacity
                                        style={styles.enterChat}
                                        onPress={() => {
                                          setgroup(groupDetails);
                                          navigation.navigate('ChatCRM', {
                                            group: groupDetails,
                                          });
                                        }}
                                      >
                                        <Text style={styles.buttonTitle}>
                                          Enter Group Chat
                                        </Text>
                                      </TouchableOpacity>
                                      <View
                                        style={{
                                          marginVertical: scale(10),
                                        }}
                                      >
                                        <GroupMembersList
                                          group={groupDetails}
                                        />
                                      </View>
                                    </View>
                                  )}
                                </>
                              );
                          })
                        : null}
                      {item.title === 'Connecting Nature (Do-Day)'
                        ? groups.map((group, id) => {
                            if (group.type === 'campaign')
                              return (
                                <>
                                  <View style={styles.List} key={id}>
                                    <TouchableOpacity
                                      onPress={() =>
                                        handleExpandGroup(id, group)
                                      }
                                    >
                                      <View style={styles.groupContainer}>
                                        <Text style={styles.groupTitle}>
                                          {group.title}
                                        </Text>

                                        <MaterialIcons
                                          name={
                                            isChatListOpen[id]
                                              ? 'keyboard-arrow-up'
                                              : 'keyboard-arrow-down'
                                          }
                                          style={{ fontSize: scale(20) }}
                                        />
                                      </View>
                                    </TouchableOpacity>
                                  </View>
                                  {isChatListOpen[id] && (
                                    <View
                                      style={{
                                        width: '95%',
                                        alignSelf: 'center',
                                      }}
                                    >
                                      <TouchableOpacity
                                        style={styles.enterChat}
                                        onPress={() => {
                                          setgroup(groupDetails);
                                          navigation.navigate('ChatCRM', {
                                            group: groupDetails,
                                          });
                                        }}
                                      >
                                        <Text style={styles.buttonTitle}>
                                          Enter Group Chat
                                        </Text>
                                      </TouchableOpacity>
                                      <View
                                        style={{
                                          marginVertical: scale(10),
                                        }}
                                      >
                                        <GroupMembersList
                                          group={groupDetails}
                                        />
                                      </View>
                                    </View>
                                  )}
                                </>
                              );
                          })
                        : null}
                    </List.Accordion>
                  </View>
                </View>
              )}
            />
          </View>
          <AdminHomeManegeTab loading={loading} />
        </View>
      </ScrollView>
      <AdminBottomTab onPressAdmin={handleAdminChat} />
      <CreateNew
        visible={visible}
        containerStyle={containerStyle}
        hideModal={hideModal}
      />
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  main: {
    backgroundColor: Color.LightBg,
    height: '100%',
    width: '100%',
  },
  bodyContainer: {
    borderRadius: 10,
    marginVertical: scale(15),
    borderColor: Color.LightGrey,
    backgroundColor: Color.White,
    shadowColor: Color.Black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
    position: 'relative',
    zIndex: 900,
    width: '90%',
    alignSelf: 'center',
  },

  contentContainer: {
    flexDirection: 'row',
    paddingVertical: Height * 0.008,
    alignContent: 'center',
    marginLeft: Width * 0.03,
    justifyContent: 'space-between',
  },
  CreateGroup: {
    flexDirection: 'row',
    alignSelf: 'center',
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Width * 0.03,
  },
  avatarGroup: {
    width: Dimensions.get('screen').height * 0.07,
    height: Dimensions.get('screen').height * 0.07,
    borderRadius: Dimensions.get('screen').height * 0.1,
    backgroundColor: Color.VeryLightGrey,
  },
  CreateGroupText: {
    paddingVertical: Height * 0.02,
    fontSize: Height * 0.02,
    fontWeight: '400',
    fontFamily: 'Roboto_400Regular',
    color: Color.Black,
  },
  groupHeading: {
    fontFamily: 'Roboto_700Bold',
    fontSize: Height * 0.022,
    fontWeight: '600',
    marginLeft: Width * 0.059,
    marginTop: Height * 0.015,
    color: Color.Black,
  },
  List: {
    marginBottom: Height * 0.01,
    borderRadius: 10,
    marginVertical: Height * 0.006,
    borderColor: Color.LightGrey,
    backgroundColor: Color.White,
    shadowColor: Color.Black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
    position: 'relative',
    zIndex: 900,
  },

  adminGroupListContainer: {
    paddingHorizontal: Width * 0.045,
    width: Dimensions.get('window').width,
  },

  groupContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: scale(12),
  },
  groupTitle: {
    fontSize: Height * 0.017,
    fontFamily: 'Roboto_500Medium',
    paddingVertical: Height * 0.018,
    marginLeft: Width * 0.02,
    color: Color.Black,
  },
  groupMessages: {
    paddingVertical: 10,
    backgroundColor: Color.White,
    paddingHorizontal: 15,
  },
  logo: {
    marginLeft: Width * 0.05,
    width: 90,
    height: 58,
    resizeMode: 'contain',
  },
  enterChat: {
    backgroundColor: 'rgba(0, 123, 255, 0.1)',
    alignItems: 'center',
    width: '100%',
    alignSelf: 'center',
    height: scale(40),
    justifyContent: 'center',
    borderRadius: scale(8),
    borderWidth: 1,
    borderColor: 'rgba(0, 123, 255, 1)',
  },
  buttonTitle: {
    color: Color.Blue,
    fontSize: screenHeight * 0.018,
    fontFamily: 'Roboto_700Bold',
  },
  titleStyle: {
    color: 'black',
    fontFamily: 'Roboto_700Bold',
    fontSize: screenHeight * 0.018,
  },
});
