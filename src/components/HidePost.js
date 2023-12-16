import React from "react";
import { View, Pressable, Text, StyleSheet, Dimensions } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import {
  Entypo,
  MaterialIcons,
  MaterialCommunityIcons,
} from "react-native-vector-icons";

import Color from "../../assets/colors/Color";
//Network Imports
import { BASE_URL } from "../../CONSTANTS";
import axios from "axios";

//state imports
import { useUserState } from "../slices/userSlice";

const HidePost = (props) => {
  const userState = useUserState();

  const blockUser = async () => {
    const config = {
      headers: {
        "auth-token": userState.token,
      },
    };
    try {
      //make api call here
      const { data } = await axios.patch(
        `${BASE_URL}/user/block-user/${post.postedby.id}`,
        {},
        config
      );
      if (data.success) {
        reload();
      }
      hideUsersPost();
    } catch (error) {
      console.log("some error occured");
    }
  };
  return (
    <View style={styles.mainContainer}>
      <View style={styles.topOfHead}>
        <View style={{ flexDirection: "row" }}>
          <Entypo name="eye-with-line" size={20} color={Color.Blue} />
          <Text style={styles.headText}>Post hidden</Text>
        </View>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Text style={styles.messageText}>
            Hiding posts to personalize your Feed.
          </Text>
          <TouchableOpacity onPress={() => props.onPress()}>
            <MaterialCommunityIcons
              name="undo-variant"
              size={22}
              color={Color.Grey}
              style={{
                backgroundColor: Color.VeryLightGrey,
                paddingHorizontal: 15,
                paddingVertical: 3,
                borderRadius: Dimensions.get("screen").height * 0.1,
              }}
            />
          </TouchableOpacity>
        </View>
      </View>
      <Pressable>
        <View
          style={{
            marginTop: 12,
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <MaterialIcons name="report-problem" size={20} color={Color.Grey} />
          <Text style={styles.belowLineText}>Report post</Text>
        </View>
      </Pressable>
      <Pressable>
        <View
          style={{
            marginTop: 12,
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <Entypo name="block" size={20} color={Color.Grey} />
          <Text style={styles.belowLineText}>Block user</Text>
        </View>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    backgroundColor: Color.White,
    paddingHorizontal: 17,
    paddingVertical: 10,
  },
  topOfHead: {
    borderBottomWidth: 0.5,
    borderColor: Color.VeryLightGrey,
  },
  headText: {
    marginLeft: 10,
    color: Color.Grey,
  },
  messageText: {
    color: Color.Black,
    fontFamily: "Roboto_600SemiBold",
    fontSize: 15,
    width: "60%",
    marginTop: 5,
  },
  belowLineText: {
    marginLeft: 10,
    color: Color.Grey,
    fontSize: 14,
    fontFamily: "Roboto_400Regular",
  },
});

export default HidePost;
