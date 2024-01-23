import React from "react";
import { Dimensions, Image, StyleSheet, Text } from "react-native";
import { View } from "react-native-animatable";
import Color from "../../../assets/colors/Color";
import { BASE_URL } from "../../../CONSTANTS";
import logo from "../../../assets/plantImage.jpg";

const height = Dimensions.get("screen").height;
const width = Dimensions.get("screen").width;
const OrderItem = ({ items }) => {
  return (
    <View
      style={{
        flexDirection: "column",
        alignItems: "flex-start",
        flex: 1,
        position: "relative",
      }}
    >
      {items.orderItems.map((item, index) => (
        <View
          style={{
            width: "100%",
          }}
          key={index}
        >
          <View
            style={{
              flexDirection: "row",
              paddingVertical: 35,
            }}
          >
            <Image source={{uri:`${BASE_URL}${item.product.image}`}} style={styles.ItemImage} />

            <Text style={styles.ItemName}>
              {item.product.title}
            </Text>
          </View>
          <Text style={styles.ItemDeal}>{item.quantity}x</Text>
          <Text style={styles.ItemPrice}>Rs.{item.product.price}x{item.quantity} = {item.product.price * item.quantity}</Text>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  ItemImage: {
    width: width * 0.13,
    height: height * 0.06,
    borderRadius: 8,
    resizeMode: "cover",
    position: "absolute",
    left: 15,
    top: 10,
  },
  ItemName: {
    position: "absolute",
    left: "18.87%",
    top: 11,
    fontSize: 16,
    fontWeight: "600",
    color: Color.Grey,
  },
  ItemQuantity: {
    position: "absolute",
    left: "16.13%",
    top: 36,
    color: Color.Grey,
    fontSize: 15,
    // marginVertical: 0,
  },
  ItemPrice: {
    position: "absolute",
    right: 30,
    top: 36,
    fontSize: 12,
    color: Color.Blue,
  },
  ItemDeal: {
    position: "absolute",
    left: "20.13%",
    top: 36,
    color: Color.Grey,
    fontSize: 15,
  },
});

export default OrderItem;
