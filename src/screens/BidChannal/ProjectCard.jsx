import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  FlatList,
  Pressable,
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
import { Image } from 'expo-image';

import { useNavigation } from '@react-navigation/native';

import EditBiddingProjectModal from '../../components/EditBiddingProjectModal';
import { shortenText } from '../../utils/isFollowing';

const ProjectCard = ({ item, currentuser, refetch, groupData }) => {
  const userState = useUserState();
  const { navigate } = useNavigation();

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
  const [announcement, setannouncement] = useState('');
  const [isEditProject, setisEditProject] = useState(null);
  const [isEditProjectModal, setisEditProjectModal] = useState(false);

  const hideModal = () => {
    setisBidOpen(false);
    setisEdit(false);
  };

  const memberToNotify = groupData?.members
    ?.filter((mem) => mem.member.phoneNumber !== userState.phoneNumber) // Filter out members with matching phone numbers
    .map((mem) => mem.member); // Extract only the member objects

  useEffect(() => {
    const mergedArray = item.bids.concat(item.announcement);

    mergedArray.sort((a, b) => {
      const timeA = a.bidTime || a.announcementItem.createdAt;
      const timeB = b.bidTime || b.announcementItem.createdAt;
      return new Date(timeB) - new Date(timeA); // Sort in descending order
    });

    // Update the state with the sorted array
    setbids(mergedArray);
    if (item?.status === 'Starting Soon' || item?.status === 'Closed') {
      setisUserBid(true);
    } else {
      const isUserBit = item?.bids?.some(
        (item) => item?.bidBy[0]?.phoneNumber === userState?.phoneNumber,
      );
      setisUserBid(isUserBit);
    }
  }, [item?.status]);

  useEffect(() => {
    const newSocket = io(BASE_URL, { auth: { token: userState.token } });
    newSocket.on('receive_bid', (data, serverId) => {
      setbids((prevBids) => {
        const priorityQueue = [...prevBids];

        // Insert the new bid into the correct position in the priority queue
        priorityQueue.push(data);

        const isUserBidInUpdatedData = priorityQueue.some((item) =>
          item?.bidBy?.some(
            (bidder) => bidder?.phoneNumber === userState?.phoneNumber,
          ),
        );

        setisUserBid(isUserBidInUpdatedData);

        priorityQueue.sort((a, b) => {
          const timeA = a.bidTime || a.announcementItem.createdAt;
          const timeB = b.bidTime || b.announcementItem.createdAt;
          return new Date(timeB) - new Date(timeA);
        });

        const updatedBids = priorityQueue.slice(0, 200);

        return updatedBids;
      });
    });

    newSocket.on('updated_bid', (data, serverId) => {
      setbids((prevBids) => {
        const priorityQueue = [...prevBids];

        // Remove the old bid from the priority queue
        const updatedBidsWithoutOld = priorityQueue.filter(
          (item) => item._id !== data._id,
        );

        // Add the updated bid to the correct position in the priority queue
        updatedBidsWithoutOld.push(data);

        const isUserBidInUpdatedData = updatedBidsWithoutOld.some((item) =>
          item?.bidBy?.some(
            (bidder) => bidder?.phoneNumber === userState?.phoneNumber,
          ),
        );

        setisUserBid(isUserBidInUpdatedData);

        // Sort the priority queue based on the bid time
        updatedBidsWithoutOld.sort((a, b) => {
          const timeA = a.bidTime || a.announcementItem.createdAt;
          const timeB = b.bidTime || b.announcementItem.createdAt;
          return new Date(timeB) - new Date(timeA);
        });

        const updatedBids = updatedBidsWithoutOld.slice(0, 200);
        return updatedBids;
      });
    });

    newSocket.on('receive_announcement', (data, serverId) => {
      const startedRegex = /\bstarted\b/i;
      if (startedRegex.test(data?.announcementItem?.content)) {
        refetch();
      }

      setbids((prevBids) => {
        if (serverId === item?._id) {
          const updatedBids = [...prevBids, data];
          return updatedBids.sort((a, b) => {
            const timeA = a.bidTime || a.announcementItem.createdAt;
            const timeB = b.bidTime || b.announcementItem.createdAt;
            return new Date(timeB) - new Date(timeA);
          });
        }
        return prevBids;
      });
    });

    setSocket(newSocket);
    return () => {
      newSocket.disconnect();
    };
  }, []);

  const handleSubmit = async () => {
    if (isEdit) {
      socket.emit(
        'update_bid',
        {
          id: editItem?._id,
          newPrice: bidPrice,
        },
        selectedItem?._id,
      );
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
    socket.emit(
      'send_bid',
      {
        bidBy: bidBy,
        bidOn: selectedItem?._id,
        bidPrice: bidPrice,
      },
      selectedItem?._id,
    );

    handleGroupNotification('New Bid Placed');
    setbidPrice('');
    // refetch();
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
    try {
      const { data } = await updateProjectStatus(id, status);
      showSnackbar(data?.message);
      refetch();
    } catch {}
  };

  const handleStart = (item) => {
    const content = `Bidding has been started ${startedAt}`;
    handleAnnouncement(item?._id, content, 'started');
    handleUpdateStatus(item?._id, 'Started');
  };

  const handleClose = (item) => {
    const content = `Bidding has been closed. Winner will be announced soon.`;
    setisWinningModal(true);
    setselectedItem(item);
    if (item?.status !== 'Closed') {
      handleUpdateStatus(item?._id, 'Closed');
      handleAnnouncement(item?._id, content);
    }
    refetch();
  };
  const formattedPrice = Number(item?.price).toLocaleString();

  const handleGroupNotification = async (title) => {
    try {
      const notificationData = {
        user: memberToNotify,
        senderName: currentuser?.code,
        groupTitle: selectedItem?.ProjectName,
        title,
      };
      await axiosInstance.post(`/bidChannel/notify-new-bid`, notificationData);
    } catch {}
  };

  const handleAnnouncement = (id, content) => {
    socket.emit(
      'bid_announcement',
      {
        bidOn: id,
        announcement: content,
      },
      id,
    );
  };

  const handleAnnouncmentMsg = (item) => {
    if (announcement === '') {
    } else {
      handleAnnouncement(item?._id, announcement);
      setannouncement('');
    }
  };

  const handleEditProject = (item) => {
    setisEditProject(item);
    setisEditProjectModal(true);
  };

  const shortDesciption = shortenText(item?.description, 35);

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <View
          style={{
            width: '100%',
            height: screenHeight * 0.12,
          }}
        >
          <FlatList
            data={item?.image?.filter(
              (imageItem) => imageItem?.mimetype === 'image/jpeg',
            )}
            renderItem={({ item: imageItem }) => {
              return (
                <View
                  style={{
                    width: '100%',
                    height: screenHeight * 0.12,
                  }}
                >
                  <Image
                    source={{
                      uri: `${BASE_URL}/images/${imageItem?.filename}`,
                    }}
                    style={styles.image}
                    contentFit="cover"
                  />
                </View>
              );
            }}
          />
        </View>

        {/* <Image
          source={{ uri: `${BASE_URL}/images/${item?.image[0].filename}` }}
          style={styles.image}
        /> */}
        <Pressable onPress={() => navigate('projectdetails', { item: item })}>
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
              <Text style={styles.descriptionTitle}>{shortDesciption}</Text>
            </View>
            <ProjectDetails
              item={item}
              containerStyle={styles.detailsContainer}
            />
          </View>
        </Pressable>

        <View style={styles.priceContainer}>
          <Text
            style={{
              ...titleStyle,
              fontSize: screenHeight * 0.015,
              fontFamily: 'Poppins_700Bold',
            }}
          >
            Starting Bidding Price
          </Text>
          <Text
            style={{
              ...titleStyle,
              fontSize: screenHeight * 0.017,
              fontFamily: 'Poppins_700Bold',
            }}
          >
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
              <TouchableOpacity
                disabled={
                  item?.status === 'Started' || item?.status === 'Closed'
                }
                onPress={() => handleEditProject(item)}
              >
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
              onPress={() => handleStart(item)}
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
              backgroundColor: isUserBid ? Color.LightGrey : Color.Blue,
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

              return (
                <View
                  style={{
                    flex: 1,
                    alignItems: isUserBid ? 'flex-end' : 'flex-start',
                    paddingHorizontal: screenWidth * 0.06,
                  }}
                >
                  {item?.announcementItem ? (
                    <View style={styles.announcementItem}>
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
                          <Text style={styles.activeEditTitle}>Your Bid</Text>
                          <Text
                            style={styles.activeEditTitle}
                            onPress={() => handleEdit(item)}
                          >
                            Edit
                          </Text>
                        </View>
                      ) : (
                        <View style={styles.biddIngContainer}>
                          <Text style={styles.activeEditTitle}>
                            {item?.bidBy[0]?.code}
                          </Text>
                        </View>
                      )}
                      <Text style={styles.activeEditTitle}>
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
                          <Text style={styles.activeEditTitle}>
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
      {isBidOpen && (
        <Portal>
          <Modal visible={isBidOpen} onDismiss={hideModal}>
            <View style={container}>
              <Text style={titleStyle}>Bidding Form</Text>
              <View style={{ width: '90%' }}>
                <View>
                  <Text
                    style={{ ...titleStyle, fontSize: screenHeight * 0.017 }}
                  >
                    {selectedItem?.ProjectName}
                  </Text>
                  <Text
                    style={{ ...styles.descriptionTitle, marginVertical: '2%' }}
                  >
                    {selectedItem?.description}
                  </Text>
                </View>
                <ProjectDetails
                  item={item}
                  containerStyle={styles.projectFea}
                />

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
      )}

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
              // padding: screenHeight * 0.01,
              marginTop: 0,
            }}
            onChangeText={setannouncement}
            value={announcement}
            placeholder="Type your message"
          />
          <TouchableOpacity onPress={() => handleAnnouncmentMsg(item)}>
            <SendIcon />
          </TouchableOpacity>
        </View>
      )}
      {isWinningModal && (
        <WinningAnnounModal
          modalVisible={isWinningModal}
          setModalVisible={setisWinningModal}
          item={selectedItem}
          refetch={refetch}
          handleGroupNotification={handleGroupNotification}
        />
      )}

      {isEditProject && (
        <EditBiddingProjectModal
          item={groupData}
          isVisible={isEditProjectModal}
          setisVisible={setisEditProjectModal}
          project={isEditProject}
          refetch={refetch}
        />
      )}
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
    // alignItems: 'center',
  },
  descriptionContainer: {
    width: screenWidth * 0.6,
  },
  detailsContainer: {
    // flex: 1,
    gap: 6,
    // backgroundColor: 'red',
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
    position: 'relative',
    top: screenHeight * 0.007,
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
    paddingHorizontal: screenWidth * 0.083,
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
    width: screenWidth * 0.75,
    marginVertical: '1%',
    alignItems: 'center',
  },
  bidPrice: {
    backgroundColor: Color.White,
    paddingHorizontal: screenWidth * 0.02,
    paddingVertical: screenHeight * 0.004,
    borderRadius: screenHeight * 0.01,
  },
  announcementItem: {
    backgroundColor: Color.Disable,
    maxWidth: screenWidth * 0.8,
    alignSelf: 'center',
    paddingHorizontal: 10,
    paddingVertical: screenHeight * 0.006,
    borderRadius: 5,
  },
});
