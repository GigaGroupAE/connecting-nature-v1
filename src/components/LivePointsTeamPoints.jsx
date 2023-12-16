import {
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React from "react";
import { scale } from "react-native-size-matters";
import Color from "../../assets/colors/Color";
import { useNavigation } from "@react-navigation/native";

const LivePointsTeamPoints = ({ campaign }) => {
  return (
    <View>
      <ImageBackground
        source={require("../../assets/vs-bg.png")}
        style={styles.imageBackground}
      >
        <View style={styles.card}>
          <View style={styles.teamContainer}>
            <Text style={styles.team}>Team A</Text>
            <Text style={styles.points}>{campaign?.teamA?.points}</Text>
          </View>
          <View style={styles.teamContainer}>
            <Text style={styles.team}>Team B</Text>
            <Text style={styles.points}>{campaign?.teamB?.points}</Text>
          </View>
        </View>
      </ImageBackground>
    </View>
  );
};

export default LivePointsTeamPoints;

const styles = StyleSheet.create({
  imageBackground: {
    width: "100%",
    height: scale(76),
  },
  card: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    alignSelf: "center",
    height: "100%",
    width: "100%",
  },
  teamContainer: {
    width: "50%",
    alignItems: "center",
  },
  points: {
    color: Color.White,
    fontFamily: "Roboto_700Bold",
    fontSize: scale(27),
  },
  team: {
    color: Color.White,
    fontFamily: "Roboto_400Regular",
    fontSize: scale(12),
  },
});
