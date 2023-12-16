import { StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import { returnCountDown } from "../utils/countdown";
import Color from "../../assets/colors/Color";
import { scale } from "react-native-size-matters";
import { useNavigation } from "@react-navigation/native";
import { axiosInstance } from "../../axiosInstance";
import { useStateContext } from "../contexts/ContextProvider";
import { useUserState } from "../slices/userSlice";
import axios from "axios";
import { BASE_URL } from "../../CONSTANTS";

const CampaignTimeLeft = ({ campaign }) => {
  const { campaignViewShortImage, showSnackbar } = useStateContext();
  const userState = useUserState();
  const navigation = useNavigation();
  const [leadingTeam, setleadingTeam] = useState("");
  const [equalpoints, setequalpoints] = useState("");
  const [completionExecuted, setCompletionExecuted] = useState(false);
  const [lossingTeam, setlossingTeam] = useState("");

  const [timeCal, settimeCal] = useState(false);
  const [countDown, setCountDown] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  useEffect(() => {
    let compareDate = new Date(campaign?.endTime);
    const interval = setInterval(() => {
      const newCountDown = returnCountDown(compareDate);
      if (newCountDown === "-1") {
        clearInterval(interval);
        settimeCal(true);
      } else {
        setCountDown(newCountDown);
        settimeCal(true);
      }
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [campaign?.endTime]);

  useEffect(() => {
    if (campaign?.teamA?.points > campaign?.teamB?.points) {
      setleadingTeam("Team A");
      setlossingTeam("Team B");
    } else if (campaign?.teamA?.points < campaign?.teamB?.points) {
      setleadingTeam("Team B");
      setlossingTeam("Team A");
    } else {
      setequalpoints("both");
    }
    // setCompletionExecuted(true);
  }, []);
  useEffect(() => {
    if (
      timeCal &&
      campaign?.status !== "archived" &&
      countDown?.days === 0 &&
      countDown?.hours === 0 &&
      countDown?.minutes === 0
    ) {
      handleCampaignCompletion();
    }
  }, [timeCal]);

  const handleEndCampaign = async () => {
    console.log("run funcation");
    try {
      const res = await axiosInstance.patch(
        `/archives/addArchiveCampaign/${campaign._id}`
      );

      if (res.data) {
      }
    } catch (error) {
      console.log(error, "error while campaign archive");
    }
  };

  const handleCampaignCompletion = async () => {
    // if (!completionExecuted) {
    //   return;
    // }

    let description;

    if (equalpoints === "both") {
      description =
        "In a thrilling showdown, Team A and Team B have battled to a spectacular tie! 🏆 Both teams showcased incredible talent and resilience, and the result reflects the true spirit of competition. 🌟🙌 #TieGame #Sportsmanship #Unstoppable 🥇🥈";
    } else {
      description = `And the winner is... ${leadingTeam}! 🏆 Their determination and teamwork shone brightly. 🌟 Kudos to ${lossingTeam} for an outstanding effort! 🙌 #Champions #Teamwork`;
    }
    try {
      const formData = new FormData();
      formData.append("description", description);
      formData.append("postedby", JSON.stringify("654fece4d4690e92e1609c6e"));
      formData.append("media", {
        name: "image/jpeg",
        uri: campaignViewShortImage,
        type: "image/jpeg",
      });

      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
          Accept: "application/json",
          "auth-token": userState.token,
        },
      };
      const { data } = await axios.post(
        `${BASE_URL}/story/addstory/`,
        formData,
        config
      );
      showSnackbar(
        "The campaign time is over. Thank you for your participation"
      );
      handleEndCampaign();
      navigation.navigate("Home");
    } catch (error) {
      console.log(error, "Error occurred");
    }
  };

  return (
    <View style={styles.pointsContainer}>
      {equalpoints === "both" ? (
        <Text style={styles.equalpoints}>Both teams have equal points</Text>
      ) : (
        <View style={styles.lead}>
          <Text style={styles.time}>{leadingTeam} </Text>
          {campaign?.status === "archived" ? (
            <Text style={styles.subTitle}>won the campaign with</Text>
          ) : (
            <Text style={styles.subTitle}> is leading board with </Text>
          )}
          <Text style={styles.subTitle}>
            {leadingTeam === "Team B"
              ? `${campaign?.teamB?.points}`
              : `${campaign?.teamA?.points}`}{" "}
            pts
          </Text>
        </View>
      )}
      <View style={styles.countDown}>
        {campaign?.status === "archived" ? (
          <Text style={styles.time}>Closed</Text>
        ) : (
          <Text style={styles.time}>
            {` ${countDown.days}D:${countDown.hours}h:${countDown.minutes}m:${countDown.seconds}s`}
          </Text>
        )}
      </View>
    </View>
  );
};

export default CampaignTimeLeft;

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
    fontSize: scale(11.5),
    paddingHorizontal: scale(4),
  },
  lead: {
    flexDirection: "row",
    alignItems: "center",
  },
  subTitle: {
    fontSize: scale(11.5),
    fontFamily: "Roboto_500Medium",
  },
  postContainer: {
    flex: 1,
  },
  equalpoints: {
    fontSize: scale(11.5),
    fontFamily: "Roboto_500Medium",
  },
});
