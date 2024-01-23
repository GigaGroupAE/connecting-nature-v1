import React from "react";
import {
  Dimensions,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Color from "../assets/colors/Color";
import { useUserState } from "./slices/userSlice";
import moment from "moment";
import { axiosInstance } from "../axiosInstance";
import { io } from "socket.io-client";
import { BASE_URL } from "../CONSTANTS";
import { useStateContext } from "./contexts/ContextProvider";

const socket = io.connect(`${BASE_URL}/CN`);
const Width = Dimensions.get("screen").width;
const Height = Dimensions.get("screen").height;

const truncateDescription = (description) => {
  if (description.length > 15) {
    return `${description.slice(0, 14)}...`;
  }
  return description;
};

const LivepollComments = ({ id, screen }) => {
  const { comment, setcomment } = useStateContext();

  const commentsToShuffle = comment;
  let date = moment().utcOffset("+05:00");
  const shuffledComments = commentsToShuffle.slice(0, 8);
  const userState = useUserState();

  const handleComment = (item) => {
    let newcomments = comment;
    newcomments.push({
      description: item?.description,
      postedby: userState.phoneNumber,
      type: userState.type,
      fullName: userState.fullName,
      profile: userState.profile,
      date: date,
    });

    axiosInstance
      .patch(`/campaigns/update/${id}`, {
        messages: newcomments,
      })
      .then((res) => {
        socket.emit("send_message", res.data.messages);
        setcomment(res?.data?.messages);
      })
      .catch((e) => console.log(e));
  };

  const renderItem = ({ item, index }) => {
    return (
      <TouchableOpacity>
        <TouchableOpacity
          style={styles.buttonContainer}
          onPress={() => handleComment(item)}
        >
          {screen !== "comment" && (
            <Image
              source={{
                uri: `${BASE_URL}/${item?.profile}`,
                cache: "force-cache",
              }}
              style={styles.userImage}
            />
          )}

          <Text style={styles.comment}>
            {truncateDescription(item?.description)}
          </Text>
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  return (
    <FlatList
      horizontal
      data={shuffledComments}
      renderItem={renderItem}
      keyExtractor={(item, index) => index.toString()}
      style={{
        flexDirection: "row",
        backgroundColor: Color.White,
        paddingVertical: Height * 0.005,
      }}
      showsHorizontalScrollIndicator={false}
    />
  );
};

export default LivepollComments;

const styles = StyleSheet.create({
  buttonContainer: {
    backgroundColor: "#EBF5FF",
    paddingHorizontal: Width * 0.04,
    paddingVertical: Height * 0.008,
    borderRadius: Height * 0.1,
    marginHorizontal: Width * 0.012,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  userImage: {
    width: 20,
    height: 20,
    borderRadius: 10,
    resizeMode: "cover",
    backgroundColor: Color.Disable,
  },
  comment: {
    fontSize: Height * 0.018,
    marginHorizontal: Width * 0.012,
    fontFamily: "Roboto_500Medium",
  },
});
