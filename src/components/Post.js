import React, { useState, useMemo, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
  Pressable,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';

//Icons import
import { FontAwesome, AntDesign } from 'react-native-vector-icons';
import { useUserState } from './../slices/userSlice';
//HOST NAME
import { BASE_URL } from '../../CONSTANTS';
import Color from '../../assets/colors/Color';

import BottomSheetForPost from './BottomSheetForPost';
import moment from 'moment';
import PostHeader from '../screens/Home/PostHeader';
import PostDeleteModal from '../screens/Home/PostDeleteModal';
import PostVideo from '../screens/Home/PostVideo';

import PostImage from '../screens/Home/PostImage';
import PostSharedHeader from './PostSharedHeader';
import { screenHeight } from '../utils/ScreenDimensions';

import LikedSvg from './SVG/LikedSvg';

export default function Post(props, postId) {
  const date = moment().utcOffset('+05:00');
  const { post } = props;

  const [visible, setVisible] = useState(false);
  const [modalVisible, setmodalVisible] = useState(false);
  const toggleBottomNavigationView = () => {
    setVisible(!visible);
  };
  const navigation = useNavigation();
  const userState = useUserState();

  const route = `${BASE_URL}/posts/updateposts/${post._id}`;
  const [reactions, setreactions] = useState(post?.reactions);
  const [comment, setcomment] = useState(post?.comments);
  const [liked, setliked] = useState(false);
  useEffect(() => {
    // Memoize the reactions and comments props
    const { post } = props;

    setreactions((prevReactions) => {
      // Check if reactions have changed before updating state
      if (prevReactions !== post?.reactions) {
        setliked(
          post?.reactions.some((user) => {
            return user._id === userState.id;
          }),
        );
        return post?.reactions;
      }
      return prevReactions;
    });

    setcomment((prevComments) => {
      // Check if comments have changed before updating state
      if (prevComments !== post?.comments) {
        return post?.comments;
      }
      return prevComments;
    });
  }, [post?.reactions, post?.comments]);

  const modalComponent = useMemo(
    () => (
      <PostDeleteModal
        post={props?.post}
        reload={props?.reload}
        setmodalVisible={setmodalVisible}
      />
    ),
    [modalVisible, post, props?.reload],
  );

  const handleOnClickComment = () => {
    navigation.navigate('Comments', {
      comments: comment,
      id: post._id,
      postedBy: post?.postedby?._id,
      data: props?.data,
      expoPushToken: post?.postedby?.expoPushToken,
      setcomment: setcomment,
    });
  };

  const updatereactions = async (likes, notify = false) => {
    if (liked === false) {
      //check if the owner of post is not the user that is logged IN.
      if (notify && post.postedby.phoneNumber !== userState.phoneNumber) {
        // notifications
        const config = {
          headers: {
            'auth-token': userState.token,
          },
        };
        await axios.post(
          `${BASE_URL}/notify/commentNotification/${post._id}`,
          {
            user: userState.phoneNumber,
            body: {
              date: date,
              user: {
                profile: userState.profile,
                fullName: userState.fullName,
                type: userState.type,
                expoPushToken: post?.postedby?.expoPushToken,
              },
            },
            data: {
              title: 'post-like',
              content: post?._id,
            },
          },
          config,
        );
      }
    }

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
      .catch((e) => {});
  };
  const handleonshare = async (post) => {
    navigation.navigate('postShare', { post: post, reload: props.reload });
  };

  const handlePostsLike = (item) => {
    navigation.navigate('PostsLike', { item });
  };

  const handleLike = () => {
    if (!liked) {
      const templike = [...reactions];
      const newLikes = {
        phoneNumber: userState.phoneNumber,
        fullName: userState.fullName,
        type: userState.type,
        profile: userState.profile,
        _id: userState.id,
      };
      templike.push(newLikes);
      updatereactions(templike, true);
      setliked(true);
    } else {
      const newlikes = reactions.filter((reaction) => {
        return reaction._id !== userState.id;
      });
      updatereactions(newlikes, false);
      setliked(false);
    }
  };

  const supportedImageFormats = ['image/jpeg', 'image/png', 'image/jpg'];
  const supportedFormats = [
    'image/jpeg',
    'image/png',
    'image/jpg',
    'video/mp4',
  ];
  const isImageOrVideo = supportedFormats.includes(props.post.media?.type);

  // Include data in the dependency array if you want this to run when data changes
  return (
    <>
      <View style={styles.mainContainer}>
        {modalVisible && modalComponent}
        <View>
          <View style={styles.postContainer}>
            {post?.sharedBy && (
              <PostSharedHeader
                sharedBy={post?.sharedBy}
                setmodalVisible={setmodalVisible}
                postedBy={post?.postedby}
                description={post?.description}
                createdAT={post?.createdAT}
                media={post?.media}
                id={post?._id}
              />
            )}
            {!props?.post?.sharedBy && (
              <PostHeader data={post} setmodalVisible={setmodalVisible} />
            )}
          </View>
          <View style={styles.postContainer}>
            {post?.media?.type &&
              supportedImageFormats.includes(post?.media?.type) && (
                <View style={styles.postImage}>
                  <PostImage
                    post={post}
                    imageStyle={styles.image}
                    setcomment={setcomment}
                  />
                </View>
              )}
            <View>
              {post.media?.type === 'video/mp4' ? (
                <PostVideo post={post} setcomment={setcomment} />
              ) : null}
            </View>
            {reactions?.length !== 0 ||
            comment?.length !== 0 ||
            post?.shares?.length !== 0 ? (
              <View
                style={
                  isImageOrVideo
                    ? styles.imageStatsContainer
                    : styles.statsContainer
                }
              >
                <TouchableOpacity
                  style={{
                    flexDirection: 'row',
                  }}
                  onPress={() => handlePostsLike(reactions)}
                >
                  {reactions.length !== 0 ? <LikedSvg /> : null}
                  <Text style={styles.statsLikes}>
                    {liked !== false || reactions.length > 0
                      ? reactions.length + ' Liked'
                      : null}
                  </Text>
                </TouchableOpacity>
                <View style={styles.rightStats}>
                  <TouchableOpacity onPress={handleOnClickComment}>
                    <Text style={styles.statsComments}>
                      {comment.length !== 0
                        ? comment.length === 1
                          ? comment?.length + ' comment'
                          : comment?.length + ' comments'
                        : null}
                    </Text>
                  </TouchableOpacity>
                  {post.shares.length !== 0 && (
                    <Text style={styles.statsShare}>
                      {post.shares.length !== 0
                        ? post.shares.length === 1
                          ? post.shares.length + ' share'
                          : post.shares.length + ' shares'
                        : null}
                    </Text>
                  )}
                </View>
              </View>
            ) : null}
            <View style={styles.actionMainContainer}>
              <View>
                <Pressable
                  android_ripple={{ color: Color.LightGrey }}
                  style={styles.mainAction}
                  onPress={handleLike}
                >
                  {liked ? (
                    <FontAwesome
                      name="thumbs-up"
                      style={{ ...styles.shareIcon, color: Color.Blue }}
                    />
                  ) : (
                    <FontAwesome name="thumbs-o-up" style={styles.shareIcon} />
                  )}

                  <Text style={liked ? styles.actionedText : styles.actionText}>
                    Like
                  </Text>
                </Pressable>
              </View>
              <View>
                <Pressable
                  android_ripple={{ color: Color.LightGrey }}
                  style={styles.mainAction}
                  onPress={handleOnClickComment}
                >
                  <FontAwesome name="comment-o" style={styles.shareIcon} />
                  <Text style={styles.actionText}>Comment</Text>
                </Pressable>
              </View>
              <View>
                <Pressable
                  android_ripple={{ color: Color.LightGrey }}
                  style={styles.mainAction}
                  onPress={() => handleonshare(props?.post)}
                >
                  <AntDesign name="sharealt" style={styles.shareIcon} />
                  <Text style={styles.actionText}>Share</Text>
                </Pressable>
              </View>
            </View>
          </View>
        </View>
        {visible && (
          <BottomSheetForPost
            toggleBottomNavigationView={toggleBottomNavigationView}
            visible={visible}
            isPoster={userState.phoneNumber === props.post.postedby.phoneNumber}
            reload={props?.reload}
            postId={props?.post._id}
            post={props?.post}
            storyReload={props?.storyReload}
          />
        )}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    width: '100%',
    marginBottom: 10,
  },
  postContainer: {
    backgroundColor: '#fff',
    width: '100%',
  },
  image: {
    height: Dimensions.get('screen').height * 0.5,
    marginTop: 5,
    width: '100%',
    resizeMode: 'cover',
  },
  video: {
    height: Dimensions.get('screen').height * 0.6,
    marginTop: 5,
    backgroundColor: Color.Black,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    alignContent: 'center',
    paddingHorizontal: 17,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderColor: Color.VeryLightGrey,
    marginTop: 5,
  },
  imageStatsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    alignContent: 'center',
    paddingHorizontal: 17,
    paddingVertical: 8,
    borderColor: Color.VeryLightGrey,
    marginTop: 5,
  },
  statIcon: {
    width: Dimensions.get('screen').height * 0.02,
    height: Dimensions.get('screen').height * 0.02,
  },
  statsLikes: {
    marginLeft: 5,
    fontSize: screenHeight * 0.014,
    fontFamily: 'Roboto_400Regular',
    color: Color.Grey,
    marginTop: '3%',
  },
  rightStats: {
    flexDirection: 'row',
    alignItems: 'center',
    alignContent: 'center',
    justifyContent: 'space-between',
  },
  statsComments: {
    fontSize: screenHeight * 0.014,
    fontFamily: 'Roboto_400Regular',
    color: Color.Grey,
  },
  statsShare: {
    marginLeft: '3%',
    fontSize: screenHeight * 0.014,
    fontFamily: 'Roboto_400Regular',
    color: Color.Grey,
  },
  actionMainContainer: {
    borderTopWidth: 1,
    width: '95%',
    alignSelf: 'center',
    borderColor: Color.VeryLightGrey,
    flexDirection: 'row',
    alignContent: 'center',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  mainAction: {
    flexDirection: 'row',
    alignContent: 'center',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
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
    alignSelf: 'center',
    fontFamily: 'Roboto_400Regular',
    color: Color.Black,
    marginLeft: 8,
  },
  actionedText: {
    fontSize: 13,
    alignSelf: 'center',
    fontFamily: 'Roboto_400Regular',
    color: Color.Blue,
    marginLeft: 8,
  },
  pressedIcon: {
    color: Color.Blue,
  },
  unpressedIcon: {
    color: Color.Black,
  },
  shareIcon: {
    paddingVertical: 12,
    color: Color.Grey,
    fontSize: 21,
  },
});
