import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Pressable,
  ScrollView,
} from 'react-native';
import React, { useState } from 'react';
import { BASE_URL } from '../../CONSTANTS';
import { screenHeight, screenWidth } from '../utils/ScreenDimensions';
import Color from '../../assets/colors/Color';
import { Modal, Portal } from 'react-native-paper';
import { Image } from 'expo-image';
import { axiosInstance } from '../../axiosInstance';
import { useStateContext } from '../contexts/ContextProvider';
import {
  buttonTitle,
  container,
  modalTitle,
  buttonContainer,
} from '../screens/Decorations/ModalStyle';
import InputTextLarge from './InputTextLarge';

const VerificationUsersDetials = ({ item, refetch }) => {
  const [isViewUser, setisViewUser] = useState(false);
  const [isDecline, setisDecline] = useState(false);
  const [description, setDescription] = useState('');
  const [userData, setuserData] = useState(null);
  const { showSnackbar } = useStateContext();

  const hideViewModal = () => {
    setisViewUser(false);
  };

  const handleApprove = async (item) => {
    const data = {
      newUserType: item?.requestedRole,
      token: item?.user?.expoPushToken,
    };
    try {
      await axiosInstance.patch(
        `/upgradeRequests/approveRequest/${item?._id}`,
        { data },
      );
      refetch();
      showSnackbar('Account Upgrade Request Approved Successfully');
    } catch {}
  };

  const handleReject = async () => {
    try {
      await axiosInstance.patch(
        `/upgradeRequests/declineRequest/${userData?._id}`,
        {
          declinedReason: description,
        },
      );
      refetch();
      showSnackbar('Account Upgrade Request Denied Successfully');
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Pressable onPress={() => setisViewUser(true)} style={styles.container}>
      <View style={styles.leftContainer}>
        <Image
          source={{ uri: `${item?.user?.profile}` }}
          style={styles.userImage}
        />
        <View style={{ gap: 8 }}>
          <Text style={{ ...styles.title, fontSize: screenHeight * 0.018 }}>
            {item?.user?.fullName}
          </Text>
          <View style={styles.roleContainer}>
            <Text style={styles.role}>Requested Role</Text>
            <Text style={styles.title}>{item?.requestedRole}</Text>
          </View>
        </View>
      </View>
      <View style={styles.rightContainer}>
        <TouchableOpacity
          style={styles.buttonContainer}
          onPress={() => handleApprove(item)}
        >
          <Text style={{ ...styles.title, color: Color.White }}>Approve</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.denyButton}
          onPress={() => {
            setisDecline(true);
            setuserData(item);
          }}
        >
          <Text style={styles.title}>Deny</Text>
        </TouchableOpacity>
      </View>
      {isViewUser && (
        <Portal>
          <Modal visible={isViewUser} onDismiss={hideViewModal}>
            <ScrollView
              style={styles.viewUserModal}
              showsVerticalScrollIndicator={false}
            >
              <View
                style={{
                  width: '95%',
                  alignSelf: 'center',
                  gap: 10,
                  marginVertical: screenHeight * 0.02,
                }}
              >
                <View style={styles.contentContainer}>
                  <Text style={styles.label}>Full Name:</Text>
                  <Text style={styles.item}>{item?.fullName}</Text>
                </View>

                <View style={styles.contentContainer}>
                  <Text style={styles.label}>Phone Number:</Text>
                  <Text style={styles.item}>{item?.phoneNumber}</Text>
                </View>

                <View style={styles.contentContainer}>
                  <Text style={styles.label}>Email:</Text>
                  <Text style={styles.item}>{item?.email}</Text>
                </View>
                {item?.about && (
                  <View style={styles.contentContainer}>
                    <Text style={styles.label}>About:</Text>
                    <Text style={styles.item}>{item?.about}</Text>
                  </View>
                )}
                {item?.website && (
                  <View style={styles.contentContainer}>
                    <Text style={styles.label}>Website:</Text>
                    <Text style={styles.item}>{item?.website}</Text>
                  </View>
                )}
                {item?.social && (
                  <View style={styles.contentContainer}>
                    <Text style={styles.label}>Social Page Link 1:</Text>
                    <Text style={styles.item}>{item?.social}</Text>
                  </View>
                )}
                {item?.socialtwo && (
                  <View style={styles.contentContainer}>
                    <Text style={styles.label}>Social Page Link 2:</Text>
                    <Text style={styles.item}>{item?.socialtwo}</Text>
                  </View>
                )}
                {item?.skype && (
                  <View style={styles.contentContainer}>
                    <Text style={styles.label}>Skype :</Text>
                    <Text style={styles.item}>{item?.skype}</Text>
                  </View>
                )}
                {item?.address && (
                  <View style={styles.contentContainer}>
                    <Text style={styles.label}>Address 1:</Text>
                    <Text style={styles.item}>{item?.address}</Text>
                  </View>
                )}
                {item?.addresstwo && (
                  <View style={styles.contentContainer}>
                    <Text style={styles.label}>Address 2:</Text>
                    <Text style={styles.item}>{item?.addresstwo}</Text>
                  </View>
                )}
                {item?.postal && (
                  <View style={styles.contentContainer}>
                    <Text style={styles.label}>Postal Code</Text>
                    <Text style={styles.item}>{item?.postal}</Text>
                  </View>
                )}
                {item?.country && (
                  <View style={styles.contentContainer}>
                    <Text style={styles.label}>Country</Text>
                    <Text style={styles.item}>{item?.country}</Text>
                  </View>
                )}

                {item?.orgType && (
                  <View style={styles.contentContainer}>
                    <Text style={styles.label}>Organization Type</Text>
                    <Text style={styles.item}>{item?.orgType}</Text>
                  </View>
                )}

                {item?.department && (
                  <View style={styles.contentContainer}>
                    <Text style={styles.label}>Department</Text>
                    <Text style={styles.item}>{item?.department}</Text>
                  </View>
                )}

                {item?.designation && (
                  <View style={styles.contentContainer}>
                    <Text style={styles.label}>Designation</Text>
                    <Text style={styles.item}>{item?.designation}</Text>
                  </View>
                )}

                {item?.employid && (
                  <View style={styles.contentContainer}>
                    <Text style={styles.label}>Employee ID No.</Text>
                    <Text style={styles.item}>{item?.employid}</Text>
                  </View>
                )}

                {item?.companyName && (
                  <View style={styles.contentContainer}>
                    <Text style={styles.label}>Company Name</Text>
                    <Text style={styles.item}>{item?.companyName}</Text>
                  </View>
                )}

                {item?.companyAddress && (
                  <View style={styles.contentContainer}>
                    <Text style={styles.label}>Company Address</Text>
                    <Text style={styles.item}>{item?.companyAddress}</Text>
                  </View>
                )}

                {item?.companyCity && (
                  <View style={styles.contentContainer}>
                    <Text style={styles.label}>Company City</Text>
                    <Text style={styles.item}>{item?.companyCity}</Text>
                  </View>
                )}

                {item?.utililtyBill && (
                  <View
                    style={{
                      ...styles.contentContainer,
                      flexDirection: 'column',
                    }}
                  >
                    <Text style={styles.label}>Utililty Bill</Text>
                    <Image
                      source={{
                        uri: `${item?.utililtyBill}`,
                      }}
                      style={styles.image}
                      contentFit="cover"
                    />
                  </View>
                )}

                {item?.cnicFront && (
                  <View
                    style={{
                      ...styles.contentContainer,
                      flexDirection: 'column',
                    }}
                  >
                    <Text style={styles.label}>CNIC Front</Text>
                    <Image
                      source={{ uri: `${item?.cnicFront}` }}
                      style={styles.image}
                      contentFit="cover"
                    />
                  </View>
                )}
                {item?.cnicBack && (
                  <View
                    style={{
                      ...styles.contentContainer,
                      flexDirection: 'column',
                    }}
                  >
                    <Text style={styles.label}>CNIC Back</Text>
                    <Image
                      source={{ uri: `${item?.cnicBack}` }}
                      style={styles.image}
                      contentFit="cover"
                    />
                  </View>
                )}
              </View>
            </ScrollView>
          </Modal>
        </Portal>
      )}

      <Portal>
        <Modal visible={isDecline} onDismiss={() => setisDecline(false)}>
          <View style={container}>
            <Text style={modalTitle}>Deny Reason</Text>
            <View style={{ width: '92%' }}>
              <InputTextLarge
                title="Description"
                onchange={setDescription}
                value={description}
              />

              <TouchableOpacity
                style={{
                  ...buttonContainer,
                  marginTop: screenHeight * 0.02,
                  width: '100%',
                }}
                onPress={handleReject}
              >
                <Text style={buttonTitle}>Submit</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </Portal>
    </Pressable>
  );
};

export default VerificationUsersDetials;

const styles = StyleSheet.create({
  container: {
    // padding: screenHeight * 0.015,
    borderRadius: 8,
    width: screenWidth * 0.93,
    fontFamily: 'Roboto_500Medium',
    marginTop: 8,
    backgroundColor: Color.White,
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
    alignSelf: 'center',
    flex: 1,
    marginBottom: 2,
    flexDirection: 'row',
    paddingHorizontal: screenWidth * 0.03,
    paddingVertical: screenWidth * 0.025,
  },
  userImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  leftContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 2,
    // backgroundColor: 'red',
  },
  roleContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  title: {
    fontFamily: 'Roboto_700Bold',
    fontSize: screenHeight * 0.013,
  },
  role: {
    fontFamily: 'Roboto_400Regular',
    color: Color.Grey,
    fontSize: screenHeight * 0.013,
  },
  rightContainer: {
    flex: 1,
    // backgroundColor: 'yellow',
    alignItems: 'center',
    gap: 10,
    paddingLeft: screenWidth * 0.12,
  },
  buttonContainer: {
    backgroundColor: Color.Blue,
    paddingHorizontal: screenWidth * 0.05,
    paddingVertical: screenHeight * 0.006,
    borderRadius: 6,
  },
  denyButton: {
    borderWidth: 1,
    paddingHorizontal: screenWidth * 0.074,
    paddingVertical: screenHeight * 0.005,
    borderRadius: 6,
    borderColor: Color.Grey,
  },
  viewUserModal: {
    width: screenWidth * 0.9,
    maxHeight: screenHeight * 0.8,
    backgroundColor: Color.White,
    alignSelf: 'center',
    borderRadius: screenHeight * 0.01,
  },
  contentContainer: {
    width: '95%',
    alignSelf: 'center',
    flexDirection: 'row',
    gap: 20,
    overflow: 'hidden',
  },
  label: {
    fontFamily: 'Poppins_500Medium',
    fontSize: screenHeight * 0.0166,
  },
  item: {
    fontFamily: 'Roboto_500Medium',
    fontSize: screenHeight * 0.016,
    color: Color.DarkGrey,
    width: '80%',
    paddingRight: '4%',
  },
  image: {
    width: screenWidth * 0.8,
    height: screenHeight * 0.2,
    alignSelf: 'center',
    borderRadius: screenHeight * 0.01,
  },
});
