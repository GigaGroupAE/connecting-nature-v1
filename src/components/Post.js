import React, { useState, useMemo, useEffect } from "react"
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Dimensions,
  Pressable,
} from "react-native"
import { useNavigation } from "@react-navigation/native"
import axios from "axios"

//Icons import
import { FontAwesome, AntDesign } from "react-native-vector-icons"
import { useUserState } from "./../slices/userSlice"
//HOST NAME
import { BASE_URL } from "../../CONSTANTS"
import Color from "../../assets/colors/Color"

import BottomSheetForPost from "./BottomSheetForPost"
import moment from "moment"
import PostHeader from "../screens/Home/PostHeader"
import PostDeleteModal from "../screens/Home/PostDeleteModal"
import PostDescription from "./PostDesciption"
import PostVideo from "../screens/Home/PostVideo"
import { useStateContext } from "../contexts/ContextProvider"
import PostImage from "../screens/Home/PostImage"
import PostSharedHeader from "./PostSharedHeader"

export default function Post(props, postId) {
  var date = moment().utcOffset("+05:00")
  const { showSnackbar } = useStateContext()
  const [visible, setVisible] = useState(false)
  const [modalVisible, setmodalVisible] = useState(false)
  const toggleBottomNavigationView = () => {
    setVisible(!visible)
  }
  const navigation = useNavigation()
  const userState = useUserState()

  const route = `${BASE_URL}/posts/updateposts/${props.post._id}`
  const [reactions, setreactions] = useState(props.post.reactions)
  const [comment, setcomment] = useState(props?.post?.comments)
  const [liked, setliked] = useState(false)

  useEffect(() => {
    setreactions(props.post.reactions)
    setliked(
      reactions.some((user) => {
        return user._id === userState.id
      })
    )
  }, [props.post.reactions])

  useEffect(() => {
    setcomment(props?.post?.comments)
  }, [props?.post?.comments])

  const modalComponent = useMemo(
    () => (
      <PostDeleteModal
        post={props.post}
        reload={props.reload}
        setmodalVisible={setmodalVisible}
      />
    ),
    [modalVisible, props.post, props.reload]
  )

  const handleOnClickComment = () => {
    navigation.navigate("Comments", {
      comments: comment,
      id: props.post._id,
      postedBy: props.post.postedby._id,
      data: props.data,
      expoPushToken: props?.post?.postedby?.expoPushToken,
      setcomment: setcomment,
    })
  }

  const [shares, setshares] = useState([...props.post.shares])
  //notify shall be true in case of like action
  //notify shall be false in case of unlike action
  //so that the user shall not receive notification when the user has unliked
  const updatereactions = async (likes, notify = false) => {
    if (liked === false) {
      //check if the owner of post is not the user that is logged IN.
      if (notify && props.post.postedby.phoneNumber !== userState.phoneNumber) {
        // notifications
        const config = {
          headers: {
            "auth-token": userState.token,
          },
        }
        const { data } = await axios.post(
          `${BASE_URL}/notify/commentNotification/${props.post._id}`,
          {
            user: userState.phoneNumber,
            body: {
              date: date,
              user: {
                profile: userState.profile,
                fullName: userState.fullName,
                type: userState.type,
                expoPushToken: props?.post?.postedby?.expoPushToken,
              },
            },
            data: {
              title: "post-like",
              content: props.post._id,
            },
          },
          config
        )
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
        }
      )
      .then((res) => {
        setreactions(res.data.reactions)
      })
      .catch((e) => console.log(e))
  }
  const handleonshare = async (post) => {
    navigation.navigate("postShare", { post: post, reload: props.reload })
    // try {
    //   let tempshares = [...shares];
    //   tempshares.push(userState.id);
    //   const formData = new FormData();
    //   ["shares", "comments", "reactions"].forEach((e) =>
    //     formData.append(e, JSON.stringify([]))
    //   );
    //   formData.append("description", props.post.description);
    //   formData.append("postedby", JSON.stringify(userState.id));
    //   formData.append("sharedBy", post?._id);
    //   if (props.post.media) {
    //     formData.append("media", {
    //       name: props.post.media.name,
    //       uri: `${BASE_URL}/images/${props.post.media.name}`,
    //       type: props.post.media.type,
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
    //   if (userState.id !== props.post.postedby._id) {
    //     handleLocalNotification();
    //   }
    //   showSnackbar("The post has been shared");
    //   props.reload();
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
  }

  const handleLocalNotification = async () => {
    try {
      const config = {
        headers: {
          "auth-token": userState.token,
        },
      }
      const notification = await axios.post(
        `${BASE_URL}/notify/commentNotification/${props.post._id}`,
        {
          user: userState.phoneNumber,
          body: {
            date: date,

            user: {
              profile: userState.profile,
              fullName: userState.fullName,
              type: userState.type,
              expoPushToken: props?.post?.postedby?.expoPushToken,
            },
          },

          data: {
            title: "post-share",
            content: props.post._id,
          },
        },
        config
      )
    } catch (error) {
      console.log("error in local notofications", error)
    }
  }
  const handlePostView = (props) => {
    navigation.navigate("PostView", {
      url: `${BASE_URL}/images/${props.post.media.name}`,
      message: props.post.description,
    })
  }
  const handlePostsLike = (item) => {
    navigation.navigate("PostsLike", { item })
  }

  const handleLike = () => {
    if (!liked) {
      let templike = [...reactions]
      const newLikes = {
        phoneNumber: userState.phoneNumber,
        fullName: userState.fullName,
        type: userState.type,
        profile: userState.profile,
        _id: userState.id,
      }
      templike.push(newLikes)
      updatereactions(templike, true)
      setliked(true)
    } else {
      const newlikes = reactions.filter((reaction) => {
        return reaction._id !== userState.id
      })
      updatereactions(newlikes, false)
      setliked(false)
    }
  }

  // Include data in the dependency array if you want this to run when data changes
  return (
    <>
      <View style={styles.mainContainer}>
        {modalVisible && modalComponent}
        <View>
          <View style={styles.postContainer}>
            {props?.post?.sharedBy && (
              <PostSharedHeader
                sharedBy={props?.post?.sharedBy}
                setmodalVisible={setmodalVisible}
                postedBy={props?.post?.postedby}
                description={props?.post?.description}
                createdAT={props?.post?.createdAT}
              />
            )}
            {!props?.post?.sharedBy && (
              <PostHeader data={props.post} setmodalVisible={setmodalVisible} />
            )}
          </View>
          <View style={styles.postContainer}>
            {props.post.media?.type === "image/jpeg" ||
            props.post.media?.type === "image/png" ||
            props.post.media?.type === "image/jpg" ? (
              <View style={styles.postImage}>
                <PostImage
                  post={props?.post}
                  imageStyle={styles.image}
                  reactions={reactions}
                  comments={comment}
                  setreactions={setreactions}
                  setcomment={setcomment}
                  reload={props.reload}
                  shares={shares}
                />
              </View>
            ) : null}
            <View>
              {props.post.media?.type === "video/mp4" ? (
                <PostVideo
                  post={props?.post}
                  reactions={reactions}
                  comments={comment}
                  setreactions={setreactions}
                  setcomment={setcomment}
                  reload={props.reload}
                  shares={shares}
                />
              ) : null}
            </View>
            {reactions.length !== 0 ||
            comment?.length !== 0 ||
            props.post.shares.length !== 0 ? (
              <View
                style={
                  props.post.media?.type === "image/jpeg" ||
                  props.post.media?.type === "image/png" ||
                  props.post.media?.type === "image/jpg" ||
                  props.post.media?.type === "video/mp4"
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
                  <TouchableOpacity onPress={handleOnClickComment}>
                    <Text style={styles.statsComments}>
                      {comment.length !== 0
                        ? comment.length === 1
                          ? comment?.length + " comment"
                          : comment?.length + " comments"
                        : null}
                    </Text>
                  </TouchableOpacity>
                  {props.post.shares.length !== 0 && (
                    <Text style={styles.statsShare}>
                      {props.post.shares.length !== 0
                        ? props.post.shares.length === 1
                          ? props.post.shares.length + " share"
                          : props.post.shares.length + " shares"
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
            reload={props.reload}
            postId={props.post._id}
            post={props.post}
            storyReload={props.storyReload}
          />
        )}
      </View>
    </>
  )
}

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
})
