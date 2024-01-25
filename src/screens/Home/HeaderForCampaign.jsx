import {
  StyleSheet,
  Text,
  View,
  Pressable,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useState } from "react";
import { axiosInstance } from "../../../axiosInstance";
import { scale } from "react-native-size-matters";
import { Entypo, AntDesign } from "react-native-vector-icons";
import Color from "../../../assets/colors/Color";
import { useNavigation } from "@react-navigation/native";

const HeaderForCampaign = ({ campaign }) => {
  const navigation = useNavigation();
  // const [campaign, setcampaign] = useState([]);

  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const response = await axiosInstance.get(
  //         "/campaigns/mostrecentcampaign"
  //       );

  //       if (response?.data?.campaigns) {
  //         setcampaign(response?.data?.campaigns);
  //       }
  //     } catch (error) {
  //       console.log("Error:", error);
  //     }
  //   };

  //   fetchData();
  // }, []);

  return (
    <TouchableOpacity
      style={{ backgroundColor: `#841CA9` }}
      // activeOpacity={0.4}
      onPress={() => navigation.navigate("Campaign")}
    >
      <View style={styles.container}>
        <View style={styles.containerLeft}>
          <Text style={styles.campaignTitle}>{campaign?.campaignName}</Text>
          {/* <View style={styles.locationContainer}>
            <Entypo name="location-pin" style={styles.locationIcon} />
            <Text style={styles.locationTitle}>{campaign?.venue}</Text>
          </View> */}

          <View style={styles.teamsContainer}>
            <View style={styles.teamPoints}>
              <Text style={styles.teamA}>Team A</Text>
              <Text style={styles.points}>{campaign?.teamA?.points}</Text>
            </View>
            <View style={{ ...styles.teamPoints, marginHorizontal: scale(8) }}>
              <Text style={styles.teamA}>Team B</Text>
              <Text style={styles.points}>{campaign?.teamB?.points}</Text>
            </View>
          </View>
        </View>
        <View style={styles.containerRight}>
          <View style={styles.runningContainer}>
            <AntDesign name="setting" style={styles.runningIcon} />
            <Text style={styles.runningTitle}>Running...</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default HeaderForCampaign;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: scale(14),
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-evenly",
    paddingVertical: scale(6),
  },
  containerLeft: {
    width: "70%",
  },
  containerRight: {
    width: "30%",
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: scale(4),
  },
  teamsContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: scale(2),
  },
  teamPoints: {
    flexDirection: "row",
    paddingHorizontal: scale(12),
    paddingVertical: scale(4),
    borderRadius: scale(20),
    backgroundColor: " rgba(255, 255, 255, 0.15)",
  },
  campaignTitle: {
    fontFamily: "Roboto_700Bold",
    fontSize: scale(14),
    color: Color.White,
    paddingVertical: scale(2),
  },
  locationIcon: {
    fontSize: scale(12),
    color: Color.White,
  },
  locationTitle: {
    fontSize: scale(11),
    paddingHorizontal: scale(4),
    fontFamily: "Roboto_400Regular",
    color: Color.White,
  },
  teamA: {
    color: Color.White,
    fontSize: scale(11),
    fontFamily: "Roboto_700Bold",
  },
  points: {
    color: Color.White,
    fontSize: scale(11),
    paddingLeft: scale(3),
    fontFamily: "Roboto_700Bold",
  },
  runningContainer: {
    flexDirection: "row",
    backgroundColor: "rgba(95, 3, 128, 1)",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: scale(8),
    borderRadius: scale(8),
  },
  runningTitle: {
    fontFamily: "Roboto_700Bold",
    color: Color.White,
    paddingHorizontal: scale(5),
  },
  runningIcon: {
    fontSize: scale(14),
    color: Color.White,
  },
});
