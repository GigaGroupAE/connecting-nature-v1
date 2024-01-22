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
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import CommentInput from "../../components/CommentInput";
import HeaderNormal from "../../components/HeaderNormal";
import Color from "../../../assets/colors/Color";
import { calculateTimeDifference } from "../../utils/timeDifference";
import VideoPlayer from "expo-video-player";
import { useStateContext } from "../../contexts/ContextProvider";

import { BASE_URL } from "../../../CONSTANTS";

import { AntDesign, MaterialCommunityIcons } from "react-native-vector-icons";
import { useUserState } from "../../slices/userSlice";
import axios from "axios";
import { io } from "socket.io-client";
import moment from "moment";
import { useNavigation, useRoute } from "@react-navigation/native";
import MiniVideoPlayer from "../../components/MiniVideoPlayer";
import StoryCommentHeader from "./StoryCommentHeader";
import PostDescription from "../../components/PostDesciption";

import StoryVideo from "../../components/StoryVideo";
import StoryImage from "../../components/StoryImage";
import StoryDeleteModal from "./StoryDeleteModal";

const width = Dimensions.get("screen").width;
const height = Dimensions.get("screen").height;
const socket = io.connect(`${BASE_URL}/CN`);

//  comments container
const CommentItem = ({ item }) => {
  let timePassed = calculateTimeDifference(item.date);

  return (
    <View style={styles.commentMainContainer}>
      <View style={{ paddingVertical: height * 0.01 }}>
        <Image
          style={styles.userImg}
          source={{
            uri: `${BASE_URL}/images/${item.commented_by.profile}`,
          }}
        />
      </View>
      <View>
        <View style={styles.commentTextContainer}>
          <View style={styles.nameFollow}>
            <Text style={styles.userName}>{item.commented_by.fullName}</Text>
            {/* <Text style={styles.follow}>{item.role}</Text> */}
            {(item.commented_by.type === "Operations" ||
              item.commented_by.type === "Admin" ||
              item.commented_by.type === "Manager" ||
              item.commented_by.type === "Assistant Manager" ||
              item.commented_by.type === "Super Admin" ||
              item.commented_by.type === "celebrity") && (
              <MaterialCommunityIcons
                name="check-decagram"
                style={styles.adminIcon}
              />
            )}
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

const StoryComment = (props) => {
  var date = moment().utcOffset("+05:00");
  const {
    loading,
    setLoading,
    selectedStory,
    showMiniWindow,
    videoURI,
    videoAutherName,
    showSnackbar,
  } = useStateContext();
  const userstate = useUserState();
  const route = useRoute();
  const navigation = useNavigation();
  const [reactions, setreactions] = useState([...selectedStory.reactions]);
  const [textInputFocused, setTextInputFocused] = useState(false);
  const [comments, setcomments] = useState([...selectedStory.comments]);
  const [shares, setshares] = useState([...selectedStory.shares]);
  const [modalVisible, setmodalVisible] = useState(false);
  const [liked, setliked] = useState(
    reactions.some((user) => {
      return user._id === userstate.id;
    })
  );

  console.log(modalVisible);
  let tempcomment = "";
  const handlecommentinput = (props) => {
    if (props !== "") {
      tempcomment = props;
    }
  };

  const updatereactions = async (likes, notify = false) => {
    if (liked === false) {
      //check if the owner of post is not the user that is logged IN.
      if (
        notify &&
        selectedStory.postedby.phoneNumber !== userstate.phoneNumber
      ) {
        // notifications
        const config = {
          headers: {
            "auth-token": userstate.token,
          },
        };
      }
    }
    axios
      .patch(
        `${BASE_URL}/story/updatestory/${selectedStory._id}`,
        { reactions: likes },
        {
          headers: {
            "auth-token": userstate.token,
          },
        }
      )
      .then((res) => {
        setreactions(res.data.reactions);
      })
      .catch((e) => console.log(e));
  };

  // handle comments
  const handlesend = async () => {
    setLoading(true);
    Keyboard.dismiss();
    if (tempcomment !== "") {
      let newcomments = comments;
      newcomments.push({
        description: tempcomment,
        commented_by: userstate.id,
        date: date,
      });

      const config = {
        headers: {
          "auth-token": userstate.token,
        },
      };

      try {
        let { data } = await axios.patch(
          `${BASE_URL}/story/updatestory/${selectedStory._id}`,
          { comments: comments },
          {
            headers: {
              "auth-token": userstate.token,
            },
          }
        );
        setLoading(false);
        if (data) {
          socket.emit("send_comments_story", data);
          setLoading(false);
        }
      } catch (error) {
        console.log("coming from this block is the error", error);
        setLoading(false);
      }
    } else {
      alert("Cannot post an empty Comment");
      setLoading(false);
    }
  };

  useEffect(() => {
    try {
      socket.on("receive_comments_story", (data) => {
        setcomments(data);
      });
    } catch (e) {
      console.log(e);
    }
  }, [socket]);

  // handle share

  const handleonshare = async () => {
    try {
      let tempshares = [...shares];
      tempshares.push(userstate.id);

      const formData = new FormData();
      ["shares", "comments", "reactions"].forEach((e) =>
        formData.append(e, JSON.stringify([]))
      );
      formData.append("description", selectedStory.description);
      formData.append("postedby", JSON.stringify(userstate.id));

      if (selectedStory.media) {
        formData.append("media", {
          name: selectedStory.media.name,
          uri: `${BASE_URL}/images/${selectedStory.media.name}`,
          type: selectedStory.media.type,
        });
      } else {
        formData.append("media", null);
      }

      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
          Accept: "application/json",
          "auth-token": userstate.token,
        },
      };

      // Create the new story
      const postResponse = await axios.post(
        `${BASE_URL}/story/addstory/`,
        formData,
        config
      );
      showSnackbar("The story has been shared");

      // Update the shares count for the selected story
      const res = await axios.patch(
        `${BASE_URL}/story/updatestory/${selectedStory._id}`,
        { shares: tempshares },
        {
          headers: {
            "auth-token": userstate.token,
          },
        }
      );
      setshares([...res.data.shares]);
    } catch (error) {
      console.log(error);
      showSnackbar(
        "Sorry, we couldn't share the story at the moment. Please try again later."
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
      let templike = [...reactions];
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

  const StoryCommentHead = useMemo(
    () => <StoryCommentHeader setmodalVisible={setmodalVisible} />,
    [modalVisible]
  );
  const StoryDescription = useMemo(
    () => <PostDescription description={selectedStory.description} />,
    [selectedStory.description]
  );

  const ShowStoryVideo = useMemo(
    () => (
      <StoryVideo
        postVideo={selectedStory.media.name}
        videoAuther={selectedStory.postedby.fullName}
        videoDescription={selectedStory.description}
        selectedStory={selectedStory}
      />
    ),
    [selectedStory]
  );

  const ShowStoryImage = useMemo(
    () => (
      <StoryImage
        media={selectedStory?.media.name}
        mediaDesciption={selectedStory?.description}
        id={selectedStory._id}
        imageStyle={styles.image}
      />
    ),
    [selectedStory]
  );

  const refetch = () => {
    navigation.goBack();
  };

  const modalComponent = useMemo(
    () => (
      <StoryDeleteModal
        post={selectedStory}
        refetch={refetch}
        setmodalVisible={setmodalVisible}
      />
    ),
    [modalVisible, selectedStory]
  );

  const supportedImageFormats = ["image/jpeg", "image/png", "image/jpg"];

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : ""}
      style={{ flex: 1 }}
    >
      <View style={{ backgroundColor: Color.White, height: "100%" }}>
        {/* Header */}
        <HeaderNormal title={"Spotlight"} />
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* User Details */}
          {modalVisible && modalComponent}
          {StoryCommentHead}
          {/* Post Description */}

          {StoryDescription}

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
                {selectedStory.media?.type === "video/mp4" && (
                  <View>{ShowStoryVideo}</View>
                )}
              </View>

              {/* Image */}
              <View>
                {supportedImageFormats.includes(selectedStory.media?.type) && (
                  <View>{ShowStoryImage}</View>
                )}
              </View>
            </View>

            {/* Reaction Container */}
            <View style={{ marginTop: height * 0.015 }}>
              <View style={styles.topStoryMainContainer}>
                <View style={styles.topStoryContainer}>
                  <TouchableOpacity
                    style={styles.postLikes}
                    onPress={handleLike}
                  >
                    {liked ? (
                      <AntDesign
                        name="heart"
                        style={{ ...styles.icons, color: Color.Red }}
                      />
                    ) : (
                      <AntDesign name="hearto" style={styles.icons} />
                    )}
                    <Text style={styles.comment}>{reactions.length}</Text>
                  </TouchableOpacity>
                  <Pressable
                    android_ripple={{ color: Color.LightGrey }}
                    style={styles.mainAction}
                  >
                    <View style={styles.postLikes}>
                      <MaterialCommunityIcons
                        name="comment-outline"
                        style={styles.icons}
                      />
                      <Text style={styles.comment}>{comments.length}</Text>
                    </View>
                  </Pressable>
                  <Pressable onPress={handleonshare} style={styles.postLikes}>
                    <MaterialCommunityIcons
                      name="share-variant-outline"
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
              keyExtractor={(item) => item._id}
              renderItem={({ item }) => <CommentItem item={item} />}
            />
          </View>
        </ScrollView>

        {/* Comment Input */}
        {selectedStory.media.type === "video/mp4" && showMiniWindow && (
          <View style={styles.miniVideo}>
            <MiniVideoPlayer uri={videoURI} videoAutherName={videoAutherName} />
          </View>
        )}

        <CommentInput
          disabled={loading}
          placeholder={"Write your comment"}
          onPress={handlesend}
          onchange={handlecommentinput}
          onFocus={handleTextInputFocus}
          onBlur={handleTextInputBlur}
        />
      </View>
    </KeyboardAvoidingView>
  );
};

export default StoryComment;

const styles = StyleSheet.create({
  postLikes: {
    fontSize: 21,
    flexDirection: "row",
    alignItems: "center",
  },
  comment: {
    fontSize: 14,
    fontFamily: "Roboto_500Medium",
    fontWeight: "400",
    color: Color.Black,
  },
  icons: {
    fontSize: 22,
    color: Color.Black,
    paddingHorizontal: width * 0.02,
  },

  commentMainContainer: {
    flexDirection: "row",
    paddingHorizontal: height * 0.02,
    paddingVertical: height * 0.01,
  },
  commentTextContainer: {
    marginLeft: width * 0.04,
    alignItems: "baseline",
    alignSelf: "flex-start",
    backgroundColor: "#F5F6FA",
    // padding: "2.5%",
    paddingHorizontal: width * 0.04,
    paddingVertical: height * 0.013,
    borderRadius: 15,
    marginRight: "15%",
    marginTop: "2.5%",
  },

  nameFollow: {
    flexDirection: "row",
    alignItems: "center",
  },
  userName: {
    fontWeight: "bold",
    color: Color.Black,
    paddingRight: width * 0.03,
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
    flexDirection: "row",
    marginLeft: width * 0.19,
    marginTop: height * 0.006,
  },
  time: {
    fontSize: 13,
    fontWeight: "500",
    color: "#585858",
    lineHeight: 21,
    marginRight: width * 0.04,
  },

  userImg: {
    width: 40,
    height: 40,
    resizeMode: "contain",
    borderRadius: height * 0.1,
  },
  userContainer: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingVertical: 2,
  },
  userNameContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    overflow: "hidden",
  },
  userName: {
    fontFamily: "Roboto_500Medium",
    fontWeight: "500",
    fontSize: height * 0.02,
  },
  postDuration: {
    fontSize: 14,
    fontWeight: "400",
    fontFamily: "Roboto_400Regular",
    color: Color.DarkGrey,
  },
  postDescr: {
    fontSize: 13,
    fontFamily: "Roboto_400Regular",
    lineHeight: 20,
    paddingHorizontal: width * 0.04,
    paddingVertical: height * 0.015,
  },

  topStoryMainContainer: {
    backgroundColor: Color.White,
    shadowColor: Color.DarkGrey,
    borderWidth: 0.8,
    borderColor: "#DADADA",
  },
  topStoryContainer: {
    justifyContent: "space-around",
    borderColor: Color.White,
    paddingVertical: height * 0.0095,
    flexDirection: "row",
  },
  adminIcon: {
    marginLeft: 5,
    alignSelf: "center",
    fontSize: height * 0.018,
    color: Color.Blue,
  },
  image: {
    height: height * 0.25,
    marginTop: 5,
    width: "100%",
    resizeMode: "cover",
  },
  miniVideo: {
    position: "absolute",
    zIndex: 200,
    width: "100%",
    height: "9%",
    bottom: height * 0.07,
    backgroundColor: "red",
  },
});
