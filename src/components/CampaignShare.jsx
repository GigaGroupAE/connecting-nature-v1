import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React from "react";
import { FontAwesome } from "react-native-vector-icons";
import Color from "../../assets/colors/Color";
import { scale } from "react-native-size-matters";

const Height = Dimensions.get("screen").height;
const Width = Dimensions.get("window").width;

const CampaignShare = ({ handleShareExternal, handlePointsShareFeed }) => {
  return (
    <View style={styles.modalContainer}>
      <TouchableOpacity
        style={styles.contentContainer}
        onPress={handlePointsShareFeed}
      >
        <Image
          source={require("../../assets/postLogo.png")}
          style={styles.image}
        />
        <Text style={styles.title}>Share on Feeds</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.contentContainer}
        onPress={handleShareExternal}
      >
        <FontAwesome name="share" style={styles.icon} />
        <Text style={styles.title}>Share external</Text>
      </TouchableOpacity>
    </View>
  );
};

export default CampaignShare;

const styles = StyleSheet.create({
  modalContainer: {
    backgroundColor: Color.White,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: Width * 0.05,
    paddingVertical: Height * 0.01,
    borderBottomWidth: 0.5,
    borderBottomColor: Color.LightGrey,
    // marginBottom: Height * 0.01,
  },
  contentContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  image: {
    width: 25,
    height: 23,
    resizeMode: "contain",
  },
  title: {
    fontFamily: "Roboto_400Regular",
    fontSize: scale(14),
    paddingHorizontal: scale(10),
    marginTop: Height * 0.007,
  },
  icon: {
    marginTop: Height * 0.01,
    fontSize: scale(17),
  },
});
