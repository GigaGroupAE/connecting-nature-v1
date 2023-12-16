import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { Ionicons, Entypo } from "react-native-vector-icons";
import ChatIcon from "../../../assets/noChatIcon.png";
import Color from "../../../assets/colors/Color";
import { useUserState } from "../../slices/userSlice";
import { useCartState } from "../../slices/cartSlice";
import { useStateContext } from "../../contexts/ContextProvider";
import axios from "axios";
import { BASE_URL } from "../../../CONSTANTS";
import { useNavigation } from "@react-navigation/native";

const Height = Dimensions.get("screen").height;
const Width = Dimensions.get("screen").width;

const NoMessage = () => {
  const userState = useUserState();
  const [Messages, setMessages] = useState([]);
  const navigation = useNavigation();

  const { group, setgroup } = useStateContext();
  useEffect(() => {
    axios
      .get(`${BASE_URL}/chat/get-my-chats`, {
        headers: {
          "auth-token": userState.token,
        },
      })
      .then((res) => {
        setMessages([...res.data.myChats]);
      })
      .catch((e) => console.log(e));
  }, []);
  const selectcontact = (props) => {
    let first = false;
    let second = false;
    let foundGroup = {};
    const individualGroups = Messages;
    individualGroups.map((group) => {
      if (
        group.members[0].phoneNumber === userState.phoneNumber ||
        group.members[0].phoneNumber === props.phoneNumber
      ) {
        first = true;
        if (
          group.members[1].phoneNumber === userState.phoneNumber ||
          group.members[1].phoneNumber === props.phoneNumber
        ) {
          second = true;
          foundGroup = group;
        }
      }
    });
    if (first === true && second === true) {
      setgroup(foundGroup);
      navigation.navigate("ChatCN", { group: foundGroup });
    } else {
      console.log("login user is ===>", userState.id);
      console.log("props user is =====>", props._id);

      let members = [userState.id, props._id];

      let data;

      data = {
        members: members,
        messages: [],
      };
      axios
        .post(`${BASE_URL}/chat/createchat`, data, {
          headers: {
            "auth-token": userState.token,
          },
        })
        .then((response) => {
          axios
            .get(`${BASE_URL}/chat/get-my-chats`, {
              headers: {
                "auth-token": userState.token,
              },
            })
            .then((res) => {
              const newgroup = res.data.myChats.filter((singlegroup) => {
                return singlegroup._id === response.data._id;
              });
              setgroup(newgroup[0]);
              navigation.navigate("ChatCN", { group: newgroup[0] });
            })
            .catch((e) => console.log(e));
        })
        .catch((e) => console.log(e));
    }
  };
  return (
    <View
      style={{
        alignItems: "center",
        height: "100%",
        justifyContent: "center",
        marginBottom: Height * -0.2,
      }}
    >
      <Image style={styles.bellIcon} source={ChatIcon} />
      <Text style={styles.heading}>No Message found!</Text>
      <Text style={styles.subHeading}>
        It seems, there is no message in your chat list.
      </Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          navigation.navigate("SelectContact", {
            selectedContact: selectcontact,
          });
        }}
      >
        <Text style={styles.buttonTitle}> Start a Conversation</Text>
      </TouchableOpacity>
    </View>
  );
};

export default NoMessage;

const styles = StyleSheet.create({
  heading: {
    fontFamily: "Roboto_700Bold",
    color: Color.DarkGrey,
    fontSize: Height * 0.019,
    paddingVertical: Height * 0.01,
  },
  subHeading: {
    fontFamily: "Roboto_500Medium",
    color: Color.DarkGrey,
    fontSize: Height * 0.016,
  },
  bellIcon: {
    width: Width * 0.3,
    height: Height * 0.14,
    resizeMode: "contain",
  },
  button: {
    backgroundColor: Color.Blue,
    marginTop: Height * 0.05,
    paddingHorizontal: Width * 0.06,
    paddingVertical: Height * 0.012,
    borderRadius: Height * 0.01,
  },
  buttonTitle: {
    fontFamily: "Roboto_600SemiBold",
    color: Color.White,
    fontSize: Height * 0.02,
  },
});
