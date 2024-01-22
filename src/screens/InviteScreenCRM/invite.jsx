import React, { useState, useEffect } from "react";
import { Appbar, Searchbar } from "react-native-paper";

import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Platform,
  FlatList,
  TouchableOpacity,
  TextInput,
  Dimensions,
} from "react-native";

import { useNavigation } from "@react-navigation/native";
import { useContactState } from "./../../slices/contactslice";
import Color from "../../../assets/colors/Color";
import Contact from "./contact";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { Entypo } from "react-native-vector-icons";
import HeaderNormal from "../../components/HeaderNormal";
import CustomStatsBar from "../../components/CustomStatsBar";
export default function Invite() {
  //const contactstate = useContactsState();
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState("");
  const [showInput, setShowInput] = useState(false);

  const onChangeSearch = (query) => setSearchQuery(query);
  const contactstate = useContactState();

  let postUsers = [];
  let userstoinvite = [];
  let checkedusers = [];
  const handleOnCheck = (prop) => {
    console.log(prop);
    if (prop !== null) {
      checkedusers.push(prop);
      let userdir = "user/" + prop.phoneNumber;
      postUsers.push({
        color: "#00FFFF",
        privilege: "user",
        uid: prop.phoneNumber,
        user: userdir,
      });
      userstoinvite.push({
        designation: "",
        displayName: prop.name,
        isAdmin: false,
        phoneNumber: prop.phoneNumber,
        photoURL: "",
        status: "invited",
      });
    } else {
      postUsers.pop();
      userstoinvite.pop();
    }
  };

  return (
    <SafeAreaProvider style={styles.container}>
      <CustomStatsBar backgroundColor={Color.White} />
      <HeaderNormal title="Add Participants" />

      <View style={[styles.body]}>
        {/* <Appbar.Header
          style={{
            width: "100%",
            height: 70,
            backgroundColor: "white",
            zIndex: 2,
          }}
        >
          <Appbar.BackAction
            color={"grey"}
            onPress={() => navigation.goBack()}
          />
          <Appbar.Content
            title="Add Participants"
            titleStyle={{ fontFamily: "Roboto_500Medium", fontSize: 18 }}
            color={"grey"}
            style={{
              ...Platform.select({
                ios: {
                  marginTop: 0,
                  marginLeft: -4,
                },
                android: {
                  marginTop: 4,
                  marginLeft: -4,
                },
              }),
            }}
          />
        </Appbar.Header> */}

        <ScrollView showsVerticalScrollIndicator={false}>
          <Searchbar
            placeholder="Search"
            onChangeText={onChangeSearch}
            value={searchQuery}
          />
          {searchQuery === "" ? (
            <FlatList
              data={contactstate.resolvedContacts}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => <Contact item={item} />}
            />
          ) : (
            contactstate.resolvedContacts.map((user, index) => {
              if (user.name.match(searchQuery)) {
                return <Contact item={user} />;
              } else {
                return null;
              }
            })
          )}
        </ScrollView>
      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  body: {
    //this flex : 1 was causing the invisibility of contacts
    //flex: 1,
    flexDirection: "column",
    backgroundColor: Color.White,
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
  chatSearchContainer: {
    flexDirection: "row",
    alignContent: "center",
    alignItems: "center",
    marginTop: 10,
    marginHorizontal: 10,
  },
  searchContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 4,
    marginLeft: 10,
    borderRadius: Dimensions.get("screen").height * 0.1,
    backgroundColor: "#F1F1F1",
  },
  textBox: {
    fontSize: 14,
    marginTop: 3,
    fontFamily: "Roboto_400Regular",
    width: "82%",
  },
});
