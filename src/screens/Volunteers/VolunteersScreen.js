import {
  Dimensions,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  StatusBar,
  ScrollView,
  Image,
  Pressable,
  TouchableOpacity,
} from "react-native";
import { useState } from "react";
import user from "../../../assets/user.jpg";

//theme
import Color from "../../../assets/colors/Color";

//icons import
import { Feather, Entypo } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "react-native-vector-icons";

//images import
import special from "../../../assets/special.png";
import notSpecial from "../../../assets/notSpecial.png";

//base url
import { BASE_URL } from "../../../CONSTANTS";
import axios from "axios";

//components import
import Stats from "../../components/Stats";

//Responsive Width and Height
const Width = Dimensions.get("screen").width;
const Height = Dimensions.get("screen").height;

//userState
import { useUserState } from "../../slices/userSlice";
import { useNavigation } from "@react-navigation/native";

// const HEIGHT = Dimensions.get("screen").height - StatusBar.currentHeight;

//this screen requires volunteers array as props
//route.params.volunteers

import { useStateContext } from "../../contexts/ContextProvider.js";
import { axiosInstance } from "../../../axiosInstance";
import { SafeAreaProvider } from "react-native-safe-area-context";
import CustomStatsBar from "../../components/CustomStatsBar";

const VolunteersScreen = ({ route }) => {
  const campaignId = route.params.campaignId;
  const userState = useUserState();
  const [volunteers, setVolunteers] = useState(route.params.volunteers);
  const navigation = useNavigation();
  const { loading, setLoading, showSnackbar } = useStateContext();
  const inviteVolunteer = async (phoneNumber, userId) => {
    try {
      const { data } = await axiosInstance.patch(
        `/campaigns/invite-volunteer/${campaignId}`,
        { phoneNumbers: [phoneNumber], usersToUpdate: [userId] }
      );
      setVolunteers(data.updatedCampaign);
    } catch (error) {
      console.log(error);
    }
  };

  const inviteAll = async () => {
    let usersToUpdate = [];
    let phoneNumbers = [];
    //filtering those users that are not invited only
    volunteers.forEach((vol) => {
      if (vol.status === "invite") {
        usersToUpdate.push(vol.user._id);
        phoneNumbers.push(vol.user.phoneNumber);
      }
    });
    try {
      const { data } = await axiosInstance.patch(
        `/campaigns/invite-volunteer/${campaignId}`,
        { phoneNumbers, usersToUpdate }
      );
      setVolunteers(data.updatedCampaign);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <SafeAreaProvider>
      <CustomStatsBar backgroundColor={Color.White} />

      <View style={styles.container}>
        {/* HEADER */}
        <View style={styles.header}>
          <View style={{ flexDirection: "row", margin: "4%" }}>
            <Text
              style={{
                fontFamily: "Roboto_600SemiBold",
                fontSize: 18,
                color: "#707070",
                flex: 1,
              }}
            >
              Current Activity Stats
            </Text>
            <View
              style={{
                flexDirection: "row",
                flex: 0.5,
                justifyContent: "space-around",
              }}
            >
              <TouchableOpacity onPress={inviteAll}>
                <Text style={styles.invite}>Invite All</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => navigation.navigate("Home")}>
                <Text style={{ marginLeft: Width * 0.012, ...styles.invite }}>
                  Done
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* STATS */}
        <View style={styles.stats}>
          <Stats
            data={[
              {
                title: "Volunteer available",
                count: volunteers.length,
              },
              {
                title: "Invitation sent",
                count: volunteers.filter((v) => v.status === "sent").length,
              },
              {
                title: "Invitation accepted",
                count: volunteers.filter((v) => v.status === "accepted").length,
              },
              {
                title: "Special Volunteer Selected",
                count: 0,
              },
            ]}
            volunteers={volunteers}
            campaignId={campaignId}
          />
        </View>
        {/* LIST OF USERS */}
        <ScrollView style={styles.list}>
          {volunteers.map((v, idx) => {
            let displayedUsername = v.user.fullName;
            if (v.user.fullName.length > 10) {
              displayedUsername = v.user.fullName.slice(0, 10) + "...";
            }

            return (
              <View key={idx} style={styles.userContainer}>
                <View style={styles.imgContainer}>
                  <Image
                    source={{ uri: `${BASE_URL}/images/${v.user.profile}` }}
                    style={styles.userImg}
                  />
                  <View style={styles.nameContainer}>
                    <Text style={styles.userName}>{displayedUsername}</Text>
                    {(v.user?.type === "Operations" ||
                      v.user?.type === "Admin" ||
                      v.user?.type === "Manager" ||
                      v.user?.type === "Assistant Manager" ||
                      v.user?.type === "Super Admin" ||
                      v.user?.type === "celebrity") && (
                      <MaterialCommunityIcons
                        name="check-decagram"
                        style={styles.adminIcon}
                      />
                    )}
                  </View>
                </View>
                <View style={styles.pointContainer}>
                  <Text style={styles.pts}>Pts</Text>
                  <Text style={styles.points}>{v?.user?.points} </Text>
                </View>

                <View style={styles.btnContainer}>
                  <Pressable
                    disabled={v.status !== "invite"}
                    style={({ pressed }) =>
                      pressed
                        ? [
                            { backgroundColor: Color.Blue, borderRadius: 8 },
                            styles.pressed,
                          ]
                        : [
                            v.status === "sent"
                              ? styles.disabled
                              : {
                                  backgroundColor: Color.Blue,
                                  borderRadius: 8,
                                },
                          ]
                    }
                    onPress={() => {
                      //console.log("V.userid", v.user._id);
                      inviteVolunteer(v.user.phoneNumber, v.user._id);
                    }}
                  >
                    <Text style={styles.btn}>
                      {v.status === "invite" && " Invite "}
                      {v.status === "sent" && "   sent   "}

                      {v.status === "accpeted" && "accepted"}
                    </Text>
                  </Pressable>
                </View>
              </View>
            );
          })}
        </ScrollView>
      </View>
    </SafeAreaProvider>
  );
};

export default VolunteersScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Color.White,
  },
  header: {
    marginTop: StatusBar.currentHeight,
    height: Height * 0.07,
  },

  stats: {
    // height: HEIGHT * 0.23,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderBottomWidth: StyleSheet.hairlineWidth,

    borderColor: "rgba(154, 154, 154, 0.5)",
    flex: 0,
  },
  list: {
    flex: 1,
    paddingHorizontal: "4%",
    backgroundColor: Color.White,
  },
  icons: {
    color: "#707070",
  },
  pressed: {
    opacity: 0.75,
  },
  disabled: {
    backgroundColor: " #EEEEEE",
    borderRadius: 8,
    color: Color.DarkGrey,
  },
  userContainer: {
    flexDirection: "row",
    marginVertical: Height * 0.003,

    backgroundColor: Color.White,
    borderRadius: 8,

    justifyContent: "space-between",
    borderBottomWidth: 0.7,
    borderColor: Color.LightGrey,
  },
  imgContainer: {
    flexDirection: "row",
    paddingVertical: Height * 0.008,
    alignContent: "center",
    marginLeft: Width * 0.03,
  },
  userImg: {
    width: 45,
    height: 45,
    borderRadius: 22,
    resizeMode: "contain",
  },
  nameContainer: {
    marginTop: Height * 0.008,
    flex: 0,
    // alignSelf: "center",
    flexDirection: "row",
  },
  userName: {
    fontFamily: "Roboto_500Medium",
    marginLeft: Width * 0.02,
  },
  userRole: {
    marginLeft: Width * 0.02,
    fontFamily: "Roboto_500Medium",
    color: Color.Blue,
    marginTop: "-1.5%",
  },
  pointContainer: {
    position: "absolute",
    left: Width * 0.5,
    alignSelf: "center",
  },
  pts: {
    color: Color.Black,
    fontFamily: "Roboto",
    fontWeight: "500",
  },
  points: {
    color: Color.Black,
    fontFamily: "Roboto",
    fontWeight: "900",
    fontSize: 16,
  },
  btnContainer: {
    alignSelf: "center",
    marginRight: Width * 0.03,
  },
  btn: {
    textAlign: "center",
    color: Color.White,
    fontFamily: "Roboto_600SemiBold",
    paddingHorizontal: Width * 0.05,
    paddingVertical: Height * 0.0055,
    backgroundColor: Color.Blue,
    borderRadius: 8,
  },
  invite: {
    alignSelf: "center",
    fontFamily: "Roboto_500Medium",
    color: Color.Blue,
    fontWeight: "600",
    fontSize: 12,
  },
  adminIcon: {
    color: Color.Blue,
    marginTop: "4%",
  },
});
