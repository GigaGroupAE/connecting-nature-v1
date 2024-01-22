import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Platform,
  Pressable,
} from "react-native";
import { Searchbar } from "react-native-paper";
import React, { useEffect, useState } from "react";
import BouncyCheckbox from "react-native-bouncy-checkbox";
import axios from "axios";
import { useUserState } from "./../../slices/userSlice";
import { useNavigation, useRoute } from "@react-navigation/native";
import { BASE_URL } from "../../../CONSTANTS";
import HeaderNormal from "../../components/HeaderNormal";
import Color from "../../../assets/colors/Color";
import { SafeAreaProvider } from "react-native-safe-area-context";
import CustomStatsBar from "../../components/CustomStatsBar";
BASE_URL;
export default function MultipleContactSelect(props) {
  const [users, setuser] = useState([]);
  const userState = useUserState();
  const navigation = useNavigation();
  const [checked, setchecked] = useState([]);
  const onChangeSearch = (query) => setSearchQuery(query);
  const [searchQuery, setSearchQuery] = useState("");
  const route = useRoute();

  const data = route.params?.currentMembers;
  const currentMembers = data.map((item) => item.member);

  useEffect(() => {
    axios
      .get(`${BASE_URL}/user/getusers`, {
        headers: {
          "auth-token": userState.token,
        },
      })
      .then((res) => {
        const userData = res.data;

        // Filter out the users that exist in both userData and data arrays
        const filteredUsers = userData.filter((user) => {
          // Assuming there is a unique identifier like _id for each user
          return !currentMembers.some((item) => item._id === user._id);
        });
        setuser([...filteredUsers]);
      })
      .catch((e) => console.log(e));
  }, []);
  let render = true;
  const handleOnCheck = (user, action) => {
    if (action === "unselect") {
      setchecked((prev) =>
        prev.filter((u) => u.phoneNumber !== user.phoneNumber)
      );
    } else {
      setchecked((prev) => [
        ...prev,
        {
          name: user.fullName,
          type: user.type,
          photo: user.profile,
          phoneNumber: user.phoneNumber,
          privilege: "member",
          _id: user._id,
        },
      ]);
    }
  };
  // const handleOnPress = useCallback(() => {
  //   console.log(checked, "che");
  //   props.route.params.selectedContacts(checked);
  //   navigation.goBack();
  // }, []);
  const handleOnPress = () => {
    props.route.params.selectedContacts(checked);
    navigation.goBack();
  };
  return (
    <SafeAreaProvider style={styles.container}>
      <CustomStatsBar backgroundColor={Color.White} />
      <View>
        <HeaderNormal title="Add Participants" />
        <Pressable
          style={{
            position: "absolute",
            right: 20,
            top: 15,
          }}
          onPress={handleOnPress}
        >
          <Text
            style={{
              fontFamily: "Roboto_500Medium",
              fontSize: 18,
              color: Color.Blue,
            }}
          >
            Invite
          </Text>
        </Pressable>
      </View>
      <View style={[styles.body]}>
        <ScrollView>
          <Searchbar
            placeholder="Search"
            onChangeText={onChangeSearch}
            value={searchQuery}
          />
          {searchQuery === ""
            ? render === true
              ? users.map((user, index) => {
                  return (
                    <View
                      key={"contact-" + index}
                      style={[
                        styles.row,
                        {
                          paddingHorizontal: 10,
                          backgroundColor: "white",
                          width: "93%",
                          alignSelf: "center",
                          borderRadius: 7,
                          paddingVertical: 6,
                          marginVertical: 5,
                        },
                      ]}
                    >
                      <Text
                        numberOfLines={1}
                        ellipsizeMode="tail"
                        style={{
                          fontFamily: "Roboto_500Medium",
                          color: "#606060",
                          flex: 1,
                        }}
                      >
                        {user?.phoneNumber || "No Phone Number"}
                        <Text
                          style={{
                            color: "#909090",
                            fontSize: 12,
                          }}
                        >
                          {" "}
                          {"     ~"}
                          {user.fullName}
                        </Text>
                      </Text>
                      {
                        <BouncyCheckbox
                          size={25}
                          fillColor="#4582C3"
                          onPress={(isChecked) => {
                            if (isChecked === true) {
                              handleOnCheck(user, "select");
                            } else {
                              handleOnCheck(user, "unselect");
                            }
                          }}
                          style={{
                            marginLeft: "auto",
                            borderRadius: 25,
                            backgroundColor: "white",
                            elevation: 0,
                          }}
                          contentStyle={{ paddingHorizontal: 3, height: 35 }}
                          labelStyle={{
                            color: "#4582C3",
                            fontFamily: "Roboto_600SemiBold",
                            fontSize: 12,
                          }}
                          mode="contained"
                        />
                      }
                    </View>
                  );
                })
              : null
            : users.map((user) => {
                if (user.fullName.match(searchQuery)) {
                  return null;
                }
              })}
        </ScrollView>
      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  body: {
    flex: 1,
    flexDirection: "column",
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "flex-start",
  },
  // use this attribute with View to create a new row
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  btnNormal: {
    backgroundColor: "aqua",
  },
  btnPress: {
    backgroundColor: "gray",
  },
});
