import {
  Dimensions,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React from "react";
import HeaderList from "../VolunteersTeams/HeaderList";
import WinerCard from "./WinerCard";
import Color from "../../../../assets/colors/Color";

import ListPortal from "./ListPortal";

const Height = Dimensions.get("screen").height;
const Width = Dimensions.get("screen").width;

const DoDayPortal = () => {
  return (
    <View style={{ backgroundColor: Color.White, height: "100%" }}>
      <HeaderList title="Do-Day Portal" />

      <ListPortal />
    </View>
  );
};

export default DoDayPortal;

const styles = StyleSheet.create({
  upgradReq: {
    flexDirection: "row",
    alignSelf: "center",
    width: "100%",
    paddingHorizontal: Width * 0.025,
    justifyContent: "space-between",
    alignItems: "center",
  },
  reqText: {
    paddingVertical: Height * 0.02,
    marginLeft: Width * 0.025,
    fontSize: Height * 0.02,
    fontWeight: "400",
    fontFamily: "Roboto_500Medium",
    flex: 1,
    alignSelf: "center",
    color: Color.Grey,
  },
  bodyContainer: {
    flexDirection: "row",
    marginVertical: Height * 0.006,
    backgroundColor: Color.White,
    borderRadius: 8,
    shadowColor: Color.Grey,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
    elevation: 4,
    justifyContent: "space-between",
    width: "88%",
    alignSelf: "center",
  },
});
