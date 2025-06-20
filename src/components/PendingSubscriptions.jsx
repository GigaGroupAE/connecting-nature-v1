import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useState } from 'react';
import Color from '../../assets/colors/Color';
import { screenHeight, screenWidth } from '../utils/ScreenDimensions';
import {
  buttonTitle,
  titleStyle,
  buttonContainer,
  container,
} from '../screens/Decorations/ModalStyle';
import ShowScriptionDetailsModal from './ShowScriptionDetailsModal';
import { useNavigation } from '@react-navigation/native';
import { axiosInstance } from '../../axiosInstance';
import { Modal, Portal } from 'react-native-paper';
import InputTextLarge from './InputTextLarge';
import { useStateContext } from '../contexts/ContextProvider';
import NoDataIndicater from '../screens/NoDataIndicater';
import { BASE_URL } from '../../CONSTANTS';

const PendingSubscriptions = ({ item, refetch }) => {
  const { navigate } = useNavigation();
  const [isViewReceipt, setisViewReceipt] = useState(false);
  const [receiptData, setreceiptData] = useState(null);
  const [isDenyModal, setisDenyModal] = useState(false);
  const [description, setDescription] = useState('');
  const [rejectUser, setrejectUser] = useState(null);
  const { showSnackbar } = useStateContext();

  const generateRandomCode = () => {
    const min = 100000;
    const max = 999999;
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  // Common prefix for the code
  const prefix = 'GB';

  const handleApprove = async (item) => {
    const code = prefix + generateRandomCode();
    const memberData = {
      member: item?.requestedBy?._id,
      privilege: 'member',
      code: code,
      item: item?._id,
    };
    try {
      const notificationData = {
        user: item?.requestedBy?._id,
        body: {
          user: {
            fullName: 'Connecting Nature', // Change if needed
            expoPushToken: item?.requestedBy?.expoPushToken,
          },
          content: {
            description:
              'Your subscription request has been approved. You are now able to bid on properties.',
          },
        },
        data: {
          title: 'req-approve',
        },
      };
      await axiosInstance.post(
        `/bidChannel/add-crm-notification`,
        notificationData,
      );

      await axiosInstance.post('/bidChannel/approve-subscription', {
        data: memberData,
      });
      refetch();
      showSnackbar('Subscription approved successfully');
    } catch {}
  };

  const handleReject = async () => {
    try {
      // Create rejectReason object
      const rejectReason = {
        id: rejectUser?._id,
        denyingReason: description,
        status: 'rejected',
      };

      // Prepare notification data
      const notificationData = {
        user: rejectUser?.requestedBy?._id,
        body: {
          user: {
            fullName: 'Connecting Nature',
            expoPushToken: rejectUser?.requestedBy?.expoPushToken,
          },
          content: {
            description: description,
          },
        },
        data: {
          title: 'req-denied',
        },
      };

      // Send notification
      await axiosInstance.post(
        `/bidChannel/add-crm-notification`,
        notificationData,
      );

      // Reject subscription
      await axiosInstance.post('/bidChannel/reject-subscription', {
        rejectReason,
      });

      // Reset state and show success message
      setisDenyModal(false);
      setDescription('');
      refetch();
      showSnackbar('Subscription rejected successfully');
    } catch {
      // Handle errors (e.g., show error message to user)
    }
  };

  return (
    <View style={styles.container}>
      {item?.length === 0 ? (
        <View>
          <NoDataIndicater
            title="No Pending Requests"
            subTitle="This section will update with new subscription requests. Stay tuned for updates."
          />
        </View>
      ) : (
        <FlatList
          data={item}
          renderItem={({ item }) => {
            return (
              <View style={styles.itemCard}>
                <View style={styles.contentContainer}>
                  <TouchableOpacity
                    onPress={() =>
                      navigate('UserProfile', {
                        userPhoneNumber: item?.requestedBy?.phoneNumber,
                      })
                    }
                    style={styles.leftContainer}
                  >
                    <Image
                      source={{
                        uri: `${item?.requestedBy?.profile}`,
                      }}
                      style={styles.image}
                    />

                    <View style={{ gap: 3 }}>
                      <Text style={titleStyle}>{item?.fullName}</Text>
                      <Text style={styles.phoneNumber}>
                        {item?.phoneNumber}
                      </Text>
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => {
                      setisViewReceipt(true);
                      setreceiptData(item);
                    }}
                  >
                    <Text style={styles.phoneNumber}>View Receipt</Text>
                  </TouchableOpacity>
                </View>

                <View style={styles.detailsContainer}>
                  <TouchableOpacity
                    style={{
                      ...buttonContainer,
                      width: '48%',
                      marginTop: 0,
                      paddingVertical: screenHeight * 0.007,
                    }}
                    onPress={() => handleApprove(item)}
                  >
                    <Text style={buttonTitle}>Approve</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={{
                      ...buttonContainer,
                      width: '48%',
                      marginTop: 0,
                      backgroundColor: Color.White,
                      borderWidth: 1,
                      paddingVertical: screenHeight * 0.007,
                    }}
                    onPress={() => {
                      setisDenyModal(true);
                      setrejectUser(item);
                    }}
                  >
                    <Text style={{ ...buttonTitle, color: Color.Black }}>
                      Deny
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            );
          }}
        />
      )}
      {isViewReceipt && (
        <ShowScriptionDetailsModal
          isVisible={isViewReceipt}
          setisVisible={setisViewReceipt}
          item={receiptData}
          refetch={refetch}
        />
      )}

      <Portal>
        <Modal visible={isDenyModal} onDismiss={() => setisDenyModal(false)}>
          <View style={container}>
            <Text style={titleStyle}>Deny Reason</Text>
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
    </View>
  );
};

export default PendingSubscriptions;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: Color.White,

    width: screenWidth * 0.92,
    alignSelf: 'center',
  },
  itemCard: {
    borderRadius: 8,
    width: screenWidth * 0.91,
    marginTop: 16,
    backgroundColor: Color.White,
    shadowColor: Color.Grey,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
    elevation: 3,
    zIndex: 1000,
    position: 'relative',
    paddingHorizontal: screenWidth * 0.04,
    paddingVertical: screenHeight * 0.009,
    alignSelf: 'center',
    marginBottom: '0.5%',
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 25,
    resizeMode: 'cover',
    backgroundColor: 'red',
  },
  contentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  leftContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  phoneNumber: {
    fontFamily: 'Roboto_400Regular',
    fontSize: screenHeight * 0.016,
  },
  detailsContainer: {
    flexDirection: 'row',
    gap: 15,
    alignItems: 'center',
    marginVertical: screenHeight * 0.009,
    position: 'relative',
    top: screenHeight * 0.005,
  },
});
