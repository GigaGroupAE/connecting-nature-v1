import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { useUserState, useUserStateActions } from "../../slices/userSlice";
import { MaterialCommunityIcons } from "react-native-vector-icons";
import { BASE_URL } from "../../../CONSTANTS";
import Color from "../../../assets/colors/Color";

const Height = Dimensions.get("screen").height;
const Width = Dimensions.get("screen").width;

const UserFollowers = ({ item }) => {
  const navigation = useNavigation();

  const handleNavigation = (number) => {
    navigation.navigate("UserProfile", {
      userPhoneNumber: number,
      screen: "follower",
    });
  };

  const username =
    item?.fullName.length > 25
      ? item.fullName.slice(0, 15) + "..."
      : item.fullName;

  return (
    <View>
      <View style={styles.followerCard}>
        <View style={styles.imageContainer}>
          <Image
            source={{
              uri: `${BASE_URL}/images/${item.profile}`,
            }}
            style={styles.userImage}
          />
        </View>

        <View style={styles.nameContainer}>
          <TouchableOpacity
            onPress={() => {
              handleNavigation(item.phoneNumber);
            }}
          >
            <View style={{ flexDirection: "row" }}>
              <Text style={styles.userName}>{username}</Text>
              {(item.type === "Operations" ||
                item.type === "Admin" ||
                item.type === "Manager" ||
                item.type === "Assistant Manager" ||
                item.type === "Super Admin" ||
                item.type === "celebrity") && (
                <MaterialCommunityIcons
                  name="check-decagram"
                  style={styles.adminIcon}
                />
              )}
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default UserFollowers;

const styles = StyleSheet.create({
  container: {
    backgroundColor: Color.White,
    flex: 1,
  },
  followerCard: {
    flexDirection: "row",
    backgroundColor: Color.White,
    borderRadius: 8,
    width: "100%",
    alignSelf: "center",
    paddingVertical: Height * 0.015,
    paddingHorizontal: Width * 0.04,
    borderBottomWidth: 1,
    borderBottomColor: Color.VeryLightGrey,
  },
  userImage: {
    borderRadius: 23,
    width: 50,
    height: 50,
    resizeMode: "center",
  },
  imageContainer: {
    width: 50,
    height: 50,
    borderRadius: 30,
    overflow: "hidden",
    alignItems: "center",
  },
  nameContainer: {
    flexDirection: "row",
    width: "85%",
    marginLeft: Width * 0.03,
    justifyContent: "space-between",
    alignSelf: "center",
  },
  userName: {
    fontFamily: "Roboto_500Medium",
    fontSize: Height * 0.0177,
  },
  userRole: {
    fontFamily: "Roboto_400Regular",
    color: Color.Blue,
    marginTop: "-1.5%",
    fontSize: Height * 0.016,
  },
  button: {
    alignSelf: "center",
    backgroundColor: Color.Blue,
    marginVertical: "auto",
    paddingVertical: Height * 0.01,
    paddingHorizontal: Width * 0.05,
    borderRadius: Height * 0.01,
  },
  buttonTitle: {
    color: Color.White,
    fontFamily: "Roboto_500Medium",
    textTransform: "capitalize",
  },
  adminIcon: {
    marginLeft: 5,
    alignSelf: "center",
    fontSize: Height * 0.018,
    color: Color.Blue,
  },
});
