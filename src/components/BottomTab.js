import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Pressable,
  Dimensions,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { useNavigation } from "@react-navigation/native";
import Color from "../../assets/colors/Color";
import AddButton from "./AddButton";
import { CreatePost } from "../screens";
import { useUserState } from "../slices/userSlice";
import { authorized } from "../utils/authorized";

const Height = Dimensions.get("screen").height;
const Width = Dimensions.get("screen").width;
export default function BottomTab(props) {
  const navigation = useNavigation();
  const userstate = useUserState();

  const [createPostVisible, setCreatePostVisible] = useState(false);
  const onAddPost = () => {
    navigation.navigate("AddPost", {
      origin: "post",
      reload: props.reload,
    });
    setCreatePostVisible(false);
  };
  const closeModal = () => {
    setCreatePostVisible(false);
  };

  function showCreatePost() {
    setCreatePostVisible(true);
  }
  function hideCreatePost() {
    setCreatePostVisible(false);
  }

  // INCLUDE user AS AN ARGUMENT IN BELOW 2 LINES IF YOU WANT TO ACCESS ADMIN AND CAMPAIGN CREATION.S
  const canSeeCampaign = authorized(
    userstate.type,
    "Manager",
    "celebrity",
    "user"
  );

  const handleHome = () => {
    navigation.navigate("Home");
    props?.scrollToTop();
  };
  return (
    <View style={styles.mainContainer}>
      <View>
        <Pressable
          style={styles.tabStyle}
          onFocus
          onPress={() => handleHome()}
          android_ripple={{ color: Color.LightGrey, borderless: true }}
        >
          <FontAwesome
            name="home"
            size={30}
            color={props?.activeMenu === "Home" ? Color.Blue : Color.Black}
          />
          {/* <Text
            style={
              props?.activeMenu === "Home"
                ? styles.activeTabText
                : styles.tabText
            }
          >
            Home
          </Text> */}
        </Pressable>
      </View>
      <View>
        <Pressable
          style={styles.tabStyle}
          android_ripple={{ color: Color.LightGrey, borderless: true }}
          onPress={() => {
            navigation.navigate("SearchScreen");
          }}
        >
          <Ionicons
            name="search"
            size={30}
            color={props?.activeMenu === "Search" ? Color.Blue : Color.Black}
          />
          {/* <Text
            style={
              props?.activeMenu === "Search"
                ? styles.activeTabText
                : styles.tabText
            }
          >
            Search
          </Text> */}
        </Pressable>
      </View>
      <View>
        {/* <Pressable
          style={styles.tabCart}
          style={{ backgroundColor: "red", position: "relative", left: "20%" }}
          android_ripple={{ color: Color.LightGrey, borderless: true }}
          onPress={() => {
            navigation.navigate("ShowCase");
          }}
        > */}
        {/* <MaterialIcons name="shopping-cart" size={30} color={Color.White} /> */}

        <AddButton
          clicktrigger={() => showCreatePost()}
          activeScreen={"bottomTab"}
        />
        {createPostVisible && (
          <CreatePost
            onCancel={hideCreatePost}
            onAddPost={onAddPost}
            closeModal={closeModal}
            canSeeCampaign={canSeeCampaign}
            storyReload={props.storyReload}
          />
        )}
        {/* </Pressable> */}
      </View>
      <Pressable
        style={styles.tabStyle}
        android_ripple={{ color: Color.LightGrey, borderless: true }}
        onPress={() => {
          navigation.navigate("Campaign");
          props?.scrollToTop();
        }}
      >
        <MaterialIcons
          name="campaign"
          size={35}
          color={props?.activeMenu === "Campaign" ? Color.Blue : Color.Black}
        />
        {/* <Text
          style={
            props?.activeMenu === "Campaign"
              ? styles.activeTabText
              : styles.tabText
          }
        >
          Campaign
        </Text> */}
      </Pressable>
      <Pressable
        style={styles.tabStyle}
        android_ripple={{ color: Color.LightGrey, borderless: true }}
        onPress={() => {
          navigation.navigate("ChatList");
          props?.scrollToTop();
        }}
      >
        <Ionicons
          name={
            props?.activeMenu === "Chat"
              ? "chatbox-ellipses"
              : "md-chatbox-ellipses-outline"
          }
          size={30}
          color={props?.activeMenu === "Chat" ? Color.Blue : Color.Black}
        />
        {/* <Text
          style={
            props?.activeMenu === "Chat" ? styles.activeTabText : styles.tabText
          }
        >
          Chat
        </Text> */}
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    position: "absolute",
    bottom: 0,
    paddingHorizontal: 30,
    alignContent: "center",
    alignItems: "center",
    justifyContent: "space-between",
    flexDirection: "row",
    backgroundColor: Color.White,
    width: "100%",
    height: "8%",
    borderTopWidth: 1.5,
    borderColor: Color.VeryLightGrey,
  },
  tabStyle: {
    alignContent: "center",
    alignItems: "center",
  },
  tabCart: {
    alignContent: "center",
    alignItems: "center",
    // backgroundColor: Color.Blue,
    borderRadius: Dimensions.get("screen").height * 0.1,
    // borderColor: Color.White,
    // borderWidth: 5,
    padding: 17,
    // alignSelf: "flex-start",
    marginTop: 0,
  },
  tabText: {
    fontFamily: "Roboto_600SemiBold",

    // marginTop: 2,
    fontSize: 13,
    color: Color.Grey,
  },
  activeTabText: {
    fontFamily: "Roboto_600SemiBold",
    marginTop: 2,
    fontSize: 13,
    color: Color.Blue,
  },
});
