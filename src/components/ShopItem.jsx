import React, { useState } from "react";
import {
  View,
  Image,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from "react-native";
import { MaterialIcons } from "react-native-vector-icons";
import Color from "../../assets/colors/Color";
import { BASE_URL } from "../../CONSTANTS";
import { useStateContext } from "../contexts/ContextProvider";
import { useCartStateActions } from "../slices/cartSlice";

const height = Dimensions.get("screen").height;
const width = Dimensions.get("screen").width;

const ShopItem = (props) => {
  const [quantity, setQuantity] = useState(1);
  const CartActions = useCartStateActions();
  const { showSnackbar } = useStateContext();
  const addItemsToCart = (item) => {
    CartActions.addItem({ item, quantity });
    showSnackbar("item added to cart successfully!");
    setQuantity(1);
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: Color.White,
        flexDirection: "column",
        margin: 1,
        elevation: 2,
        borderRadius: 10,
        paddingBottom: 10,
        marginVertical: 10,
        marginHorizontal: 10,
        overflow: "hidden",
      }}
    >
      <Image
        style={styles.imageThumbnail}
        source={{ uri: `${BASE_URL}${props.item.image}` }}
      />
      <Text style={styles.Title}>{props.item.title}</Text>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          paddingVertical: 5,
          paddingHorizontal: 9,
        }}
      >
        <Text style={{ color: Color.Blue }}>Rs. {props.item.price}</Text>
        <Text style={{ color: Color.LightGrey }}>
          {props.item.deal_quantity} plants
        </Text>
      </View>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-around",
          paddingVertical: 5,
          borderRadius: 8,
          backgroundColor: Color.LightBlue,
          marginHorizontal: 6,
          alignItems: "center",
        }}
      >
        <MaterialIcons
          name="add"
          size={20}
          color={Color.Blue}
          style={{
            color: "white",
            borderRadius: 20,
            backgroundColor: "#4582C3",
          }}
          onPress={() => {
            setQuantity((prev) => prev + 1);
          }}
        />
        <Text style={{ color: Color.LightGrey, fontSize: 20 }}>{quantity}</Text>
        <MaterialIcons
          name="remove"
          size={20}
          color={Color.Blue}
          style={{
            color: "white",
            borderRadius: 20,
            backgroundColor: "#707070",
          }}
          onPress={() => {
            setQuantity((prev) => {
              if (prev === 1) return prev;
              return prev - 1;
            });
          }}
        />
      </View>
      <View
        style={{
          backgroundColor: Color.Blue,
          // bottom: 0,

          paddingVertical: 10,
          top: 10,
          borderBottomEndRadius: 6,
          // alignItems: "flex-end",
          // justifyContent: "flex-end",
          // borderRadius: 25,
        }}
      >
        <TouchableOpacity
          style={{ color: Color.White, alignSelf: "center" }}
          onPress={() => addItemsToCart(props.item, quantity)}
        >
          <Text style={{ color: Color.White }}>Add to Cart</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ShopItem;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "white",
  },
  imageThumbnail: {
    justifyContent: "center",
    alignItems: "center",
    width: width * 0.5,
    height: height * 0.18,
    resizeMode: "cover",
    backgroundColor: "red",
  },
  Title: {
    alignSelf: "center",
    color: Color.LightGrey,
  },
});
