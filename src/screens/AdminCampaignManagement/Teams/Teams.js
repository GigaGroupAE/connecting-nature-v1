import * as React from "react";
import {
  View,
  Text,
  StatusBar,
  Dimensions,
  SafeAreaView,
  StyleSheet,
  Pressable,
  FlatList,
  Image,
} from "react-native";
//icons
import { AntDesign, Entypo } from "react-native-vector-icons";
import { Menu, Divider, Provider } from "react-native-paper";

import { useNavigation } from "@react-navigation/native";
//components import
import TeamsScreenHeader from "../../../components/TeamsScreenHeader";
import Color from "../../../../assets/colors/Color";
import { TouchableOpacity } from "react-native-gesture-handler";
import { useState } from "react";
import { theme } from "../../../../theme";
import { BASE_URL } from "../../../../CONSTANTS";
import axios from "axios";

//gif
import empty from "../../../../assets/empty.gif";
import { useUserState } from "../../../slices/userSlice";

const HEIGHT = Dimensions.get("screen").height - StatusBar.currentHeight;
const WIDTH = Dimensions.get("screen").width;
const Teams = ({ route }) => {
  const navigation = useNavigation();
  const [activeTeam, setActiveTeam] = useState("TeamA");
  const userState = useUserState();
  const [teamA, setTeamA] = useState(route.params.campaign.TeamA);
  const [teamB, setTeamB] = useState(route.params.campaign.TeamB);

  //this function will popup menu from react-native-paper
  const [visible, setVisible] = React.useState(false);

  const openMenu = () => setVisible(true);

  const closeMenu = () => setVisible(false);

  //this function will return us the active team
  const returnActiveTeam = (team) => {
    let temp = team === "TeamA" ? teamA : teamB;
    return temp;
  };

  const makeLead = async (leader) => {
    //make api request {teamName:TeamA,leader:00000000000}

    try {
      const headers = {
        headers: {
          "auth-token": userState.token,
        },
      };

      const { data } = await axios.patch(
        `${BASE_URL}/today/make-team-lead/${route.params.campaign._id}`,
        { teamName: activeTeam, leader },
        headers
      );
      if (data.success) {
        setTeamA(data.updatedDoday.TeamA);
        setTeamB(data.updatedDoday.TeamB);
        console.log(data.updatedDoday);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const removeVolunteer = async (volunteer) => {
    try {
      const headers = {
        headers: {
          "auth-token": userState.token,
        },
      };
      const { data } = await axios.patch(
        `${BASE_URL}/today/remove-volunteer-from-team/${route.params.campaign._id}`,
        { teamName: activeTeam, volunteer },
        headers
      );
      if (data.success) {
        setTeamA(data.updatedDoday.TeamA);
        setTeamB(data.updatedDoday.TeamB);
        console.log("success", data.updatedDoday);
      }
    } catch (error) {}
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Color.White }}>
      <View style={styles.container}>
        {/* HEADER */}
        <View style={styles.header}>
          <TeamsScreenHeader
            pageTitle={"Teams"}
            btnOnPress={() => navigation.goBack()}
            btnTitle={"All Members"}
          />
        </View>
        {/* TEAM A & B  */}
        <View style={styles.teamsHeader}>
          <Pressable
            style={[styles.btn, activeTeam === "TeamA" ? styles.activeBtn : {}]}
            onPress={() => {
              setActiveTeam("TeamA");
            }}
          >
            <Text
              style={[
                styles.btnText,
                activeTeam === "TeamA" ? { color: Color.Blue } : {},
              ]}
            >
              Team A
            </Text>
          </Pressable>
          <Pressable
            style={[styles.btn, activeTeam === "TeamB" ? styles.activeBtn : {}]}
            onPress={() => {
              setActiveTeam("TeamB");
            }}
          >
            <Text
              style={[
                styles.btnText,
                activeTeam === "TeamB" ? { color: Color.Blue } : {},
              ]}
            >
              Team B
            </Text>
          </Pressable>
        </View>
        {/* LIST OF MEMBERS */}
        <View style={styles.list}>
          {returnActiveTeam(activeTeam).members.length > 0 && (
            <FlatList
              data={returnActiveTeam(activeTeam).members}
              keyExtractor={(item) => item.number}
              renderItem={({ item }) => {
                return (
                  <View style={styles.card}>
                    <View style={{ flexDirection: "row" }}>
                      <Image
                        style={styles.avatar}
                        source={{ uri: `${BASE_URL}/images/${item.profile}` }}
                      />
                      <View style={{ marginTop: "3%" }}>
                        <Text style={styles.fullName}>
                          {item.fullName}{" "}
                          {returnActiveTeam(activeTeam).leader ===
                            item.number && (
                            <Text style={styles.influencer}> Leader</Text>
                          )}
                        </Text>
                        <Text style={styles.invitationAccepted}>
                          Accepted Invitation
                        </Text>
                      </View>
                    </View>
                    {/* BUTTONS */}
                    <View style={styles.btnContainer}>
                      {}
                      {returnActiveTeam(activeTeam).leader !== item.number && (
                        <Pressable
                          style={({ pressed }) =>
                            pressed
                              ? [styles.action, styles.btnPressed]
                              : [styles.action]
                          }
                          onPress={() => makeLead(item.number)}
                        >
                          <Text style={styles.actionText}>Make Lead</Text>
                        </Pressable>
                      )}
                      <Pressable
                        style={({ pressed }) =>
                          pressed
                            ? [styles.action, styles.btnPressed]
                            : [styles.action]
                        }
                        onPress={() => removeVolunteer(item)}
                      >
                        {/* <AntDesign name={"delete"} size={20} color={"red"} /> */}
                      </Pressable>

                      <Menu
                        visible={visible}
                        onDismiss={closeMenu}
                        anchor={
                          <Pressable onPress={openMenu}>
                            <Entypo
                              name="dots-three-vertical"
                              size={20}
                              color={Color.LightGrey}
                            />
                          </Pressable>
                        }
                      >
                        <Menu.Item
                          onPress={() => removeVolunteer(item)}
                          title="Delete"
                        />
                        <Menu.Item onPress={() => {}} title="Mark Lead" />
                      </Menu>
                    </View>
                  </View>
                );
              }}
            />
          )}
          {returnActiveTeam(activeTeam).members.length === 0 && (
            <>
              <Image
                source={empty}
                style={{ height: "50%", width: WIDTH * 1 }}
              />
              <Text
                style={{
                  textAlign: "center",
                  fontFamily: theme.fonts.family.regular,
                  color: Color.Blue,
                }}
              >
                oh o!! This team has no Volunteers
              </Text>
            </>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: StatusBar.currentHeight,
  },
  header: {
    height: HEIGHT * 0.06,
  },
  teamsHeader: {
    height: HEIGHT * 0.06,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: "rgba(154, 154, 154, 0.5)",
    flexDirection: "row",
    //alignItems: "center",
    //justifyContent: "space-around",
  },
  btn: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  btnText: {
    fontFamily: theme.fonts.family.semiBold,
    color: "#D9D9D9",
  },
  activeBtn: { borderBottomWidth: 1, borderColor: Color.Blue },
  list: {
    height: HEIGHT * 0.86,
    backgroundColor: "#fff",
  },
  card: {
    height: HEIGHT * 0.12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: "rgba(154, 154, 154, 0.5)",
    flexDirection: "row",
    //for vertically centre content
    alignItems: "center",
    justifyContent: "space-between",
  },
  avatar: {
    height: Dimensions.get("screen").height * 0.065,
    width: Dimensions.get("screen").height * 0.065,
    borderRadius: Dimensions.get("screen").height * 0.1,
    marginHorizontal: WIDTH * 0.02,
  },
  fullName: { fontFamily: theme.fonts.family.semiBold },
  invitationAccepted: {
    fontFamily: theme.fonts.family.regular,
    color: "rgba(112, 112, 112, 0.7)",
  },
  influencer: {
    color: Color.Blue,
    fontFamily: theme.fonts.family.regular,
  },
  btnContainer: {
    marginRight: WIDTH * 0.02,
    flexDirection: "row",
  },
  btnPressed: {
    opacity: 0.3,
  },
  action: {
    marginHorizontal: 10,
  },
  actionText: {
    fontFamily: theme.fonts.family.regular,
    textDecorationLine: "underline",
    color: Color.Blue,
  },
});
export default Teams;
