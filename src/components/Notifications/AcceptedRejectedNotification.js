//react/native imports
import { View, Text, Image, StyleSheet } from "react-native";
import logo from "../../../assets/cn-icon.png";
import { theme } from "../../../theme";

const AcceptedRejectedNotification = ({ data, type }) => {
  return (
    <View style={[styles.notificationCardWrapper]}>
      <View style={styles.cardContentContainer}>
        {<Image source={logo} style={styles.avatar} />}

        <View style={{ flex: 1, paddingLeft: "5%" }}>
          <Text
            style={[
              styles.title,
              type === "accepted" ? { color: "green" } : { color: "red" },
            ]}
          >
            Giga Management
          </Text>
          {type === "accepted" && (
            <Text
              style={styles.acceptedText}
            >{`You accepted the invite to participate  in  ${data.data.content.campaignName}`}</Text>
          )}
          {type === "rejected" && (
            <Text
              style={styles.rejectedText}
            >{`You denied the invite to participate  in  ${data.data.content.campaignName}`}</Text>
          )}
        </View>
      </View>
    </View>
  );
};

export default AcceptedRejectedNotification;
const styles = StyleSheet.create({
  notificationCardWrapper: {
    //height: HEIGHT * 0.15,
    paddingBottom: 10,
    borderRadius: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: "rgba(154, 154, 154, 0.5)",
  },
  cardContentContainer: {
    flex: 1,
    marginTop: "5%",
    flexDirection: "row",
  },
  title: {
    fontFamily: theme.fonts.family.medium,
  },
  acceptedText: {
    fontFamily: theme.fonts.family.regular,
    color: "rgba(112, 112, 112, 0.7)",
  },
  rejectedText: {
    fontFamily: theme.fonts.family.regular,
    color: "rgba(112, 112, 112, 0.7)",
    textDecorationLine: "line-through",
  },
  avatar: {
    height: 60,
    width: 60,
    borderRadius: 60 / 2,
  },
});
