import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
  Dimensions,
  Image,
  ScrollView,
  FlatList,
  Pressable,
  Keyboard,
} from "react-native";
import React, { useReducer, useState } from "react";
import { Entypo, Foundation } from "react-native-vector-icons";
import Color from "../../assets/colors/Color";
import { useNavigation, useRoute } from "@react-navigation/native";
import Comment from "./Comment";
import { BASE_URL } from "../../CONSTANTS";
import { useUserState } from "../slices/userSlice";
import { axiosInstance } from "../../axiosInstance";
import { io } from "socket.io-client";
import CampaignCommentInput from "./CampaignCommentInput";
import moment from "moment";
import { calculateTimeDifference } from "../utils/timeDifference";
import { useStateContext } from "../contexts/ContextProvider";
import { scale } from "react-native-size-matters";

const Height = Dimensions.get("screen").height;
const Width = Dimensions.get("screen").width;
const socket = io.connect(`${BASE_URL}/CN`);

const LivePointsComment = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const userState = useUserState();
  let date = moment().utcOffset("+05:00");
  const campaign = route?.params?.campaign;
  const activeScreen = route?.params?.screen;
  const { comment, setcomment } = useStateContext();

  const [tempComment, setTempComment] = useState("");
  const [textInputFocused, setTextInputFocused] = useState(false);

  const handleDelete = () => {};

  const handleTextInputFocus = () => {
    setTextInputFocused(true);
  };

  const handleTextInputBlur = () => {
    setTextInputFocused(false);
  };
  const handlecomment = () => {
    // if (props.route.params.campaign !== userState.phoneNumber) {
    //      const content = {
    //        title: userState.fullName + " liked your post",
    //      };
    // }
    Keyboard.dismiss();
    if (tempComment !== "") {
      let newcomments = comment;
      newcomments.push({
        description: tempComment,
        postedby: userState.phoneNumber,
        type: userState.type,
        fullName: userState.fullName,
        profile: userState.profile,
        date: date,
      });

      axiosInstance
        .patch(`/campaigns/update/${campaign._id}`, {
          messages: newcomments,
        })
        .then((res) => {
          socket.emit("send_message", res.data.messages);
          setcomment(res?.data?.messages);
        })
        .catch((e) => console.log(e));
    } else {
      alert("Cannot post an empty Comment");
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <SafeAreaView style={{ backgroundColor: Color.LightBlue }}>
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
          {!comment?.length > 0 && (
            <View style={styles.noComment}>
              <Image
                style={styles.noCommentImage}
                source={require("../../assets/no-comments.png")}
              />
              <Text style={styles.noCommentHeading}>No Comments</Text>
              <Text style={styles.noCommentText}>Be the first to comment</Text>
            </View>
          )}
          {/* Comment Section */}
          {/* <ScrollView
            style={styles.mainScroll}
            showsVerticalScrollIndicator={false}
          > */}
          <View
            style={
              activeScreen === "arch"
                ? styles.mainScrollArch
                : styles.mainScroll
            }
          >
            <FlatList
              data={comment}
              showsVerticalScrollIndicator={false}
              renderItem={({ item }) => {
                let timePassed = calculateTimeDifference(item?.date);
                return (
                  <View>
                    {/* Comment Section */}

                    <View>
                      <View style={styles.commentMainContainer}>
                        <Image
                          style={styles.avatar}
                          source={{
                            uri: `${BASE_URL}/images/${item?.profile}`,
                          }}
                        />
                        <TouchableOpacity
                          style={styles.commentTextContainer}
                          // onLongPress={() => setmodalVisible(true)}
                        >
                          <View style={styles.nameFollow}>
                            <Pressable
                              onPress={() => {
                                navigation.navigate("UserProfile", {
                                  userPhoneNumber: item?.phoneNumber,
                                });
                              }}
                            >
                              <Text style={styles.userName}>
                                {item?.fullName}
                              </Text>
                            </Pressable>
                          </View>

                          <View>
                            <Text style={styles.commentText}>
                              {item?.description}
                            </Text>
                          </View>
                        </TouchableOpacity>
                      </View>
                      <View style={styles.action}>
                        <Text style={styles.time}>{timePassed}</Text>
                      </View>
                    </View>
                  </View>
                );
              }}
            />
          </View>
          {/* </ScrollView> */}
        </View>

        {activeScreen === "arch" ? (
          <View style={styles.lockCampaign}>
            <Foundation name="lock" style={styles.lockIcon} />
            <Text style={styles.campaginCloseTitle}>
              You can’t post a comment on this Campaign. It’s closed check out
              other live campaigns in Campaign Tab.
            </Text>
          </View>
        ) : (
          <CampaignCommentInput
            placeholder={"Write your message..."}
            onPress={handlecomment}
            onchange={setTempComment}
            onFocus={handleTextInputFocus}
            onBlur={handleTextInputBlur}
            id={campaign._id}
          />
        )}
      </SafeAreaView>
    </View>
  );
};

export default LivePointsComment;
const styles = StyleSheet.create({
  main: {
    paddingHorizontal: 15,
    backgroundColor: "#fff",
    height: "100%",
    width: "100%",
  },
  header: {
    marginTop: 20,
    marginBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignContent: "center",
    alignItems: "center",
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
    fontWeight: "400",
    color: Color.Black,
  },
  headText: {
    fontFamily: "Roboto_600SemiBold",
    color: Color.Black,
    fontSize: 16,
  },
  commentMainContainer: {
    marginTop: 10,
    flexDirection: "row",
    alignContent: "center",
    alignItems: "center",
  },
  commentTextContainer: {
    marginLeft: 15,
    alignItems: "baseline",
    alignSelf: "flex-start",
    backgroundColor: "#F5F6FA",
    padding: 7,
    borderRadius: 15,
    marginRight: "15%",
  },
  avatar: {
    alignSelf: "flex-start",
    borderRadius: Dimensions.get("screen").height * 0.1,
    width: Dimensions.get("screen").height * 0.06,
    height: Dimensions.get("screen").height * 0.06,
  },
  nameFollow: {
    flexDirection: "row",
  },
  userName: {
    fontWeight: "bold",
    color: Color.Black,
  },
  follow: {
    color: Color.Blue,
    marginLeft: 5,
  },
  commentText: {
    color: Color.Black,
    lineHeight: 20,
  },
  action: {
    flexDirection: "row",
    marginLeft: 65,
    marginTop: 5,
  },
  time: {
    fontSize: 13,
    fontWeight: "500",
    color: Color.Black,
    lineHeight: 21,
    marginRight: 15,
  },
  like: {
    fontSize: 13,
    color: Color.Black,
    fontWeight: "500",
    lineHeight: 21,
  },
  liked: {
    fontSize: 13,
    color: Color.Blue,
    fontWeight: "500",
    lineHeight: 21,
  },
  mainScroll: {
    width: "100%",
    marginBottom: "50%",
  },
  mainScrollArch: {
    width: "100%",
    marginBottom: "33%",
  },
  noComment: {
    position: "absolute",
    right: "25%",
    bottom: "40%",
  },
  noCommentImage: {
    width: Dimensions.get("screen").height * 0.25,
    height: Dimensions.get("screen").height * 0.15,
  },
  noCommentHeading: {
    fontFamily: "Roboto_600SemiBold",
    fontSize: 14,
    alignSelf: "center",
    color: Color.Black,
  },
  noCommentText: {
    fontFamily: "Roboto_400Regular",
    fontSize: 12,
    alignSelf: "center",
    color: Color.Black,
  },
  lockCampaign: {
    backgroundColor: Color.LightBg,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: scale(12),
    paddingVertical: scale(8),
    position: "absolute",
    bottom: 0,
  },
  campaginCloseTitle: {
    width: "96%",
    fontFamily: "Roboto_400Regular",
    fontSize: scale(12),
    paddingLeft: scale(8),
    color: Color.Grey,
  },
  lockIcon: {
    fontSize: scale(24),
    color: Color.Yellow,
  },
});
