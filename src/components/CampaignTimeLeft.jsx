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
