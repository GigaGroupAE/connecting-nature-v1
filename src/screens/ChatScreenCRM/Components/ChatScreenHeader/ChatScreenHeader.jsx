import React from "react";
import {
  Dimensions,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Appbar, Avatar } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import { useUserState } from "../../../../slices/userSlice";
import { useState } from "react";
import { useEffect } from "react";
import { BASE_URL } from "../../../../../CONSTANTS";
import Color from "../../../../../assets/colors/Color";
import { SafeAreaView } from "react-native-safe-area-context";
import { useStateContext } from "../../../../contexts/ContextProvider.js";
import { Entypo } from "react-native-vector-icons";

const Height = Dimensions.get("screen").height;
const Width = Dimensions.get("screen").width;

const ChatScreenHeader = (props) => {
  const { group, setgroup } = useStateContext();
  const groupState = group;
  const userState = useUserState();
  const navigation = useNavigation();
  const [subtitle, setsubtitle] = useState();
  const [photo, setPhoto] = useState();
  const [title, settitle] = useState();
  const [modalVisible, setModalVisible] = useState(false);

  const UserList = () => {
    navigation.navigate("UserList");
    setModalVisible(false);
  };

  useEffect(() => {
    if (group?.type === "individual" || group?.type === "Admin") {
      if (group?.members !== undefined) {
        let member = group?.members?.filter((member) => {
          return member?.member?.phoneNumber !== userState.phoneNumber;
        });

        let memb = member[0];
        setPhoto(`${BASE_URL}/images/${memb.member.profile}`);
        settitle(memb.member.fullName);
        setsubtitle(memb.member.type);
      }
    } else {
      console.log("ELSE CASE ---");
      console.log("gropusatee------", groupState.groupPic);
      setPhoto(`${BASE_URL}/images/${groupState.groupPic}`);
      settitle(group.title);
      let tempsubtitle = "";
      group?.members?.map((m, index) => {
        if (index != group.members.length - 1) {
          tempsubtitle = tempsubtitle + m.member?.fullName + " , ";
        } else {
          tempsubtitle = tempsubtitle + m.member?.fullName + " ";
        }
      });
      setsubtitle(tempsubtitle);
    }
  }, []);

  const handleClick = () => {
    props?.handleShowInput(true);
  };
  return (
    <Appbar.Header
      style={{
        marginTop: "0%",
        // marginBottom: 2.5,
        marginBottom: Height * 0.005,
        width: "100%",
        backgroundColor: Color.Blue,
      }}
    >
      <Appbar.BackAction
        color={"white"}
        onPress={() => {
          setgroup(null);
          navigation.goBack();
        }}
      />
      <TouchableOpacity
        onPress={() =>
          navigation.navigate("GroupSettings", {
            groupState: {
              title: title,
              groupPic: photo,
              members: group.members,
              type: group.type,
              groupId: group._id,
            },
          })
        }
      >
        <Avatar.Image
          size={40}
          source={
            photo
              ? { uri: photo }
              : {
                  uri: "https://firebasestorage.googleapis.com/v0/b/giga-intranet.appspot.com/o/default%2Fgroup.png?alt=media&token=e26513b2-3ac3-4f77-8ab6-be92e2d45c79",
                }
          }
          style={{ marginRight: -10 }}
        />
      </TouchableOpacity>
      <Appbar.Content
        onPress={() =>
          navigation.navigate("GroupSettings", {
            groupState: {
              title: title,
              groupPic: photo,
              members: group.members,
              type: group.type,
              groupId: group._id,
            },
          })
        }
        title={title ? title : "Loading..."}
        titleStyle={{ fontFamily: "Roboto_500Medium", fontSize: 18 }}
        subtitle={subtitle ? subtitle : "Loading..."}
        subtitleStyle={{ fontSize: 12, marginTop: -5, color: "white" }}
        color={"white"}
        style={{
          ...Platform.select({
            ios: {
              marginTop: 0,
            },
            android: {
              marginTop: 0,
            },
          }),
        }}
      />
      <Appbar.Action
        style={{ marginRight: 5 }}
        color={"white"}
        size={25}
        icon="magnify"
        onPress={() => handleClick()}
      />
    </Appbar.Header>
  );
};

export default ChatScreenHeader;

const styles = StyleSheet.create({
  main: {
    backgroundColor: "white",
    height: "100%",
    width: "100%",
  },
  ModelTitile: {
    fontSize: Height * 0.018,
    fontFamily: "Roboto_500Medium",
    fontWeight: "500",
    marginVertical: Height * 0.007,
  },
});
