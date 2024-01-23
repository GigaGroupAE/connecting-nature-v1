import { Dimensions, Image, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import Color from "../../../../assets/colors/Color";

import { useStateContext } from "../../../contexts/ContextProvider";
import { BASE_URL } from "../../../../CONSTANTS";
const Width = Dimensions.get("screen").width;
const Height = Dimensions.get("screen").height;

const WinerCard = ({ winerTeam }) => {
  const [leadingTeam, setleadingTeam] = useState("");
  const [winerTeamScore, setwinerTeamScore] = useState(0);
  const [equalpoints, setequalpoints] = useState("");

  const { activeCampaign } = useStateContext();

  useEffect(() => {
    if (activeCampaign?.teamA?.points > activeCampaign?.teamB?.points) {
      setleadingTeam("Team A");
    } else if (activeCampaign?.teamB?.points > activeCampaign?.teamA?.points) {
      setleadingTeam("Team B");
    } else {
      setequalpoints("both");
    }
  }, [activeCampaign]);

  const TeamALeaderName =
    activeCampaign?.teamA?.leader?.fullName?.length > 12
      ? activeCampaign?.teamA?.leader?.fullName.slice(0, 11) + "..."
      : activeCampaign?.teamA?.leader?.fullName;

  const TeamBLeaderName =
    activeCampaign?.teamB?.leader?.fullName?.length > 12
      ? activeCampaign?.teamB?.leader?.fullName?.slice(0, 11) + "..."
      : activeCampaign?.teamB?.leader?.fullName;

  return (
    <View
      style={{
        width: Width * 0.9,
        alignSelf: "center",
        // paddingTop: Height * 0.03,
      }}
    >
      <View style={{ flexDirection: "row", marginTop: Height * 0.012 }}>
        {equalpoints === "both" ? (
          <Text style={{ ...styles.winerTile, fontWeight: "400" }}>
            Both teams have equal points
          </Text>
        ) : (
          <>
            <Text style={styles.winerTile}> 👑 {leadingTeam} </Text>
            <Text style={{ ...styles.winerTile, fontWeight: "600" }}>
              is leading the board with {winerTeamScore} points!!
            </Text>
          </>
        )}
      </View>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          marginVertical: Height * 0.02,
        }}
      >
        <View>
          <View style={winerTeam === "teamA" ? styles.winer : styles.loser}>
            <Image
              source={{
                uri: `${BASE_URL}/images/${activeCampaign?.teamA?.leader?.profile}`,
              }}
              style={{
                // width: Width * 0.2,
                // height: Height * 0.1,
                borderRadius: Height * 1,
                resizeMode: "contain",
                marginBottom: Height * 0.01,
                borderWidth: Height * 0.001,
                borderColor: Color.Grey,
                width: 65,
                height: 65,
              }}
            />
            <Text
              style={
                winerTeam === "teamA" ? styles.winerText : styles.loserText
              }
            >
              {TeamALeaderName}
            </Text>
            <Text
              style={
                winerTeam === "teamA"
                  ? { ...styles.winerText }
                  : { ...styles.loserText, fontWeight: "600" }
              }
            >
              Team A
            </Text>

            <Text
              style={
                winerTeam === "teamA"
                  ? {
                      ...styles.winerText,
                      fontWeight: "700",
                      fontSize: Height * 0.033,
                    }
                  : {
                      ...styles.loserText,
                      fontWeight: "700",
                      fontSize: Height * 0.033,
                    }
              }
            >
              {activeCampaign?.teamA.points}
            </Text>
          </View>
          <Text style={styles.volunteers}>
            Volunteers({activeCampaign?.teamA?.members.length})
          </Text>
        </View>
        <View>
          <View style={winerTeam === "teamB" ? styles.winer : styles.loser}>
            <Image
              source={{
                uri: `${BASE_URL}/images/${activeCampaign?.teamB?.leader?.profile}`,
              }}
              style={{
                width: 65,
                height: 65,
                borderRadius: Height * 1,
                resizeMode: "contain",
                marginBottom: Height * 0.01,
                borderWidth: Height * 0.001,
                borderColor: Color.Grey,
              }}
            />
            <Text
              style={
                winerTeam === "teamB" ? styles.winerText : styles.loserText
              }
            >
              {TeamBLeaderName}
            </Text>
            <Text
              style={
                winerTeam === "teamB"
                  ? { ...styles.winerText }
                  : { ...styles.loserText, fontWeight: "600" }
              }
            >
              Team B
            </Text>

            <Text
              style={
                winerTeam === "teamB"
                  ? {
                      ...styles.winerText,
                      fontWeight: "700",
                      fontSize: Height * 0.033,
                    }
                  : {
                      ...styles.loserText,
                      fontWeight: "700",
                      fontSize: Height * 0.033,
                    }
              }
            >
              {activeCampaign?.teamB?.points}
            </Text>
          </View>
          <Text style={styles.volunteers}>
            Volunteers({activeCampaign?.teamB?.members?.length})
          </Text>
        </View>
      </View>
    </View>
  );
};

export default WinerCard;

const styles = StyleSheet.create({
  winerTile: {
    fontSize: Height * 0.019,
    fontWeight: "700",
    fontFamily: "Roboto",
  },
  winer: {
    backgroundColor: Color.Blue,
    paddingVertical: Height * 0.02,
    // paddingHorizontal: Width * 0.098,
    width: Width * 0.42,
    borderRadius: Height * 0.01,
    alignItems: "center",
    color: Color.White,
    // backgroundColor: Color.White,
    borderRadius: 8,
    shadowColor: Color.Grey,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
    elevation: 8,
  },
  loser: {
    backgroundColor: Color.White,
    paddingVertical: Height * 0.02,
    // paddingHorizontal: Width * 0.085,
    width: Width * 0.42,
    borderRadius: Height * 0.01,
    alignItems: "center",
    borderWidth: Height * 0.001,
    borderRadius: 8,
    shadowColor: Color.Grey,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
    elevation: 8,
  },
  winerText: {
    color: Color.White,
    fontWeight: "600",
    fontSize: Height * 0.019,
  },
  loserText: {
    color: Color.Black,
    fontWeight: "700",
    fontSize: Height * 0.019,
  },
  volunteers: {
    alignSelf: "center",
    marginVertical: Height * 0.013,
    color: Color.Blue,
    fontWeight: "700",
    fontSize: Height * 0.02,
  },
});
