import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Pressable,
  Dimensions,
} from "react-native";
import { AntDesign, Entypo } from "react-native-vector-icons";
import { MaterialIcons } from "react-native-vector-icons";
import { useNavigation } from "@react-navigation/native";
import Color from "../../assets/colors/Color";
import { useCartState } from "../slices/cartSlice";
import { useState, useEffect } from "react";
import { BASE_URL } from "../../CONSTANTS";
import { useUserState } from "../slices/userSlice";
import axios from "axios";
import { useStateContext } from "../contexts/ContextProvider";

const height = Dimensions.get("screen").height;
const width = Dimensions.get("screen").width;

export default function HeaderNormal(props) {
  const userState = useUserState();
  const cartSlice = useCartState();
  const [Messages, setMessages] = useState([]);
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
  const navigation = useNavigation();
  return (
    <View>
      <View style={styles.container}>
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            flex: 2,
            alignItems: "center",
          }}
        >
          <Pressable
            android_ripple={{ color: Color.VeryLightGrey, borderless: true }}
            onPress={() => navigation.goBack()}
          >
            <AntDesign
              name="arrowleft"
              size={24}
              color={Color.Black}
              style={{ alignSelf: "center", alignItems: "center" }}
            />
          </Pressable>

          <Text style={styles.title}>{props.title}</Text>
        </View>
        <View
          style={{
            alignSelf: "center",
            position: "relative",
            width: width * 0.12,
          }}
        >
          {props.title === "Chats" && (
            <Pressable
              onPress={() => {
                navigation.navigate("SelectContact", {
                  selectedContact: selectcontact,
                });
              }}
            >
              <Entypo name="new-message" size={25} color={Color.Blue} />
            </Pressable>
          )}
        </View>
        {props.title === "ShowCase" ? (
          <Pressable
            onPress={() => {
              navigation.navigate("Checkout");
            }}
          >
            <MaterialIcons
              name="add-shopping-cart"
              size={35}
              color={Color.Blue}
            />
            <Text
              style={{
                top: -7,
                right: -6,
                position: "absolute",
                backgroundColor: "#DCDCDC",
                borderRadius: 20,
                paddingHorizontal: 5,
                color: "#4582C3",
              }}
            >
              {cartSlice.cart.length}
            </Text>
          </Pressable>
        ) : (
          <View></View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Color.White,
    alignContent: "center",
    alignItems: "center",
    flexDirection: "row",
    paddingHorizontal: 17,
    paddingVertical: 10,
    borderBottomWidth: 2,
    borderColor: Color.VeryLightGrey,
    justifyContent: "space-between",
  },
  title: {
    color: Color.Black,
    fontSize: 17,
    fontFamily: "Roboto_600SemiBold",
    marginLeft: 10,
    marginTop: 2,
    lineHeight: 30,
    textAlignVertical: "center",
  },
});
