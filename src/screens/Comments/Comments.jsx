import {
  StyleSheet,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
  Text,
  Keyboard,
  Dimensions,
} from 'react-native';
import Comment from '../../components/Comment';
import CommentInput from '../../components/CommentInput';
import { useNavigation } from '@react-navigation/native';
import { useState, useEffect } from 'react';
import { useUserState } from '../../slices/userSlice';
import axios from 'axios';

import moment from 'moment';
import { io } from 'socket.io-client';
import { BASE_URL } from '../../../CONSTANTS';

import { useStateContext } from '../../contexts/ContextProvider.js';

//icons

import Entypo from 'react-native-vector-icons/Entypo.js';
import Color from '../../../assets/colors/Color';

import { axiosInstance } from '../../../axiosInstance';

const socket = io.connect(`${BASE_URL}/CN`);

export default function Comments(props) {
  const date = moment().utcOffset('+05:00');

  const navigation = useNavigation();
  const route = `${BASE_URL}/posts/updateposts/` + props?.route?.params?.id;
  const userState = useUserState();
  const [comments, setcomments] = useState([...props?.route?.params?.comments]);

  const postId = props?.route?.params?.id;
  let tempcomment = '';
  const handlecommentinput = (props) => {
    if (props !== '') {
      tempcomment = props;
    }
  };
  const [liked, setliked] = useState(false);
  const { loading, setLoading } = useStateContext();
  const handlesend = async () => {
    setLoading(true);

    Keyboard.dismiss();
    if (tempcomment !== '') {
      const newcomments = comments;
      newcomments.push({
        description: tempcomment,
        commented_by: userState.id,
        date,
      });

      const config = {
        headers: {
          'auth-token': userState.token,
        },
      };
      try {
        const { data } = await axios.patch(
          route,
          { comments: newcomments },
          config,
        );
        if (data) {
          //if we're here then it means the comment was posted
          // so it's a good place to make a notification request here
          //find the appropriate data to send to the backend

          //if the post owner is not same as logged IN user
          //only then do notification request

          if (userState.id !== props?.route?.params?.postedBy) {
            // eslint-disable-next-line no-unused-vars
            const { data } = await axios.post(
              `${BASE_URL}/notify/commentNotification/${props.route.params.id}`,
              {
                user: userState.phoneNumber,
                body: {
                  date,

                  user: {
                    profile: userState.profile,
                    fullName: userState.fullName,
                    type: userState.type,
                    expoPushToken: `${props?.route?.params?.expoPushToken}`,
                  },
                },

                data: {
                  title: 'post-comment',
                  content: props.route.params.id,
                },
              },
              config,
            );
          }
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
        props.route.params.setcomment(data);
        setcomments([...data]);
      });
    } catch (e) {}
    setliked(
      comments.likes?.some((user) => {
        return user === userState.id;
      }),
    );
  }, [socket]);

  const handleTextInputFocus = () => {};

  const handleTextInputBlur = () => {};

  const handleDelete = async (commenendId) => {
    try {
      const res = await axiosInstance.patch('/posts/delete-Comment', {
        comment: `${commenendId}`,
        PostId: `${postId}`,
      });
      setcomments(res?.data?.comments);
      props?.route?.params?.setcomment(res?.data?.comments);
    } catch (error) {}
  };
  const updatereactions = async (item, index) => {
    if (liked === false) {
      const config = {
        headers: {
          'auth-token': userState.token,
        },
      };
      await axios.post(
        `${BASE_URL}/notify/commentNotification/${props.route.params.post.id}`,
        {
          user: userState.phoneNumber,
          body: {
            date,
            user: {
              profile: userState.profile,
              fullName: userState.fullName,
              type: userState.type,
              expoPushToken: props?.post?.postedby?.expoPushToken,
            },
          },
          data: {
            title: 'comment-like',
            content: props.post._id,
          },
        },
        config,
      );

      const newcomments = [...comments];
      newcomments[index].likes = comments[index]?.likes?.push(userState.id);
      axios
        .patch(
          route,
          { comments: newcomments },
          {
            headers: {
              'auth-token': userState.token,
            },
          },
        )
        .then((res) => {})
        .catch((e) => {});
    } else {
      const newcomments = [...comments];
      newcomments[index].likes = comments[index]?.likes?.filter(
        (like) => like !== userState.id,
      );
      axios
        .patch(
          route,
          { comments: newcomments },
          {
            headers: {
              'auth-token': userState.token,
            },
          },
        )
        .then((res) => {})
        .catch((e) => {});
    }
  };
  // const handleCommentReplies = async (comment, index) => {
  //   let newcomments = [...comments];
  //   //Paste the description and the essentials of the comment replies here for it to work
  //   newcomments[index].comments = comments[index]?.replies?.push({});
  //   // axios
  //   //   .patch(
  //   //     route,
  //   //     { comments: newcomments },
  //   //     {
  //   //       headers: {
  //   //         "auth-token": userState.token,
  //   //       },
  //   //     }
  //   //   )
  //   //   .then((res) => {
  //   //     setreactions(res.data.reactions);
  //   //   })
  //   //   .catch((e) => console.log(e));
  // };

  return (
    <View style={{ flex: 1 }}>
      <View style={{ backgroundColor: Color.LightBlue }}>
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
          {!comments.length > 0 && (
            <View style={styles.noComment}>
              <Image
                style={styles.noCommentImage}
                source={require('../../../assets/no-comments.png')}
              />
              <Text style={styles.noCommentHeading}>No Comments</Text>
              <Text style={styles.noCommentText}>Be the first to comment</Text>
            </View>
          )}
          {/* Comment Section */}
          <ScrollView
            style={styles.mainScroll}
            showsVerticalScrollIndicator={false}
          >
            {comments.map((comment, index) => {
              return (
                <Comment
                  comment={comment}
                  handleDelete={handleDelete}
                  updatereactions={updatereactions}
                  postid={postId}
                  key={comment?._id}
                />
              );
            })}
          </ScrollView>
        </View>
        <CommentInput
          disabled={loading}
          placeholder="Write your comment"
          onchange={handlecommentinput}
          onPress={handlesend}
          onFocus={handleTextInputFocus}
          onBlur={handleTextInputBlur}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  main: {
    paddingHorizontal: 15,
    backgroundColor: '#fff',
    height: '100%',
    width: '100%',
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
  headerComments: {
    fontSize: 12,
    fontWeight: '400',
    color: Color.Black,
  },
  headerShares: {
    marginRight: 40,
    fontSize: 12,
    fontWeight: '400',
    color: Color.Black,
  },
  mainContainer: {
    marginTop: 34,
  },
  commentsHeadText: {
    marginBottom: 14,
    fontSize: 14,
    fontWeight: '500',
    color: Color.Black,
  },
  mainScroll: {
    width: '100%',
    marginBottom: '25%',
  },
  commentMainContainer: {
    flexDirection: 'row',
    alignContent: 'center',
    alignItems: 'center',
  },
  commentTextContainer: {
    marginLeft: 15,
    alignItems: 'baseline',
    alignSelf: 'flex-start',
    backgroundColor: '#fff',
    padding: 7,
    borderRadius: 8,
  },
  avatar: {
    borderRadius: 100,
    width: 35,
    height: 35,
  },
  nameFollow: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  userName: {
    fontSize: 14,
    fontWeight: '600',
    color: Color.Black,
  },
  follow: {
    fontSize: 14,
    fontWeight: '700',
    color: '#4582C3',
    marginLeft: 13,
  },
  commentText: {
    fontSize: 13,
    fontWeight: '500',
    color: Color.Black,
    lineHeight: 21,
  },
  action: {
    flexDirection: 'row',
    marginLeft: 57,
  },
  time: {
    fontSize: 12,
    fontWeight: '500',
    color: Color.Black,
    lineHeight: 21,
  },
  like: {
    marginLeft: 17,
    fontSize: 12,
    color: Color.Black,
    fontWeight: '500',
    lineHeight: 21,
  },
  headText: {
    fontFamily: 'Roboto_600SemiBold',
    color: Color.Black,
    fontSize: 16,
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
});
