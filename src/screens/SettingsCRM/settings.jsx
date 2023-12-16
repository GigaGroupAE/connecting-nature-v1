import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Pressable,
  Dimensions,
} from "react-native";
import React from "react";
import { BASE_URL } from "../../../CONSTANTS.js";
import { Entypo } from "react-native-vector-icons";
import { IconButton, Button, Avatar } from "react-native-paper";
import { useUserState, useUserStateActions } from "./../../slices/userSlice";
import { useNavigation } from "@react-navigation/native";
import HeaderNormal from "../../components/HeaderNormal.js";
import Color from "../../../assets/colors/Color";
import { SafeAreaView } from "react-native-safe-area-context";
import { useCartStateActions } from "../../slices/cartSlice.js";
import axios from "axios";
function ProfileSettings(props) {
  const userState = useUserState();
  const navigation = useNavigation();
  const CartActions = useCartStateActions();

  const userActions = useUserStateActions();
  const userstate = useUserState();

  const Logout = () => {
    //delete the expo token from database
    const config = {
      headers: {
        "auth-token": userstate.token,
      },
    };
    axios
      .put(
        `${BASE_URL}/user/updateUserExpoToken`,
        { expoPushToken: null },
        config
      )
      .then((res) => {
        userActions.resetState();
        CartActions.resetState();
        navigation.reset({
          index: 0,
          routes: [{ name: "SignIn" }],
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const handleNotification = () => {
    navigation.navigate("NotificationsScreen");
  };
  const handleSupport = () => {
    props.navigation.navigate("Support");
  };
  return (
    <SafeAreaView style={styles.body}>
      <HeaderNormal title="Profile Settings" />
      <ScrollView>
        <View style={styles.userInfoHeader}>
          <View style={styles.headerRow}>
            <Avatar.Image
              size={Dimensions.get("screen").height * 0.075}
              source={
                userState.profile
                  ? { uri: `${BASE_URL}/images/${userState.profile}` }
                  : null //require("../../assets/avatar-placeholder.png")
              }
            />
            <View style={{ marginLeft: 12 }}>
              <View style={{ flexDirection: "row" }}>
                <Text style={styles.userName}>{userState.fullName}</Text>
                <Pressable
                  android_ripple={{ color: Color.LightGrey, borderless: true }}
                  onPress={() => {}}
                >
                  <IconButton
                    icon="pencil"
                    color={Color.Black}
                    size={18}
                    //  onPress={showModal3}
                    style={styles.editIcon}
                  />
                </Pressable>
              </View>
              {userState.designation && (
                <Text style={styles.userType}>{userState.designation}</Text>
              )}
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <Text style={styles.phoneNumberText}>
                  {"+92" + userState.phoneNumber}
                </Text>
                <Pressable>
                  <Text
                    style={{
                      fontFamily: "Roboto_600SemiBold",
                      fontSize: 14,
                      color: Color.Blue,
                      paddingHorizontal: 8,
                      paddingVertical: 2,
                    }}
                  >
                    Change
                  </Text>
                </Pressable>
              </View>
            </View>
          </View>
        </View>
        <Pressable
          android_ripple={{ color: Color.LightGrey }}
          onPress={handleNotification}
          style={styles.row}
        >
          <IconButton
            icon="bell"
            color={Color.Black}
            size={22}
            style={styles.leftIcons}
          />
          <View>
            <Text style={styles.listText}>Notification</Text>
          </View>
          <Entypo
            name="chevron-small-right"
            size={25}
            color={Color.Black}
            style={styles.chevronIcon}
          />
        </Pressable>
        <Pressable
          android_ripple={{ color: Color.LightGrey }}
          onPress={handleSupport}
          style={styles.row}
        >
          <IconButton
            icon="headset"
            color={Color.Black}
            size={20}
            onPress={() => console.log("Pressed")}
            style={styles.leftIcons}
          />
          <View>
            <Text style={styles.listText}>Support</Text>
          </View>
          <Entypo
            name="chevron-small-right"
            size={25}
            color={Color.Black}
            style={styles.chevronIcon}
          />
        </Pressable>
        <Pressable
          android_ripple={{ color: Color.LightGrey }}
          onPress={Logout}
          style={styles.row}
        >
          <IconButton
            icon="logout"
            color={Color.Black}
            size={20}
            style={styles.leftIcons}
          />
          <View>
            <Text style={styles.listText}>Logout</Text>
          </View>
          <Entypo
            name="chevron-small-right"
            size={25}
            color={Color.Black}
            style={styles.chevronIcon}
          />
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  body: {
    flex: 1,
    backgroundColor: Color.White,
    justifyContent: "flex-start",
  },
  userInfoHeader: {
    width: "100%",
    alignItems: "center",
  },
  userName: {
    fontFamily: "Roboto_600SemiBold",
    fontSize: 18,
    color: Color.Black,
    alignSelf: "center",
  },
  editIcon: {
    alignSelf: "center",
  },
  userType: {
    fontFamily: "Roboto_400Regular",
    fontSize: 14,
    color: Color.Blue,
  },
  phoneNumberText: {
    fontFamily: "Roboto_400Regular",
    fontSize: 15,
    color: Color.Blue,
    textDecorationLine: "underline",
    textDecorationColor: Color.Blue,
    width: "60%",
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 20,
    paddingHorizontal: 15,
    width: "100%",
    justifyContent: "flex-start",
    backgroundColor: Color.LightBg,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 5,
    paddingHorizontal: 15,
    marginTop: 15,
    width: "100%",
    justifyContent: "flex-start",
  },
  btnNormal: {
    backgroundColor: "#4582C3",
  },
  btnPress: {
    backgroundColor: "grey",
  },
  chevronIcon: {
    position: "absolute",
    right: 15,
  },
  listText: {
    fontFamily: "Roboto_500Medium",
    fontSize: 15,
    color: Color.Black,
    marginLeft: 5,
  },
  leftIcons: {
    borderColor: Color.White,
    backgroundColor: Color.LightBg,
  },
  pressedItem: {
    opacity: 0.5,
  },
});
export default ProfileSettings;
