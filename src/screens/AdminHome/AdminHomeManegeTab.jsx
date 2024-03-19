import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React from "react";
import { Pressable } from "react-native";
import { MaterialCommunityIcons, AntDesign } from "react-native-vector-icons";
import Color from "../../../assets/colors/Color";
import { useNavigation } from "@react-navigation/native";
import { Image } from "react-native";
import { scale } from "react-native-size-matters";

const Height = Dimensions.get("screen").height;
const Width = Dimensions.get("screen").width;

const AdminHomeManegeTab = ({ camapgins, loading }) => {
  const navigation = useNavigation();
  const handleInviteUser = () => {
    navigation.navigate("InviteUsers");
  };
  const handleVerificationReq = () => {
    navigation.navigate("UpgradeRequestsScreen");
  };

  const handleDoDay = () => {
    navigation.navigate("dodaylist", camapgins);
  };

  return (
    <View style={{ marginBottom: "23%" }}>
      <View style={styles.bodyContainer}>
        <Pressable style={styles.upgradReq} onPress={handleVerificationReq}>
          <Image
            source={require("../../../assets/updatereq.png")}
            style={styles.image}
          />
          <Text style={styles.reqText}>Verification Request</Text>
          <AntDesign
            name="right"
            style={{ fontSize: 20, color: Color.Black }}
          />
        </Pressable>
      </View>
      <View style={styles.bodyContainer}>
        <Pressable style={styles.upgradReq} onPress={handleInviteUser}>
          <MaterialCommunityIcons
            name="account-arrow-up-outline"
            style={{ fontSize: 22, color: Color.Black }}
          />
          <Text style={styles.reqText}>Invite Users</Text>
          <AntDesign
            name="right"
            style={{ fontSize: 20, color: Color.Black }}
          />
        </Pressable>
      </View>

      <View style={styles.bodyContainer}>
        <TouchableOpacity
          disabled={loading}
          style={styles.upgradReq}
          // onPress={handleDoDay}
        >
          <Image
            source={require("../../../assets/portal.png")}
            style={styles.image}
          />

          <Text style={styles.reqText}>Do-Day Portal</Text>
          <AntDesign
            name="right"
            style={{ fontSize: 20, color: Color.Black }}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default AdminHomeManegeTab;

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
    paddingVertical: Height * 0.022,
    marginLeft: Width * 0.025,
    fontSize: Height * 0.02,
    fontFamily: "Roboto_400Regular",
    flex: 1,
    alignSelf: "center",
    color: Color.Black,
    fontWeight: "400",
  },
  groupContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  bodyContainer: {
    borderColor: Color.VeryLightGrey,
    marginBottom: Height * 0.01,
    backgroundColor: Color.White,
    borderRadius: 10,
    marginVertical: Height * 0.007,
    borderColor: Color.LightGrey,
    backgroundColor: Color.White,
    shadowColor: Color.Black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
    position: "relative",
    zIndex: 900,
    width: "90%",
    alignSelf: "center",
  },
  image: {
    width: scale(18),
    height: scale(18),
  },
});
