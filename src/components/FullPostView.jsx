import React, { useRef, useEffect, useState } from "react"
import {
  View,
  Text,
  ImageBackground,
  Dimensions,
  StyleSheet,
  Pressable,
  Alert,
} from "react-native"
import GestureRecognizer from "react-native-swipe-gestures"
import { useNavigation, useRoute } from "@react-navigation/native"
import VideoPlayer from "expo-video-player"
import { scale } from "react-native-size-matters"
import { AntDesign, FontAwesome, Entypo } from "react-native-vector-icons"
import axios from "axios"
import * as MediaLibrary from "expo-media-library"
import moment from "moment"
import { useUserState } from "../slices/userSlice"
import { BASE_URL } from "../../CONSTANTS"
import { useStateContext } from "../contexts/ContextProvider"
import DescriptionText from "./DescriptionText"
import Color from "../../assets/colors/Color"
import { TouchableOpacity } from "react-native-gesture-handler"
import * as Permissions from "expo-permissions"
import * as FileSystem from "expo-file-system"
import PostShareModal from "./PostShareModal"
let deviceHeight = Dimensions.get("screen").height
let deviceWidth = Dimensions.get("screen").width
export default function FullPostView(props) {
  const video = useRef(null)
  const [modalVisible, setmodalVisible] = useState(false)
  const userState = useUserState()
  const route = useRoute()
  const {
    url,
    post,

    screen,
  } = route.params
  const Apiroute = `${BASE_URL}/posts/updateposts/${post?._id}`
  const [liked, setliked] = useState(
    post?.reactions?.some((user) => {
      return user._id === userState.id
    })
  )

  const [likeCount, setlikeCount] = useState(post?.reactions?.length)
  var date = moment().utcOffset("+05:00")

  const navigation = useNavigation()
  const {
    setVideoURI,
    setShowMiniWindow,
    setVideoDescriptionHandler,
    setvideoAutherName,
    showSnackbar,
  } = useStateContext()

  useEffect(() => {
    setShowMiniWindow(false)
  }, [])
  const handleLike = () => {
    if (!liked) {
      let templike = [...post?.reactions]
      const newLikes = {
        phoneNumber: userState.phoneNumber,
        fullName: userState.fullName,
        type: userState.type,
        profile: userState.profile,
        _id: userState.id,
      }
      templike.push(newLikes)
      setlikeCount()
      updatereactions(templike, true)
      setlikeCount(likeCount + 1)
      // The true parameter indicates a like action.
    } else {
      const newlikes = post?.reactions.filter((reaction) => {
        return reaction._id !== userState.id
      })
      setlikeCount(likeCount - 1)

      updatereactions(newlikes, false)
    }
  }

  const updatereactions = async (likes, notify = false) => {
    if (liked === false) {
      if (notify && post.postedby.phoneNumber !== userState.phoneNumber) {
        // notifications
        const config = {
          headers: {
            "auth-token": userState.token,
          },
        }
        const { data } = await axios.post(
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
              title: "post-like",
              content: post._id,
            },
          },
          config
        )
      }
    }

    axios
      .patch(
        Apiroute,
        { reactions: likes },
        {
          headers: {
            "auth-token": userState.token,
          },
        }
      )
      .then((res) => {
        setliked(!liked)
      })
      .catch((e) => console.log(e))
  }

  // const handleDownlaod = () => {
  //   const documentDirectory = FileSystem.documentDirectory + url;
  //   Sharing.shareAsync(documentDirectory);
  // };

  const imageUrl = {
    uri: `${url}`,
  }

  const handleDownload = async () => {
    let date = moment().format("YYYYMMDDhhmmss")
    let fileUri = FileSystem.documentDirectory + `${date}.jpg`
    try {
      const res = await FileSystem.downloadAsync(imageUrl.uri, fileUri)
      saveFile(res.uri)
    } catch (err) {
      console.log("FS Err: ", err)
    }
  }

  const saveFile = async () => {
    const { status } = await Permissions.askAsync(Permissions.MEDIA_LIBRARY)
    if (status === "granted") {
      try {
        const asset = await MediaLibrary.createAssetAsync(post?.media?.name)
        const album = await MediaLibrary.getAlbumAsync("Download")
        if (album == null) {
          await MediaLibrary.createAlbumAsync("Download", asset, false)
          console.log("donwloaded ")
        } else {
          await MediaLibrary.addAssetsToAlbumAsync([asset], album, false)
        }
        console.log("save")
        showSnackbar("Save file")
      } catch (err) {
        console.log("Save err: ", err)
      }
    } else if (status === "denied") {
      alert("please allow permissions to download")
    }
  }

  const handleOnClickComment = () => {
    navigation.navigate("Comments", {
      comments: post?.comments,
      id: post?._id,
      postedBy: post?.postedby?._id,
      data: props?.data,
      expoPushToken: post?.postedby?.expoPushToken,
    })
  }
  const handleonshare = async () => {
    navigation.navigate("postShare", { post: post })

    // try {
    //   let tempshares = [...shares];
    //   tempshares.push(userState.id);

    //   const formData = new FormData();
    //   ["shares", "comments", "reactions"].forEach((e) =>
    //     formData.append(e, JSON.stringify([]))
    //   );
    //   formData.append("description", post.description);
    //   formData.append("postedby", JSON.stringify(userState.id));
    //   formData.append("sharedBy", post?.postedby?._id);

    //   if (post?.media) {
    //     formData.append("media", {
    //       name: post?.media?.name,
    //       uri: `${BASE_URL}/images/${post?.media?.name}`,
    //       type: post?.media?.type,
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

    //   if (userState.id !== post?.postedby?._id) {
    //     handleLocalNotification();
    //   }
    //   showSnackbar("The post has been shared");
    //   reload();
    //   const patchResponse = await axios.patch(
    //     Apiroute,
    //     { shares: tempshares },
    //     {
    //       headers: {
    //         "auth-token": userState.token,
    //       },
    //     }
    //   );
    // } catch (error) {
    //   showSnackbar(
    //     "Sorry, we couldn't share the post at the moment. Please try again later."
    //   );
    //   console.log(error);
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
            title: "post-share",
            content: post._id,
          },
        },
        config
      )
    } catch (error) {
      console.log("error in local notofications", error)
    }
  }

  // const handleDownloadFile = async () => {
  //   const remoteFileUri = `${url}`;
  //   const localFileName = `${post?.media.name}`;
  //   const localUri = FileSystem.cacheDirectory + localFileName;
  //   console.log(localUri);
  //   const album = await MediaLibrary.getAlbumAsync("Download");

  //   try {
  //     const downloadObject = FileSystem.createDownloadResumable(
  //       remoteFileUri,
  //       localUri
  //     );

  //     const response = await downloadObject.downloadAsync();

  //     if (response.status === 200) {
  //       Alert.alert("File downloaded successfully");
  //     } else {
  //       Alert.alert("File download failed");
  //     }
  //   } catch (error) {
  //     console.error("Error downloading file:", error);
  //     Alert.alert("An error occurred while downloading the file.");
  //   }
  // };

  return (
    <View>
      <View>
        {props.route.params.mediatype === "video" ? (
          <View>
            {props.route.params.screen === "message" ? (
              <GestureRecognizer
                onSwipeDown={() => {
                  navigation.goBack()
                }}
              >
                <VideoPlayer
                  style={{
                    height: Dimensions.get("screen").height,
                    width: Dimensions.get("screen").width,
                  }}
                  fullscreen={true}
                  defaultControlsVisible={true}
                  timeVisible={false}
                  slider={true}
                  videoProps={{
                    isLooping: false,
                    ref: video,
                    source: {
                      uri: props.route.params.url,
                    },
                    shouldPlay: true,
                    resizeMode: "contain",
                  }}
                />
              </GestureRecognizer>
            ) : (
              <GestureRecognizer
                onSwipeDown={() => {
                  setVideoURI(url)
                  setVideoDescriptionHandler(post?.description)
                  setShowMiniWindow(true)
                  setvideoAutherName(post?.postedby?.fullName)
                  navigation.goBack()
                }}
              >
                <VideoPlayer
                  style={{
                    height: Dimensions.get("screen").height,
                    width: Dimensions.get("screen").width,
                  }}
                  fullscreen={true}
                  defaultControlsVisible={true}
                  timeVisible={false}
                  slider={true}
                  videoProps={{
                    isLooping: false,
                    ref: video,
                    source: {
                      uri: url,
                    },
                    shouldPlay: true,
                    resizeMode: "contain",
                  }}
                />
              </GestureRecognizer>
            )}
          </View>
        ) : (
          <ImageBackground
            resizeMode="contain"
            source={{ uri: url }}
            style={{
              height: deviceHeight,
              width: deviceWidth,
              backgroundColor: Color.Black,
            }}
          />
        )}
        {/* Bottom tab */}
        {screen === "home" && (
          <View style={style.bottomTab}>
            {/* content container  */}
            <View style={style.contentContainer}>
              <View>
                <Text style={style.userName}>{post?.postedby?.fullName}</Text>
              </View>
              <View>
                <DescriptionText description={post?.description} />
              </View>
            </View>
            {/* Liked count container  */}
            <View style={style.likedCount}>
              <View>
                {likeCount > 0 && (
                  <View style={style.likedContainer}>
                    {liked ? (
                      <AntDesign
                        name="like1"
                        style={style.likeIcon}
                        color={Color.Blue}
                      />
                    ) : (
                      <AntDesign
                        name="like2"
                        style={style.likeIcon}
                        color={Color.White}
                      />
                    )}
                    <Text style={style.likeCount}>{likeCount}</Text>
                  </View>
                )}
              </View>

              <View style={style.commentContainer}>
                <View>
                  <View>
                    {post?.comments?.length > 0 && (
                      <View style={style.comment}>
                        <Text style={style.likeCount}>
                          {post?.comments?.length}
                        </Text>
                        <Text style={style.commetTitle}>comments</Text>
                      </View>
                    )}
                  </View>

                  <View></View>
                </View>
              </View>
            </View>

            <View style={style.actionMainContainer}>
              <View>
                <Pressable
                  android_ripple={{ color: Color.LightGrey }}
                  style={style.mainAction}
                  onPress={handleLike}
                >
                  {liked ? (
                    <FontAwesome
                      name="thumbs-up"
                      style={{ ...style.shareIcon, color: Color.Blue }}
                    />
                  ) : (
                    <FontAwesome name="thumbs-o-up" style={style.shareIcon} />
                  )}

                  <Text style={liked ? style.actionedText : style.actionText}>
                    Like
                  </Text>
                </Pressable>
              </View>
              <View>
                <Pressable
                  android_ripple={{ color: Color.LightGrey }}
                  style={style.mainAction}
                  onPress={handleOnClickComment}
                >
                  <FontAwesome name="comment-o" style={style.shareIcon} />
                  <Text style={style.actionText}>Comment</Text>
                </Pressable>
              </View>
              <View>
                <Pressable
                  android_ripple={{ color: Color.LightGrey }}
                  style={style.mainAction}
                  onPress={handleonshare}
                >
                  <AntDesign name="sharealt" style={style.shareIcon} />
                  <Text style={style.actionText}>Share</Text>
                </Pressable>
              </View>
            </View>
          </View>
        )}

        <View style={style.downloadContainer}>
          <TouchableOpacity
            style={style.donwloadIcn}
            onPress={() => setmodalVisible(!modalVisible)}
          >
            <Entypo
              name="dots-three-vertical"
              style={style.likeIcon}
              color={Color.White}
            />
          </TouchableOpacity>
        </View>
        <PostShareModal
          modalVisible={modalVisible}
          setModalVisible={setmodalVisible}
          name={post?.media.name}
          url={url}
        />
      </View>
    </View>
  )
}

const style = StyleSheet.create({
  bottomTab: {
    position: "absolute",
    width: "100%",
    bottom: deviceHeight * 0.065,
    backgroundColor: "rgba(0, 13, 16, 0.4)",
    justifyContent: "space-evenly",
    zIndex: 300,
  },

  likedCount: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: scale(16),
  },
  likedContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
  },
  likeIcon: {
    fontSize: scale(17),
  },
  likeCount: {
    fontFamily: "Roboto_400Regular",
    fontSize: scale(13),
    paddingHorizontal: scale(4),
    color: Color.White,
  },
  comment: {
    flexDirection: "row",
    alignItems: "center",
  },
  commetTitle: {
    fontFamily: "Roboto_400Regular",
    fontSize: scale(12),
    color: Color.White,
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
    flexWrap: "wrap",
  },
  mainAction: {
    flexDirection: "row",
    alignContent: "center",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: scale(20),
  },
  postAction: {
    flexDirection: "row",
    alignContent: "center",
    alignItems: "center",
    justifyContent: "space-between",
  },
  actionIcon: {
    width: scale(22),
    height: scale(23),
    color: Color.White,
  },
  actionText: {
    fontSize: scale(13),
    alignSelf: "center",
    fontFamily: "Roboto_400Regular",
    color: Color.White,
    marginLeft: scale(8),
  },
  actionedText: {
    fontSize: scale(13),
    alignSelf: "center",
    fontFamily: "Roboto_400Regular",
    color: Color.Blue,
    marginLeft: scale(8),
  },
  pressedIcon: {
    color: Color.Blue,
  },
  unpressedIcon: {
    color: Color.White,
  },
  shareIcon: {
    paddingVertical: scale(12),
    color: Color.White,
    fontSize: scale(21),
  },
  contentContainer: {},
  userName: {
    paddingHorizontal: scale(18),
    paddingTop: scale(10),
    fontFamily: "Roboto_500Medium",
    color: Color.White,
  },
  downloadContainer: {
    position: "absolute",
    zIndex: 100,
    right: scale(15),
    top: scale(30),
  },
  donwloadIcn: {
    paddingHorizontal: scale(10),
    paddingVertical: scale(10),
  },
})
