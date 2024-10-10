/* eslint-disable @typescript-eslint/indent */
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Platform,
  TouchableOpacity,
  Alert,
  Dimensions,
  Pressable,
  Image,
  ActivityIndicator,
  FlatList,
} from 'react-native';
import React, { useState } from 'react';
import {
  Appbar,
  IconButton,
  Button,
  Avatar,
  Portal,
  Modal,
  Dialog,
} from 'react-native-paper';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { useUserState } from '../../slices/userSlice';
import { BASE_URL } from './../../../CONSTANTS';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import MemberRow from './MemberRow';
import { useStateContext } from '../../contexts/ContextProvider.js';
import Color from '../../../assets/colors/Color';
import { scale } from 'react-native-size-matters';
import * as ImagePicker from 'expo-image-picker';
import { axiosInstance } from '../../../axiosInstance';
import { screenWidth } from '../../utils/ScreenDimensions';

// const ALLOWED_ROLES = ['Owner'];

function GroupSettings(props) {
  const { group, currentUserprivilege, showSnackbar } = useStateContext();
  // const isCurrentUserAllowed = ALLOWED_ROLES.includes(currentUserprivilege);

  const [groupState, setgroup] = useState({
    type: group?.type,
    title: group?.title,
    members: group?.members,
    groupPic: group?.groupPic,
    groupId: group?._id,
  });
  const userState = useUserState();
  const [groupImage, setgroupImage] = useState(null);

  // let userDetails = group?.members.filter(
  //   (m) => m.member.phoneNumber !== userState.phoneNumber,
  // );

  const [groups, setgroups] = useState([]);
  const [modalProfile, setmodalProfile] = useState(false);
  // const [photo, setphoto] = useState(
  //   `${BASE_URL}/images/${groupState.groupPic}`,
  // );

  const navigation = useNavigation();

  const containerStyle = {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 5,
    width: '90%',
    marginLeft: '5%',
  };
  const RemoveMember = async (member) => {
    try {
      const memberId = member.member._id;

      const response = await axios.patch(
        `${BASE_URL}/groups/remove-member/${group._id}`,
        { memberId: memberId },
        {
          headers: {
            'auth-token': userState.token,
          },
        },
      );

      const updatedGroup = response.data.group;
      setgroup(updatedGroup);
      alert('Member Removed Successfully');
    } catch (error) {}
  };

  const selectedcontacts = (members) => {
    const getIdFromMembers = members.map((m) => {
      return {
        member: m._id,
        privilege: m.privilege,
      };
    });
    const getIdFromExistingMembers = groupState?.members?.map((m) => {
      return {
        member: m.member._id,
        privilege: m.privilege,
      };
    });
    const tempmembers = [...getIdFromExistingMembers, ...getIdFromMembers];

    axios
      .patch(
        `${BASE_URL}/groups/updategroup/${group._id}`,
        { members: tempmembers },
        {
          headers: {
            'auth-token': userState.token,
          },
        },
      )
      .then((res) => {
        setgroup(res.data);
        alert('Members Added Successfully');
      })
      .catch((e) => {});
  };
  const [IsImageUploading, setIsImageUploading] = useState(false);
  const [visible3, setVisible3] = useState(false);
  const hideDialog = () => setVisible3(false);

  // disband group modal

  // block user modal
  const [blockModal, setBlockModal] = useState(false);
  const onDismissBlockModal = () => setBlockModal(false);

  //disband group
  const disbandGroup = async () => {
    const config = {
      headers: {
        'auth-token': userState.token,
      },
    };
    //do api request here
    const { data } = await axios.post(
      `${BASE_URL}/archives/disband-group/${groupState.groupId}`,
      {},
      config,
    );
    if (data.success) {
      alert('group disbanded successfully');
      navigation.navigate('AdminHome');
    } else {
    }
  };

  const currentUser = groupState?.members.filter((mem) => {
    return mem.member._id === userState.id;
  });

  const handleProfile = () => {
    if (currentUserprivilege) {
      setmodalProfile(true);
    } else {
      navigation.navigate('ViewImage', {
        url: `${BASE_URL}/${groupState?.groupPic}`,
        message: '',
      });
    }
  };

  const handleCloseProfile = () => {
    setmodalProfile(false);
  };

  const handlePick = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      quality: 0.5,
    });

    setgroupImage(result.assets[0].uri);
    setmodalProfile(false);
  };

  const handleUpdateGroupImage = async () => {
    setIsImageUploading(true);
    const formData = new FormData();

    if (groupImage === null) {
      setIsImageUploading(false);
      return;
    }

    formData.append('groupPic', {
      name: `${userState.phoneNumber}.jpg`,
      uri: groupImage,
      type: 'image/jpg',
    });

    try {
      const res = await axiosInstance.patch(
        `/groups/updateGroupPicture/${group?._id}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Accept: 'application/json',
          },
        },
      );

      setIsImageUploading(false);

      showSnackbar('Your group image has been updated.');
      setgroup(res.data);
      setgroupImage(null);
    } catch (error) {
      setIsImageUploading(false);
    }
  };

  const handleRemoveMember = (member) => {
    const currentMember = groupState.members.find(
      (m) => m.member.phoneNumber === userState.phoneNumber,
    );

    if (currentMember && currentMember.privilege === 'Owner') {
      if (member.phoneNumber === userState.phoneNumber) {
        alert('You cannot remove yourself from the group');
      } else if (groupState.members.length <= 2) {
        Alert.alert(
          'Cannot Remove Member',
          'A group must have at least two members.',
        );
      } else {
        RemoveMember(member);
      }
    }
  };

  const renderMember = ({ item }) => (
    <View key={item.phoneNumber} style={styles.memberListContainer}>
      <View style={styles.memberRow}>
        <MemberRow member={item} groupState={groupState} />
        {currentUser[0]?.privilege === 'Owner' && (
          <Button
            mode="text"
            uppercase={false}
            style={styles.removeButton}
            labelStyle={styles.removeButtonLabel}
            onPress={() => handleRemoveMember(item)}
          >
            remove
          </Button>
        )}
      </View>
    </View>
  );

  const renderGroup = ({ item }) => {
    console.log(item);
    const isCurrentUserInGroup = item.members.some(
      (member) => member.phoneNumber === userState.phoneNumber,
    );

    if (
      item.type !== 'individual' &&
      item.type !== 'Admin' &&
      isCurrentUserInGroup
    ) {
      return (
        <View
          key={item.id} // Assuming id is unique
          style={styles.groupContainer}
        >
          <View style={styles.groupRow}>
            <TouchableWithoutFeedback
              onPress={() => navigation.navigate('Chat')}
              style={styles.groupTouchable}
            >
              <Avatar.Image
                size={50}
                source={
                  item.photo
                    ? { uri: item.photo }
                    : require('../../../assets/no-profile-picture-placeholder.png')
                }
              />
              <View style={styles.groupDetails}>
                <Text style={styles.groupTitle}>{item.title}</Text>
                <Text style={styles.groupType}>{item.type}</Text>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </View>
      );
    }
    return null;
  };

  return (
    // Using ScrollView to dismiss keyboard when user clicks anywhere on the screen.
    <View style={[styles.body]}>
      <Appbar.Header
        style={{
          marginTop: 0,
          width: '100%',
          backgroundColor: Color.White,
          borderBottomWidth: 1,
          borderColor: Color.VeryLightGrey,
        }}
      >
        <Appbar.BackAction
          color={Color.Black}
          onPress={() => navigation.goBack()}
          size={20}
        />
        <Appbar.Content
          title={
            groupState.type === 'individual' ||
            groupState.type === 'Admin' ||
            groupState.type === 'user'
              ? 'Profile Settings'
              : 'Group Settings'
          }
          titleStyle={{
            fontFamily: 'Roboto_600SemiBold',
            fontSize: 20,
          }}
          color={Color.Black}
          style={{
            ...Platform.select({
              ios: {
                marginTop: 0,
              },
              android: {
                marginTop: 4,
                marginLeft: 0,
              },
            }),

            alignItems: 'flex-start',
          }}
        />
        {groupImage === null && (
          <Appbar.Action
            style={{ marginRight: 15, zIndex: 1 }}
            color={Color.Black}
            size={22}
            icon="phone"
            onPress={() => {
              // if (Platform === "ios") {
              //   Linking.openURL(`telprompt:${numberCall()}`);
              // } else {
              //   Linking.openURL(`tel:${numberCall()}`);
              // }
            }}
          />
        )}

        {groupImage && (
          <TouchableOpacity
            style={styles.updateContiner}
            onPress={handleUpdateGroupImage}
          >
            {IsImageUploading ? (
              <ActivityIndicator
                style={{ paddingHorizontal: 15 }}
                color="white"
              />
            ) : (
              <Text style={styles.updateTitle}>Update</Text>
            )}
          </TouchableOpacity>
        )}
      </Appbar.Header>

      <ScrollView
        style={{
          flex: 1,
          width: '100%',
        }}
        contentContainerStyle={{
          alignItems: 'center',
        }}
      >
        {/* Profile Header Avatar, Name, Phone Number and Type --- Start */}
        <View
          style={[
            {
              width: '100%',
              backgroundColor: 'white',
              alignItems: 'center',
              marginBottom: 10,
            },
          ]}
        >
          <TouchableOpacity
            style={[
              styles.row,
              {
                marginTop: 15,
                paddingBottom: 15,
                paddingHorizontal: 15,
                width: '100%',
                alignContent: 'center',
              },
            ]}
            onPress={handleProfile}
          >
            {/* Profile Header Avatar --- Start */}

            <Avatar.Image
              size={Dimensions.get('screen').height * 0.13}
              style={{ backgroundColor: 'white' }}
              source={
                groupImage === null
                  ? {
                      uri: `${BASE_URL}/${groupState?.groupPic}`,
                    }
                  : { uri: groupImage }
              }
            />
            {/* Profile Header Avatar --- End */}
          </TouchableOpacity>
          {/* Profile Header Full Name --- Start */}

          <View style={{ justifyContent: 'center' }}>
            <Text
              numberOfLines={1}
              ellipsizeMode="tail"
              style={{
                fontFamily: 'Roboto_600SemiBold',
                fontSize: 18,
                color: Color.Black,
                width: '100%',
              }}
            >
              {groupState?.type !== 'individual' && groupState?.type !== 'Admin'
                ? groupState?.members.map((user) => {
                    if (userState.phoneNumber !== user.phoneNumber) {
                      return user.name;
                    }
                  })
                : groupState?.members.map((user) => {
                    if (userState.phoneNumber !== user.phoneNumber) {
                      return user.name;
                    }
                  })}
            </Text>
          </View>
          {/* Profile Header Full Name --- End */}
          {/* Profile Header Phone Number and Type --- Start */}
          {groupState.title !== 'test' && (
            <Text style={{ ...styles.groupLevel, color: Color.Black }}>
              {groupState.title}
            </Text>
          )}

          <Text style={styles.groupLevel}>{groupState.type}</Text>
          {/* <Text
            style={{
              fontFamily: "Roboto_400Regular",
              fontSize: 16,
              color: "#4582C3",
            }}
          >
            {groupState.level !== "individual" && groupState.level !== "Admin"
              ? groupState.members.map((user) => {
                  if (user.type === "Lead") {
                    return user.name;
                  }
                })
              : groupState.members.map((user) => {
                  if (userState.phoneNumber !== user.member?.phoneNumber) {
                    return "+92" + " " + user.member?.phoneNumber;
                  }
                })}{" "}
            &#8226;{" "}
            <Text>
              {groupState.level === "individual" && groupState.level === "Admin"
                ? "Group Lead"
                : groupState.members.map((user) => {
                    if (userState.phoneNumber !== user.member.phoneNumber) {
                      if (groupState.level === "Admin") {
                        return "CEO";
                      } else {
                        return user.type || "no type";
                      }
                    }
                  })}
            </Text>
          </Text> */}
          {/* Profile Header Phone Number and Type --- End */}
        </View>

        <View style={{ width: '100%' }}>
          <Pressable
            android_ripple={{ color: Color.LightGrey }}
            onPress={() =>
              navigation.navigate('MediaScreen', {
                data: group?.messages,
                groupTitle: group?.title,
              })
            }
          >
            <View
              style={[
                styles.row,
                {
                  padding: 10,
                  paddingHorizontal: 15,
                  borderRadius: 5,
                  width: '100%',
                  justifyContent: 'flex-start',
                },
              ]}
            >
              <View
                style={{
                  backgroundColor: Color.LightBlue,
                  paddingHorizontal: scale(6),
                  paddingVertical: scale(6),
                  borderRadius: scale(40),
                  marginHorizontal: scale(4),
                }}
              >
                <Image
                  source={require('../../../assets/pdfIcon.png')}
                  style={{
                    width: scale(18),
                    height: scale(18),
                    resizeMode: 'contain',
                  }}
                />
              </View>
              <View
                style={{
                  marginLeft: 12,
                  flexDirection: 'column',
                }}
              >
                <Text
                  style={{
                    // fontFamily: "Poppins_500Medium",
                    fontSize: 15,
                    color: '#4582C3',
                  }}
                >
                  Media, Docs, Links
                </Text>
              </View>
              <IconButton
                icon="chevron-right"
                color="#C8C8C8"
                size={25}
                style={{
                  marginLeft: 'auto',
                  margin: 0,
                  marginRight: -10,
                  padding: 0,
                }}
              />
            </View>
          </Pressable>
          {/* <FIleMedia /> */}
        </View>

        <View
          style={[
            {
              width: '100%',
              alignItems: 'center',
            },
          ]}
        >
          {groupState.type !== 'individual' && groupState.type !== 'Admin' ? (
            <Pressable
              android_ripple={{ color: Color.LightGrey }}
              onPress={() =>
                navigation.navigate('MultiContactSelect', {
                  selectedContacts: selectedcontacts,
                  currentMembers: groupState?.members,
                })
              }
            >
              {currentUser[0]?.privilege !== 'member' && (
                <View
                  style={[
                    styles.row,
                    {
                      padding: 10,
                      paddingHorizontal: 15,
                      borderRadius: 5,
                      width: '100%',
                      justifyContent: 'flex-start',
                      // backgroundColor: "white",
                    },
                  ]}
                >
                  <IconButton
                    icon="plus"
                    color="#777CE4"
                    size={20}
                    style={{
                      backgroundColor: '#E1E2FF',
                      borderWidth: 0,
                      borderColor: 'white',
                    }}
                  />
                  <View
                    style={{
                      marginLeft: 12,
                      flexDirection: 'column',
                    }}
                  >
                    <Text
                      style={{
                        // fontFamily: "Poppins_500Medium",
                        fontSize: 15,
                        color: '#4582C3',
                      }}
                    >
                      Add Participant
                    </Text>
                  </View>
                  <IconButton
                    icon="chevron-right"
                    color="#C8C8C8"
                    size={25}
                    style={{
                      marginLeft: 'auto',
                      margin: 0,
                      marginRight: -10,
                      padding: 0,
                    }}
                  />
                </View>
              )}
            </Pressable>
          ) : (
            <Pressable
              android_ripple={{ color: Color.LightGrey }}
              // onPress={() => onToggleComingSoon()}
              style={[
                {
                  width: '100%',
                  alignItems: 'center',
                },
              ]}
            >
              <View
                style={[
                  styles.row,
                  {
                    padding: 10,
                    paddingHorizontal: 15,
                    borderRadius: 5,
                    width: '100%',
                    justifyContent: 'flex-start',
                  },
                ]}
              >
                <IconButton
                  icon="share"
                  color="#4582C3"
                  size={20}
                  style={{
                    backgroundColor: '#E4F1FF',
                    borderWidth: 0,
                    borderColor: 'white',
                  }}
                />
                <View
                  style={{
                    marginLeft: 12,
                    flexDirection: 'column',
                  }}
                >
                  <Text
                    style={{
                      //fontFamily: "Roboto_500Medium",
                      fontSize: 15,
                      color: '#4582C3',
                    }}
                  >
                    Share Profile
                  </Text>
                </View>
                <IconButton
                  icon="chevron-right"
                  color="#C8C8C8"
                  size={25}
                  style={{
                    marginLeft: 'auto',
                    margin: 0,
                    marginRight: -10,
                    padding: 0,
                  }}
                />
              </View>
            </Pressable>
          )}
        </View>
        <View
          style={[
            styles.row,
            {
              marginTop: 20,
              marginBottom: 10,
              width: '90%',
              justifyContent: 'flex-start',
            },
          ]}
        >
          <Text
            style={{
              //fontFamily: "Roboto_500Medium",
              fontSize: 16,
              color: 'gray',
            }}
          >
            {groupState.type !== 'individual' && groupState.type !== 'Admin'
              ? 'Group Members'
              : 'Groups In Common'}
          </Text>
        </View>
        {groupState.type !== 'individual' && groupState.type !== 'Admin' ? (
          <FlatList
            data={groupState.members}
            renderItem={renderMember}
            keyExtractor={(item) => item?.phoneNumber}
          />
        ) : (
          groups !== undefined && (
            <FlatList
              data={groups}
              renderItem={renderGroup}
              keyExtractor={(item) => item.id}
            />
          )
        )}
        <TouchableOpacity
          onPressOut={() => {
            if (
              groupState.type !== 'individual' &&
              groupState.type !== 'Admin'
            ) {
              const currentmember = groupState?.members.filter((member) => {
                return member.member.phoneNumber === userState.phoneNumber;
              });
              if (currentmember[0].privilege === 'Owner') {
                disbandGroup();
              } else {
                alert('You dont have the permission to disband group');
              }

              //here do the api call
              // disbandGroup();

              //onToggleDisband();
            } else {
              // onToggleBlockModal();
            }
          }}
          style={[
            styles.row,
            {
              marginTop: 10,
              marginBottom: 30,
              width: '90%',
              justifyContent: 'flex-start',
            },
          ]}
        >
          <IconButton
            icon="close"
            color="#E70000"
            size={20}
            style={{
              backgroundColor: '#FFE1E1',
              margin: 0,
              marginRight: 10,
            }}
          />
          <Button
            mode="text"
            uppercase={false}
            compact
            style={{ marginLeft: -5 }}
            color="#E70000"
            labelStyle={{
              fontSize: 16,
              color: '#E70000',

              letterSpacing: 0.1,
            }}
          >
            {groupState.type === 'individual' || groupState.type === 'Admin'
              ? 'Block User'
              : 'Disband Group'}
          </Button>
        </TouchableOpacity>

        {/* block user modal */}
        <Portal>
          <Modal
            visible={blockModal}
            onDismiss={onDismissBlockModal}
            contentContainerStyle={containerStyle}
          >
            <View
              style={[
                styles.row,
                {
                  width: '100%',
                },
              ]}
            >
              <Text
                style={{
                  //   fontFamily: "Poppins_400Regular",
                  fontSize: 16,
                  color: '#4582C3',
                  textAlign: 'center',
                }}
              >
                Are you sure you want to Block This User?
              </Text>
            </View>
            <View
              style={[
                styles.row,
                {
                  width: '100%',
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginVertical: 20,
                },
              ]}
            >
              <Button
                uppercase={false}
                style={{
                  width: '35%',
                  backgroundColor: '#E70000',
                  marginRight: 12,
                }}
                labelStyle={{
                  // fontFamily: "Roboto_400Regular",
                  fontSize: 16,
                  color: 'white',
                  letterSpacing: 0.1,
                }}
                contentStyle={{
                  justifyContent: 'center',
                }}
              >
                Block
              </Button>
              <Button
                uppercase={false}
                style={{
                  marginLeft: 12,
                  width: '35%',
                  backgroundColor: '#4582C3',
                }}
                labelStyle={{
                  fontSize: 16,
                  color: 'white',
                  letterSpacing: 0.1,
                }}
                contentStyle={{
                  justifyContent: 'center',
                }}
                onPress={() => {
                  onDismissBlockModal();
                }}
              >
                Cancel
              </Button>
            </View>
          </Modal>
        </Portal>

        <View>
          <Portal>
            <Dialog visible={visible3} onDismiss={hideDialog}>
              <Dialog.Title
                style={{
                  // fontFamily: "Poppins_500Medium",
                  color: 'grey',
                }}
              >
                Warning
              </Dialog.Title>
              <Dialog.Content>
                <Text
                  style={{
                    lineHeight: 20,
                    // fontFamily: "Poppins_400Regular",
                    color: '#4582C3',
                  }}
                >
                  This user is the Co-Lead of this group. Performing this action
                  will remove them as the Group Lead. Continue?
                </Text>
              </Dialog.Content>
              <Dialog.Actions>
                <Button
                  onPress={hideDialog}
                  uppercase={false}
                  color="#4582C3"
                  labelStyle={{
                    // fontFamily: "Poppins_400Regular",
                    color: '#4582C3',
                    fontSize: 16,
                    letterSpacing: 0.1,
                  }}
                >
                  Yes
                </Button>
                <Button
                  onPress={hideDialog}
                  uppercase={false}
                  color="#4582C3"
                  labelStyle={{
                    // fontFamily: "Poppins_400Regular",
                    color: '#4582C3',
                    fontSize: 16,
                    letterSpacing: 0.1,
                  }}
                >
                  No
                </Button>
              </Dialog.Actions>
            </Dialog>
          </Portal>
        </View>

        <Portal>
          <Modal visible={modalProfile} onDismiss={handleCloseProfile}>
            <View style={styles.profileContainer}>
              <TouchableOpacity
                onPress={() => {
                  setmodalProfile(false);
                  navigation.navigate('ViewImage', {
                    url: `${BASE_URL}/${groupState?.groupPic}`,
                    message: '',
                  });
                }}
              >
                <Text style={styles.profileTitle}>See group picture</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handlePick}>
                <Text style={styles.profileTitle}>Update group picture</Text>
              </TouchableOpacity>
            </View>
          </Modal>
        </Portal>
      </ScrollView>
    </View>
  );
}

export default GroupSettings;

const styles = StyleSheet.create({
  body: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  // use this attribute with View to create a new row
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnNormal: {
    backgroundColor: Color.Blue,
  },
  btnPress: {
    backgroundColor: 'grey',
  },
  groupLevel: {
    fontFamily: 'Roboto_600SemiBold',
    color: Color.Blue,
    fontSize: 16,
  },
  profileContainer: {
    backgroundColor: Color.White,
    width: scale(300),
    alignSelf: 'center',
    borderRadius: scale(8),
    paddingHorizontal: scale(14),
    paddingVertical: scale(10),
  },
  profileTitle: {
    fontFamily: 'Roboto_500Medium',
    fontSize: scale(14),
    paddingVertical: scale(8),
  },
  updateContiner: {
    backgroundColor: Color.Blue,
    paddingHorizontal: scale(12),
    paddingVertical: scale(4),
    borderRadius: scale(4),
    marginHorizontal: scale(6),
  },
  updateTitle: {
    color: Color.White,
    fontFamily: 'Roboto_500Medium',
    fontSize: scale(13),
  },
  memberListContainer: {
    width: screenWidth * 0.9,
    alignItems: 'flex-start',
    gap: 6,
    marginVertical: '1%',
    paddingVertical: '1%',
  },
  memberRow: {
    width: '100%',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
