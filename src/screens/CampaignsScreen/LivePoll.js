import {
  View,
  Text,
  StyleSheet,
  Image,
  ImageBackground,
  FlatList,
  TouchableOpacity,
  Dimensions,
  KeyboardAvoidingView,
  Keyboard,
  ScrollView,
} from 'react-native';
import React, { useRef } from 'react';
// import { Multiply } from "react-native-image-filter-kit";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import HeaderNormal from '../../components/HeaderNormal';
import CommentInput from '../../components/CommentInput';
import { useEffect, useState } from 'react';
import axios from 'axios';
import moment from 'moment';
import { useUserState } from './../../slices/userSlice';
import { useNavigation, useRoute } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Sharing from 'expo-sharing';
import ViewShot from 'react-native-view-shot';
import { FontAwesome, Foundation } from 'react-native-vector-icons';

import { io } from 'socket.io-client';

const Height = Dimensions.get('screen').height;
const Width = Dimensions.get('screen').width;
const socket = io.connect(`${BASE_URL}/CN`);
//util function for time
import { calculateTimeDifference } from '../../utils/timeDifference';
import { returnCountDown } from '../../utils/countdown';

//BASE_URL
import { BASE_URL } from '../../../CONSTANTS';
import Color from '../../../assets/colors/Color';
import { useStateContext } from '../../contexts/ContextProvider';
import { axiosInstance } from '../../../axiosInstance';
import LivePointsAction from '../../components/LivePointsAction';
import CampaignTimeLeft from '../../components/CampaignTimeLeft';
import LivePointsTeamMember from '../../components/LivePointsTeamMember';
import { Modal, Portal } from 'react-native-paper';
import { scale } from 'react-native-size-matters';
import LivePollTimeCal from '../../components/LivePollTimeCal';

export default function LivePoll(props) {
  const routerr = useRoute();
  const campaign = routerr?.params?.campaign;
  const timeLeft = routerr?.params?.countDown;
  let date = moment().utcOffset('+05:00');
  const [Messages, setMessages] = useState(
    props.route.params.campaign.messages,
  );
  const [tempComment, setTempComment] = useState('');
  const [leadingTeam, setleadingTeam] = useState('');
  const [equalpoints, setequalpoints] = useState('');
  const [lossingTeam, setlossingTeam] = useState('');
  const [timeCal, settimeCal] = useState(false);
  const [teamAuser, setteamAuser] = useState('');
  const [completionExecuted, setCompletionExecuted] = useState(false);
  const [teamBuser, setteamBuser] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const navigation = useNavigation();
  const doday = props.route.params.campaign;
  const userState = useUserState();
  const [liked, setliked] = useState(false);
  const route =
    `${BASE_URL}/today/updatedoday/` + props.route.params.campaign._id;

  const { setGlobalSocket, setLoading, showSnackbar } = useStateContext();

  const [points, setPoints] = useState({ teamA: null, teamB: null });
  const [textInputFocused, setTextInputFocused] = useState(false);
  const handlecomment = () => {
    // if (props.route.params.campaign !== userState.phoneNumber) {
    //      const content = {
    //        title: userState.fullName + " liked your post",
    //      };
    // }
    Keyboard.dismiss();
    if (tempComment !== '') {
      let newcomments = Messages;
      newcomments.push({
        description: tempComment,
        postedby: userState.phoneNumber,
        type: userState.type,
        fullName: userState.fullName,
        profile: userState.profile,
        date: date,
      });

      axiosInstance
        .patch(`/campaigns/update/${props.route.params.campaign._id}`, {
          messages: newcomments,
        })
        .then((res) => {
          socket.emit('send_message', res.data.messages);
        })
        .catch((e) => console.log(e));
    } else {
      alert('Cannot post an empty Comment');
    }
  };

  const handlebackpress = () => {
    navigation.goBack();
  };
  useEffect(() => {
    socket.on('receive_message', (data) => {
      setMessages(data);
    });
  }, [socket]);

  const [countDown, setCountDown] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  //here i want to calculate the countdown
  useEffect(() => {
    let compareDate = new Date(doday.endTime);
    const interval = setInterval(() => {
      const newCountDown = returnCountDown(compareDate);
      if (newCountDown === '-1') {
        clearInterval(interval);
        settimeCal(true);
      } else {
        setCountDown(newCountDown);
        settimeCal(true);
      }
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [doday.endTime]);

  //  here i want to calculate which team is leading
  useEffect(() => {
    setliked(
      Messages.likes?.some((user) => {
        return user === userState.id;
      }),
    );
  }, []);
  useEffect(() => {
    if (campaign?.teamA?.points > campaign?.teamB?.points) {
      setleadingTeam('Team A');
      setlossingTeam('Team B');
    } else if (campaign?.teamA?.points < campaign?.teamB?.points) {
      setleadingTeam('Team B');
      setlossingTeam('Team A');
    } else {
      setequalpoints('both');
    }
    setCompletionExecuted(true);
  }, [countDown]);

  const [bucketSocket, setBucketSocket] = useState(null);

  useEffect(() => {
    if (campaign?.teamA?.members.length > 0) {
      const teamAuser = Object.values(campaign?.teamA?.members);
      setteamAuser(teamAuser);
    }
    if (campaign?.teamB?.members.length > 0) {
      const teamAuser = Object.values(campaign?.teamB?.members);
      setteamBuser(teamAuser);
    }
  }, []);

  useEffect(() => {
    let newSocket = io(BASE_URL, { auth: { token: userState.token } });
    newSocket.on('connect', () => {
      newSocket.emit('join', { id: doday?.group?._id });
    });

    newSocket.on('receive_points', (data) => {
      console.log('👑', 'received pointes');
      if (data.error) {
        showSnackbar(data.message);
        return;
      }

      setActiveCampaign(data.campaign);
      setPoints({
        teamA: data.campaign.teamA?.points,
        teamB: data.campaign.teamB?.points,
      });
    });

    setBucketSocket(newSocket);
    //setGlobalSocket(newSocket);

    return () => {
      console.log('leaving ❌❌');
      newSocket.emit('leave', { id: doday?.group?._id });
      newSocket.disconnect();
      //setGlobalSocket(null);
    };
  }, []);

  const handleTextInputFocus = () => {
    setTextInputFocused(true);
  };

  const handleTextInputBlur = () => {
    setTextInputFocused(false);
  };

  const viewShotRef = useRef();

  const handlePointsShare = async () => {
    const imageUri = await viewShotRef.current.capture();

    // Share the captured image
    await Sharing.shareAsync(imageUri, {
      mimeType: 'image/jpeg',
      dialogTitle: 'Share this image',
      UTI: 'public.jpeg',
    });
    setModalVisible(false);
  };

  const handleShare = () => {
    setModalVisible(true);
  };

  const handlePointsShareFeed = async () => {
    const imageUri = await viewShotRef.current.capture();
    navigation.navigate('PointsSharePost', imageUri);
    setModalVisible(false);
  };

  const hideModal = () => setModalVisible(false);

  const handleEndCampaign = async () => {
    try {
      const res = await axiosInstance.patch(
        `/archives/addArchiveCampaign/${campaign._id}`,
      );

      if (res.data) {
      }
    } catch (error) {
      console.log(error, 'error while campaign archive');
    }
  };

  const handleCampaignCompletion = async () => {
    if (!completionExecuted) {
      return;
    }

    let description;

    if (equalpoints === 'both') {
      description =
        'In a thrilling showdown, Team A and Team B have battled to a spectacular tie! 🏆 Both teams showcased incredible talent and resilience, and the result reflects the true spirit of competition. 🌟🙌 #TieGame #Sportsmanship #Unstoppable 🥇🥈';
    } else {
      description = `And the winner is... ${leadingTeam}! 🏆 Their determination and teamwork shone brightly. 🌟 Kudos to ${lossingTeam} for an outstanding effort! 🙌 #Champions #Teamwork`;
    }

    try {
      const imageUri = await viewShotRef.current.capture();
      const formData = new FormData();
      formData.append('description', description);
      formData.append('postedby', JSON.stringify('654fece4d4690e92e1609c6e'));
      formData.append('media', {
        name: 'image/jpeg',
        uri: imageUri,
        type: 'image/jpeg',
      });

      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
          Accept: 'application/json',
          'auth-token': userState.token,
        },
      };
      const { data } = await axios.post(
        `${BASE_URL}/story/addstory/`,
        formData,
        config,
      );
      showSnackbar(
        'The campaign time is over. Thank you for your participation',
      );
      handleEndCampaign();
      navigation.navigate('Home');
    } catch (error) {
      console.log(error, 'Error is');
    }
  };

  useEffect(() => {
    if (
      timeCal &&
      campaign?.status !== 'archived' &&
      countDown?.days === 0 &&
      countDown?.hours === 0 &&
      countDown?.minutes === 0
    ) {
      handleCampaignCompletion();
    }
  }, [completionExecuted, timeCal]);

  const likeMessage = (item, index) => {
    if (!liked) {
      let newcomments = [...Messages];
      newcomments[index].likes = Messages[index]?.likes?.push(userState.id);
      axios
        .patch(
          route,
          { messages: newcomments },
          {
            headers: {
              'auth-token': userState.token,
            },
          },
        )
        .then((res) => {
          setMessages(res.data.messages);
        })
        .catch((e) => console.log(e));
    } else {
      let newcomments = [...Messages];
      newcomments[index].likes = Messages[index]?.likes?.filter(
        (like) => like != userState.id,
      );
      axios
        .patch(
          route,
          { messages: newcomments },
          {
            headers: {
              'auth-token': userState.token,
            },
          },
        )
        .then((res) => {
          setMessages(res.data.messages);
        })
        .catch((e) => console.log(e));
    }
  };
  const handleCommentReplies = async (comment, index) => {
    let newcomments = [...Messages];
    //Paste the description and the essentials of the comment replies here for it to work
    newcomments[index].comments = Messages[index]?.replies?.push({});
    axios
      .patch(
        route,
        { messsages: newcomments },
        {
          headers: {
            'auth-token': userState.token,
          },
        },
      )
      .then((res) => {
        setreactions(res.data.reactions);
      })
      .catch((e) => console.log(e));
  };
  const handleDeleteMessage = async (index) => {
    let newcomments = Messages.filter((item, i) => i != index);
    axios
      .patch(
        route,
        { messages: newcomments },
        {
          headers: {
            'auth-token': userState.token,
          },
        },
      )
      .then((res) => {
        setMessages(res.data.messages);
      })
      .catch((e) => console.log(e));
  };
  return (
    <SafeAreaView style={{ backgroundColor: 'white', height: '100%' }}>
      <ScrollView>
        <HeaderNormal title={'Do-Day Live Poll'} back={handlebackpress} />
        <View style={styles.mainContainer}>
          <KeyboardAvoidingView behavior="padding">
            <View style={styles.sectionContainer}>
              <View style={styles.pollHeading}>
                <Text style={styles.headingText}>{doday.campaignName}</Text>
              </View>
              <Text style={styles.pollDesc}>Live points updates</Text>
            </View>

            <LivePollTimeCal
              countDown={countDown}
              leadingTeam={leadingTeam}
              equalpoints={equalpoints}
              campaign={campaign}
            />
            <View style={styles.cardContainer}>
              <ViewShot
                ref={viewShotRef}
                options={{
                  format: 'jpg',
                  quality: 0.9,
                }}
              >
                <View style={styles.teamsContainer}>
                  <ImageBackground
                    source={require('../../../assets/vs-bg.png')}
                    resizeMode="cover"
                  >
                    <View style={styles.blendMode}>
                      <View style={styles.teams}>
                        <Image
                          style={styles.avatar}
                          source={
                            doday?.teamA?.leader?.profile
                              ? {
                                  uri: `${doday?.teamA?.leader?.profile}`,
                                }
                              : require('../../../assets/avatar-placeholder.png')
                          }
                        />

                        <Text style={styles.leaderUserName}>
                          {doday.teamA?.leader?.fullName || 'No Leader'}
                        </Text>
                        <Text style={styles.teamText}>Team A</Text>

                        <Text style={styles.points}>
                          {points.teamA || doday.teamA.points}
                        </Text>
                      </View>
                      <View style={styles.teams}>
                        <Image
                          style={styles.avatar}
                          source={
                            doday?.teamA?.leader?.profile
                              ? {
                                  uri: `${doday?.teamB?.leader?.profile}`,
                                }
                              : require('../../../assets/avatar-placeholder.png')
                          }
                        />

                        <Text style={styles.leaderUserName}>
                          {doday?.teamB?.leader?.fullName || 'No Leader'}
                        </Text>
                        <Text style={styles.teamText}>Team B</Text>

                        <Text style={styles.points}>
                          {points.teamB || doday.teamB?.points}
                        </Text>
                      </View>
                    </View>
                  </ImageBackground>
                </View>
              </ViewShot>
              <View style={styles.membersContainer}>
                <LivePointsTeamMember
                  teamAuser={teamAuser}
                  teamBuser={teamBuser}
                  campaign={campaign}
                />
              </View>

              <View>
                <LivePointsAction
                  campaign={campaign}
                  onpress={handleShare}
                  screen="livePoll"
                />
              </View>
            </View>
          </KeyboardAvoidingView>
          <View style={{ marginBottom: Height * 0.12 }}>
            {Messages?.length === 0 ? (
              <View>
                <View style={styles.noComment}>
                  <Image
                    style={styles.noCommentImage}
                    source={require('../../../assets/no-comments.png')}
                    resizeMode="contain"
                  />
                  <View style={styles.noCommentContainer}>
                    <Text style={styles.noCommentHeading}>No Comments</Text>
                    <Text style={styles.noCommentText}>
                      Be the first to comment
                    </Text>
                  </View>
                </View>
              </View>
            ) : (
              <FlatList
                data={Messages}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => {
                  let timePassed = calculateTimeDifference(item.date);

                  return (
                    <View style={styles.mainBody}>
                      <View style={styles.commentMainContainer}>
                        <Image
                          style={styles.commentAvatar}
                          //source={require("../../../assets/avatar-placeholder.png")}
                          source={{
                            uri: `${
                              item.profile
                                ? item.profile
                                : 'no-profile-picture-placeholder.png'
                            }`,
                          }}
                        />

                        <View style={styles.commentTextContainer}>
                          <View style={styles.nameFollow}>
                            <TouchableOpacity
                              onPress={() => {
                                console.log('we have this information', item);
                                navigation.navigate('UserProfile', {
                                  userPhoneNumber: item.postedby,
                                });
                              }}
                            >
                              <Text style={styles.userName}>
                                {item.fullName ? item.fullName : item.postedby}
                              </Text>
                            </TouchableOpacity>
                            {/* <Text style={styles.category}>{item.type}</Text> */}
                          </View>
                          <View>
                            <Text style={styles.commentText}>
                              {item.description}
                            </Text>
                          </View>
                        </View>
                      </View>
                      <Text
                        style={{
                          ...styles.timeText,
                          alignSelf: 'flex-start',
                          left: Width * 0.16,
                        }}
                      >
                        {timePassed}
                      </Text>
                    </View>
                  );
                }}
              />
            )}
          </View>
        </View>
      </ScrollView>

      {campaign?.status === 'archived' ? (
        <View style={styles.lockCampaign}>
          <Foundation name="lock" style={styles.lockIcon} />
          <Text style={styles.campaginCloseTitle}>
            You can’t post a comment on this Campaign. It’s closed check out
            other live campaigns in Campaign Tab.
          </Text>
        </View>
      ) : (
        <CommentInput
          placeholder={'Write your message...'}
          onPress={handlecomment}
          onchange={setTempComment}
          onFocus={handleTextInputFocus}
          onBlur={handleTextInputBlur}
        />
      )}

      {/* Share Modal External or internal  */}
      <Portal>
        <Modal
          visible={modalVisible}
          onDismiss={hideModal}
          animationType="slide"
          style={styles.modal}
          transparent={true}
        >
          <View style={styles.modalContainer}>
            <TouchableOpacity
              style={styles.contentContainer}
              onPress={handlePointsShareFeed}
            >
              <Image
                source={require('../../../assets/postLogo.png')}
                style={styles.image}
              />
              <Text style={styles.title}>Share on Feeds</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.contentContainer}
              onPress={handlePointsShare}
            >
              <FontAwesome name="share" style={styles.icon} />
              <Text style={styles.title}>Share external</Text>
            </TouchableOpacity>
          </View>
        </Modal>
      </Portal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    width: '100%',
    height: '100%',
  },
  sectionContainer: {
    backgroundColor: '#F9F9F9',
    paddingHorizontal: Width * 0.04,
    paddingVertical: Height * 0.015,
  },
  cardContainer: {
    backgroundColor: '#F9F9F9',
    width: '100%',
  },

  pollHeading: {
    alignItems: 'center',
  },
  headingText: {
    fontFamily: 'Roboto_600SemiBold',
    color: Color.Black,
    fontSize: Height * 0.032,
    width: '100%',
  },
  pollDesc: {
    fontFamily: 'Roboto_400Regular',
    color: Color.Grey,
    fontSize: Height * 0.02,
  },
  teamsContainer: {
    width: '100%',
    backgroundColor: Color.DarkBlue,
  },
  blendMode: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    alignContent: 'center',

    paddingHorizontal: Width * 0.08,
    paddingVertical: Height * 0.015,
  },
  teams: {
    alignItems: 'center',
    marginTop: Height * 0.012,
  },
  teamText: {
    fontFamily: 'Roboto_600SemiBold',
    color: Color.White,
    fontSize: Height * 0.017,
    width: '100%',
    textAlign: 'center',
  },
  points: {
    fontFamily: 'Roboto_600SemiBold',
    color: Color.White,
    fontSize: Height * 0.045,
    textAlign: 'center',
    marginTop: Height * 0.012,
  },
  membersContainer: {
    flexDirection: 'row',
  },
  teamMembers: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    // paddingHorizontal: 45,
    paddingVertical: Height * 0.022,

    paddingHorizontal: Width * 0.15,
  },
  avatarSmall: {
    width: 25,
    height: 25,
    borderRadius: Height * 0.1,
    marginLeft: -Width * 0.012,
  },
  avatar: {
    marginTop: 10,
    width: 70,
    height: 70,
    borderRadius: 35,
    resizeMode: 'contain',
  },
  memberText: {
    fontFamily: 'Roboto',
    color: '#707070',
    fontSize: Height * 0.017,
    fontWeight: '400',
    marginLeft: Width * 0.022,
  },
  userContainer: {
    marginLeft: 8,
  },
  leaderUserName: {
    fontFamily: 'Roboto_600SemiBold',
    color: Color.White,
    fontSize: Height * 0.023,
    textAlign: 'center',
    marginTop: Height * 0.012,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    // paddingBottom: 15,
    // paddingHorizontal: 30,
  },
  memberTextBold: {
    fontFamily: 'Roboto',
    color: '#707070',
    fontSize: 12,
    fontWeight: 'bold',
  },

  // FlatList StyleSheet Code Start ----------------------------------------------------

  mainBody: {
    // alignItems: "center",
    width: '100%',
    paddingHorizontal: 25,
    marginVertical: 5,
  },

  timeText: {
    fontFamily: 'Roboto',
    fontSize: Height * 0.017,
    fontWeight: '400',
    color: '#707070',
    opacity: 0.7,
    alignSelf: 'flex-end',
    // marginLeft: 5,
  },

  commentMainContainer: {
    marginTop: 7,
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
    borderRadius: 8,
    marginRight: 48,
  },
  commentAvatar: {
    borderRadius: Height * 0.1,
    width: 40,
    height: 40,
  },
  nameFollow: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  userName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#515151',
  },
  category: {
    fontSize: 14,
    fontWeight: '400',
    color: '#4582C3',
    marginLeft: 6,
    alignSelf: 'flex-end',
  },
  commentText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#606060',
    lineHeight: 18,
    marginTop: 3,
  },
  action: {
    flexDirection: 'row',
    marginLeft: 57,
  },
  time: {
    fontSize: 12,
    fontWeight: '500',
    color: '#585858',
    lineHeight: 21,
  },
  like: {
    marginLeft: 17,
    fontSize: 12,
    color: '#585858',
    fontWeight: '500',
    lineHeight: 21,
  },

  modal: {
    justifyContent: 'center',
    alignItems: 'center',
  },

  module: {
    alignItems: 'flex-end',
    height: '30%',
  },
  modalContainer: {
    height: scale(150),
    width: scale(300),
    backgroundColor: Color.White,
    justifyContent: 'center',
    borderRadius: scale(8),
  },
  contentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: scale(20),
    paddingVertical: scale(12),
  },
  title: {
    fontFamily: 'Roboto_400Regular',
    fontSize: scale(17),
    paddingHorizontal: scale(12),
  },
  icon: {
    fontSize: scale(18),
  },
  crossIcon: {
    alignItems: 'center',
    paddingVertical: scale(10),
    width: scale(60),
    alignSelf: 'flex-end',
  },
  cross: {
    fontSize: scale(20),
  },
  image: {
    width: scale(20),
    height: scale(26),
    resizeMode: 'contain',
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  lockCampaign: {
    backgroundColor: Color.LightBg,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: scale(12),
    paddingVertical: scale(8),
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
  noComment: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  noCommentImage: {
    width: scale(80),
    height: scale(80),
    resizeMode: 'contain',
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
  noCommentContainer: {
    position: 'relative',
    bottom: scale(16),
  },
});
