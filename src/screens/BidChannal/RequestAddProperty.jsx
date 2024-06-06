import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
} from 'react-native';
import React, { useState } from 'react';
import Color from '../../../assets/colors/Color';
import HeaderNormal from '../../components/HeaderNormal';
import {
  fetchUnderReviewProjects,
  updateProjectStatus,
} from '../../utils/BiddingChannel';
import { useInfiniteQuery } from 'react-query';
import { screenHeight, screenWidth } from '../../utils/ScreenDimensions';
import {
  titleStyle,
  buttonContainer,
  buttonTitle,
  container,
} from '../Decorations/ModalStyle';
import { BASE_URL } from '../../../CONSTANTS';
import { Portal, Modal } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { useStateContext } from '../../contexts/ContextProvider';
import { axiosInstance } from '../../../axiosInstance';
import InputTextLarge from '../../components/InputTextLarge';
import ArchivedBiddingSkeletn from '../../components/Skeletns/ArchivedBiddingSkeletn';
import NoDataIndicater from '../NoDataIndicater';

const RequestAddProperty = () => {
  const { navigate } = useNavigation();

  const [propertyDetails, setpropertyDetails] = useState(null);

  const { showSnackbar } = useStateContext();
  const [isDenyModal, setisDenyModal] = useState(false);
  const [description, setDescription] = useState('');
  // const [isSubmitLoading, setisSubmitLoading] = useState(fa)

  // const [firstImage, setfirstImage] = useState(propertyDetails?.image[0]);

  const {
    data,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
  } = useInfiniteQuery(
    'unreviewProject',
    ({ pageParam = 1 }) => fetchUnderReviewProjects({ pageParam }),
    {
      getNextPageParam: (lastPage, allPages) => {
        if (lastPage?.currentPage && lastPage?.totalPages) {
          return lastPage.currentPage < lastPage.totalPages
            ? lastPage.currentPage + 1
            : null;
        }
        return null;
      },
    },
  );

  const handleRefresh = () => {
    refetch();
  };

  const handleEndReached = () => {
    if (!isFetchingNextPage && hasNextPage) {
      fetchNextPage();
    }
  };

  const handleApprove = async (item) => {
    try {
      await updateProjectStatus(item?._id, 'Starting Soon');
      refetch();
      showSnackbar(
        'The property has been successfully approved and is now live on the channel',
      );
      const notificationData = {
        user: item?.from?._id,
        body: {
          user: {
            fullName: 'Connecting Nature',
            expoPushToken: item?.from?.expoPushToken,
          },
          content: {
            description:
              'Your property has been successfully approved and is now live on the channel',
          },
        },
        data: {
          title: 'property-Approved',
        },
      };
      await axiosInstance.post(
        `/bidChannel/add-crm-notification`,
        notificationData,
      );
    } catch {}
  };

  const handleReject = async () => {
    try {
      await updateProjectStatus(propertyDetails?._id, 'rejected', description);
      refetch();
      showSnackbar(
        'The property has been successfully approved and is now live on the channel',
      );
      const notificationData = {
        user: propertyDetails?.from?._id,
        body: {
          user: {
            fullName: 'Connecting Nature',
            expoPushToken: propertyDetails?.from?.expoPushToken,
          },
          content: {
            description,
          },
        },
        data: {
          title: 'property-Rejected',
        },
      };
      await axiosInstance.post(
        `/bidChannel/add-crm-notification`,
        notificationData,
      );
    } catch {}
  };

  return (
    <View style={styles.container}>
      <HeaderNormal title="Requests Add Property" />

      <View style={styles.contentContainer}>
        {!isLoading && data?.pages.flatMap((page) => page.data.length) < 1 && (
          <View
            style={{
              width: '100%',
              alignSelf: 'center',
              alignItems: 'center',
            }}
          >
            <NoDataIndicater
              title="No Add Property Requests"
              subTitle="There are currently no pending add property requests. Check back later for any new property submissions."
            />
          </View>
        )}
        {isLoading ? (
          <View style={{ flex: 1, marginVertical: '3%' }}>
            <ArchivedBiddingSkeletn />
          </View>
        ) : (
          <FlatList
            data={data?.pages.flatMap((page) => page.data) || []}
            keyExtractor={(item) => item._id}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                colors={[Color.Blue]}
                refreshing={isLoading}
                onRefresh={handleRefresh}
              />
            }
            renderItem={({ item }) => {
              const sendUser = item?.from;

              return (
                <View style={styles.itemCard}>
                  <View style={styles.contentContainer}>
                    <TouchableOpacity
                      onPress={() =>
                        navigate('UserProfile', {
                          userPhoneNumber: sendUser?.phoneNumber,
                        })
                      }
                      style={styles.leftContainer}
                    >
                      <Image
                        source={{
                          uri: `${BASE_URL}/images/${sendUser?.profile}`,
                        }}
                        style={styles.image}
                      />

                      <View style={{ gap: 3 }}>
                        <Text style={titleStyle}>{sendUser?.fullName}</Text>
                        <Text style={styles.phoneNumber}>
                          {sendUser?.phoneNumber}
                        </Text>
                      </View>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => {
                        navigate('projectdetails', { item: item });
                        setpropertyDetails(item);
                      }}
                    >
                      <Text style={styles.phoneNumber}>View Detail</Text>
                    </TouchableOpacity>
                  </View>

                  <View style={styles.detailsContainer}>
                    <TouchableOpacity
                      style={{
                        ...buttonContainer,
                        width: '47%',
                        marginTop: 3,
                        paddingVertical: screenHeight * 0.0071,
                      }}
                      onPress={() => handleApprove(item)}
                    >
                      <Text style={buttonTitle}>Approve</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={{
                        ...buttonContainer,
                        width: '47%',
                        marginTop: 3,
                        backgroundColor: Color.White,
                        borderWidth: 1,
                        paddingVertical: screenHeight * 0.0071,
                      }}
                      onPress={() => {
                        setisDenyModal(true);
                        setpropertyDetails(item);
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
            onEndReachedThreshold={0.5}
            onEndReached={handleEndReached}
            ListFooterComponent={isFetchingNextPage && <ActivityIndicator />}
            contentContainerStyle={{ gap: 5 }}
          />
        )}

        {/* Property Details Modal  */}
        {/* 
        <Portal>
          <Modal
            visible={isViewDetails}
            onDismiss={() => setisViewDetails(false)}
          >
            <View style={container}>
              <View style={{ paddingBottom: screenHeight * 0.01 }}>
                <Text style={modalTitle}>
                  {propertyDetails?.from?.fullName}
                </Text>
              </View>

              <View style={{ width: screenWidth * 0.82 }}>
                {firstImage?.mimetype === 'image/jpeg' ? (
                  <TouchableOpacity
                    onPress={() =>
                      navigate('ViewImage', {
                        url: `${BASE_URL}/images/${firstImage?.filename}`,
                      })
                    }
                  >
                    <Image
                      source={{
                        uri: `${BASE_URL}/images/${firstImage?.filename}`,
                      }}
                      style={styles.propertyImage}
                    />
                  </TouchableOpacity>
                ) : (
                  <VideoPlayer
                    // style={styles.image}
                    style={{
                      width: screenWidth,
                      height: screenHeight * 0.35,
                    }}
                    fullscreen={{
                      enterFullscreen: () => {
                        video.current.setStatusAsync({
                          shouldPlay: false,
                        });
                        navigate('PostView', {
                          url: `${BASE_URL}/images/${firstImage?.filename}`,
                          message: '',
                          mediatype: 'video',
                          description: '',
                          //video: props.video,
                          screen: 'message',
                        });
                      },
                    }}
                    defaultControlsVisible
                    videoProps={{
                      isLooping: false,
                      ref: video,
                      source: {
                        uri: `${BASE_URL}/images/${firstImage?.filename}`,
                      },
                      shouldPlay: false,
                      resizeMode: ResizeMode.COVER,
                    }}
                  />
                )}
                <FlatList
                  data={propertyDetails?.image}
                  animationEnabled={false}
                  renderItem={({ item, index }) => {
                    // Skip rendering the first item
                    if (firstImage?._id === item?._id) {
                      return null;
                    }
                    return (
                      <Pressable
                        onPress={() => setfirstImage(item)}
                        style={{ paddingVertical: 5 }}
                      >
                        {item?.mimetype === 'image/jpeg' ? (
                          <Image
                            source={{
                              uri: `${BASE_URL}/images/${item?.filename}`,
                            }}
                            style={{
                              width: screenWidth * 0.25,
                              height: screenHeight * 0.07,
                              resizeMode: 'cover',
                              borderRadius: 4,
                            }}
                          />
                        ) : (
                          <View
                            style={{
                              width: screenWidth * 0.25,
                              height: screenHeight * 0.07,
                              borderRadius: screenHeight * 0.01,
                            }}
                          >
                            <VideoPlayer
                              // style={styles.image}
                              style={{
                                width: screenWidth * 0.24,
                                height: screenHeight * 0.068,

                                borderRadius: screenHeight * 0.01,
                              }}
                              // fullscreen={{
                              //   enterFullscreen: () => {
                              //     video.current.setStatusAsync({
                              //       shouldPlay: false,
                              //     });
                              //     navigation.navigate('PostView', {
                              //       url: `${BASE_URL}/images/${postVideo}`,
                              //       message: '',
                              //       mediatype: 'video',
                              //       description: videoDescription,
                              //       //video: props.video,
                              //       autherName: videoAuther,
                              //       screen: 'home',
                              //     });
                              //   },
                              //   exitFullscreen: (e) => console.log(e),
                              // }}
                              // defaultControlsVisible
                              videoProps={{
                                isLooping: false,
                                ref: video,
                                source: {
                                  uri: `${BASE_URL}/images/${item.filename}`,
                                },
                                shouldPlay: false,
                                resizeMode: ResizeMode.COVER,
                              }}
                            />
                          </View>
                        )}
                      </Pressable>
                    );
                  }}
                  horizontal
                  contentContainerStyle={{ gap: 10, marginVertical: '2%' }}
                  showsHorizontalScrollIndicator={false}
                />

                <Text style={styles.projectTitle}>
                  {propertyDetails?.ProjectName}
                </Text>
                <ProjectDetails
                  item={propertyDetails}
                  containerStyle={styles.projectdetailsContainer}
                />
                <Text>
                  {propertyDetails?.description} Lorem, ipsum dolor sit amet
                  consectetur adipisicing elit. Recusandae aspernatur harum quis
                  fugit maiores. Ut nesciunt deleniti, reiciendis odit non est
                  deserunt eius. Sint veniam et ipsa. Commodi, aperiam
                  voluptatum.
                </Text>
              </View>
            </View>
          </Modal>
        </Portal> */}

        {/* Deny Reason Modal  */}

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
    </View>
  );
};

export default RequestAddProperty;

const styles = StyleSheet.create({
  container: {
    backgroundColor: Color.White,
    flex: 1,
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
    backgroundColor: Color.VeryLightGrey,
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
  projectdetailsContainer: {
    flexDirection: 'row',
    gap: 20,
    paddingVertical: screenHeight * 0.004,
  },
  projectTitle: {
    fontFamily: 'Poppins_700Bold',
    fontSize: screenHeight * 0.017,
  },
  propertyImage: {
    width: screenWidth * 0.82,
    height: screenHeight * 0.2,
    alignSelf: 'center',
    resizeMode: 'cover',
    borderRadius: screenHeight * 0.01,
  },
});
