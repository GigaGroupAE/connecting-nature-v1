import React, { Component, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Dimensions,
  Pressable,
} from "react-native";
import { calculateTimeDifference } from "../utils/timeDifference";
import { AntDesign } from "react-native-vector-icons";
import { BASE_URL } from "../../CONSTANTS";
import Color from "../../assets/colors/Color";
import { useNavigation } from "@react-navigation/native";
import DeleteCommentModal from "./DeleteCommentModal";
export default function Comment({
  comment,
  handleDelete,
  index,
  updatereactions,
}) {
  let timePassed = calculateTimeDifference(comment?.date);
  const [modalVisible, setmodalVisible] = useState(false);
  const navigation = useNavigation();

  const commented_by = comment?.commented_by;

  const getindex = (item, aindex) => {
    updatereactions(item, aindex);
  };

  return (
    <View>
      {/* Comment Section */}

      <View>
        <View style={styles.commentMainContainer}>
          <Image
            style={styles.avatar}
            source={{ uri: `${BASE_URL}/images/${commented_by?.profile}` }}
          />
          <TouchableOpacity
            style={styles.commentTextContainer}
            onLongPress={() => setmodalVisible(true)}
          >
            <View style={styles.nameFollow}>
              <Pressable
                onPress={() => {
                  navigation.navigate("UserProfile", {
                    userPhoneNumber: commented_by?.phoneNumber,
                  });
                }}
              >
                <Text style={styles.userName}>{commented_by?.fullName}</Text>
              </Pressable>
            </View>

            <View>
              <Text style={styles.commentText}>{comment?.description}</Text>
            </View>
          </TouchableOpacity>
        </View>
        <View style={styles.action}>
          <Text style={styles.time}>{timePassed}</Text>
        </View>
      </View>
      <DeleteCommentModal
        modalVisible={modalVisible}
        setModalVisible={setmodalVisible}
        comment={comment}
        handleDelete={handleDelete}
        index={index}
        updatereactions={getindex}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  main: {
    paddingHorizontal: 15,
    borderRadius: 20,
    height: "100%",
    width: "100%",
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
});
