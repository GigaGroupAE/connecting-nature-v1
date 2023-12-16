import { StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import { returnCountDown } from "../utils/countdown";
import Color from "../../assets/colors/Color";
import { scale } from "react-native-size-matters";
import { useNavigation } from "@react-navigation/native";

const LivePollTimeCal = ({ campaign, countDown, leadingTeam, equalpoints }) => {
  const navigation = useNavigation();
  //   const [leadingTeam, setleadingTeam] = useState("");
  //   const [equalpoints, setequalpoints] = useState("");
  //   const [countDown, setCountDown] = useState({
  //     days: 0,
  //     hours: 0,
  //     minutes: 0,
  //     seconds: 0,
  //   });
  //   useEffect(() => {
  //     let compareDate = new Date(campaign?.endTime);
  //     const interval = setInterval(() => {
  //       const newCountDown = returnCountDown(compareDate);
  //       if (newCountDown === "-1") {
  //         clearInterval(interval);
  //       } else {
  //         setCountDown(newCountDown);
  //       }
  //     }, 1000);

  //     return () => {
  //       clearInterval(interval);
  //     };
  //   }, [campaign?.endTime]);

  //   useEffect(() => {
  //     if (campaign?.teamA?.points > campaign?.teamB?.points) {
  //       setleadingTeam("Team A");
  //     } else if (campaign?.teamA?.points < campaign?.teamB?.points) {
  //       setleadingTeam("Team B");
  //     } else {
  //       setequalpoints("both");
  //     }
  //   }, []);

  return (
    <View style={styles.pointsContainer}>
      {equalpoints === "both" ? (
        <Text>Both teams have equal points</Text>
      ) : (
        <View style={styles.lead}>
          <Text style={styles.time}>{leadingTeam}</Text>
          {campaign?.status === "archived" ? (
            <Text style={styles.subTitle}>won the campaign with</Text>
          ) : (
            <Text style={styles.subTitle}> is leading board with </Text>
          )}
          <Text>
            {leadingTeam === "Team B"
              ? `${campaign?.teamB?.points}`
              : `${campaign?.teamA?.points}`}{" "}
            pts
          </Text>
        </View>
      )}
      <View style={styles.countDown}>
        {campaign?.status === "archived" ? (
          <Text>Closed</Text>
        ) : (
          <Text style={styles.time}>
            {` ${countDown.days}D:${countDown.hours}h:${countDown.minutes}m:${countDown.seconds}s`}
          </Text>
        )}
      </View>
    </View>
  );
};

export default LivePollTimeCal;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: Color.White,
  },
  scoreCard: {
    backgroundColor: Color.LightBg,
    height: scale(155),
    alignItems: "center",
    overflow: "hidden",
  },
  pointsContainer: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignSelf: "center",
    paddingVertical: scale(10),
    paddingHorizontal: scale(16),
  },
  countDown: {
    flexDirection: "row",
    alignItems: "center",
  },
  time: {
    fontFamily: "Roboto_700Bold",
    fontSize: scale(12),
    paddingHorizontal: scale(4),
  },
  lead: {
    flexDirection: "row",
    alignItems: "center",
  },
  subTitle: {
    fontSize: scale(12),
    fontFamily: "Roboto_500Medium",
  },
  postContainer: {
    flex: 1,
  },
});
