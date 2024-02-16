// import { Pressable, StyleSheet, Text, View } from 'react-native';
// import React, { useEffect, useState } from 'react';
// import Color from '../../../assets/colors/Color';
// import { FontAwesome, AntDesign } from 'react-native-vector-icons';
// import { useUserState } from '../../slices/userSlice';
// import { BASE_URL } from '../../../CONSTANTS';
// import axios from 'axios';
// import moment from 'moment';
// import { useNavigation } from '@react-navigation/native';

// const PostAction = ({ post }) => {
//   const userState = useUserState();
//   const date = moment().utcOffset('+05:00');

//   const navigation = useNavigation();

//   const [reactions, setreactions] = useState(post?.reactions);
//   const [comment, setcomment] = useState(post?.comments);
//   const [liked, setliked] = useState(false);
//   useEffect(() => {
//     // Memoize the reactions and comments props

//     setreactions((prevReactions) => {
//       // Check if reactions have changed before updating state
//       if (prevReactions !== post?.reactions) {
//         setliked(
//           post?.reactions.some((user) => {
//             return user._id === userState.id;
//           }),
//         );
//         return post?.reactions;
//       }
//       return prevReactions;
//     });

//     setcomment((prevComments) => {
//       // Check if comments have changed before updating state
//       if (prevComments !== post?.comments) {
//         return post?.comments;
//       }
//       return prevComments;
//     });
//   }, [post?.reactions, post?.comments]);

//   const route = `${BASE_URL}/posts/updateposts/${post._id}`;

//   const updatereactions = async (likes, notify = false) => {
//     if (liked === false) {
//       //check if the owner of post is not the user that is logged IN.
//       if (notify && post.postedby.phoneNumber !== userState.phoneNumber) {
//         // notifications
//         const config = {
//           headers: {
//             'auth-token': userState.token,
//           },
//         };
//         await axios.post(
//           `${BASE_URL}/notify/commentNotification/${post._id}`,
//           {
//             user: userState.phoneNumber,
//             body: {
//               date: date,
//               user: {
//                 profile: userState.profile,
//                 fullName: userState.fullName,
//                 type: userState.type,
//                 expoPushToken: post?.postedby?.expoPushToken,
//               },
//             },
//             data: {
//               title: 'post-like',
//               content: post._id,
//             },
//           },
//           config,
//         );
//       }
//     }

//     axios
//       .patch(
//         route,
//         { reactions: likes },
//         {
//           headers: {
//             'auth-token': userState.token,
//           },
//         },
//       )
//       .then((res) => {
//         setreactions(res.data.reactions);
//       })
//       .catch((e) => {});
//   };
//   const handleLike = () => {
//     if (!liked) {
//       const templike = [...reactions];
//       const newLikes = {
//         phoneNumber: userState.phoneNumber,
//         fullName: userState.fullName,
//         type: userState.type,
//         profile: userState.profile,
//         _id: userState.id,
//       };
//       templike.push(newLikes);
//       updatereactions(templike, true);
//       setliked(true);
//     } else {
//       const newlikes = reactions.filter((reaction) => {
//         return reaction._id !== userState.id;
//       });
//       updatereactions(newlikes, false);
//       setliked(false);
//     }
//   };

//   const handleonshare = async (post) => {
//     navigation.navigate('postShare', { post: post });
//   };

//   const handleOnClickComment = () => {
//     navigation.navigate('Comments', {
//       comments: comment,
//       id: post._id,
//       postedBy: post?.postedby?._id,

//       expoPushToken: post?.postedby?.expoPushToken,
//       setcomment: setcomment,
//     });
//   };

//   const supportedImageFormats = ['image/jpeg', 'image/png', 'image/jpg'];
//   const supportedFormats = [
//     'image/jpeg',
//     'image/png',
//     'image/jpg',
//     'video/mp4',
//   ];

//   return (
//     <View style={styles.postContainer}>
//       {props?.post?.media?.type &&
//         supportedImageFormats.includes(props?.post?.media?.type) && (
//           <View style={styles.postImage}>
//             <PostImage
//               post={props?.post}
//               imageStyle={styles.image}
//               setcomment={setcomment}
//             />
//           </View>
//         )}
//       <View>
//         {props.post.media?.type === 'video/mp4' ? (
//           <PostVideo post={props?.post} setcomment={setcomment} />
//         ) : null}
//       </View>
//       {reactions?.length !== 0 ||
//       comment?.length !== 0 ||
//       props?.post?.shares?.length !== 0 ? (
//         <View
//           style={
//             isImageOrVideo ? styles.imageStatsContainer : styles.statsContainer
//           }
//         >
//           <TouchableOpacity
//             style={{
//               flexDirection: 'row',
//             }}
//             onPress={() => handlePostsLike(reactions)}
//           >
//             {reactions.length !== 0 ? <LikedSvg /> : null}
//             <Text style={styles.statsLikes}>
//               {liked !== false || reactions.length > 0
//                 ? reactions.length + ' Liked'
//                 : null}
//             </Text>
//           </TouchableOpacity>
//           <View style={styles.rightStats}>
//             <TouchableOpacity onPress={handleOnClickComment}>
//               <Text style={styles.statsComments}>
//                 {comment.length !== 0
//                   ? comment.length === 1
//                     ? comment?.length + ' comment'
//                     : comment?.length + ' comments'
//                   : null}
//               </Text>
//             </TouchableOpacity>
//             {props.post.shares.length !== 0 && (
//               <Text style={styles.statsShare}>
//                 {props.post.shares.length !== 0
//                   ? props.post.shares.length === 1
//                     ? props.post.shares.length + ' share'
//                     : props.post.shares.length + ' shares'
//                   : null}
//               </Text>
//             )}
//           </View>
//         </View>
//       ) : null}
//       <View style={styles.actionMainContainer}>
//         <View>
//           <Pressable
//             android_ripple={{ color: Color.LightGrey }}
//             style={styles.mainAction}
//             onPress={handleLike}
//           >
//             {liked ? (
//               <FontAwesome
//                 name="thumbs-up"
//                 style={{ ...styles.shareIcon, color: Color.Blue }}
//               />
//             ) : (
//               <FontAwesome name="thumbs-o-up" style={styles.shareIcon} />
//             )}

//             <Text style={liked ? styles.actionedText : styles.actionText}>
//               Like
//             </Text>
//           </Pressable>
//         </View>
//         <View>
//           <Pressable
//             android_ripple={{ color: Color.LightGrey }}
//             style={styles.mainAction}
//             onPress={handleOnClickComment}
//           >
//             <FontAwesome name="comment-o" style={styles.shareIcon} />
//             <Text style={styles.actionText}>Comment</Text>
//           </Pressable>
//         </View>
//         <View>
//           <Pressable
//             android_ripple={{ color: Color.LightGrey }}
//             style={styles.mainAction}
//             onPress={() => handleonshare(props?.post)}
//           >
//             <AntDesign name="sharealt" style={styles.shareIcon} />
//             <Text style={styles.actionText}>Share</Text>
//           </Pressable>
//         </View>
//       </View>
//     </View>
//   );
// };

// export default PostAction;

// const styles = StyleSheet.create({
//   actionMainContainer: {
//     borderTopWidth: 1,
//     width: '95%',
//     alignSelf: 'center',
//     borderColor: Color.VeryLightGrey,
//     flexDirection: 'row',
//     alignContent: 'center',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//   },
//   mainAction: {
//     flexDirection: 'row',
//     alignContent: 'center',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     paddingHorizontal: 20,
//   },
//   postAction: {
//     flexDirection: 'row',
//     alignContent: 'center',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//   },
//   actionIcon: {
//     width: 22,
//     height: 23,
//   },
//   actionText: {
//     fontSize: 13,
//     alignSelf: 'center',
//     fontFamily: 'Roboto_400Regular',
//     color: Color.Black,
//     marginLeft: 8,
//   },
//   actionedText: {
//     fontSize: 13,
//     alignSelf: 'center',
//     fontFamily: 'Roboto_400Regular',
//     color: Color.Blue,
//     marginLeft: 8,
//   },
//   pressedIcon: {
//     color: Color.Blue,
//   },
//   unpressedIcon: {
//     color: Color.Black,
//   },
//   shareIcon: {
//     paddingVertical: 12,
//     color: Color.Grey,
//     fontSize: 21,
//   },
// });

import { StyleSheet, Text, View } from 'react-native';
import React from 'react';

const PostAction = () => {
  return (
    <View>
      <Text>PostAction</Text>
    </View>
  );
};

export default PostAction;

const styles = StyleSheet.create({});
