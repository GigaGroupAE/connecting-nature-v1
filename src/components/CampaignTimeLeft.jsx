import { StyleSheet, Text, View } from "react-native"
import React, { useEffect, useMemo, useState } from "react"
import Color from "../../assets/colors/Color"
import { scale } from "react-native-size-matters"
import { useNavigation } from "@react-navigation/native"
import { axiosInstance } from "../../axiosInstance"
import { useStateContext } from "../contexts/ContextProvider"
import { useUserState } from "../slices/userSlice"
import axios from "axios"
import { BASE_URL } from "../../CONSTANTS"
import { getRemainingTime } from "../utils/CampaignsHelper"

const CampaignTimeLeft = ({ campaign }) => {
  const remainingTime = useMemo(() => getRemainingTime(campaign?.endTime), [])
  const { campaignViewShortImage, showSnackbar } = useStateContext()
  const userState = useUserState()

  const handleEndCampaign = async () => {
    try {
      const res = await axiosInstance.patch(
        `/archives/addArchiveCampaign/${campaign._id}`
      )

      if (res.data) {
      }
    } catch (error) {
      console.log(error, "error while campaign archive")
    }
  }
  const handleCampaignCompletion = async () => {
    const teamAPoints = campaign?.teamA?.points || 0
    const teamBPoints = campaign?.teamB?.points || 0

    let description
    let leadingTeam
    let lossingTeam

    if (teamAPoints > teamBPoints) {
      leadingTeam = "Team A"
      lossingTeam = "Team B"
    } else if (teamAPoints < teamBPoints) {
      leadingTeam = "Team B"
      lossingTeam = "Team A"
    } else {
      description =
        "In a thrilling showdown, Team A and Team B have battled to a spectacular tie! 🏆 Both teams showcased incredible talent and resilience, and the result reflects the true spirit of competition. 🌟🙌 #TieGame #Sportsmanship #Unstoppable 🥇🥈"
    }

    if (!description) {
      description = `And the winner is... ${leadingTeam}! 🏆 Their determination and teamwork shone brightly. 🌟 Kudos to ${lossingTeam} for an outstanding effort! 🙌 #Champions #Teamwork`
    }

    try {
      const formData = new FormData()
      formData.append("description", description)
      formData.append("postedby", JSON.stringify("654fece4d4690e92e1609c6e"))
      formData.append("media", {
        name: "image/jpeg",
        uri: campaignViewShortImage,
        type: "image/jpeg",
      })
      console.log(formData)
      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
          Accept: "application/json",
          "auth-token": userState.token,
        },
      }

      // Uncomment when ready to make the API call
      // const { data } = await axios.post(
      //   `${BASE_URL}/story/addstory/`,
      //   formData,
      //   config
      // );

      showSnackbar(
        "The campaign time is over. Thank you for your participation"
      )
      // handleEndCampaign();
      // navigation.navigate("Home");
    } catch (error) {
      console.log(error, "Error occurred")
    }
  }
  useEffect(() => {
    if (remainingTime === "Campaign ended") {
      const delay = 40000 // 10 seconds delay
      setTimeout(() => {
        if (remainingTime === "Campaign ended") {
          handleCampaignCompletion()
        }
      }, delay)
    }
  }, [remainingTime])

  return (
    <View style={styles.pointsContainer}>
      {campaign?.teamA?.points === campaign?.teamB?.points ? (
        <Text style={styles.equalpoints}>Both teams have equal points</Text>
      ) : (
        <View style={styles.lead}>
          <Text style={styles.time}>
            {campaign?.teamA?.points > campaign?.teamB?.points
              ? "Team A"
              : "Team B"}{" "}
          </Text>
          <Text style={styles.subTitle}>
            {campaign?.status === "archived"
              ? "won the campaign with"
              : " is leading board with"}
          </Text>
          <Text style={styles.subTitle}>
            {campaign?.teamA?.points > campaign?.teamB?.points
              ? campaign?.teamA?.points
              : campaign?.teamB?.points}{" "}
            pts
          </Text>
        </View>
      )}
      <View style={styles.countDown}>
        {campaign?.status === "archived" ? (
          <Text style={styles.time}>Closed</Text>
        ) : (
          <Text style={styles.time}>{remainingTime}</Text>
        )}
      </View>
    </View>
  )
}

export default CampaignTimeLeft

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
})
