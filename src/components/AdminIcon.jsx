import { Dimensions, StyleSheet, Text, View } from "react-native";
import React from "react";
import { MaterialCommunityIcons } from "react-native-vector-icons";
import Color from "../../assets/colors/Color";

const Height = Dimensions.get("screen").height;

const AdminIcon = ({ userType }) => {
  return (
    <View>
      {(userType === "Operations" ||
        userType === "Admin" ||
        userType === "Manager" ||
        userType === "Assistant Manager" ||
        userType === "Super Admin" ||
        userType === "celebrity") && (
        <MaterialCommunityIcons
          name="check-decagram"
          style={styles.adminIcon}
        />
      )}
    </View>
  );
};

export default AdminIcon;

const styles = StyleSheet.create({
  adminIcon: {
    marginLeft: 3,
    alignSelf: "center",
    fontSize: Height * 0.018,
    color: Color.Blue,
    marginTop: Height * 0.005,
  },
});
