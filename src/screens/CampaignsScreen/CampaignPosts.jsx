import {
  Dimensions,
  Pressable,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from "react-native";
import React, { useMemo, useState } from "react";
import moment from "moment";
import { useStateContext } from "../../contexts/ContextProvider";
import { useNavigation } from "@react-navigation/native";
import { useUserState } from "../../slices/userSlice";
import { BASE_URL } from "../../../CONSTANTS";
import PostDeleteModal from "../Home/PostDeleteModal";
import Color from "../../../assets/colors/Color";
import PostHeader from "../Home/PostHeader";
import { FontAwesome, AntDesign } from "react-native-vector-icons";
import PostImage from "../Home/PostImage";
import PostVideo from "../Home/PostVideo";
import axios from "axios";
import PostSharedHeader from "../../components/PostSharedHeader";

const supportedImageFormats = ["image/jpeg", "image/png", "image/jpg"];

const supportedMediaFormats = [
  "image/jpeg",
  "image/png",
  "image/jpg",
  "video/mp4",
];

const CampaignPosts = ({ post, campaignId, reload }) => {
  const date = moment().utcOffset("+05:00");

  const [modalVisible, setmodalVisible] = useState(false);
  const [shares, setshares] = useState([post?.shares]);

  const navigation = useNavigation();
  const userState = useUserState();
  const route = `${BASE_URL}/posts/updateposts/${post?._id}`;
  const [reactions, setreactions] = useState(post?.reactions);
  const [comment, setcomment] = useState(post?.comments);

  const [liked, setliked] = useState(
    reactions.some((user) => {
      return user._id === userState.id;
    }),
  );

  const handleOnClickComment = () => {
    navigation.navigate("Comments", {
      comments: comment,
      id: post?._id,
      postedBy: post.postedby._id,
      data: "",
      expoPushToken: post?.postedby?.expoPushToken,
      setcomment: setcomment,
    });
  };

  // useEffect(() => {
  //   setliked(
  //     reactions.some((user) => {
  //       return user._id === userState.id;
  //     })
  //   );
  // }, [reactions]);

  const modalComponent = useMemo(
    () => (
      <PostDeleteModal
        post={post}
        reload={reload}
        setmodalVisible={setmodalVisible}
      />
    ),
    [modalVisible, post],
  );

  const updatereactions = async (likes, notify = false) => {
    if (liked === false) {
      //check if the owner of post is not the user that is logged IN.
      if (notify && post?.postedby?.phoneNumber !== userState.phoneNumber) {
        // notifications
        const config = {
          headers: {
            "auth-token": userState.token,
          },
        };
        const { data } = await axios.post(
          `${BASE_URL}/notify/commentNotification/${post?._id}`,
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
              title: "post-like",
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
            "auth-token": userState.token,
          },
        },
      )
      .then((res) => {
        setreactions(res?.data?.reactions);
      })
      .catch((e) => console.log(e));
  };

  const handleonshare = async (post) => {
    navigation.navigate("postShare", { post: post, reload: reload });

    // try {
    //   let tempshares = [...shares];
    //   tempshares.push(userState.id);

    //   const formData = new FormData();
    //   ["shares", "comments", "reactions"].forEach((e) =>
    //     formData.append(e, JSON.stringify([]))
    //   );
    //   formData.append("description", post.description);
    //   formData.append("postedby", JSON.stringify(userState.id));
    //   formData.append("ref", campaignId);
    //   formData.append("sharedBy", post?.postedby?._id);

    //   if (post.media) {
    //     formData.append("media", {
    //       name: post.media.name,
    //       uri: `${BASE_URL}/images/${post.media.name}`,
    //       type: post.media.type,
    //     });
    //   } else {
    //     formData.append("media", null);
    //   }

    //   const config = {
    //     headers: {
    //       "Content-Type": "multipart/form-data",
    //       Accept: "application/json",
    //       "auth-token": userState.token,
    //     },
    //   };
    //   const postResponse = await axios.post(
    //     `${BASE_URL}/posts/addpost`,
    //     formData,
    //     config
    //   );

    //   if (userState.id !== post.postedby._id) {
    //     handleLocalNotification();
    //   }
    //   showSnackbar("The post has been shared");
    //   reload();
    //   const patchResponse = await axios.patch(
    //     route,
    //     { shares: tempshares },
    //     {
    //       headers: {
    //         "auth-token": userState.token,
    //       },
    //     }
    //   );
    //   setshares([...patchResponse.data.shares]);
    // } catch (error) {
    //   console.log(error);
    //   showSnackbar(
    //     "Sorry, we couldn't share the post at the moment. Please try again later."
    //   );
    // }
  };

  // const handleLocalNotification = async () => {
  //   try {
  //     const config = {
  //       headers: {
  //         "auth-token": userState.token,
  //       },
  //     };
  //     const notification = await axios.post(
  //       `${BASE_URL}/notify/commentNotification/${post._id}`,
  //       {
  //         user: userState.phoneNumber,
  //         body: {
  //           date: date,

  //           user: {
  //             profile: userState.profile,
  //             fullName: userState.fullName,
  //             type: userState.type,
  //             expoPushToken: post?.postedby?.expoPushToken,
  //           },
  //         },

  //         data: {
  //           title: "post-share",
  //           content: post._id,
  //         },
  //       },
  //       config,
  //     );
  //   } catch (error) {
  //     console.log("error in local notofications", error);
  //   }
  // };
  // const handlePostView = (props) => {
  //   navigation.navigate("PostView", {
  //     url: `${BASE_URL}/images/${props.post.media.name}`,
  //     message: props.post.description,
  //   });
  // };
  const handlePostsLike = (item) => {
    navigation.navigate("PostsLike", { item });
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

  return (
    <View
      style={{
        mainContainer: {
          width: "100%",
          marginBottom: 10,
        },
      }}
    >
      {modalVisible && modalComponent}

      <View style={styles.postContainer}>
        {post?.sharedBy && (
          <PostSharedHeader
            sharedBy={post?.sharedBy}
            setmodalVisible={setmodalVisible}
            postedBy={post?.postedby}
            description={post?.description}
            createdAT={post?.createdAT}
          />
        )}
        {!post?.sharedBy && (
          <PostHeader data={post} setmodalVisible={setmodalVisible} />
        )}
      </View>
      <View style={styles.postContainer}>
        {supportedImageFormats?.includes(post.media?.type) ? (
          <View style={styles.postImage}>
            <PostImage
              post={post}
              imageStyle={styles.image}
              reactions={reactions}
              comments={comment}
              setreactions={setreactions}
              setcomment={setcomment}
              reload={reload}
              shares={shares}
            />
          </View>
        ) : null}
        <View>
          {post.media?.type === "video/mp4" ? (
            <PostVideo
              post={post}
              reactions={reactions}
              comments={comment}
              setreactions={setreactions}
              setcomment={setcomment}
              reload={reload}
              shares={shares}
            />
          ) : null}
        </View>
        {reactions.length !== 0 ||
        comment?.length !== 0 ||
        post.shares.length !== 0 ? (
          <View
            style={
              supportedMediaFormats?.includes(post.media?.type)
                ? styles.imageStatsContainer
                : styles.statsContainer
            }
          >
            <TouchableOpacity
              style={{
                flexDirection: "row",
              }}
              onPress={() => handlePostsLike(reactions)}
            >
              {reactions.length !== 0 ? (
                <AntDesign
                  name="like1"
                  size={10}
                  color={Color.White}
                  style={{
                    backgroundColor: Color.Blue,
                    borderRadius: Dimensions.get("screen").height * 0.1,
                    padding: 4,
                  }}
                />
              ) : null}
              <Text style={styles.statsLikes}>
                {liked !== false || reactions.length > 0
                  ? reactions.length + " Liked"
                  : null}
              </Text>
            </TouchableOpacity>
            <View style={styles.rightStats}>
              <TouchableOpacity>
                <Text style={styles.statsComments}>
                  {comment.length !== 0
                    ? comment.length === 1
                      ? comment?.length + " comment"
                      : comment?.length + " comments"
                    : null}
                </Text>
              </TouchableOpacity>
              {post.shares.length !== 0 && (
                <Text style={styles.statsShare}>
                  {post.shares.length !== 0
                    ? post.shares.length === 1
                      ? post.shares.length + " share"
                      : post.shares.length + " shares"
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
              onPress={() => handleonshare(post)}
            >
              <AntDesign name="sharealt" style={styles.shareIcon} />
              <Text style={styles.actionText}>Share</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </View>
  );
};

export default CampaignPosts;

const styles = StyleSheet.create({
  mainContainer: {
    width: "100%",
    marginBottom: 10,
  },
  postContainer: {
    backgroundColor: "#fff",
    width: "100%",
  },
  image: {
    height: Dimensions.get("screen").height * 0.5,
    marginTop: 5,
    width: "100%",
    resizeMode: "cover",
  },
  video: {
    height: Dimensions.get("screen").height * 0.6,
    marginTop: 5,
    backgroundColor: Color.Black,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    alignContent: "center",
    paddingHorizontal: 17,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderColor: Color.VeryLightGrey,
    marginTop: 5,
  },
  imageStatsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    alignContent: "center",
    paddingHorizontal: 17,
    paddingVertical: 8,
    borderColor: Color.VeryLightGrey,
    marginTop: 5,
  },
  statIcon: {
    width: Dimensions.get("screen").height * 0.02,
    height: Dimensions.get("screen").height * 0.02,
  },
  statsLikes: {
    marginLeft: 5,
    fontSize: 12,
    fontFamily: "Roboto_400Regular",
    color: Color.Black,
  },
  rightStats: {
    flexDirection: "row",
    alignItems: "center",
    alignContent: "center",
    justifyContent: "space-between",
  },
  statsComments: {
    fontSize: 12,
    fontFamily: "Roboto_400Regular",
    color: Color.Black,
  },
  statsShare: {
    marginLeft: "5%",
    fontSize: 12,
    fontFamily: "Roboto_400Regular",
    color: Color.Black,
  },
  actionMainContainer: {
    borderTopWidth: 1,
    width: "95%",
    alignSelf: "center",
    borderColor: Color.VeryLightGrey,
    flexDirection: "row",
    alignContent: "center",
    alignItems: "center",
    justifyContent: "space-between",
  },
  mainAction: {
    flexDirection: "row",
    alignContent: "center",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
  },
  postAction: {
    flexDirection: "row",
    alignContent: "center",
    alignItems: "center",
    justifyContent: "space-between",
  },
  actionIcon: {
    width: 22,
    height: 23,
  },
  actionText: {
    fontSize: 13,
    alignSelf: "center",
    fontFamily: "Roboto_400Regular",
    color: Color.Black,
    marginLeft: 8,
  },
  actionedText: {
    fontSize: 13,
    alignSelf: "center",
    fontFamily: "Roboto_400Regular",
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
