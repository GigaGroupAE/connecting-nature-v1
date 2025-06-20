import React, { useEffect, useCallback, useState } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import * as Notifications from 'expo-notifications';
import axios from 'axios';

//Icons import
import {
  FontAwesome,
  MaterialCommunityIcons,
  Octicons,
} from 'react-native-vector-icons';
import AntDesign from 'react-native-vector-icons/AntDesign.js';

import { useUserState } from '../slices/userSlice';

import { Video, AVPlaybackStatus } from 'expo-av';

//HOST NAME
import { BASE_URL } from '../../CONSTANTS';
import Color from '../../assets/colors/Color';

//utility functions
import { calculateTimeDifference } from '../utils/timeDifference';
import BottomSheetForPost from './BottomSheetForPost';

export default function SharedPost(props) {
  //variables for bottom sheet
  const [visible, setVisible] = useState(false);

  const toggleBottomNavigationView = () => {
    //Toggling the visibility state of the bottom sheet
    setVisible(!visible);
  };
  //variables end for bottom sheet
  const video = React.useRef(null);
  const [status, setStatus] = React.useState({});
  const [pressId, setPressId] = useState(0);

  const [textShown, setTextShown] = useState(false); //To show ur remaining Text
  const [lengthMore, setLengthMore] = useState(false); //to show the "Read more & Less Line"
  const toggleNumberOfLines = () => {
    //To toggle the show text or hide it
    setTextShown(!textShown);
  };

  const onTextLayout = useCallback((e) => {
    setLengthMore(e.nativeEvent.lines.length >= 4); //to check the text is more than 4 lines or not
    // console.log(e.nativeEvent);
  }, []);

  async function schedulePushNotification(content) {
    await Notifications.scheduleNotificationAsync({
      content: content,
      trigger: { seconds: 2 },
    });
  }

  const navigation = useNavigation();
  const userState = useUserState();
  const [liked, setliked] = useState(false);
  const route = `${BASE_URL}/posts/updateposts/${props.post._id}`;
  const [reactions, setreactions] = useState([...props.post.reactions]);
  let timePassed = calculateTimeDifference(props.post.createdAT);

  const handleOnClickComment = () => {
    navigation.navigate('Comments', {
      comments: props.post.comments,
      id: props.post._id,
      postedBy: props.post.postedby.phoneNumber,
      data: props.data,
    });
  };
  const [shares, setshares] = useState([...props.post.shares]);
  //notify shall be true in case of like action
  //notify shall be false in case of unlike action
  //so that the user shall not receive notification when the user has unliked

  const updatereactions = (likes, notify = false) => {
    if (liked === false) {
      //check if the owner of post is not the user that is logged IN.

      if (notify && props.post.postedby.phoneNumber !== userState.phoneNumber) {
        //notification
        const config = {
          headers: {
            'auth-token': userState.token,
          },
        };
        //making the use of comment notification api for likes
        //since that api also sends the notification to the post author
        axios
          .post(
            `${BASE_URL}/notify/commentNotification/${props.post._id}`,
            { title: `${userState.fullName} liked your post` },
            config,
          )
          .then((res) => {
            console.log(res.data);
          })
          .catch((error) => {
            console.log('error from like notifications is ', error);
          });
      }
    }
    console.log(reactions);
    axios
      .patch(
        route,
        { reactions: likes },
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
  const handleonshare = () => {
    const post = {
      shares: [],
      comments: [],
      reactions: [],
      description: props.post.description,
      postedby: userState,
      media: 'test',
    };
    let tempshares = shares;
    tempshares.push({
      sharedby: userState,
    });

    //creating form data
    const formData = new FormData();
    ['shares', 'comments', 'reactions'].forEach((e) =>
      formData.append(e, JSON.stringify([])),
    );
    formData.append('description', props.post.description);
    //since we cannot add object to formdata and userState is an object
    //so we will STRINGIFY the userState and parse it at the backend
    formData.append('postedby', JSON.stringify(userState));

    if (props.post.media) {
      formData.append('media', {
        name: props.post.media.name, // phone number is added to make sure data doesn't duplicate at any cost
        uri: `${props.post.media.name}`,
        type: props.post.media.type,
      });
    } else {
      formData.append('media', null);
    }

    const config = {
      headers: {
        'Content-Type': 'multipart/form-data',
        Accept: 'application/json',
        'auth-token': userState.token,
      },
    };

    axios
      .post(`${BASE_URL}/posts/addpost`, formData, config)
      .then((res) => {
        console.log(res.data);

        alert('The post has been shared');
      })
      .catch((e) => console.log('error while sharing is ', e));

    axios
      .patch(
        route,
        { shares: tempshares },
        {
          headers: {
            'auth-token': userState.token,
          },
        },
      )
      .then((res) => {
        setshares([...res.data.shares]);
        //console.log(res);
      })
      .catch((e) => console.log(e));
  };

  return (
    <View style={styles.mainContainer}>
      <View>
        <View style={styles.postContainer}>
          <View style={styles.postHead}>
            <Image
              style={styles.userAvatar}
              source={{
                uri: `${props.post.postedby.profile}`,
              }}
            />
            <TouchableOpacity
              onPress={() =>
                navigation.navigate('UserProfile', {
                  type: 'post',
                  post: {
                    name: props.post.postedby.fullName,
                    profile: props.post.postedby.profile,
                    type: props.post.postedby.type,
                    phoneNumber: props.post.postedby.phoneNumber,
                  },
                })
              }
            >
              <Text style={styles.userName}>
                {props.post.postedby.fullName}
              </Text>
            </TouchableOpacity>
            <Text style={styles.postTime}>{timePassed}</Text>
            <TouchableOpacity
              style={styles.threeDots}
              onPress={toggleBottomNavigationView}
            >
              <MaterialCommunityIcons
                name="dots-horizontal"
                size={25}
                color={Color.Grey}
              />
            </TouchableOpacity>
          </View>
          {props.post.description && (
            <View style={styles.postDescription}>
              <Text
                onTextLayout={onTextLayout}
                numberOfLines={textShown ? undefined : 4}
                style={styles.descriptionText}
              >
                {props.post.description}
              </Text>
              {lengthMore ? (
                <Text
                  onPress={toggleNumberOfLines}
                  style={{ marginTop: 5, color: Color.Blue }}
                >
                  {textShown ? 'Read less...' : 'Read more...'}
                </Text>
              ) : null}
            </View>
          )}
          {props.post.media?.type === 'image/jpeg' ||
          props.post.media?.type === 'image/png' ||
          props.post.media?.type === 'image/jpg' ? (
            <View style={styles.postImage}>
              <TouchableOpacity
                key={props.index}
                onPress={() =>
                  navigation.navigate('PostView', {
                    url: `${props.post.media.name}`,
                    message: props.post.description,
                  })
                }
              >
                <Image
                  style={styles.image}
                  resizeMode="cover"
                  source={{
                    uri: `${props.post.media.name}`,
                  }}
                />
              </TouchableOpacity>
            </View>
          ) : null}
          {props.post.media?.type === 'video/mp4' ? (
            <Video
              ref={video}
              style={styles.image}
              source={{
                uri: `${props.post.media.name}`,
              }}
              useNativeControls
              resizeMode="contain"
              isLooping={false}
              onPlaybackStatusUpdate={(status) => setStatus(() => status)}
            />
          ) : null}

          {!shares && (
            <View style={styles.sharedPostContainer}>
              <View style={styles.sharedPostHead}>
                <Image
                  style={styles.userSharedAvatar}
                  source={{
                    uri: `${props.post.postedby.profile}`,
                  }}
                />
                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate('UserProfile', {
                      type: 'post',
                      post: {
                        name: props.post.postedby.fullName,
                        profile: props.post.postedby.profile,
                        type: props.post.postedby.type,
                        phoneNumber: props.post.postedby.phoneNumber,
                      },
                    })
                  }
                >
                  <Text style={styles.userName}>
                    {props.post.postedby.fullName}
                  </Text>
                </TouchableOpacity>
                <Text style={styles.postTime}>{timePassed}</Text>
              </View>
              <View style={styles.sharedPostDescription}>
                <Text
                  onTextLayout={onTextLayout}
                  numberOfLines={textShown ? undefined : 4}
                  style={styles.descriptionText}
                >
                  {props.post.description}
                </Text>
                {lengthMore ? (
                  <Text
                    onPress={toggleNumberOfLines}
                    style={{ marginTop: 5, color: Color.Blue }}
                  >
                    {textShown ? 'Read less...' : 'Read more...'}
                  </Text>
                ) : null}
              </View>
              {props.post.media?.type === 'image/jpeg' ||
              props.post.media?.type === 'image/png' ||
              props.post.media?.type === 'image/jpg' ? (
                <View style={styles.postImage}>
                  <TouchableOpacity
                    key={props.index}
                    onPress={() =>
                      navigation.navigate('PostView', {
                        url: `${props.post.media.name}`,
                        message: props.post.description,
                      })
                    }
                  >
                    <Image
                      style={styles.image}
                      resizeMode="cover"
                      source={{
                        uri: `${props.post.media.name}`,
                      }}
                    />
                  </TouchableOpacity>
                </View>
              ) : null}
              {props.post.media?.type === 'video/mp4' ? (
                <Video
                  ref={video}
                  style={styles.image}
                  source={{
                    uri: `${props.post.media.name}`,
                  }}
                  useNativeControls
                  resizeMode="contain"
                  isLooping={false}
                  onPlaybackStatusUpdate={(status) => setStatus(() => status)}
                />
              ) : null}
            </View>
          )}
          {reactions.length !== 0 && (
            <View style={styles.postStats}>
              {reactions.length !== 0 ? (
                <Image
                  style={styles.statIcon}
                  source={require('../../assets/stat-like.png')}
                />
              ) : null}
              <Text style={styles.statsLikes}>
                {reactions.length !== 0
                  ? reactions.length === 1
                    ? reactions.length + ' like'
                    : reactions.length + ' likes'
                  : null}
              </Text>
              <Text style={styles.statsComments}>
                {props.post.comments.length !== 0
                  ? props.post.comments.length === 1
                    ? props.post.comments.length + ' comment'
                    : props.post.comments.length + ' comments'
                  : null}
              </Text>
              <Text style={styles.statsShare}>
                {props.post.shares.length !== 0
                  ? props.post.shares.length === 1
                    ? props.post.shares.length + ' share'
                    : props.post.shares.length + ' shares'
                  : null}
              </Text>
            </View>
          )}

          <View style={styles.mainAction}>
            <TouchableOpacity
              style={styles.postAction}
              onPress={() => {
                let like = reactions.filter((reaction) => {
                  return reaction.likedby === userState.phoneNumber;
                });
                console.log('This is the like', like);
                if (like.length === 0) {
                  console.log('if case ran');
                  let templike = reactions;
                  templike.push({ likedby: userState.phoneNumber });
                  updatereactions(templike, (notify = true));
                  setliked(true);
                } else {
                  console.log('else case ran');
                  const newlikes = reactions.filter((reaction) => {
                    return reaction.likedby !== userState.phoneNumber;
                  });
                  updatereactions(newlikes, (notify = false));
                  setliked(false);
                }
              }}
            >
              {reactions.likedby ? (
                <FontAwesome name="thumbs-up" size={22} color={Color.Blue} />
              ) : (
                <FontAwesome name="thumbs-o-up" size={22} color={Color.Grey} />
              )}

              <Text
                style={[
                  reactions.length !== 0
                    ? styles.actionedText
                    : styles.actionText,
                ]}
              >
                Like
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.postAction}
              onPress={() => {
                handleOnClickComment();
              }}
            >
              <FontAwesome name="comment-o" size={22} color={Color.Grey} />

              <Text style={styles.actionText}>Comment</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.postAction}
              onPress={() => handleonshare()}
            >
              <AntDesign name="sharealt" size={22} color={Color.Grey} />
              <Text style={styles.actionText}>Share</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
      {visible && (
        <BottomSheetForPost
          toggleBottomNavigationView={toggleBottomNavigationView}
          visible={visible}
          isPoster={userState.phoneNumber === props.post.postedby.phoneNumber}
          reload={props.reload}
          postId={props.post._id}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    width: '100%',
    marginBottom: 10,
    backgroundColor: Color.LightGrey,
    shadowColor: '#707070',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
    elevation: 10,
  },
  postContainer: {
    backgroundColor: '#fff',
    width: '100%',
  },
  sharedPostContainer: {
    // backgroundColor: "#fffeee",
    width: '100%',
    marginTop: 5,
    // paddingHorizontal: 17,
    borderWidth: 1,
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10,
    borderColor: Color.VeryLightGrey,
  },
  sharedPostHead: {
    width: '100%',
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
    alignContent: 'center',
    paddingHorizontal: 25,
    // justifyContent: "space-between",
  },
  postHead: {
    width: '100%',
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
    alignContent: 'center',
    paddingHorizontal: 17,
    // justifyContent: "space-between",
  },
  userAvatar: {
    marginRight: 10,
    borderRadius: Dimensions.get('screen').height * 0.1,
    width: Dimensions.get('screen').height * 0.06,
    height: Dimensions.get('screen').height * 0.06,
    backgroundColor: Color.VeryLightGrey,
  },
  userSharedAvatar: {
    marginRight: 10,
    borderRadius: Dimensions.get('screen').height * 0.1,
    width: Dimensions.get('screen').height * 0.045,
    height: Dimensions.get('screen').height * 0.045,
    backgroundColor: Color.VeryLightGrey,
  },
  userName: {
    color: Color.Black,
    fontSize: 14,
    fontFamily: 'Roboto_600SemiBold',
    alignSelf: 'center',
  },
  postTime: {
    fontFamily: 'Roboto_400Regular',
    color: Color.Grey,
    marginLeft: 10,
    fontSize: 12,
  },
  threeDots: {
    position: 'absolute',
    right: 17,
  },
  postDescription: {
    paddingHorizontal: 17,
    paddingVertical: 5,
    marginTop: 5,
  },
  sharedPostDescription: {
    paddingHorizontal: 25,
    paddingVertical: 10,
  },
  descriptionText: {
    fontSize: 14,
    fontFamily: 'Roboto_400Regular',
    color: Color.DarkGrey,
  },
  image: {
    width: '100%',
    height: 300,
    marginTop: 10,
  },
  postStats: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 19,
    paddingVertical: 10,
    borderBottomWidth: 2,
    borderColor: Color.VeryLightGrey,
  },
  statIcon: {
    width: 20,
    height: 20,
  },
  statsLikes: {
    // position: "absolute",
    left: '40%',
    top: 2,
    fontSize: 14,
    fontFamily: 'Roboto_400Regular',
    color: Color.Grey,
  },
  statsComments: {
    position: 'absolute',
    right: '25%',
    fontSize: 14,
    fontFamily: 'Roboto_400Regular',
    color: Color.Grey,
  },
  statsShare: {
    position: 'absolute',
    right: '5%',
    fontSize: 14,
    fontFamily: 'Roboto_400Regular',
    color: Color.Grey,
  },
  mainAction: {
    flexDirection: 'row',
    alignContent: 'center',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 12,
    paddingHorizontal: 40,
  },
  postAction: {
    flexDirection: 'row',
    alignContent: 'center',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  actionIcon: {
    width: 22,
    height: 23,
  },
  actionText: {
    fontSize: 13,
    alignSelf: 'flex-end',
    fontFamily: 'Roboto_400Regular',
    color: Color.Grey,
    marginLeft: 8,
  },
  actionedText: {
    fontSize: 13,
    alignSelf: 'flex-end',
    fontFamily: 'Roboto_400Regular',
    color: Color.Blue,
    marginLeft: 8,
  },
  pressedIcon: {
    color: Color.Blue,
  },
  unpressedIcon: {
    color: Color.Grey,
  },
});
