import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  FlatList,
  Pressable,
  TouchableOpacity,
  ScrollView,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import React, { useEffect, useMemo, useState } from "react";
import CommentInput from "../../components/CommentInput";
import HeaderNormal from "../../components/HeaderNormal";
import Color from "../../../assets/colors/Color";

import { useStateContext } from "../../contexts/ContextProvider";

import { BASE_URL } from "../../../CONSTANTS";

import { AntDesign, MaterialCommunityIcons } from "react-native-vector-icons";
import { useUserState } from "../../slices/userSlice";
import axios from "axios";
import { io } from "socket.io-client";
import moment from "moment";
import { useNavigation } from "@react-navigation/native";
import MiniVideoPlayer from "../../components/MiniVideoPlayer";
import StoryCommentHeader from "./StoryCommentHeader";
import PostDescription from "../../components/PostDesciption";

import StoryVideo from "../../components/StoryVideo";
import StoryImage from "../../components/StoryImage";
import StoryDeleteModal from "./StoryDeleteModal";
import CommentListStroy from "./CommentListStroy";

const width = Dimensions.get("screen").width;
const height = Dimensions.get("screen").height;
const socket = io.connect(`${BASE_URL}/CN`);

const StoryComment = (props) => {
  const date = moment().utcOffset("+05:00");
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

  const navigation = useNavigation();

  const [reactions, setreactions] = useState([...selectedStory.reactions]);
  const [comments, setcomments] = useState([...selectedStory.comments]);
  const [shares, setshares] = useState([...selectedStory.shares]);
  const [modalVisible, setmodalVisible] = useState(false);
  const [liked, setliked] = useState(
    reactions.some((user) => {
      return user._id === userstate.id;
    }),
  );

  let tempcomment = "";
  const handlecommentinput = (props) => {
    if (props !== "") {
      tempcomment = props;
    }
  };

  const updatereactions = async (likes, notify = false) => {
    axios
      .patch(
        `${BASE_URL}/story/updatestory/${selectedStory._id}`,
        { reactions: likes },
        {
          headers: {
            "auth-token": userstate.token,
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
    if (tempcomment !== "") {
      const newcomments = comments;
      newcomments.push({
        description: tempcomment,
        commented_by: userstate.id,
        date: date,
      });

      try {
        const { data } = await axios.patch(
          `${BASE_URL}/story/updatestory/${selectedStory._id}`,
          { comments: comments },
          {
            headers: {
              "auth-token": userstate.token,
            },
          },
        );
        setLoading(false);
        if (data) {
          socket.emit("send_comments_story", data);
          setLoading(false);
        }
      } catch (error) {
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
    } catch (e) {}
  }, [socket]);

  // handle share

  const handleonshare = async () => {
    try {
      const tempshares = [...shares];
      tempshares.push(userstate.id);

      const formData = new FormData();
      ["shares", "comments", "reactions"].forEach((e) =>
        formData.append(e, JSON.stringify([])),
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
      await axios.post(`${BASE_URL}/story/addstory/`, formData, config);
      showSnackbar("The story has been shared");

      // Update the shares count for the selected story
      const res = await axios.patch(
        `${BASE_URL}/story/updatestory/${selectedStory._id}`,
        { shares: tempshares },
        {
          headers: {
            "auth-token": userstate.token,
          },
        },
      );
      setshares([...res.data.shares]);
    } catch (error) {
      showSnackbar(
        "Sorry, we couldn't share the story at the moment. Please try again later.",
      );
    }
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

  const StoryCommentHead = useMemo(
    () => <StoryCommentHeader setmodalVisible={setmodalVisible} />,
    [modalVisible],
  );
  const StoryDescription = useMemo(
    () => <PostDescription description={selectedStory.description} />,
    [selectedStory.description],
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
    [selectedStory],
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
    [selectedStory],
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
    [modalVisible, selectedStory],
  );

  const supportedImageFormats = ["image/jpeg", "image/png", "image/jpg"];

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : ""}
      style={{ flex: 1 }}
    >
      <View style={{ backgroundColor: Color.White, height: "100%" }}>
        {/* Header */}
        <HeaderNormal title="Spotlight" />
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
              renderItem={({ item }) => (
                <CommentListStroy item={item} setcomments={setcomments} />
              )}
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
          placeholder="Write your comment"
          onPress={handlesend}
          onchange={handlecommentinput}
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
