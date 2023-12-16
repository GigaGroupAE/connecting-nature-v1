import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  StyleSheet,
  View,
  FlatList,
  Image,
  Text,
  Dimensions,
  TouchableOpacity,
  Alert
} from "react-native";
import Color from "../../../assets/colors/Color";
import { MaterialIcons } from "react-native-vector-icons";
import HeaderNormal from "../../components/HeaderNormal";
import axios from "axios";
import { BASE_URL } from "../../../CONSTANTS";
import { useUserState } from "../../slices/userSlice";
import { useCartStateActions } from "../../slices/cartSlice";
import ShopItem from "../../components/ShopItem";
import { useGetProductsQuery } from "../../slices/ProductsApi";

const App = () => {

  const userState = useUserState()
  const CartActions = useCartStateActions()
  const [products, setProducts] = useState(null)
  // useEffect(() => {
  //   const getData = async () => {
  //     const { data } = await axios.get(`${BASE_URL}/product/get`, {
  //       headers: {
  //         "auth-token": userState.token
  //       }
  //     })
  //     setProducts(data.products)
  //   }
  //   getData()
  // }, [])

  const { data, isLoading, error, isFetching } = useGetProductsQuery(userState.token)

  if (isLoading)
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Loading....</Text>
      </View>
    );

  if (error) {
    console.log("error is ", error);
    Alert.alert("error", error.data);

    return;
  }



  return (
    <SafeAreaView style={styles.container}>
      <HeaderNormal title="ShowCase" />
      <FlatList
        data={data.products}
        renderItem={({ item }) => (
          <ShopItem item={item} />
          // <View
          //   style={{
          //     flex: 1,
          //     backgroundColor: Color.White,
          //     flexDirection: "column",
          //     margin: 1,
          //     elevation: 2,
          //     borderBottomLeftRadius: 20,
          //     borderBottomRightRadius: 20,
          //     paddingBottom: 10,
          //     marginVertical: 10,
          //     marginHorizontal: 10,
          //   }}
          // >
          //   <Image style={styles.imageThumbnail} source={{ uri: `${BASE_URL}${item.image}` }} />
          //   <Text style={styles.Title}>{item.title}</Text>
          //   <View
          //     style={{
          //       flexDirection: "row",
          //       justifyContent: "space-evenly",
          //       paddingVertical: 5,
          //     }}
          //   >
          //     <Text style={{ color: Color.Blue }}>Rs. {item.price}</Text>
          //     <Text style={{ color: Color.LightGrey }}>{item.deal_quantity} plants</Text>
          //   </View>
          //   <View
          //     style={{
          //       flexDirection: "row",
          //       justifyContent: "space-evenly",
          //       paddingVertical: 5,
          //       borderRadius: 25,
          //       backgroundColor: Color.LightBlue,
          //       marginHorizontal: 8,
          //     }}
          //   >
          //     <MaterialIcons name="add" size={20} color={Color.Blue} onPress={()=>{console.log("added")}}/>
          //     <Text style={{ color: Color.LightGrey, fontSize: 20 }}>1</Text>
          //     <MaterialIcons name="remove" size={20} color={Color.Blue} />
          //   </View>
          //   <View
          //     style={{
          //       backgroundColor: Color.Blue,
          //       bottom: 0,
          //       marginTop: 10,
          //       paddingVertical: 10,
          //       alignItems: "flex-end",
          //       justifyContent: "flex-end",
          //       borderRadius: 25,
          //     }}
          //   >
          //     <TouchableOpacity style={{ color: Color.White, alignSelf: "center" }} onPress={() => CartActions.addItem({ item })}>
          //       <Text style={{ color: Color.White }}>
          //         Add to Cart
          //       </Text>
          //     </TouchableOpacity>
          //   </View>
          // </View>
        )}
        numColumns={2}
        keyExtractor={(item, index) => index}
      />
    </SafeAreaView>
  );
};
export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "white",
  },
  imageThumbnail: {
    justifyContent: "center",
    alignItems: "center",
    height: 100,
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
  },
  Title: {
    alignSelf: "center",
    color: Color.LightGrey,
  },
});
