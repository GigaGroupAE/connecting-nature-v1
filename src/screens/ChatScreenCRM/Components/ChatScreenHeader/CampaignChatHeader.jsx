import React, { useState } from 'react';
import {
  Dimensions,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  TextInput,
} from 'react-native';
import { Modal, Portal } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { Entypo, AntDesign } from 'react-native-vector-icons';
// import { View } from "react-native-animatable";
import { useUserState } from '../../../../slices/userSlice';
import { BASE_URL } from '../../../../../CONSTANTS';
import Color from '../../../../../assets/colors/Color';
import { useStateContext } from '../../../../contexts/ContextProvider.js';
import { axiosInstance } from '../../../../../axiosInstance';
import Members from '../../../DoDay/Members/Members';
import { scale } from 'react-native-size-matters';

const Height = Dimensions.get('screen').height;
const Width = Dimensions.get('screen').width;

//TODO :: ADD ROLES HERE
const ALLOWED_ROLES = ['Owner', 'Lead', 'Co-Lead'];

const CampaignChatHeader = ({
  sendNotificationMessage,
  socket,
  handleShowInput,
}) => {
  const {
    group,
    showSnackbar,
    setLoading,
    activeCampaign,
    setActiveCampaign,
    showmembers,
    setShowMembers,
    currentUserprivilege,
  } = useStateContext();
  const userState = useUserState();
  const navigation = useNavigation();
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [isExtendTime, setisExtendTime] = useState(false);
  const [date, setDate] = useState('');

  const isCurrentUserAllowed = ALLOWED_ROLES.includes(currentUserprivilege);

  const minimumDate = new Date();

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };
  const UserList = () => {
    navigation.navigate('UserList');
    setModalVisible(false);
  };

  const showTeam = () => {
    navigation.navigate('TeamVolunteers');
    setModalVisible(false);
  };
  const showCheckList = () => {
    navigation.navigate('CheckList', { sendNotificationMessage });
    setModalVisible(false);
  };

  const initiateDodayHandler = async () => {
    try {
      setLoading(true);
      const { data } = await axiosInstance.patch(
        `/campaigns/initiate-campaign/${group._id}`,
      );
      if (data.success) {
        setActiveCampaign(data.campaign);
        sendNotificationMessage({ heading: 'All tasks completed' });
        sendNotificationMessage({
          heading: `Do-Day Initiated by ${userState.fullName}`,
        });
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      showSnackbar(error?.response?.data?.message);
    }
  };
  const executeDodayHandler = async () => {
    try {
      setLoading(true);
      const { data } = await axiosInstance.patch(
        `/campaigns/execute-campaign/${activeCampaign._id}`,
      );
      if (data.success) {
        setActiveCampaign(data.campaign);
        sendNotificationMessage({
          heading: `Do-Day Executed by ${userState.fullName}`,
        });
      }
      setLoading(false);
    } catch (error) {
      showSnackbar(error?.response?.data?.message);
      setLoading(false);
    }
  };
  const handleUpdate = async () => {
    setLoading(true);

    try {
      const { data } = await axiosInstance.patch(
        `/campaigns//updateTime/${activeCampaign._id}`,
        { endTime: date },
      );
      setLoading(false);
      if (data?.campaign?.status === 'archived') {
        setisExtendTime(false);
        showSnackbar(
          "Oops! It looks like your campaign has already ended. Let's plan the next one!",
        );
      } else {
        setisExtendTime(false);
        showSnackbar(
          'Your campaign has been extended. Keep up the great work!',
        );
      }
    } catch (error) {
      setLoading(false);
    }
  };
  const hanldeDoDay = () => {
    navigation.navigate('DoDayPortal');
    setModalVisible(false);
  };
  const hanldeMember = () => {
    setShowMembers(true);
    setModalVisible(false);
  };

  const handleClick = () => {
    handleShowInput(true);
  };

  const handleHideModal = () => {
    setModalVisible(false);
  };

  const handleConfirm = (date) => {
    setDate(date);
    hideDatePicker();
  };

  const handleGroupSetting = () => {
    navigation.navigate('GroupSettings', {
      groupState: {
        title: group?.title,
        groupPic: group?.groupPic,
        members: group.members,
        type: group.type,
        groupId: group._id,
      },
    });
  };

  const handleExtendTime = () => {
    setModalVisible(false);

    setisExtendTime(true);
  };
  const hideExtendTime = () => {
    setisExtendTime(false);
  };
  const handleCampaignSetting = () => {
    if (isCurrentUserAllowed) {
      setModalVisible(true);
    }
  };
  return (
    <View>
      <View style={styles.container}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <AntDesign name="left" size={22} color={Color.White} />
        </TouchableOpacity>
        <View style={{ marginLeft: Width * 0.018 }}>
          <Image
            style={styles.userImg}
            source={{ uri: `${BASE_URL}/images/${group.groupPic}` }}
          />
        </View>
        <TouchableOpacity
          style={{
            flex: 1,
            marginLeft: Width * 0.02,
            gap: 4,
          }}
          onPress={handleGroupSetting}
        >
          <Text style={styles.title}>{group?.title}</Text>

          <Text style={styles.role}>{group?.members?.length} members</Text>
        </TouchableOpacity>
        <View
          style={{
            flexDirection: 'row',
            flex: 0.3,
            justifyContent: 'space-between',
          }}
        >
          <Pressable
            onPress={() => handleClick()}
            // android_ripple={{ color: Color.LightGrey, borderless: true }}
          >
            <AntDesign name="search1" size={22} color={Color.White} />
          </Pressable>
          <View>
            <Entypo
              name="dots-three-vertical"
              size={20}
              color={Color.White}
              onPress={handleCampaignSetting}
            />
            <Portal>
              <Modal
                animationType="fade"
                transparent
                visible={modalVisible}
                onRequestClose={() => {
                  setModalVisible(!modalVisible);
                }}
                onDismiss={handleHideModal}
              >
                <View
                  style={{
                    backgroundColor: Color.White,
                    position: 'relative',
                    width: Width * 0.55,
                    paddingVertical: Height * 0.017,
                    paddingHorizontal: Width * 0.042,
                    borderRadius: Height * 0.01,
                    right: scale(-130),
                    top: scale(-220),
                  }}
                >
                  {isCurrentUserAllowed && (
                    <TouchableOpacity onPress={() => UserList()}>
                      <Text style={styles.ModelTitile}>User List</Text>
                    </TouchableOpacity>
                  )}

                  {isCurrentUserAllowed && (
                    <TouchableOpacity onPress={() => showCheckList()}>
                      <Text style={styles.ModelTitile}>Check List</Text>
                    </TouchableOpacity>
                  )}
                  {
                    //ONLY SHOWING THE INITIATE BUTTON IF THE STATUS OF CAMPAIGN IS PLANNING
                    isCurrentUserAllowed &&
                      activeCampaign?.status === 'planning' && (
                        <TouchableOpacity onPress={initiateDodayHandler}>
                          <Text style={styles.ModelTitile}>
                            Initiate Do-Day
                          </Text>
                        </TouchableOpacity>
                      )
                  }
                  {
                    //ONLY SHOWING THE INITIATE BUTTON IF THE STATUS OF CAMPAIGN IS PLANNING
                    isCurrentUserAllowed &&
                      activeCampaign?.status === 'created' && (
                        <TouchableOpacity onPress={executeDodayHandler}>
                          <Text style={styles.ModelTitile}>Execute Do-Day</Text>
                        </TouchableOpacity>
                      )
                  }
                  {/* {isCurrentUserAllowed && (
                  <TouchableOpacity
                    onPress={() => navigation.navigate("DoDayPortal")}
                  >
                    <Text style={styles.ModelTitile}>
                      Assign Bucket Managert
                    </Text>
                  </TouchableOpacity>
                )} */}

                  {
                    //ONLY SHOWING PORTAL OPTION IF STATUS OF CAMPAIGN IS EXECUTED
                    isCurrentUserAllowed &&
                      activeCampaign?.status === 'executed' && (
                        <TouchableOpacity onPress={() => hanldeDoDay()}>
                          <Text style={styles.ModelTitile}>Do-Day Portal</Text>
                        </TouchableOpacity>
                      )
                  }
                  {
                    //ONLY SHOWING THE TEAMS BUTTON IF THE STATUS OF THE CAMPAIGN IS NOT PLANNING
                    isCurrentUserAllowed &&
                      activeCampaign?.status !== 'planning' && (
                        <TouchableOpacity onPress={() => showTeam()}>
                          <Text style={styles.ModelTitile}>Teams</Text>
                        </TouchableOpacity>
                      )
                  }
                  {isCurrentUserAllowed && (
                    <TouchableOpacity onPress={() => hanldeMember()}>
                      <Text style={styles.ModelTitile}>Members</Text>
                    </TouchableOpacity>
                  )}

                  {isCurrentUserAllowed && (
                    <TouchableOpacity onPress={handleExtendTime}>
                      <Text style={styles.ModelTitile}>Extend Time </Text>
                    </TouchableOpacity>
                  )}
                </View>
              </Modal>
            </Portal>
            {showmembers && (
              <View>
                <Members
                  group={group}
                  hideModal={setShowMembers}
                  showmembers={showmembers}
                />
              </View>
            )}
            <Portal>
              <Modal
                visible={isExtendTime}
                onDismiss={hideExtendTime}
                style={{ flex: 1 }}
              >
                <View style={styles.extendTime}>
                  <Text style={styles.timeTile}>Extend Your Campaign Time</Text>
                  <Pressable
                    onPress={showDatePicker}
                    style={styles.mainContainer}
                  >
                    <TextInput
                      placeholder="End Date"
                      onChangeText={setDate}
                      value={date.toLocaleString()}
                      editable={false}
                      style={styles.timeInput}
                    />
                  </Pressable>
                  <TouchableOpacity
                    style={styles.extendButton}
                    onPress={handleUpdate}
                  >
                    <Text style={styles.timeButton}>Extend Time</Text>
                  </TouchableOpacity>
                </View>
              </Modal>
            </Portal>
            <DateTimePickerModal
              isVisible={isDatePickerVisible}
              mode="datetime"
              onConfirm={handleConfirm}
              onCancel={hideDatePicker}
              minimumDate={minimumDate}
            />
          </View>
        </View>
      </View>
    </View>
  );
};

export default CampaignChatHeader;

const styles = StyleSheet.create({
  container: {
    backgroundColor: Color.Blue,
    alignContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: 17,
    paddingVertical: 10,
    borderBottomWidth: 2,
    borderColor: Color.VeryLightGrey,
    justifyContent: 'space-between',
  },
  title: {
    fontFamily: 'Roboto_600SemiBold',
    fontWeight: '600',
    color: Color.White,
    fontSize: Height * 0.021,
  },
  role: {
    fontFamily: 'Roboto_500Medium',
    fontWeight: '400',
    color: Color.White,
    fontSize: Height * 0.015,
  },
  userImg: {
    width: 55,
    height: 55,
    borderRadius: Height * 0.1,
    resizeMode: 'contain',
  },
  ModelTitile: {
    fontSize: Height * 0.018,
    fontFamily: 'Roboto_500Medium',
    fontWeight: '500',
    marginVertical: Height * 0.007,
  },
  extendTime: {
    backgroundColor: 'white',
    width: '90%',
    alignSelf: 'center',
    borderRadius: scale(14),
    alignItems: 'center',
    paddingVertical: scale(12),
  },
  timeTile: {
    fontFamily: 'Roboto_500Medium',
    fontSize: scale(14),
  },
  timeInput: {
    fontFamily: 'Roboto_500Medium',
    paddingHorizontal: scale(10),
  },
  mainContainer: {
    backgroundColor: Color.White,
    borderRadius: 8,
    shadowColor: Color.Grey,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
    elevation: 3,
    zIndex: 100,
    position: 'relative',
    width: '90%',
    paddingVertical: scale(8),
    marginVertical: scale(10),
  },
  extendButton: {
    backgroundColor: Color.Blue,
    width: '50%',
    alignItems: 'center',
    marginVertical: scale(5),
    borderRadius: scale(8),
  },
  timeButton: {
    paddingVertical: scale(8),
    fontFamily: 'Roboto_500Medium',
    color: Color.White,
    fontSize: scale(14),
  },
});
