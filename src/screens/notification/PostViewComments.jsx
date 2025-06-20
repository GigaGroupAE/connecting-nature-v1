import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  Image,
  FlatList,
  Pressable,
  TouchableOpacity,
  ScrollView,
  Keyboard,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { useUserState } from '../../slices/userSlice';
import PostVideo from '../Home/PostVideo';
import PostImage from '../Home/PostImage';
import { FontAwesome, AntDesign } from 'react-native-vector-icons';
import Color from '../../../assets/colors/Color';
import axios from 'axios';
import { useStateContext } from '../../contexts/ContextProvider';
import { io } from 'socket.io-client';
import { BASE_URL } from '../../../CONSTANTS';
import moment from 'moment';
import CommentInput from '../../components/CommentInput';
import { calculateTimeDifference } from '../../utils/timeDifference';
import AdminIcon from '../../components/AdminIcon';
import { screenHeight } from '../../utils/ScreenDimensions';

const width = Dimensions.get('screen').width;
const height = Dimensions.get('screen').height;
const socket = io.connect(`${BASE_URL}/CN`);

//  comments container
const CommentItem = ({ item }) => {
  const timePassed = calculateTimeDifference(item.date);

  return (
    <View style={styles.commentMainContainer}>
      <View style={{ paddingVertical: height * 0.01 }}>
        <Image
          style={styles.userImg}
          source={{
            uri: `${item.commented_by.profile}`,
          }}
        />
      </View>
      <View>
        <View style={styles.commentTextContainer}>
          <View style={styles.nameFollow}>
            <Text style={styles.userName}>{item.commented_by.fullName}</Text>
            <AdminIcon userType={item.commented_by.type} />
          </View>
          <View>
            <Text style={styles.commentText}>{item.description}</Text>
          </View>
        </View>
        <View style={{ paddingHorizontal: width * 0.04 }}>
          <Text style={styles.time}>{timePassed}</Text>
        </View>
      </View>
    </View>
  );
};
const PostViewComments = ({ post }) => {
  const userstate = useUserState();
  const date = moment().utcOffset('+05:00');
  const { loading, setLoading, showSnackbar } = useStateContext();
  const [reactions, setreactions] = useState([...post?.reactions]);
  const [textInputFocused, setTextInputFocused] = useState(false);
  const [comments, setcomments] = useState([...post?.comments]);
  const [shares, setshares] = useState([...post?.shares]);
  const [liked, setliked] = useState(
    reactions.some((user) => {
      return user._id === userstate.id;
    }),
  );
  const route = `${BASE_URL}/posts/updateposts/${post._id}`;

  let tempcomment = '';
  const handlecommentinput = (props) => {
    if (props !== '') {
      tempcomment = props;
    }
  };

  const updatereactions = async (likes, notify = false) => {
    axios
      .patch(
        route,
        { reactions: likes },
        {
          headers: {
            'auth-token': userstate.token,
          },
        },
      )
      .then((res) => {
        setreactions(res.data.reactions);
      })
      .catch((e) => {});
  };
  // handle comments
  const handlesend = async () => {
    setLoading(true);

    Keyboard.dismiss();
    if (tempcomment !== '') {
      const newcomments = comments;
      newcomments.push({
        description: tempcomment,
        commented_by: userstate.id,
        date: date,
      });

      const config = {
        headers: {
          'auth-token': userstate.token,
        },
      };
      try {
        const { data } = await axios.patch(
          route,
          { comments: newcomments },
          config,
        );
        if (data) {
          socket.emit('send_comments', data);
          setLoading(false);
        }
      } catch (error) {
        setLoading(false);
      }
    } else {
      alert('Cannot post an empty Comment');
      setLoading(false);
    }
  };

  useEffect(() => {
    try {
      socket.on('receive_comments', (data) => {
        setcomments([...data]);
      });
    } catch (e) {}
  }, [socket]);

  // handle share

  const handleonshare = async () => {
    try {
      const tempshares = [...shares];
      tempshares.push(userstate.id);

      const formData = new FormData();
      ['shares', 'comments', 'reactions'].forEach((e) =>
        formData.append(e, JSON.stringify([])),
      );
      formData.append('description', post.description);
      formData.append('postedby', JSON.stringify(userstate.id));

      if (post.media) {
        formData.append('media', {
          name: post?.media?.name,
          uri: `${post?.media?.name}`,
          type: post?.media?.type,
        });
      } else {
        formData.append('media', null);
      }

      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
          Accept: 'application/json',
          'auth-token': userstate.token,
        },
      };
      const postResponse = await axios.post(
        `${BASE_URL}/posts/addpost`,
        formData,
        config,
      );

      showSnackbar('The post has been shared');

      const patchResponse = await axios.patch(
        route,
        { shares: tempshares },
        {
          headers: {
            'auth-token': userstate.token,
          },
        },
      );
      setshares([...patchResponse.data.shares]);
    } catch (error) {
      showSnackbar(
        "Sorry, we couldn't share the post at the moment. Please try again later.",
      );
    }
  };

  const handleTextInputFocus = () => {
    setTextInputFocused(true);
  };

  const handleTextInputBlur = () => {
    setTextInputFocused(false);
  };

  const handleLike = () => {
    if (!liked) {
      const templike = [...reactions];
      const newLikes = {
        phoneNumber: userstate.phoneNumber,
        fullName: userstate.fullName,
        type: userstate.type,
        profile: userstate.profile,
        _id: userstate.id,
      };
      templike.push(newLikes);
      updatereactions(templike, true);
      setliked(true);
    } else {
      const newlikes = reactions.filter((reaction) => {
        return reaction._id !== userstate.id;
      });
      updatereactions(newlikes, false);
      setliked(false);
    }
  };

  const reload = () => {};

  return (
    <View style={{ backgroundColor: Color.White, flex: 1 }}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{ backgroundColor: Color.White }}
      >
        {/* Post Media */}
        <View
          style={{
            flex: 0,
            marginBottom: 10,
          }}
        >
          <View>
            {/* Video Player */}
            <View>
              {post?.media?.type === 'video/mp4' ? (
                <PostVideo
                  post={post}
                  reactions={reactions}
                  comments={comments}
                  setreactions={setreactions}
                  setcomment={setcomments}
                  reload={reload}
                  shares={shares}
                />
              ) : null}
            </View>

            {/* Image */}
            <View>
              <View>
                {post?.media?.type === 'image/jpeg' ||
                post?.media?.type === 'image/png' ||
                post?.media?.type === 'image/jpg' ? (
                  <View>
                    <PostImage
                      post={post}
                      imageStyle={styles.image}
                      reactions={reactions}
                      comments={comments}
                      setreactions={setreactions}
                      setcomment={setcomments}
                      reload={reload}
                      shares={shares}
                    />
                  </View>
                ) : null}
              </View>
            </View>
          </View>

          {/* Reaction Container */}
          <View style={{ marginTop: height * 0.015 }}>
            <View style={styles.topStoryMainContainer}>
              <View style={styles.topStoryContainer}>
                <TouchableOpacity style={styles.postLikes} onPress={handleLike}>
                  {liked ? (
                    <AntDesign
                      name="like1"
                      style={{ ...styles.icons, color: Color.Blue }}
                    />
                  ) : (
                    <FontAwesome name="thumbs-o-up" style={styles.icons} />
                  )}
                  <Text style={styles.comment}>{reactions?.length}</Text>
                </TouchableOpacity>
                <Pressable
                  android_ripple={{ color: Color.LightGrey }}
                  style={styles.mainAction}
                >
                  <View style={styles.postLikes}>
                    <FontAwesome name="comment-o" style={styles.icons} />
                    <Text style={styles.comment}>{comments?.length}</Text>
                  </View>
                </Pressable>
                <Pressable onPress={handleonshare} style={styles.postLikes}>
                  <AntDesign
                    name="sharealt"
                    style={[styles.icons, { paddingHorizontal: 5 }]}
                  />
                  <Text style={styles.comment}>{shares.length}</Text>
                </Pressable>
              </View>
            </View>
          </View>
        </View>

        {/* Comments */}
        {/* Comments Container */}
        <View style={{ marginBottom: height * 0.12 }}>
          <FlatList
            data={comments}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => <CommentItem item={item} />}
          />
        </View>
      </ScrollView>

      {/* Comment Input */}
      <View style={{ backgroundColor: 'yellow' }}>
        <CommentInput
          disabled={loading}
          placeholder="Write your comment"
          onPress={handlesend}
          onchange={handlecommentinput}
          onFocus={handleTextInputFocus}
          onBlur={handleTextInputBlur}
        />
      </View>
    </View>
  );
};

export default PostViewComments;

const styles = StyleSheet.create({
  postLikes: {
    fontSize: 21,
    flexDirection: 'row',
    alignItems: 'center',
  },
  comment: {
    fontSize: 14,
    fontFamily: 'Roboto_500Medium',
    fontWeight: '400',
    color: Color.Black,
  },
  icons: {
    fontSize: 22,
    color: Color.Black,
    paddingHorizontal: width * 0.02,
  },

  commentMainContainer: {
    flexDirection: 'row',
    paddingHorizontal: height * 0.02,
    paddingVertical: height * 0.01,
  },
  commentTextContainer: {
    marginLeft: width * 0.04,
    alignItems: 'baseline',
    alignSelf: 'flex-start',
    backgroundColor: '#F5F6FA',
    // padding: "2.5%",
    paddingHorizontal: width * 0.04,
    paddingVertical: height * 0.013,
    borderRadius: 15,
    marginRight: '15%',
    marginTop: '2.5%',
  },

  nameFollow: {
    flexDirection: 'row',
    // alignItems: 'center',
    justifyContent: 'center',
  },
  userName: {
    fontWeight: 'bold',
    color: Color.Black,
    // paddingRight: width * 0.03,
    fontSize: screenHeight * 0.016,
    marginBottom: screenHeight * 0.002,
  },
  follow: {
    color: Color.Blue,
    marginLeft: width * 0.013,
  },
  commentText: {
    color: Color.Black,
    lineHeight: 21,
  },
  action: {
    flexDirection: 'row',
    marginLeft: width * 0.19,
    marginTop: height * 0.006,
  },
  time: {
    fontSize: 13,
    fontWeight: '500',
    color: '#585858',
    lineHeight: 21,
    marginRight: width * 0.04,
  },

  userImg: {
    width: 40,
    height: 40,
    resizeMode: 'contain',
    borderRadius: height * 0.1,
  },
  userContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 2,
  },
  userNameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    overflow: 'hidden',
  },
  postDuration: {
    fontSize: 14,
    fontWeight: '400',
    fontFamily: 'Roboto_400Regular',
    color: Color.DarkGrey,
  },
  postDescr: {
    fontSize: 13,
    fontFamily: 'Roboto_400Regular',
    lineHeight: 20,
    paddingHorizontal: width * 0.04,
    paddingVertical: height * 0.015,
  },

  topStoryMainContainer: {
    backgroundColor: Color.White,
    shadowColor: Color.DarkGrey,
    borderWidth: 0.8,
    borderColor: '#DADADA',
  },
  topStoryContainer: {
    justifyContent: 'space-around',
    borderColor: Color.White,
    paddingVertical: height * 0.0095,
    flexDirection: 'row',
  },
  adminIcon: {
    marginLeft: 5,
    alignSelf: 'center',
    fontSize: height * 0.018,
    color: Color.Blue,
  },
  image: {
    height: height * 0.25,
    marginTop: 5,
    width: '100%',
    resizeMode: 'cover',
  },
  miniVideo: {
    position: 'absolute',
    zIndex: 200,
    width: '100%',
    height: '9%',
    bottom: height * 0.07,
    backgroundColor: 'red',
  },
});
