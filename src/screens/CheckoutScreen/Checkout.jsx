import {
  Dimensions,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  StatusBar,
  ScrollView,
  Image,
  Pressable,
  TouchableOpacity,
} from "react-native";
import React, { useState } from "react";
import Color from "../../../assets/colors/Color";
import { Feather, Entypo } from "@expo/vector-icons";
import HeaderNormal from "../../components/HeaderNormal";
import { Card } from "react-native-paper";
import uuid from "react-native-uuid";
import { BASE_URL } from "../../../CONSTANTS";
import { useUserState } from "../../slices/userSlice";
import InputText from "../../components/InputText";
import { RadioButton } from "react-native-paper";
import { Button, ButtonGroup } from "react-native-elements";
import { CommonActions, useNavigation } from "@react-navigation/native";
import { useCartState, useCartStateActions } from "../../slices/cartSlice";
import axios from "axios";
import { useStateContext } from "../../contexts/ContextProvider";
import { MaterialIcons } from "react-native-vector-icons";
import moment from "moment";
import { OUTSOURC_GROUP } from "../../../CONSTANTS";

const HEIGHT = Dimensions.get("screen").height;
const WIDTH = Dimensions.get("screen").width;

// we will receive the items added in cart in the props
export default function Checkout(props) {
  const userState = useUserState();
  const CartActions = useCartStateActions();
  const [fullName, setfullName] = useState("Hamza Naseer");
  const [phoneNumber, setphoneNumber] = useState("09810291129");
  const [email, setemail] = useState("test@gmail.com");
  const [address, setadress] = useState("9th avenue");
  const [city, setcity] = useState("islamabad");
  const [checked, setChecked] = useState();
  const [instructions, setinstructions] = useState("none");
  const { loading, setLoading } = useStateContext();
  const navigation = useNavigation();
  const cartState = useCartState();
  const [quantity, setQuantity] = useState(1);

  const decrement = (id, quantity) => {
    console.log("quantity is ", quantity);
    if (quantity === 1) return;
    CartActions.decrementQuantity({ id });
  };

  const increment = (item) => {
    CartActions.addItem({ item, quantity: 1 });
  };

  const createOrder = async () => {
    //making the correct format of the payload
    let payload = {};
    payload.orderItems = cartState.cart.map((item) => {
      return {
        product: item.product._id,
        quantity: item.quantity,
      };
    });
    payload.shippingAddress = {
      fullName,
      phoneNumber,
      address,
      city,
      email,
    };
    payload.paymentMode = "COD";
    payload.deliveryInstructions = instructions || "none";

    try {
      setLoading(true);
      const config = {
        headers: {
          "auth-token": userState.token,
        },
      };
      const { data } = await axios.post(
        `${BASE_URL}/order/create`,
        payload,
        config
      );
      if (data.success) {
        let date = moment().utcOffset("+05:00");
        const unique_id = uuid.v4();
        const id = unique_id.slice(0, 8);
        axios
          .patch(`${BASE_URL}/groups/updategroup/${OUTSOURC_GROUP}`, {
            message: {
              id: id,
              from: userState,
              type: "order",
              content: {
                id: data.order._id,
                image: "1668525637491groupPic.jpg",
              },
              date,
              status: "pending",
            },
          })
          .then((res) => console.log(res.data))
          .catch((err) => console.log("Error Here"));
        setLoading(false);
        navigation.dispatch(
          CommonActions.reset({
            routes: [
              {
                name: "Home",
              },
              {
                name: "OrderCompleted",
                params: {
                  item: cartState,
                },
              },
            ],
          })
        );
      }
    } catch (error) {
      console.log("error ", error);
    } finally {
      console.log("finally block");
      setLoading(false);
      CartActions.resetState();
      console.log("cleared--------------------- state");
    }
  };
  return (
    <ScrollView>
      <SafeAreaView style={{ flex: 1 }}>
        <HeaderNormal title="Chekout" />

        {cartState.cart.map((data, idx) => {
          return (
            <View style={styles.container} key={idx}>
              <Image
                style={styles.image}
                source={{ uri: `${BASE_URL}${data.product.image}` }}
              />
              <View
                style={{
                  flexDirection: "column",
                  height: HEIGHT * 0.05,
                  position: "absolute",
                  top: 10,
                  left: 85,
                }}
              >
                <Text
                  numberOfLines={1}
                  style={{
                    alignSelf: "center",
                    color: Color.DarkGrey,
                    fontSize: 16,
                    marginBottom: 5,
                    flexWrap: "wrap",
                  }}
                >
                  {data.product.title}
                </Text>
                <Text style={{ color: Color.DarkGrey, fontSize: 12 }}>
                  {data.product.deal_quantity} plants
                </Text>
              </View>

              <View
                style={{
                  justifyContent: "space-between",
                  borderRadius: 8,
                  // backgroundColor: Color.LightBlue,
                  alignItems: "center",
                  alignSelf: "center",
                  flexDirection: "row",
                  position: "absolute",
                  left: 85,
                  top: 60,
                  width: WIDTH * 0.2,
                  // paddingHorizontal: 10,
                  paddingVertical: 2,
                }}
              >
                <MaterialIcons
                  name="add"
                  size={15}
                  color={Color.Blue}
                  style={{
                    color: "white",
                    borderRadius: 10,
                    backgroundColor: "#4582C3",
                    paddingHorizantal: 10,
                  }}
                  onPress={() => {
                    console.log("data is ", data);
                    increment(data.product);
                  }}
                />
                <Text style={{ color: Color.LightGrey, fontSize: 18 }}>
                  {data.quantity}
                </Text>
                <MaterialIcons
                  name="remove"
                  size={15}
                  color={Color.Blue}
                  style={{
                    color: "white",
                    borderRadius: 20,
                    backgroundColor: "#707070",
                  }}
                  onPress={() => decrement(data.product._id, data.quantity)}
                />
              </View>

              <View
                style={{
                  justifyContent: "space-evenly",
                  flexDirection: "column",
                  backgroundColor: "red",
                }}
              >
                <MaterialIcons
                  name="close"
                  size={15}
                  color={Color.Blue}
                  style={{
                    position: "absolute",
                    top: 2,
                    right: 8,
                    fontSize: 19,
                  }}
                  onPress={() =>
                    CartActions.removeItem({ id: data.product._id })
                  }
                />
                <Text
                  style={{
                    alignSelf: "center",
                    color: Color.Blue,
                    position: "absolute",
                    bottom: 5,
                    right: 10,
                    fontSize: 15,
                  }}
                >
                  Rs. {data.product.price * data.quantity}
                </Text>
              </View>
            </View>
          );
        })}

        <View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginHorizontal: 20,
              marginVertical: 5,
            }}
          >
            <Text style={{ color: Color.DarkGrey }}>Delivery charges</Text>
            <Text style={{ color: Color.DarkGrey }}>0</Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginHorizontal: 20,
              marginVertical: 5,
            }}
          >
            <Text style={{ color: Color.DarkGrey }}>Total amount</Text>
            <Text style={{ color: Color.DarkGrey }}>
              Rs. {cartState.totalAmount}
            </Text>
          </View>
          <View
            style={{
              backgroundColor: Color.LightGrey,
              height: 1,
              width: Dimensions.get("screen").width,
              marginVertical: 10,
              alignSelf: "center",
            }}
          />
          <View style={{ marginHorizontal: 10 }}>
            <Text
              style={{
                color: Color.DarkGrey,
                fontSize: 17,
                marginHorizontal: 10,
                marginVertical: 10,
              }}
            >
              Personal Details
            </Text>
            <InputText
              title={"Full Name"}
              onchange={setfullName}
              value={fullName}
            />
            <InputText
              title={"Phone Number"}
              onchange={setphoneNumber}
              value={phoneNumber}
            />
            <InputText
              title={"Email(optional)"}
              onchange={setemail}
              value={email}
            />
            <InputText title={"Address"} onchange={setadress} value={address} />
            <InputText title={"City"} onchange={setcity} value={city} />
          </View>
          <View
            style={{
              backgroundColor: Color.LightGrey,
              height: 1,
              width: Dimensions.get("screen").width,
              marginVertical: 10,
              alignSelf: "center",
            }}
          />
          <View style={{ paddingBottom: 10, marginHorizontal: 10 }}>
            <Text
              style={{
                color: Color.DarkGrey,
                fontSize: 17,
                marginHorizontal: 10,
                marginVertical: 10,
              }}
            >
              Payment Method
            </Text>
            <View
              style={{
                flexDirection: "row",
                display: "flex",
                justifyContent: "space-evenly",
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  display: "flex",
                  borderWidth: 1,
                  padding: 5,
                  borderRadius: 5,
                  borderColor: Color.LightGrey,
                }}
              >
                <RadioButton
                  value="first"
                  status={checked === "first" ? "checked" : "unchecked"}
                  onPress={() => setChecked("first")}
                />
                <Text
                  style={{
                    color: Color.DarkGrey,
                    fontSize: 17,
                    marginVertical: 5,
                  }}
                >
                  Cash on Delivery
                </Text>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  display: "flex",
                  borderWidth: 1,
                  padding: 5,
                  borderRadius: 5,
                  borderColor: Color.LightGrey,
                }}
              >
                <RadioButton
                  value="second"
                  status={checked === "second" ? "checked" : "unchecked"}
                  onPress={() => setChecked("second")}
                />
                <Text
                  style={{
                    color: Color.DarkGrey,
                    fontSize: 17,
                    marginVertical: 5,
                  }}
                >
                  Credit Card
                </Text>
              </View>
            </View>
            <View>
              <InputText
                title={"Delivery instruction(if any)"}
                onchange={setinstructions}
                value={instructions}
              />
            </View>
          </View>
          <Pressable onPress={createOrder}>
            <View
              style={{
                backgroundColor: Color.Blue,
                marginVertical: 10,
                width: Dimensions.get("screen").width * 0.7,
                padding: 10,
                borderRadius: 10,
                alignSelf: "center",
              }}
            >
              <Text
                style={{
                  textAlign: "center",
                  color: Color.White,
                  fontSize: 17,
                }}
              >
                Confirm Order
              </Text>
            </View>
          </Pressable>
        </View>
      </SafeAreaView>
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignSelf: "center",
    borderRadius: 10,
    elevation: 2,
    backgroundColor: Color.White,
    width: WIDTH * 0.9,
    height: HEIGHT * 0.1,
    // backgroundColor: "yellow",
  },
  image: {
    width: WIDTH * 0.2,
    height: "100%",
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
    resizeMode: "contain",
    alignItems: "center",
    // justifyContent: "space-between",
    // borderRadius: 8,
    // backgroundColor: "white",
    // elevation: 3,
  },
});
