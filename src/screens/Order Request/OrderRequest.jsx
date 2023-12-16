import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import axios from "axios";
import HeaderNormal from "../../components/HeaderNormal";
import Color from "../../../assets/colors/Color";
import { SimpleLineIcons } from "react-native-vector-icons";
import { BASE_URL } from "../../../CONSTANTS";
import { useUserState } from "../../slices/userSlice";
import { useStateContext } from "../../contexts/ContextProvider";
import OrderItem from "./OrderItem";

const height = Dimensions.get("screen").height;
const width = Dimensions.get("screen").width;

const UserList = () => {
  const [data, setData] = useState([]);
  const { setLoading } = useStateContext();
  const userState = useUserState();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);

        const tempResponse = await axios.get(`${BASE_URL}/order/get`, {
          headers: {
            "auth-token": userState.token,
          },
        });

        setData(tempResponse.data.orders);
      } catch (error) {
        console.log("error in orderrequest", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);
  const [expandedUser, setExpandedUser] = useState(null);

  const toggleExpand = (userId) => {
    setExpandedUser((prevState) => (prevState === userId ? null : userId));
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case "processing":
        return styles.processing;
      case "shipped":
        return styles.shipped;
      case "delivered":
        return styles.delivered;
      default:
        return {};
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.userContainer}>
      <View style={styles.MainContainer}>
        <View style={styles.OrderContainer}>
          <View style={styles.User}>
            <TouchableOpacity style={styles.user}>
              <Image
                source={{ uri: `${BASE_URL}/images/${item.user.profile}` }}
                style={styles.userImage}
              />
              <Text style={styles.userName}>
                {item.shippingAddress.fullName}
              </Text>
              {/* <Text style={styles.userRole}>Giga Management</Text> */}

              <Text style={getStatusStyle(item.status)}>{item.status}</Text>
              <SimpleLineIcons
                name="notebook"
                size={22}
                color={Color.Grey}
                style={{ position: "absolute", right: 100, bottom: -20 }}
              />
              <SimpleLineIcons
                name="share"
                size={22}
                color={Color.Grey}
                style={{ position: "absolute", right: 25, bottom: -20 }}
              />
            </TouchableOpacity>
          </View>
          <View>
            <TouchableOpacity
              style={styles.item}
              onPress={() => toggleExpand(item._id)}
            >
              <View>
                <OrderItem items={item} />
              </View>
            </TouchableOpacity>
          </View>
          {expandedUser === item._id && (
            <View style={styles.expandedUserInfo}>
              <View style={{ paddingVertical: 10 }}>
                <Text
                  style={{
                    fontSize: 18,
                    marginBottom: 14,
                    fontWeight: "800",
                    color: Color.Grey,
                  }}
                >
                  Order Detail
                </Text>
                {[
                  { title: "Total Charges:", value: item.totalPrice },
                  { title: "Username:", value: item.shippingAddress.fullName },
                  { title: "Email:", value: item.shippingAddress.email },
                  {
                    title: "Phone No:",
                    value: item.shippingAddress.phoneNumber,
                  },
                  { title: "Address:", value: item.shippingAddress.address },
                  { title: "City:", value: item.shippingAddress.city },
                  { title: "Payment Methods:", value: item.paymentMode },
                  {
                    title: "Delivery Instructions:",
                    value: item.deliveryInstructions,
                  },
                ].map((data, idx) => (
                  <View style={styles.ItemContainer} key={idx}>
                    <Text style={styles.ItemName}>{data.title}</Text>
                    <Text style={styles.ItemDetails}>{data.value}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <HeaderNormal title="Orders" />

      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={(item) => item._id}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 10,
    backgroundColor: Color.White,
  },
  OrderContainer: {
    width: width * 1,
  },
  MainContainer: {
    marginTop: 16,
    backgroundColor: Color.White,
    borderRadius: 8,
    shadowColor: Color.DarkGrey,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
    elevation: 8,
  },
  User: {
    height: height * 0.085,
    borderColor: Color.BoderColor,
    borderBottomWidth: 1,
  },
  userContainer: {
    paddingVertical: 10,
  },
  user: {
    flexDirection: "row",
    height: height * 0.05,
  },
  userImage: {
    width: width * 0.13,
    height: height * 0.06,
    borderRadius: 36,
    resizeMode: "contain",
    position: "absolute",
    left: 15,
    top: 7,
  },
  userName: {
    fontWeight: "bold",
    fontSize: 16,
    color: Color.Grey,
    position: "absolute",
    left: 75,
    top: 18,
    // alignSelf: "center",
  },
  userRole: {
    fontWeight: "bold",
    fontSize: 16,
    color: Color.Blue,
    position: "absolute",
    left: 75,
    top: 28,
  },
  processing: {
    backgroundColor: Color.Blue,
    top: 0,
    position: "absolute",
    right: 20,
    paddingHorizontal: 20,
    paddingVertical: 5,
    color: Color.White,
    borderBottomLeftRadius: 8,
    borderTopRightRadius: 8,
    fontSize: 15,
  },
  shipped: {
    backgroundColor: "#333",
    top: 0,
    position: "absolute",
    right: 20,
    paddingHorizontal: 20,
    paddingVertical: 5,
    color: Color.White,
    borderBottomLeftRadius: 8,
    borderTopRightRadius: 8,
    fontSize: 16,
  },
  delivered: {
    backgroundColor: "#2A8841",
    top: 0,
    position: "absolute",
    right: 20,
    paddingHorizontal: 20,
    paddingVertical: 5,
    color: Color.White,
    borderBottomLeftRadius: 8,
    borderTopRightRadius: 8,
    fontSize: 16,
  },
  item: {
    // height: height * 0.09,
    borderColor: Color.BoderColor,
  },
  ItemImage: {
    width: width * 0.13,
    height: height * 0.07,
    borderRadius: 10,
    resizeMode: "cover",
    position: "absolute",
    left: 15,
    top: 7,
  },
  ItemName: {
    position: "absolute",
    left: "36.87%",
    top: "15.87%",
    fontSize: 16,
    fontWeight: "600",
    color: Color.Grey,
  },
  ItemQuantity: {
    position: "absolute",
    left: "36.13%",
    top: "42.4%",
    color: Color.Grey,
    fontSize: 14,
  },
  expandedUserInfo: {
    paddingHorizontal: 12,
    paddingVertical: 12,
    // height: height * 0.4,
    flex: 1,
  },
  ItemDetails: {
    fontSize: 14,
    marginBottom: 10,
    color: Color.Grey,
    fontWeight: "500",
  },
  ItemName: {
    fontSize: 17,
    color: Color.Grey,
    paddingRight: 10,
    fontWeight: "700",
    lineHeight: 21,
  },
  ItemContainer: {
    flexDirection: "row",
  },
  DeliveryInfo: {
    fontSize: 16,
    color: Color.Grey,
    marginTop: 5,
    lineHeight: 22,
    flexWrap: "wrap",
  },
});

export default UserList;
