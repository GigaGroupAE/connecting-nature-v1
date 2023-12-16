import React from "react";
import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { FlatList } from "react-native";
import { MaterialCommunityIcons } from "react-native-vector-icons";
import Color from "../../../assets/colors/Color";
import HeaderNormal from "../../components/HeaderNormal";
import { BASE_URL } from "../../../CONSTANTS";

const Height = Dimensions.get("screen").height;
const Width = Dimensions.get("screen").width;

const renderItem = ({ item, navigation }) => {
  const handleNavigation = (number) => {
    navigation.navigate("UserProfile", {
      userPhoneNumber: number,
    });
  };
  return (
    <View style={styles.followerCard}>
      <View style={styles.imageContainer}>
        <Image
          source={{
            uri: `${BASE_URL}/images/${item.profile}`,
          }}
          style={styles.userImage}
        />
      </View>

      <View style={styles.nameContainer}>
        <TouchableOpacity
          onPress={() => {
            handleNavigation(item.phoneNumber);
          }}
        >
          <View style={{ flexDirection: "row" }}>
            <Text style={styles.userName}>{item.fullName}</Text>
            {(item.type === "Operations" ||
              item.type === "Admin" ||
              item.type === "Manager" ||
              item.type === "Assistant Manager" ||
              item.type === "Super Admin" ||
              item.type === "celebrity") && (
              <MaterialCommunityIcons
                name="check-decagram"
                style={styles.adminIcon}
              />
            )}
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const PostsLikes = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const likes = route.params.item;
  return (
    <View style={styles.container}>
      <HeaderNormal title="Likes" />
      <View>
        <FlatList
          data={likes}
          renderItem={({ item }) => renderItem({ item, navigation })}
          keyExtractor={(item) => item.phoneNumber}
        />
      </View>
    </View>
  );
};

export default PostsLikes;

const styles = StyleSheet.create({
  container: {
    backgroundColor: Color.White,
    flex: 1,
  },
  followerCard: {
    flexDirection: "row",
    backgroundColor: Color.White,
    borderRadius: 8,
    width: "100%",
    alignSelf: "center",
    paddingVertical: Height * 0.01,
    paddingHorizontal: Width * 0.04,
    borderBottomWidth: 0.7,
    borderBottomColor: Color.LightGrey,
  },
  userImage: {
    borderRadius: 23,
    width: 45,
    height: 45,
    resizeMode: "center",
  },
  imageContainer: {
    width: 45,
    height: 45,
    borderRadius: 23,
    overflow: "hidden",
    alignItems: "center",
  },
  nameContainer: {
    flexDirection: "row",
    width: "85%",
    marginLeft: Width * 0.02,
    marginTop: Height * 0.01,
    justifyContent: "space-between",
  },
  userName: {
    fontFamily: "Roboto_500Medium",
    fontSize: Height * 0.0177,
  },
  userRole: {
    fontFamily: "Roboto_400Regular",
    color: Color.Blue,
    marginTop: "-1.5%",
    fontSize: Height * 0.016,
  },
  button: {
    alignSelf: "center",
    backgroundColor: Color.Blue,
    marginVertical: "auto",
    paddingVertical: Height * 0.01,
    paddingHorizontal: Width * 0.05,
    borderRadius: Height * 0.01,
  },
  buttonTitle: {
    color: Color.White,
    fontFamily: "Roboto_500Medium",
    textTransform: "capitalize",
  },
  adminIcon: {
    marginLeft: 5,
    alignSelf: "center",
    fontSize: Height * 0.018,
    color: Color.Blue,
  },
});
