import {
  View,
  Text,
  StatusBar,
  SafeAreaView,
  Dimensions,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  Pressable,
} from "react-native";
//theme imports
import Color from "../../../../assets/colors/Color";
import TeamsScreenHeader from "../../../components/TeamsScreenHeader";
//theme
import { theme } from "../../../../theme";
import { BASE_URL } from "../../../../CONSTANTS";

//icons
import { MaterialCommunityIcons } from "react-native-vector-icons";
import Done from "../../../../assets/Done.gif";
//navigation
import { useNavigation, useIsFocused } from "@react-navigation/native";
import { useEffect, useState } from "react";

//util to fetch data
import { useUserState } from "../../../slices/userSlice";
import axios from "axios";



// THIS SCREEN DISPLAYS LIST OF ALL THE MEMBERS OF A CAMPAIGN THAT 
// ARE YET TO BE DISTRIBUTED IN TEAMS 

const HEIGHT = Dimensions.get("screen").height - StatusBar.currentHeight;
const WIDTH = Dimensions.get("screen").width;
//campaign is passed to this screen
const ManageVolunteers = ({ route }) => {
  const navigation = useNavigation();
  const userState = useUserState();
  const isFocused = useIsFocused();

  const [campaign, setCampaign] = useState();
  const addToTeam = async (volunteer, teamName) => {
    // make api request {teamName : TeamA , volunteer : item}

    try {
      const headers = {
        headers: {
          "auth-token": userState.token,
        },
      };
      const { data } = await axios.patch(
        `${BASE_URL}/today/add-volunteer-to-team/${campaign._id}`,
        { teamName, volunteer },
        headers
      );
      if (data.success) {
        setCampaign(data.updatedDoday);
      }
    } catch (error) {}
  };

  //TODO :: ADD CONDITION HERE FOR INVITE ACCEPTANCE
  //i.e data.filter(d=> !d.team && d.status===accepted)
  const modifyData = (data) => {
    let temp = data?.filter((d) => !d.team && d.status === "accepted");
    return temp;
  };
  useEffect(() => {
    // this is Focused will be true if we're navigating back
    // to this screen. so this will run in that case
    if (isFocused) {
      const fetchData = async () => {
        const headers = {
          headers: {
            "auth-token": userState.token,
          },
        };
        try {
          const { data } = await axios.get(
            `${BASE_URL}/today/getById/${route.params.campaign._id}`,
            headers
          );
          console.log("data is ", data);
          setCampaign(data.campaign);
        } catch (error) {
          console.log("error is ", error);
        }
      };
      fetchData();
    }
  }, [isFocused]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Color.White }}>
      <StatusBar translucent backgroundColor={Color.Blue}></StatusBar>
      {campaign && (
        <View style={styles.container}>
          {/* HEADER */}
          <View style={styles.header}>
            <TeamsScreenHeader
              pageTitle={campaign.campaignName}
              btnTitle={"Teams"}
              btnOnPress={() =>
                navigation.navigate("Teams", { campaign: campaign })
              }
            />
          </View>

          {/* LIST */}
          <View style={styles.list}>
            {modifyData(campaign?.volunteers).length !== 0 && (
              <FlatList
                data={modifyData(campaign?.volunteers)}
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
                            {item.fullName}
                            {/* <Text style={styles.influencer}> Infulencer</Text> */}
                          </Text>
                          <Text style={styles.invitationAccepted}>
                            Accepted Invitation
                          </Text>
                        </View>
                      </View>
                      {/* BUTTONS */}
                      <View style={styles.btnContainer}>
                        <Pressable
                          style={({ pressed }) =>
                            pressed
                              ? [styles.btn, styles.btnPressed]
                              : [styles.btn]
                          }
                          onPress={() => addToTeam(item, "TeamA")}
                        >
                          <Text style={styles.btnText}>Team A</Text>
                        </Pressable>
                        <Pressable
                          style={({ pressed }) =>
                            pressed
                              ? [styles.btn, styles.btnPressed]
                              : [styles.btn]
                          }
                          onPress={() => addToTeam(item, "TeamB")}
                        >
                          <Text style={styles.btnText}>Team B</Text>
                        </Pressable>
                      </View>
                    </View>
                  );
                }}
              />
            )}
            {modifyData(campaign?.volunteers).length === 0 && (
              <>
                <Image
                  source={Done}
                  style={{ height: "50%", width: WIDTH * 1 }}
                />
                <Text
                  style={{
                    textAlign: "center",
                    fontFamily: theme.fonts.family.regular,
                    color: Color.Blue,
                  }}
                >
                  No Volunteers To Manage!!!
                </Text>
              </>
            )}
          </View>
        </View>
      )}
    </SafeAreaView>
  );
};

export default ManageVolunteers;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: StatusBar.currentHeight,
  },
  header: {
    height: HEIGHT * 0.07,
  },
  list: {
    height: HEIGHT * 0.92,
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
  btn: {
    marginHorizontal: 5,
  },
  btnText: {
    fontFamily: theme.fonts.family.regular,
    textDecorationLine: "underline",
    color: Color.Blue,
  },
  btnPressed: {
    opacity: 0.3,
  },
});
