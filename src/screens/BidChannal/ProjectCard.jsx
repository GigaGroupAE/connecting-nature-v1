import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  TextInput,
  FlatList,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import Color from '../../../assets/colors/Color';
import { screenHeight, screenWidth } from '../../utils/ScreenDimensions';
import { BASE_URL } from '../../../CONSTANTS';
import {
  titleStyle,
  buttonTitle,
  buttonContainer,
  container,
  inputstyle,
  descriptionTextStyle,
} from '../Decorations/ModalStyle';
import { useUserState } from '../../slices/userSlice';
import { Modal, Portal } from 'react-native-paper';
import ProjectDetails from '../../components/ProjectDetails';
import { io } from 'socket.io-client';
import { formatSingleDate } from '../../utils/countdown';
import VerifyBlack from '../../components/SVG/VerifyBlack';
import NoDataIndicater from '../NoDataIndicater';
import { updateProjectStatus } from '../../utils/BiddingChannel';
import { useStateContext } from '../../contexts/ContextProvider';
import WinningAnnounModal from '../../components/WinningAnnounModal';
import { axiosInstance } from '../../../axiosInstance';
import SendIcon from '../../components/SVG/SendIcon';
import moment from 'moment';

const ProjectCard = ({ item, currentuser, refetch, groupData }) => {
  const userState = useUserState();
  const date = moment().utcOffset('+05:00');
  const [isBidOpen, setisBidOpen] = useState(false);
  const [selectedItem, setselectedItem] = useState(null);
  const [bidPrice, setbidPrice] = useState('');
  const [socket, setSocket] = useState(null);
  const [bids, setbids] = useState(item?.bids);
  const [isUserBid, setisUserBid] = useState(false);
  const [isEdit, setisEdit] = useState(false);
  const [editItem, seteditItem] = useState(null);
  const { showSnackbar } = useStateContext();
  const [isWinningModal, setisWinningModal] = useState(false);

  const hideModal = () => {
    setisBidOpen(false);
    setisEdit(false);
  };

  const memberToNotify = groupData?.members
    ?.filter((mem) => mem.member.phoneNumber !== userState.phoneNumber) // Filter out members with matching phone numbers
    .map((mem) => mem.member); // Extract only the member objects

  useEffect(() => {
    setbids(item?.bids);
    if (item?.status === 'Starting Soon' || item?.status === 'Closed') {
      setisUserBid(true);
    } else {
      const isUserBit = item?.bids?.some(
        (item) => item?.bidBy[0]?.phoneNumber === userState?.phoneNumber,
      );
      setisUserBid(isUserBit);
    }
  }, [item?.bids, selectedItem]);

  useEffect(() => {
    const mergedArray = item.bids.concat(item.announcement);
    console.log(mergedArray);
    mergedArray.sort((a, b) => {
      const timeA = a.bidTime || a.announcementItem.createdAt;
      const timeB = b.bidTime || b.announcementItem.createdAt;
      return new Date(timeB) - new Date(timeA); // Sort in descending order
    });

    // Update the state with the sorted array
    setbids(mergedArray);

    const newSocket = io(BASE_URL, { auth: { token: userState.token } });
    newSocket.on('receive_bid', (data) => {
      // setbids((prevBids) => {
      //   return [...prevBids, data];
      // });
      refetch();
    });

    newSocket.on('updated_bid', (data) => {
      // setbids((prevBids) => {
      //   const updatedBids = prevBids.filter((bid) => bid._id !== data._id);
      //   return [...updatedBids, data];
      // });
      refetch();
    });

    setSocket(newSocket);
    return () => {
      newSocket.disconnect();
    };
  }, []);

  const handleSubmit = async () => {
    if (isEdit) {
      socket.emit('update_bid', {
        id: editItem?._id,
        newPrice: bidPrice,
      });
      setbidPrice('');
      setisBidOpen(false);
      setisEdit(false);
      seteditItem(null);
      return;
    }
    const bidBy = {
      _id: currentuser?.member?._id,
      fullName: currentuser?.member?.fullName,
      phoneNumber: currentuser?.member?.phoneNumber,
      profile: currentuser?.member?.profile,
      type: currentuser?.member?.type,
      expoPushToken: currentuser?.member?.expoPushToken,
      code: currentuser?.code,
    };
    socket.emit('send_bid', {
      bidBy: bidBy,
      bidOn: selectedItem?._id,
      bidPrice: bidPrice,
    });
    handleGroupNotification();
    setbidPrice('');
    refetch();
    setisBidOpen(false);
  };

  const handleEdit = (item) => {
    seteditItem(item);
    setisEdit(true);
    setisBidOpen(true);
    setselectedItem(item?.bidOn);
    setbidPrice(item?.bidPrice);
  };

  const startedAt = formatSingleDate(date);
  const handleUpdateStatus = async (id, status) => {
    const content = `Bidding has been started ${startedAt}`;
    handleAnnouncement(id, content);
    try {
      const { data } = await updateProjectStatus(id, status);
      showSnackbar(data?.message);
      refetch();
    } catch {}
  };

  const handleClose = (item) => {
    const content = `Bidding has been closed. Winner will be announced soon.`;
    handleAnnouncement(item?._id, content);
    setisWinningModal(true);
    setselectedItem(item);
    if (item?.status !== 'Closed') {
      handleUpdateStatus(item?._id, 'Closed');
    }
  };
  const formattedPrice = Number(item?.price).toLocaleString();

  const handleGroupNotification = async (title) => {
    try {
      const notificationData = {
        user: memberToNotify,
        senderName: currentuser?.code,
        groupTitle: selectedItem?.ProjectName,
      };

      await axiosInstance.post(`/bidChannel/notify-new-bid`, notificationData);
    } catch {}
  };

  const handleAnnouncement = (id, content) => {
    socket.emit('bid_announcement', {
      bidOn: id,
      announcement: content,
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Image
          source={{ uri: `${BASE_URL}/images/${item?.image[0]}` }}
          style={styles.image}
        />
        <View style={styles.titleContainer}>
          <Text style={{ ...titleStyle, fontSize: screenHeight * 0.017 }}>
            {item?.ProjectName}
          </Text>
          <TouchableOpacity style={styles.soonButton}>
            <Text style={styles.subTitle}>{item?.status}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.contentContainer}>
          <View style={styles.descriptionContainer}>
            <Text style={styles.descriptionTitle}>{item?.description}</Text>
          </View>
          <ProjectDetails
            item={item}
            containerStyle={styles.detailsContainer}
          />
        </View>

        <View style={styles.priceContainer}>
          <Text style={{ ...titleStyle, fontSize: screenHeight * 0.015 }}>
            Starting Bidding Price
          </Text>
          <Text style={{ ...titleStyle, fontSize: screenHeight * 0.017 }}>
            {formattedPrice}PKR
          </Text>
        </View>

        {currentuser?.privilege === 'Owner' ? (
          <View style={styles.actionContainer}>
            <TouchableOpacity
              style={
                item?.status === 'Starting Soon'
                  ? styles.activeEdit
                  : styles.disableEdit
              }
            >
              <TouchableOpacity>
                <Text
                  style={
                    item?.status === 'Starting Soon'
                      ? styles.activeEditTitle
                      : styles.disableTitle
                  }
                >
                  Edit
                </Text>
              </TouchableOpacity>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.buttonContainer}
              onPress={() => handleClose(item)}
              disabled={item?.status === 'Starting Soon'}
            >
              <Text
                style={
                  item?.status !== 'Starting Soon'
                    ? styles.activeEditTitle
                    : styles.disableTitle
                }
              >
                {item?.status === 'Closed' ? 'Archive' : 'Closed'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={
                item?.status === 'Starting Soon'
                  ? {
                      ...styles.buttonContainer,
                      backgroundColor: Color.Blue,
                      borderWidth: 0,
                    }
                  : {
                      ...styles.buttonContainer,
                      backgroundColor: Color.VeryLightGrey,
                      borderWidth: 0,
                    }
              }
              onPress={() => handleUpdateStatus(item?._id, 'Started')}
              disabled={item?.status === 'Started' || item?.status === 'Closed'}
            >
              <Text
                style={
                  item?.status === 'Starting Soon'
                    ? {
                        ...buttonTitle,
                        fontSize: screenHeight * 0.017,
                      }
                    : {
                        ...buttonTitle,
                        fontSize: screenHeight * 0.017,
                        color: Color.Grey,
                      }
                }
              >
                Start Bidding
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity
            style={{
              ...buttonContainer,
              width: screenWidth * 0.9,
              marginTop: screenHeight * 0.02,
              backgroundColor: isUserBid ? Color.Disable : Color.Blue,
            }}
            onPress={() => {
              setisBidOpen(true);
              setselectedItem(item);
            }}
            // disabled={
            //   item?.status === 'Starting Soon' || item?.status === 'Closed'
            // }
            disabled={isUserBid}
          >
            <Text style={{ ...titleStyle, color: Color.White }}>Bid Now</Text>
          </TouchableOpacity>
        )}
      </View>

      <View
        style={{
          flex: 1,
          marginTop: screenHeight * 0.01,
        }}
      >
        {item?.status === 'Starting Soon' ? (
          <View
            style={{
              backgroundColor: 'red',
              width: '80%',
              alignSelf: 'center',
            }}
          >
            <NoDataIndicater
              title="Bidding is not started yet"
              subTitle="Don’t worry the bid is starting soon. Once the Admin starts the bid you will be notify OR you can check your notifications. "
            />
          </View>
        ) : (
          <FlatList
            data={bids.slice().reverse()}
            renderItem={({ item }) => {
              let isUserBid;
              if (item?.bidBy) {
                isUserBid =
                  item?.bidBy[0]?.phoneNumber === userState?.phoneNumber;
              }

              const formattedPrice = Number(item?.bidPrice).toLocaleString();
              const time = formatSingleDate(item?.bidTime);

              console.log(item);

              return (
                <View
                  style={{
                    flex: 1,
                    // backgroundColor: 'red',
                    alignItems: isUserBid ? 'flex-end' : 'flex-start',
                    paddingHorizontal: screenWidth * 0.06,
                  }}
                >
                  {item?.announcementItem ? (
                    <View
                      style={{
                        backgroundColor: Color.Disable,
                        width: screenWidth * 0.8,
                        alignSelf: 'center',
                        paddingHorizontal: 10,
                        paddingVertical: 3,
                      }}
                    >
                      <Text style={styles.descriptionTitle}>
                        {item?.announcementItem?.content}
                      </Text>
                    </View>
                  ) : (
                    <View
                      style={{
                        ...styles.bidCard,
                        borderRightWidth: isUserBid ? 3 : 0,
                        borderLeftWidth: !isUserBid ? 3 : 0,
                      }}
                    >
                      {isUserBid ? (
                        <View style={styles.biddIngContainer}>
                          <Text style={titleStyle}>Your Bid</Text>
                          <Text
                            style={{
                              ...titleStyle,
                              fontFamily: 'Roboto_500Medium',
                            }}
                            onPress={() => handleEdit(item)}
                          >
                            Eidt
                          </Text>
                        </View>
                      ) : (
                        <Text style={titleStyle}>{item?.bidBy[0]?.code}</Text>
                      )}
                      <Text
                        style={{
                          ...titleStyle,
                          fontSize: screenHeight * 0.016,
                          marginVertical: '1%',
                        }}
                      >
                        {item?.bidOn?.ProjectName}
                      </Text>
                      <View style={styles.biddIngContainer}>
                        <Text
                          style={{
                            ...styles.descriptionTitle,
                            fontSize: screenHeight * 0.0155,
                          }}
                        >
                          Bidding Price
                        </Text>
                        <View style={styles.bidPrice}>
                          <Text
                            style={{
                              ...titleStyle,
                              fontSize: screenHeight * 0.016,
                              // marginVertical: '1%',
                            }}
                          >
                            {formattedPrice}PKR
                          </Text>
                        </View>
                      </View>

                      <ProjectDetails
                        item={item?.bidOn}
                        containerStyle={styles.projectFea}
                      />

                      <View style={styles.biddIngContainer}>
                        <View
                          style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            gap: 2,
                          }}
                        >
                          <VerifyBlack />
                          <Text
                            style={{
                              ...styles.descriptionTitle,
                              fontSize: screenHeight * 0.012,
                            }}
                          >
                            Verified Member
                          </Text>
                        </View>
                        <Text style={styles.descriptionTitle}>{time}</Text>
                      </View>
                    </View>
                  )}
                </View>
              );
            }}
            nestedScrollEnabled
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              gap: 10,
              // marginVertical: screenHeight * 0.02,
              // m,
              marginBottom: 30,
            }}
          />
        )}
      </View>

      <Portal>
        <Modal visible={isBidOpen} onDismiss={hideModal}>
          <View style={container}>
            <Text style={titleStyle}>Bidding Form</Text>
            <View style={{ width: '90%' }}>
              <View>
                <Text style={{ ...titleStyle, fontSize: screenHeight * 0.017 }}>
                  {selectedItem?.ProjectName}
                </Text>
                <Text
                  style={{ ...styles.descriptionTitle, marginVertical: '2%' }}
                >
                  {selectedItem?.description}
                </Text>
              </View>
              <ProjectDetails item={item} containerStyle={styles.projectFea} />

              <TextInput
                placeholder="Bidding Price"
                value={bidPrice}
                onChangeText={setbidPrice}
                style={{ ...inputstyle, width: '100%' }}
                keyboardType="numeric"
              />

              <TouchableOpacity
                style={{ ...buttonContainer, width: '100%' }}
                onPress={handleSubmit}
              >
                <Text style={buttonTitle}>Submit</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </Portal>

      {currentuser?.privilege === 'Owner' && (
        <View
          style={{
            // backgroundColor: 'red',
            flexDirection: 'row',
            alignItems: 'center',
            gap: 15,
            width: screenWidth * 0.9,
            alignSelf: 'center',
            paddingVertical: 10,
          }}
        >
          <TextInput
            style={{
              ...inputstyle,
              width: '90%',
              borderRadius: screenHeight * 0.1,
              padding: screenHeight * 0.01,
              marginTop: 0,
            }}
            // onChangeText={(e) => handleOnchange(e, 'website')}
            // value={inputs.website}
            placeholder="Type your message"
          />

          <SendIcon />
        </View>
      )}

      <WinningAnnounModal
        modalVisible={isWinningModal}
        setModalVisible={setisWinningModal}
        item={selectedItem}
        refetch={refetch}
      />
    </View>
  );
};

export default ProjectCard;

const styles = StyleSheet.create({
  container: {
    backgroundColor: Color.White,
    flex: 1,
    width: screenWidth,

    // marginBottom: 200,
  },
  headerContainer: {
    width: screenWidth * 0.9,
    alignSelf: 'center',
    marginTop: screenHeight * 0.016,
  },
  image: {
    width: '100%',
    height: screenHeight * 0.12,
    resizeMode: 'cover',
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: screenHeight * 0.009,
  },
  soonButton: {
    // borderColor: 1,
    borderWidth: 1,
    paddingHorizontal: screenWidth * 0.026,
    borderRadius: screenHeight * 0.01,
    justifyContent: 'center',
  },
  subTitle: {
    fontFamily: 'Roboto_500Medium',
    fontSize: screenHeight * 0.013,
    textAlign: 'center',
    width: '100%',
  },
  contentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  descriptionContainer: {
    width: screenWidth * 0.6,
  },
  detailsContainer: {
    // flex: 1,
    gap: 12,
    // flexDirection: 'row',
  },
  details: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  descriptionTitle: {
    fontFamily: 'Roboto_400Regular',
    fontSize: screenHeight * 0.0133,
    lineHeight: 16,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  actionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: screenHeight * 0.01,
  },
  activeEdit: {
    backgroundColor: Color.VeryLightGrey,
    paddingHorizontal: screenWidth * 0.06,
    paddingVertical: screenHeight * 0.009,
    borderRadius: screenHeight * 0.01,
  },
  disableEdit: {
    // backgroundColor: Color.VeryLightGrey,
    paddingHorizontal: screenWidth * 0.06,
    paddingVertical: screenHeight * 0.009,
    borderRadius: screenHeight * 0.01,
  },

  activeEditTitle: {
    fontFamily: 'Roboto_700Bold',
    fontSize: screenHeight * 0.016,
  },
  disableTitle: {
    fontFamily: 'Roboto_700Bold',
    fontSize: screenHeight * 0.016,
    color: 'rgba(0, 0, 0, 0.25)',
  },
  buttonContainer: {
    borderWidth: 1,
    justifyContent: 'center',
    paddingHorizontal: screenWidth * 0.06,
    fontFamily: 'Roboto_700Bold',
    fontSize: screenHeight * 0.016,
    borderRadius: screenHeight * 0.01,
  },
  projectFea: {
    gap: 12,
    flexDirection: 'row',
  },
  bidCard: {
    backgroundColor: Color.VeryLightGrey,
    alignItems: 'flex-start',
    paddingHorizontal: screenWidth * 0.025,
    paddingVertical: screenHeight * 0.009,
    marginBottom: '1%',
  },
  biddIngContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: screenWidth * 0.7,
    marginVertical: '1%',
    alignItems: 'center',
  },
  bidPrice: {
    backgroundColor: Color.White,
    paddingHorizontal: screenWidth * 0.02,
    paddingVertical: screenHeight * 0.004,
    borderRadius: screenHeight * 0.01,
  },
});
