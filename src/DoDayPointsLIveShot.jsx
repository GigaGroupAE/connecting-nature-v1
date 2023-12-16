import {
  Dimensions,
  Image,
  ImageBackground,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, { useEffect, useRef } from "react";
import ViewShot from "react-native-view-shot";
import { BASE_URL } from "../CONSTANTS";
import Color from "../assets/colors/Color";
import { useStateContext } from "./contexts/ContextProvider";
const Height = Dimensions.get("screen").height;
const Width = Dimensions.get("screen").width;
const DoDayPointsLIveShot = ({ doday, loading }) => {
  const { campaignViewShortImage, setcampaignViewShortImage } =
    useStateContext();
  const viewShotRef = useRef();
  useEffect(() => {
    const CaptureImage = async () => {
      const imageUri = await viewShotRef.current.capture();
      setcampaignViewShortImage(imageUri);
    };
    CaptureImage();
  }, [loading]);

  return (
    <View style={{ width: "100%" }}>
      <ViewShot
        ref={viewShotRef}
        options={{
          format: "jpg",
          quality: 0.9,
        }}
      >
        <View style={styles.teamsContainer}>
          <ImageBackground
            source={require("../assets/vs-bg.png")}
            resizeMode="cover"
          >
            <View style={styles.blendMode}>
              <View style={styles.teams}>
                <Image
                  style={styles.avatar}
                  source={
                    doday?.teamA?.leader?.profile
                      ? {
                          uri: `${BASE_URL}/images/${doday?.teamA?.leader?.profile}`,
                        }
                      : require("../assets/avatar-placeholder.png")
                  }
                />

                <Text style={styles.leaderUserName}>
                  {doday.teamA?.leader?.fullName || "No Leader"}
                </Text>
                <Text style={styles.teamText}>Team A</Text>

                <Text style={styles.points}>{doday.teamA.points}</Text>
              </View>
              <View style={styles.teams}>
                <Image
                  style={styles.avatar}
                  source={
                    doday?.teamA?.leader?.profile
                      ? {
                          uri: `${BASE_URL}/images/${doday?.teamB?.leader?.profile}`,
                        }
                      : require("../assets/avatar-placeholder.png")
                  }
                />

                <Text style={styles.leaderUserName}>
                  {doday?.teamB?.leader?.fullName || "No Leader"}
                </Text>
                <Text style={styles.teamText}>Team B</Text>

                <Text style={styles.points}>{doday.teamB?.points}</Text>
              </View>
            </View>
          </ImageBackground>
        </View>
      </ViewShot>
    </View>
  );
};

export default DoDayPointsLIveShot;

const styles = StyleSheet.create({
  pollHeading: {
    alignItems: "center",
  },
  headingText: {
    fontFamily: "Roboto_600SemiBold",
    color: Color.Black,
    fontSize: Height * 0.032,
    width: "100%",
  },
  pollDesc: {
    fontFamily: "Roboto_400Regular",
    color: Color.Grey,
    fontSize: Height * 0.02,
  },
  teamsContainer: {
    width: "100%",
    backgroundColor: Color.DarkBlue,
  },
  blendMode: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    alignContent: "center",

    paddingHorizontal: Width * 0.08,
    paddingVertical: Height * 0.015,
  },
  teams: {
    alignItems: "center",
    marginTop: Height * 0.012,
  },
  teamText: {
    fontFamily: "Roboto_600SemiBold",
    color: Color.White,
    fontSize: Height * 0.017,
    width: "100%",
    textAlign: "center",
  },
  points: {
    fontFamily: "Roboto_600SemiBold",
    color: Color.White,
    fontSize: Height * 0.045,
    textAlign: "center",
    marginTop: Height * 0.012,
  },
  avatar: {
    marginTop: 10,
    width: 70,
    height: 70,
    borderRadius: 35,
    resizeMode: "contain",
  },
  leaderUserName: {
    fontFamily: "Roboto_600SemiBold",
    color: Color.White,
    fontSize: Height * 0.023,
    textAlign: "center",
    marginTop: Height * 0.012,
  },
});
