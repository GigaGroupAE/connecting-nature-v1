import {
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import Color from '../../../assets/colors/Color';
import HeaderNormal from '../../components/HeaderNormal';
import { useNavigation } from '@react-navigation/native';
import { BASE_URL } from '../../../CONSTANTS';
import { screenHeight, screenWidth } from '../../utils/ScreenDimensions';
import {
  buttonTitle,
  container,
  descriptionTextStyle,
  buttonContainer,
  modalTitle,
} from '../Decorations/ModalStyle';
import { MaterialIcons, Entypo } from 'react-native-vector-icons';
import FileSvg from '../../components/SVG/FIleSvg';
import StarSvg from '../../components/SVG/Star';
import PropertySvg from '../../components/SVG/Property';
import WinerSvg from '../../components/SVG/Winner';
import AddparticipantsSvg from '../../components/SVG/AddParticipant';
import ArrowLeft from '../../components/SVG/ArrowLeft';
import { useUserState } from '../../slices/userSlice';
import AddPropertyModal from '../../components/AddPropertyModal';
import { axiosInstance } from '../../../axiosInstance';
import { useStateContext } from '../../contexts/ContextProvider';
import { useQuery } from 'react-query';
import {
  fetchChannels,
  handleRemoveSubscriber,
} from '../../utils/BiddingChannel';
import { Modal, Portal } from 'react-native-paper';
import WinAnnouncSettings from '../../components/WinAnnouncSettings';
import SubscriptionSvg from '../../components/SVG/SubscriptionSvg';

// const settingData = [
//   {
//     id: 1,
//     title: 'Archived Biddings',
//     icon: <FileSvg />,
//     navigationScreen: 'ArchivedBidding',
//   },
//   {
//     id: 2,
//     title: 'Starred Messages',
//     icon: <StarSvg />,
//     navigationScreen: '',
//   },
//   {
//     id: 3,
//     title: 'Add Property',
//     icon: <PropertySvg />,
//     navigationScreen: '',
//   },
//   {
//     id: 4,

//     navigationScreen: '',
//     title: 'Requests Add Property',
//     icon: <PropertySvg />,
//   },
//   {
//     id: 5,
//     title: 'Subscription Requests',
//     icon: <SubscriptionSvg />,
//     navigationScreen: '',
//   },
//   {
//     id: 6,
//     title: 'Announce Winner',
//     icon: <WinerSvg />,
//     navigationScreen: '',
//   },
//   {
//     id: 7,
//     title: 'Add Participant',
//     icon: <AddparticipantsSvg />,
//     navigationScreen: '',
//   },
// ];

const approvedRoles = ['Owner', 'Lead'];

const ChannalSetting = () => {
  const { navigate } = useNavigation();

  const userState = useUserState();
  const { showSnackbar } = useStateContext();
  const [removeModal, setremoveModal] = useState(false);
  const [removememberDetails, setremovememberDetails] = useState(null);
  const [currentMember, setcurrentMember] = useState([]);
  const [isWinningModal, setisWinningModal] = useState(false);

  const {
    data: groupData = [],
    refetch,
    isLoading,
  } = useQuery('channal', fetchChannels);

  const admin = groupData[0]?.members?.filter(
    (item) => item?.privilege === 'Owner',
  );

  // const [groupData, setgroupData] = useState(params?.groupData);
  const [isAddProperty, setisAddProperty] = useState(false);

  // const handleNavigation = (item) => {
  //   if (item?.title === 'Archived Biddings') {
  //     navigate(item?.navigationScreen);
  //   } else if (item?.title === 'Add Property') {
  //     setisAddProperty(true);
  //   } else if (item?.title === 'Add Participant') {
  //     navigate('MultiContactSelect', {
  //       selectedContacts: selectedcontacts,
  //       currentMembers: groupData[0]?.members,
  //     });
  //   } else if (item?.title === 'Subscription Requests') {
  //     navigate('subscriptionReq');
  //   } else if (item?.title === 'Announce Winner') {
  //     setisWinningModal(true);
  //   } else if (item?.title === 'Requests Add Property') {
  //     navigate('requestAddProperty');
  //   }
  // };

  const selectedcontacts = async (members) => {
    const generateRandomCode = () => {
      const min = 100000;
      const max = 999999;
      return Math.floor(Math.random() * (max - min + 1)) + min;
    };

    const prefix = 'GB';
    const generateUniqueCode = (usedCodes) => {
      let code;
      do {
        code = prefix + generateRandomCode();
      } while (usedCodes.has(code));
      return code;
    };

    const usedCodes = new Set();
    const getIdFromMembers = members.map((m) => {
      const code = generateUniqueCode(usedCodes);
      usedCodes.add(code);
      return {
        member: m._id,
        privilege: m.privilege,
        code: code,
      };
    });

    const getIdFromExistingMembers = groupData[0]?.members?.map((m) => {
      return {
        member: m.member._id,
        privilege: m.privilege,
        code: m.code,
      };
    });
    const tempmembers = [...getIdFromExistingMembers, ...getIdFromMembers];

    try {
      await axiosInstance.patch(`/bidChannel/add-member/${groupData[0]?._id}`, {
        members: tempmembers,
      });
      refetch();
      showSnackbar('Members Added Successfully');
    } catch {}
  };

  const handleRemoveModal = (item) => {
    setremoveModal(true);
    setremovememberDetails(item);
  };

  const handleRemoveMember = async () => {
    try {
      await handleRemoveSubscriber(
        groupData[0]?._id,
        removememberDetails?._id,
        removememberDetails?.member?._id,
      );
      showSnackbar('Subscriber removed successfully');
      refetch();
      setremoveModal(false);
    } catch {}
  };

  useEffect(() => {
    if (groupData) {
      const user = groupData[0]?.members?.filter(
        (item) => item?.member?.phoneNumber === userState?.phoneNumber,
      );
      setcurrentMember(user);
    }
  }, []);

  return (
    <View style={styles.container}>
      <HeaderNormal title="Channel Settings" />
      {/* Header  */}
      <View style={styles.header}>
        <Image
          source={{ uri: `${BASE_URL}/images/${groupData[0]?.groupPic}` }}
          style={styles.profileImage}
        />
        <View style={{ gap: 4 }}>
          <View style={styles.rowContainer}>
            <Text style={buttonTitle}>{groupData[0]?.title}</Text>
            {currentMember[0]?.privilege !== 'member' && (
              <MaterialIcons name="edit" style={styles.icon} />
            )}
          </View>
          <View style={styles.rowContainer}>
            <Text style={styles.title}>{admin[0]?.member?.fullName}</Text>
            <Text style={styles.title}>. Admin</Text>
          </View>
        </View>
      </View>
      <ScrollView
        style={{
          flex: 1,
          width: '92%',
          alignSelf: 'center',
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Navigation Screens  */}

        <View>
          {/* <FlatList
            data={settingData}
            renderItem={({ item }) => {
              // Determine whether to show all fields or limited fields based on user's privilege
              const showAllFields = currentMember[0]?.privilege !== 'member';
              const allowedFieldsForMember = [
                'Archived Biddings',
                'Add Property',
                'Starred Messages',
              ];

              // Check if the current item should be rendered based on user's privilege
              if (
                showAllFields ||
                allowedFieldsForMember.includes(item.title)
              ) {
                return ( */}
          <View
            style={{
              marginVertical: screenHeight * 0.02,
            }}
          >
            <TouchableOpacity
              style={styles.menuContainer}
              onPress={() => navigate('ArchivedBidding')}
            >
              <View
                style={{
                  ...styles.rowContainer,
                  gap: 13,
                  marginVertical: screenHeight * 0.015,
                }}
              >
                <FileSvg />
                <Text style={styles.itemname}>Archived Biddings </Text>
              </View>
              <View>
                <ArrowLeft />
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.menuContainer}
              // onPress={() => handleNavigation(item)}
            >
              <View
                style={{
                  ...styles.rowContainer,
                  gap: 13,
                  marginVertical: screenHeight * 0.015,
                }}
              >
                <StarSvg />
                <Text style={styles.itemname}>Starred Message </Text>
              </View>
              <View>
                <ArrowLeft />
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.menuContainer}
              onPress={() => setisAddProperty(true)}
            >
              <View
                style={{
                  ...styles.rowContainer,
                  gap: 13,
                  marginVertical: screenHeight * 0.015,
                }}
              >
                <PropertySvg />
                <Text style={styles.itemname}>Add Property</Text>
              </View>
              <View>
                <ArrowLeft />
              </View>
            </TouchableOpacity>

            {currentMember[0]?.privilege !== 'member' && (
              <View>
                <TouchableOpacity
                  style={styles.menuContainer}
                  onPress={() => navigate('requestAddProperty')}
                >
                  <View
                    style={{
                      ...styles.rowContainer,
                      gap: 13,
                      marginVertical: screenHeight * 0.015,
                    }}
                  >
                    <PropertySvg />
                    <Text style={styles.itemname}>Requests Add Property</Text>
                  </View>
                  <View>
                    <ArrowLeft />
                  </View>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.menuContainer}
                  onPress={() => navigate('subscriptionReq')}
                >
                  <View
                    style={{
                      ...styles.rowContainer,
                      gap: 13,
                      marginVertical: screenHeight * 0.015,
                    }}
                  >
                    <SubscriptionSvg />
                    <Text style={styles.itemname}>Subscription Requests</Text>
                  </View>
                  <View>
                    <ArrowLeft />
                  </View>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.menuContainer}
                  onPress={() => setisWinningModal(true)}
                >
                  <View
                    style={{
                      ...styles.rowContainer,
                      gap: 13,
                      marginVertical: screenHeight * 0.015,
                    }}
                  >
                    <WinerSvg />
                    <Text style={styles.itemname}>Announce Winner</Text>
                  </View>
                  <View>
                    <ArrowLeft />
                  </View>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.menuContainer}
                  onPress={() =>
                    navigate('MultiContactSelect', {
                      selectedContacts: selectedcontacts,
                      currentMembers: groupData[0]?.members,
                    })
                  }
                >
                  <View
                    style={{
                      ...styles.rowContainer,
                      gap: 13,
                      marginVertical: screenHeight * 0.015,
                    }}
                  >
                    <AddparticipantsSvg />
                    <Text style={styles.itemname}>Add Participant</Text>
                  </View>
                  <View>
                    <ArrowLeft />
                  </View>
                </TouchableOpacity>
              </View>
            )}
          </View>
          {/* );
              } else {
                return null;
              }
            }}
            contentContainerStyle={{
              marginVertical: screenHeight * 0.025,
              gap: 30,
              // ...(settingData.length === 0 && { gap: 16 }), // Remove gap if there are no items to render
            }}
          /> */}
        </View>

        {/* Members Details  */}

        <View style={styles.menuContainer}>
          <Text style={styles.itemname}>GROUP MEMBERS</Text>
          <View style={styles.membersContainer}>
            <Text style={styles.regularText}>
              {groupData[0]?.members?.length} Members
            </Text>
          </View>
        </View>
        {currentMember[0]?.privilege !== 'member' && (
          <View>
            <FlatList
              data={groupData[0]?.members}
              renderItem={({ item }) => {
                const role = approvedRoles.includes(item?.privilege);

                return (
                  <View style={styles.memberContainer}>
                    <View style={styles.rowContainer}>
                      <Image
                        source={{
                          uri: `${BASE_URL}/images/${item?.member?.profile}`,
                        }}
                        style={styles.profileImage}
                      />
                      <View style={{ gap: 4 }}>
                        <View style={styles.rowContainer}>
                          <Text style={styles.username}>
                            {item?.member?.phoneNumber ===
                            userState?.phoneNumber
                              ? 'You'
                              : item?.member?.fullName}
                          </Text>

                          {role && (
                            <View style={styles.rowContainer}>
                              <Entypo name="dot-single" />

                              <Text style={styles.regularText}>
                                {item?.privilege}
                              </Text>
                            </View>
                          )}
                        </View>
                      </View>
                    </View>

                    <TouchableOpacity onPress={() => handleRemoveModal(item)}>
                      {item?.privilege !== 'Owner' &&
                        currentMember[0]?.privilege !== 'member' && (
                          <Text
                            style={{ ...styles.username, color: Color.Black }}
                          >
                            Remove
                          </Text>
                        )}
                    </TouchableOpacity>
                  </View>
                );
              }}
              contentContainerStyle={{
                gap: 12,
                marginVertical: screenHeight * 0.02,
              }}
            />
          </View>
        )}
      </ScrollView>
      {!isLoading && (
        <AddPropertyModal
          isVisible={isAddProperty}
          setisVisible={setisAddProperty}
          item={groupData}
          screen="setting"
          currentMember={currentMember}
        />
      )}

      <Portal>
        <Modal visible={removeModal} onDismiss={() => setremoveModal(false)}>
          <View style={{ ...container }}>
            <Text style={modalTitle}>Remove Member</Text>
            <View style={{ width: '92%' }}>
              <Text style={descriptionTextStyle}>
                Are you sure you want to remove this member? Removed members
                cannot re-enter the group without resubscribing to the channel.
              </Text>

              <View style={styles.detailsContainer}>
                <TouchableOpacity
                  style={{ ...buttonContainer, width: '48%', marginTop: 0 }}
                  onPress={handleRemoveMember}
                >
                  <Text style={buttonTitle}>Remove</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={{
                    ...buttonContainer,
                    width: '48%',
                    marginTop: 0,
                    backgroundColor: Color.White,
                    borderWidth: 1,
                  }}
                  onPress={() => setremoveModal(false)}
                >
                  <Text style={{ ...buttonTitle, color: Color.Black }}>
                    Discard
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </Portal>

      {isWinningModal && (
        <WinAnnouncSettings
          modalVisible={isWinningModal}
          setModalVisible={setisWinningModal}
        />
      )}
    </View>
  );
};

export default ChannalSetting;

const styles = StyleSheet.create({
  container: {
    backgroundColor: Color.White,
    flex: 1,
  },
  header: {
    backgroundColor: Color.Blue,
    flexDirection: 'row',
    paddingVertical: screenHeight * 0.018,
    paddingHorizontal: screenWidth * 0.025,
    alignItems: 'center',
    gap: 10,
  },
  profileImage: {
    width: 56,
    height: 55,
    borderRadius: 28,
    resizeMode: 'cover',
  },
  title: {
    fontFamily: 'Roboto_500Medium',
    color: Color.White,
    fontSize: screenHeight * 0.016,
  },
  rowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  icon: {
    color: Color.White,
    fontSize: screenHeight * 0.019,
    paddingLeft: screenWidth * 0.02,
  },
  menuContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  itemname: {
    fontFamily: 'Roboto_500Medium',
    fontSize: screenHeight * 0.017,
  },
  regularText: {
    fontFamily: 'Poppins_400Regular',
    fontSize: screenHeight * 0.014,
  },
  membersContainer: {
    backgroundColor: Color.Disable,
    paddingHorizontal: screenWidth * 0.03,
    paddingVertical: screenHeight * 0.006,
    borderRadius: screenHeight * 0.01,
  },
  memberContainer: {
    backgroundColor: Color.Disable,
    paddingVertical: screenHeight * 0.01,
    paddingHorizontal: screenWidth * 0.02,
    borderRadius: screenHeight * 0.01,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    justifyContent: 'space-between',
  },
  username: {
    fontFamily: 'Poppins_500Medium',
    color: Color.Grey,
    fontWeight: '900',
    fontSize: screenHeight * 0.017,
  },
  detailsContainer: {
    flexDirection: 'row',
    gap: 15,
    alignItems: 'center',
    marginVertical: screenHeight * 0.009,
    position: 'relative',
    top: screenHeight * 0.012,
  },
});
