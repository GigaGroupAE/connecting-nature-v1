import React from "react";
import { View, Image, Text, StyleSheet } from "react-native";
import { theme } from "../../../theme";

import pic from "../../../assets/splash.png";
import { BASE_URL } from "../../../CONSTANTS";

const OrderDetailsCard = ({ screenWidth, data }) => {
  console.log(data.product);
  return (
    <View style={{ ...styles.card, margin: screenWidth * 0.02 }}>
      <View style={styles.cardPicAndTitleContainer}>
        <Image
          source={{ uri: `${BASE_URL}${data.product.image}` }}
          style={{
            ...styles.cardPic,
            height: screenWidth * 0.16,
            width: screenWidth * 0.16,
          }}
        />
        <View style={{ marginLeft: screenWidth * 0.02 }}>
          <Text
            style={{
              fontSize: screenWidth * 0.035,
              ...styles.titleText,
            }}
          >
            {data.product.title}
          </Text>
          <Text
            style={{
              ...styles.titleText,
              fontSize: screenWidth * 0.03,
            }}
          >
            {data.product.deal_quantity} plants
          </Text>
        </View>
      </View>
      <Text
        style={{
          fontSize: screenWidth * 0.03,
          fontFamily: theme.fonts.family.semiBold,
        }}
      >
        x{data.quantity}
      </Text>
      <Text
        style={{
          fontSize: screenWidth * 0.03,
          marginRight: screenWidth * 0.02,
          fontFamily: theme.fonts.family.semiBold,
          color: "#4582C3",
        }}
      >
        Rs. {data.product.price * data.quantity}
      </Text>
    </View>
  );
};

export default OrderDetailsCard;

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderRadius: 8,
    backgroundColor: "white",
    elevation: 3,
  },
  cardPicAndTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  cardPic: {
    borderTopLeftRadius: 8,
    borderBottomLeftRadius: 8,
  },
  titleText: {
    color: "#707070",
    fontFamily: theme.fonts.family.medium,
  },
});
