import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
  Image,
  FlatList,
  Pressable,
  Keyboard,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { Entypo, Foundation } from 'react-native-vector-icons';
import Color from '../../assets/colors/Color';
import { useNavigation, useRoute } from '@react-navigation/native';
import { BASE_URL } from '../../CONSTANTS';
import { useUserState } from '../slices/userSlice';
import { axiosInstance } from '../../axiosInstance';
import { io } from 'socket.io-client';
import CampaignCommentInput from './CampaignCommentInput';
import moment from 'moment';
import { calculateTimeDifference } from '../utils/timeDifference';
import { useStateContext } from '../contexts/ContextProvider';
import { scale } from 'react-native-size-matters';
import AdminIcon from './AdminIcon';
import DeleteCommentModal from './DeleteCommentModal';
import { screenHeight, screenWidth } from '../utils/ScreenDimensions';

const socket = io.connect(`${BASE_URL}/CN`);

const LivePointsComment = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const userState = useUserState();
  const date = moment().utcOffset('+05:00');
  const campaign = route?.params?.campaign;
  const activeScreen = route?.params?.screen;
  const { comment, setcomment, showSnackbar } = useStateContext();

  const [tempComment, setTempComment] = useState('');
  const [modalVisible, setmodalVisible] = useState(false);

  useEffect(() => {
    try {
      socket.on('receive_comments_campaign', (data) => {
        setcomment(data);
      });
    } catch (e) {}
  }, [socket]);

  const handlecomment = () => {
    // if (props.route.params.campaign !== userState.phoneNumber) {
    //      const content = {
    //        title: userState.fullName + " liked your post",
    //      };
    // }
    Keyboard.dismiss();
    if (tempComment !== '') {
      const newcomments = comment;
      newcomments.push({
        description: tempComment,
        commented_by: {
          _id: userState?._id,
          fullName: userState?.fullName,
          phoneNumber: userState?.phoneNumber,
          profile: userState?.profile,
          type: userState?.type,
        },
        date,
      });

      axiosInstance
        .patch(`/campaigns/update/${campaign._id}`, {
          comments: newcomments,
        })
        .then((res) => {
          socket.emit('send_comments_campaign', campaign);
          setcomment(res?.data?.comments);
        })
        .catch((e) => {});
    } else {
      alert('Cannot post an empty Comment');
    }
  };

  const handleDelete = async (commenendId) => {
    try {
      const { data } = await axiosInstance.patch(
        '/campaigns/delete-campaign-comment',
        {
          comment: `${commenendId}`,
          campaignId: `${campaign?._id}`,
        },
      );

      setcomment(data?.comments);
      // props?.route?.params?.setcomment(res?.data?.comments);
    } catch (error) {
      const errorMessage =
        error?.response?.data?.error || 'An unexpected error occurred.';
      showSnackbar(errorMessage);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.main}>
        <View style={styles.header}>
          <Text style={styles.headText}>Most Recent Comments</Text>
          <TouchableOpacity
            onPress={() => {
              navigation.goBack();
            }}
          >
            <Entypo name="cross" color={Color.Black} size={28} />
          </TouchableOpacity>
        </View>
        {!comment?.length > 0 && (
          <View style={styles.noComment}>
            <Image
              style={styles.noCommentImage}
              source={require('../../assets/no-comments.png')}
            />
            <Text style={styles.noCommentHeading}>No Comments</Text>
            <Text style={styles.noCommentText}>Be the first to comment</Text>
          </View>
        )}
        {/* Comment Section */}
        {/* <ScrollView
            style={styles.mainScroll}
            showsVerticalScrollIndicator={false}
          > */}
        <View
          style={
            activeScreen === 'arch' ? styles.mainScrollArch : styles.mainScroll
          }
        >
          <FlatList
            data={comment}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => {
              const timePassed = calculateTimeDifference(item?.date);
              return (
                <Pressable onLongPress={() => setmodalVisible(false)}>
                  {/* Comment Section */}

                  <View>
                    <View style={styles.commentMainContainer}>
                      <Image
                        style={styles.avatar}
                        source={{
                          uri: `${item?.commented_by?.profile}`,
                        }}
                      />
                      <TouchableOpacity
                        style={styles.commentTextContainer}
                        onLongPress={() => setmodalVisible(true)}
                      >
                        <View style={styles.nameFollow}>
                          <Pressable
                            onPress={() => {
                              navigation.navigate('UserProfile', {
                                userPhoneNumber: item?.commented_by.phoneNumber,
                              });
                            }}
                            style={{
                              flexDirection: 'row',
                              // alignItems: 'center',
                              justifyContent: 'center',
                            }}
                          >
                            <Text style={styles.userName}>
                              {item?.commented_by?.fullName}
                            </Text>
                            <AdminIcon userType={item?.commented_by.type} />
                          </Pressable>
                        </View>

                        <View>
                          <Text style={styles.commentText}>
                            {item?.description}
                          </Text>
                        </View>
                      </TouchableOpacity>
                    </View>
                    <View style={styles.action}>
                      <Text style={styles.time}>{timePassed}</Text>
                    </View>
                  </View>
                  <DeleteCommentModal
                    modalVisible={modalVisible}
                    setModalVisible={setmodalVisible}
                    comment={item}
                    handleDelete={handleDelete}
                    screen="campaign"
                  />
                </Pressable>
              );
            }}
          />
        </View>
        {/* </ScrollView> */}
      </View>

      {activeScreen === 'arch' ? (
        <View style={styles.lockCampaign}>
          <Foundation name="lock" style={styles.lockIcon} />
          <Text style={styles.campaginCloseTitle}>
            You can’t post a comment on this Campaign. It’s closed check out
            other live campaigns in Campaign Tab.
          </Text>
        </View>
      ) : (
        <CampaignCommentInput
          placeholder="Write your message..."
          onPress={handlecomment}
          onchange={setTempComment}
          id={campaign._id}
        />
      )}
    </View>
  );
};

export default LivePointsComment;
const styles = StyleSheet.create({
  main: {
    paddingHorizontal: 15,
    flex: 1,
    backgroundColor: Color.White,
  },
  header: {
    marginTop: 20,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignContent: 'center',
    alignItems: 'center',
  },
  headerIcons: {
    width: 20,
    height: 20,
  },
  headerCross: {
    width: 15,
    height: 15,
  },
  headerLikes: {
    marginRight: 37,
    fontSize: 12,
    fontWeight: '400',
    color: Color.Black,
  },
  headText: {
    fontFamily: 'Roboto_600SemiBold',
    color: Color.Black,
    fontSize: 16,
  },
  commentMainContainer: {
    marginTop: 10,
    flexDirection: 'row',
    alignContent: 'center',
    alignItems: 'center',
  },
  commentTextContainer: {
    marginLeft: 15,
    alignItems: 'baseline',
    alignSelf: 'flex-start',
    backgroundColor: '#F5F6FA',
    padding: 7,
    borderRadius: 15,
    marginRight: '15%',
  },
  avatar: {
    alignSelf: 'flex-start',
    borderRadius: Dimensions.get('screen').height * 0.1,
    width: Dimensions.get('screen').height * 0.06,
    height: Dimensions.get('screen').height * 0.06,
  },
  nameFollow: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  userName: {
    fontWeight: 'bold',
    color: Color.Black,
    fontSize: screenHeight * 0.016,
    marginBottom: screenHeight * 0.002,
  },
  follow: {
    color: Color.Blue,
    marginLeft: 5,
  },
  commentText: {
    color: Color.Black,
    lineHeight: 20,
  },
  action: {
    flexDirection: 'row',
    marginLeft: 65,
    marginTop: 5,
  },
  time: {
    fontSize: 13,
    fontWeight: '500',
    color: Color.Black,
    lineHeight: 21,
    marginRight: 15,
  },
  like: {
    fontSize: 13,
    color: Color.Black,
    fontWeight: '500',
    lineHeight: 21,
  },
  liked: {
    fontSize: 13,
    color: Color.Blue,
    fontWeight: '500',
    lineHeight: 21,
  },
  mainScroll: {
    flex: 1,
  },
  mainScrollArch: {
    width: '100%',
    marginBottom: '33%',
  },
  noComment: {
    position: 'absolute',
    right: '25%',
    bottom: '40%',
  },
  noCommentImage: {
    width: Dimensions.get('screen').height * 0.25,
    height: Dimensions.get('screen').height * 0.15,
  },
  noCommentHeading: {
    fontFamily: 'Roboto_600SemiBold',
    fontSize: 14,
    alignSelf: 'center',
    color: Color.Black,
  },
  noCommentText: {
    fontFamily: 'Roboto_400Regular',
    fontSize: 12,
    alignSelf: 'center',
    color: Color.Black,
  },
  lockCampaign: {
    backgroundColor: Color.LightBg,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: scale(12),
    paddingVertical: scale(8),
    position: 'absolute',
    bottom: 0,
  },
  campaginCloseTitle: {
    width: '96%',
    fontFamily: 'Roboto_400Regular',
    fontSize: scale(12),
    paddingLeft: scale(8),
    color: Color.Grey,
  },
  lockIcon: {
    fontSize: scale(24),
    color: Color.Yellow,
  },
});
