import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Pressable,
  Dimensions,
  Alert,
} from "react-native";
import axios from "axios";
import Color from "../../../../assets/colors/Color";
import HeaderNormal from "../../../components/HeaderNormal";
import { Entypo } from "react-native-vector-icons";
import ButtonMain from "../../../components/ButtonMain";
import { useNavigation } from "@react-navigation/native";
import { BASE_URL } from "../../../../CONSTANTS";
import { useDeleteProductMutation } from "../../../slices/ProductsApi";
import { useStateContext } from "../../../contexts/ContextProvider";
import { useUserState } from "../../../slices/userSlice";
const height = Dimensions.get("screen").height;
const width = Dimensions.get("screen").width;

const ProductRow = (props) => {
  const item = props.item.item;
  const [expandedUser, setExpandedUser] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const isExpanded = expandedUser && expandedUser.id === item.id;
  const zIndex = isExpanded ? -1 : 1;
  const navigation = useNavigation();
  const userState = useUserState();

  const [deleteProduct] = useDeleteProductMutation();
  const { setLoading } = useStateContext();

  const deleteHandler = async () => {
    setModalVisible(false);
    try {
      setLoading(true);
      await deleteProduct({ token: userState.token, id: item._id });
    } catch (error) {
      console.log("error while deleting product is ", error);
      Alert.alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={[styles.userContainer, { zIndex }]}>
      <View>
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            Alert.alert("Modal has been closed.");
            setModalVisible(!modalVisible);
          }}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Pressable
                style={[styles.button, styles.buttonClose]}
                onPress={() => setModalVisible(!modalVisible)}
              >
                <Entypo
                  name="cross"
                  size={30}
                  style={{
                    color: Color.Grey,
                  }}
                />
              </Pressable>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "flex-end",
                  justifyContent: "space-around",
                  marginTop: 60,
                }}
              >
                <Text
                  style={[
                    styles.btn,
                    { color: Color.White, backgroundColor: Color.Blue },
                  ]}
                  onPress={() =>
                    navigation.navigate(
                      "AddProduct",
                      {
                        product: JSON.parse(JSON.stringify(props.item)),
                      },
                      setModalVisible(false)
                    )
                  }
                >
                  Edit
                </Text>
                <Text
                  style={[
                    styles.btn,
                    { backgroundColor: "#DEDEDE", color: Color.Grey },
                  ]}
                  onPress={deleteHandler}
                >
                  Delete
                </Text>
              </View>
            </View>
          </View>
        </Modal>
      </View>
      <TouchableOpacity
        onLongPress={() => setModalVisible(true)}
        onPress={() => setModalVisible(true)}
      >
        <View
          style={{
            flexDirection: "row",
            // paddingVertical: 12,
          }}
        >
          <Image
            source={{ uri: `${BASE_URL}${item.image}` }}
            style={styles.userImage}
          />
          <Text
            numberOfLines={2}
            ellipsizeMode="tail"
            style={styles.Productname}
          >
            {item.title}
          </Text>

          <Text style={styles.Productname}>{item.price}</Text>
          <Text style={styles.Productname}>x{item.deal_quantity}</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,

    // backgroundColor: Color.Blue,
    backgroundColor: Color.White,
  },
  listContainer: {
    width: "100%",
  },
  userContainer: {
    width: width * 0.9,
    height: height * 0.07,
    marginTop: 12,
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
    overflow: "hidden",
    alignSelf: "center",
  },
  userImage: {
    width: width * 0.13,
    height: height * 0.06,
    borderRadius: 10,
    resizeMode: "contain",
    alignSelf: "center",
    // marginTop: 3,
    margin: 5,
  },
  Productname: {
    flexWrap: "wrap",
    margin: 6,
    width: width / 3.4,
    backgroundColor: "#8329 ",
    color: Color.Grey,
    alignSelf: "center",
    fontSize: 17,
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    backgroundColor: Color.White,
    borderRadius: 20,
    // paddingHorizontal: 20,
    // paddingVertical: 10,
    // alignItems: "center",
    borderRadius: 8,
    shadowColor: Color.DarkGrey,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
    elevation: 8,
    width: width * 0.8,
    height: height * 0.13,
  },
  btnContainer: {
    marginTop: 42,
    alignItems: "center",
    width: 120,
    height: 48,
    borderRadius: 6,
    flexDirection: "row",
  },

  buttonClose: {
    position: "absolute",
    right: 5,
    top: 5,
  },
  btn: {
    // marginBottom: ,
    width: width * 0.3,
    height: height * 0.05,
    borderRadius: 8,
    textAlign: "center",
    paddingTop: 8,
    fontSize: 20,
    fontWeight: "500",
  },
});

export default ProductRow;
