import {
  Dimensions,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Modal,
  Image,
} from "react-native";
import React, { useEffect, useState } from "react";
import Color from "../../../../assets/colors/Color";
import List from "./List";
import HeaderList from "./HeaderList";
import { useStateContext } from "../../../contexts/ContextProvider";
import { axiosInstance } from "../../../../axiosInstance";
import { SafeAreaProvider } from "react-native-safe-area-context";
import CustomStatsBar from "../../../components/CustomStatsBar";

const Width = Dimensions.get("screen").width;
const Height = Dimensions.get("screen").height;

const TeamVolunteers = () => {
  const [currentPage, setCurrentPage] = useState("Team A");
  const [HomePage, setHomePage] = useState(true);
  const [TeamB, setTeamB] = useState(false);
  const ATeam = () => {
    setCurrentPage("Team A");
    setHomePage(true);
    setTeamB(false);
  };
  const BTeam = () => {
    setCurrentPage("Team B");
    setHomePage(false);
    setTeamB(true);
  };
  const containerStyle = {
    backgroundColor: "white",
    borderRadius: Height * 0.01,
    paddingVertical: Height * 0.015,
    marginHorizontal: Width * 0.04,
    flex: 2,
    zIndex: 1,
  };

  const { group, activeCampaign, setActiveCampaign, setLoading } =
    useStateContext();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const { data } = await axiosInstance.get(
          `/campaigns/get-by-query?group=${group._id}`
        );
        setActiveCampaign(data.campaign);
        console.log(data.campaign.teamA);
        setLoading(false);
      } catch (error) {
        console.log(error);
        setLoading(false);
      }
    };
    fetchData();

    return () => {
      setActiveCampaign(null);
    };
  }, []);

  const renderItem = ({ item }) => {
    return (
      <View>
        <List data={item} CurrentPage={currentPage} />
      </View>
    );
  };
  return (
    <SafeAreaProvider style={styles.container}>
      <CustomStatsBar backgroundColor={Color.White} />
      <View>
        <View style={styles.container}>
          <HeaderList title="Teams" currentPage={currentPage} />

          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-around",
              width: "100%",
              borderBottomWidth: 1,
              borderBottomColor: Color.VeryLightGrey,
              height: Height * 0.05,
            }}
          >
            <TouchableOpacity
              style={HomePage ? styles.activeScreen : styles.followerContainer}
              onPress={ATeam}
            >
              <Text style={styles.title}>
                Team A({activeCampaign?.teamA?.points})
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={TeamB ? styles.activeScreen : styles.followerContainer}
              onPress={BTeam}
            >
              <Text style={styles.title}>
                Team B ({activeCampaign?.teamB?.points})
              </Text>
            </TouchableOpacity>
            <TouchableOpacity></TouchableOpacity>
          </View>

          {currentPage === "Team A" && (
            <View>
              {activeCampaign?.teamA?.members?.length === 0 ? (
                <View
                  style={{
                    paddingVertical: Height * 0.1,
                    marginTop: Height * 0.2,
                    alignSelf: "center",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Image
                    source={require("../../../../assets/BlockedUserIcon.png")}
                  />
                  <Text
                    style={{
                      fontSize: Height * 0.023,
                      fontWeight: "700",
                      // backgroundColor: "#E5F2FF",/
                      paddingHorizontal: Width * 0.062,
                      paddingVertical: Height * 0.02,
                      borderRadius: Height * 0.001,
                      color: Color.DarkGrey,
                    }}
                  >
                    This team has no Volunteers
                  </Text>
                </View>
              ) : (
                <FlatList
                  data={activeCampaign?.teamA?.members}
                  renderItem={renderItem}
                  keyExtractor={(item) => item._id}
                  ItemSeparatorComponent={() => (
                    <View style={styles.separator} />
                  )}
                />
              )}
            </View>
          )}
          {currentPage === "Team B" && (
            <View>
              {activeCampaign?.teamB?.members?.length === 0 ? (
                <View
                  style={{
                    paddingVertical: Height * 0.1,
                    marginTop: Height * 0.2,
                    alignSelf: "center",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Image
                    source={require("../../../../assets/BlockedUserIcon.png")}
                  />
                  <Text
                    style={{
                      fontSize: Height * 0.023,
                      fontWeight: "700",

                      paddingHorizontal: Width * 0.062,
                      paddingVertical: Height * 0.02,
                      borderRadius: Height * 0.001,
                      color: Color.DarkGrey,
                    }}
                  >
                    This team has no Volunteers
                  </Text>
                </View>
              ) : (
                <FlatList
                  data={activeCampaign?.teamB?.members}
                  renderItem={renderItem}
                  keyExtractor={(item) => item._id}
                  ItemSeparatorComponent={() => (
                    <View style={styles.separator} />
                  )}
                  style={{ zIndex: 1 }}
                />
              )}
            </View>
          )}
        </View>
      </View>
    </SafeAreaProvider>
  );
};

export default TeamVolunteers;

const styles = StyleSheet.create({
  container: {
    backgroundColor: Color.White,
    height: "100%",
  },
  listContainer: {
    flexDirection: "row",
    width: "100%",
    backgroundColor: "#F5F6FA",
    alignItems: "center",
    justifyContent: "space-between",
  },

  active: {
    flexDirection: "row",
    alignItems: "center",
    width: "40%",
    borderBottomColor: Color.Blue,
    borderBottomWidth: 2,
    backgroundColor: "yellow",
  },
  disable: {
    flex: 1,
    paddingVertical: 14,
    alignSelf: "center",
    color: Color.Grey,
    backgroundColor: "red",
  },
  Heading: {
    alignSelf: "center",
    fontFamily: "Roboto_500Medium",
    fontSize: 14,
    fontWeight: "6",
  },
  HeadingActive: {
    alignSelf: "center",
    fontFamily: "Roboto_500Medium",
    fontSize: 14,
    fontWeight: "6",
    color: Color.Blue,
  },
  title: {
    fontFamily: "Roboto_500Medium",
    fontSize: Height * 0.02,
    paddingHorizontal: Width * 0.01,
  },
  activeScreen: {
    flexDirection: "row",
    alignItems: "center",
    width: "40%",

    borderBottomColor: Color.Blue,
    borderBottomWidth: 2,
    justifyContent: "center",
  },
  followerContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "40%",
    display: "flex",
    justifyContent: "center",
  },
});
