import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { Ionicons, MaterialCommunityIcons } from "react-native-vector-icons";
import Color from "../../../assets/colors/Color";

//utils

import { BASE_URL } from "../../../CONSTANTS";

const Height = Dimensions.get("screen").height;
const Width = Dimensions.get("screen").width;

export default function CampaignCard(props) {
  const [teamAuser, setteamAuser] = useState("");
  const [teamBuser, setteamBuser] = useState("");
  //here i want to calculate the countdown

  useEffect(() => {
    if (props?.teamAuser.length > 0) {
      const teamAuser = Object.values(props?.teamAuser);
      setteamAuser(teamAuser);
    }
    if (props?.teamBuser.length > 0) {
      const teamAuser = Object.values(props?.teamBuser);
      setteamBuser(teamAuser);
    }
  }, []);

  // useMemo(() => {
  //   if (campaign?.teamA?.members.length > 0) {
  //     const teamA = Object.values(campaign.teamA.members)
  //     setteamAuser(teamA)
  //   }
  // }, [campaign?.teamA?.members])

  // useMemo(() => {
  //   if (campaign?.teamB?.members.length > 0) {
  //     const teamB = Object.values(campaign.teamB.members)
  //     setteamBuser(teamB)
  //   }
  // }, [campaign?.teamB?.members])

  return (
    <View style={[props.mainBg, { backgroundColor: props.color }]}>
      <View style={styles.pollHeader}>
        <MaterialCommunityIcons
          name="google-podcast"
          size={25}
          color={Color.White}
        />
        <Text style={styles.headText}>Live Poll</Text>
        <View style={styles.icons}>
          <TouchableOpacity>
            <MaterialCommunityIcons
              name="dots-horizontal"
              size={25}
              color={Color.White}
            />
          </TouchableOpacity>
        </View>
      </View>
      <View>
        <Text style={styles.titleText}>{props.title}</Text>
      </View>
      <View style={styles.teamContainer}>
        <View style={styles.teamA}>
          <Text style={styles.teamTitle}>Team A</Text>
          <View style={styles.userContainer}>
            <Image
              style={styles.userAvatar}
              source={
                teamAuser?.[0]
                  ? {
                      uri: `${BASE_URL}/images/${teamAuser?.[0]?.profile}`,
                    }
                  : null
              }
            />
            <Image
              style={styles.userAvatar}
              source={
                teamAuser?.[1]
                  ? {
                      uri: `${BASE_URL}/images/${teamAuser?.[1]?.profile}`,
                    }
                  : null
              }
            />
            <Image
              style={styles.userAvatar}
              source={
                teamAuser?.[2]
                  ? {
                      uri: `${BASE_URL}/images/${teamAuser?.[2]?.profile}`,
                    }
                  : null
              }
            />
          </View>
          <Text style={styles.teamText}>{props.countA}</Text>
          <Text style={styles.teamText}>{props.leaderA}*</Text>
        </View>
        <View style={styles.teamB}>
          <Text style={styles.teamTitle}>Team B</Text>
          <View style={styles.userContainer}>
            <Image
              style={styles.userAvatar}
              source={
                teamBuser?.[0]
                  ? {
                      uri: `${BASE_URL}/images/${teamBuser?.[0]?.profile}`,
                    }
                  : null
              }
            />
            <Image
              style={styles.userAvatar}
              source={
                teamBuser?.[1]
                  ? {
                      uri: `${BASE_URL}/images/${teamBuser?.[1]?.profile}`,
                    }
                  : null
              }
            />
            <Image
              style={styles.userAvatar}
              source={
                teamBuser?.[2]
                  ? {
                      uri: `${BASE_URL}/images/${teamBuser?.[2]?.profile}`,
                    }
                  : null
              }
            />
            <Text style={styles.teamText}>{props.countB}</Text>
            <Text style={styles.teamText}>{props.leaderB}*</Text>
          </View>
        </View>
      </View>
      <View style={styles.footer}>
        <Ionicons name="md-location-outline" size={20} color={Color.White} />
        <Text style={styles.footerText}>{`${props.location}`}</Text>
        {/* <Text style={styles.date}>{props.date}</Text> */}

        <Text style={styles.date}>
          {/* {props.locked
            ? `${countDown.days}d:${countDown.hours}h:${countDown.minutes}m:${countDown.seconds}s`
            : "Event has Started"} */}
          Do-Day
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  // mainBg: {
  //   marginTop: 0,
  //   borderRadius: 10,
  //   padding: 19,
  //   backgroundColor: "#841CA9",
  // },
  pollHeader: {
    flexDirection: "row",
    alignContent: "center",
    alignItems: "center",
  },
  icons: {
    flexDirection: "row",
    justifyContent: "space-between",
    position: "absolute",
    right: 0,
  },
  headText: {
    marginLeft: Width * 0.018,
    fontSize: Height * 0.02,
    fontWeight: "700",
    fontFamily: "Roboto",
    color: "#fff",
  },
  // threeDots: {
  //   width: 16,
  //   height: 3.83,
  //   tintColor: "#fff",
  // },
  titleText: {
    paddingTop: Height * 0.014,
    fontFamily: "Roboto",
    color: "#fff",
    fontSize: Height * 0.027,
    fontWeight: "700",
    lineHeight: 25,
  },
  teamContainer: {
    borderBottomWidth: 0.5,
    borderColor: Color.VeryLightGrey,
    marginTop: Height * 0.015,
  },
  teamA: {
    alignItems: "center",
    flexDirection: "row",
    paddingBottom: Height * 0.02,
  },
  teamB: {
    alignItems: "center",
    flexDirection: "row",
    paddingBottom: Height * 0.022,
  },
  teamTitle: {
    fontFamily: "Roboto",
    color: "#fff",
    fontSize: Height * 0.02,
    fontWeight: "700",
  },
  teamText: {
    fontFamily: "Roboto",
    color: "#fff",
    fontSize: Height * 0.019,
    fontWeight: "400",
    marginLeft: Width * 0.039,
  },
  userContainer: {
    flexDirection: "row",
    marginLeft: Width * 0.045,
  },
  userAvatar: {
    width: 25,
    height: 25,
    borderRadius: Height * 0.1,
    marginHorizontal: -Width * 0.012,
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: Height * 0.006,
  },
  footerText: {
    marginLeft: Width * 0.016,
    fontFamily: "Roboto",
    color: "#fff",
    fontSize: Height * 0.017,
    fontWeight: "600",
    alignSelf: "center",
  },
  date: {
    position: "absolute",
    right: 0,
    fontFamily: "Roboto",
    color: "#fff",
    fontSize: Height * 0.018,
    fontWeight: "700",
    alignSelf: "center",
  },
});
