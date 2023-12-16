// import React in our code
import React, { useState } from "react";

// import all the components we are going to use
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  Button,
  TouchableOpacity,
  Dimensions,
} from "react-native";

//import basic react native components
import { BottomSheet } from "react-native-btr";

//vector icons
import { MaterialIcons } from "@expo/vector-icons";
//theme
import Color from "../../assets/colors/Color";

//Network Imports
import { BASE_URL } from "../../CONSTANTS";
import axios from "axios";

//state imports
import { useUserState } from "../slices/userSlice";
import { useBlockUserMutation } from "../slices/BlockedUsers";

/*
 TIPS : FOR STYLING THIS SHEET
 1. the variable isPoster is of Boolean type.
      -> isPoster will be true if the author of the post has opened the modal.
      -> isPoster will be false if the user is not the auther of the post.
2. by the help of the isPoster variable you can design this sheet for different users
    i.e isPoster ? (code that only the author will see ) : (code that the others user will see)
    OR
    isPoster && (code that only the author will see)
    !isPoster && (code that other users will see)
    

*/

export default function BottomSheetForPost({
  toggleBottomNavigationView,
  visible,
  isPoster,
  reload,
  postId,
  post,
}) {
  const userState = useUserState();
  const archivePost = async () => {
    const config = {
      headers: {
        "auth-token": userState.token,
      },
    };
    //do api request here
    const { data } = await axios.post(
      `${BASE_URL}/archives/addPostArchive/${postId}`,
      {},
      config
    );
    if (data.success) {
      toggleBottomNavigationView();
      reload();
    } else {
      toggleBottomNavigationView();
    }
  };

  const [blockUser] = useBlockUserMutation();

  //TODO : CONVERT THIS INTO RTK ENDPOINT
  const blockHandler = async () => {
    const response = await blockUser({
      id: post.postedby._id,
      token: userState.token,
    }).unwrap();
    if (response.success) {
      reload();
    }
    toggleBottomNavigationView();
  };

  // const config = {
  //   headers: {
  //     "auth-token": userState.token,
  //   },
  // };
  // try {
  //   //make api call here
  //   const { data } = await axios.patch(
  //     `${BASE_URL}/user/block-user/${post.postedby._id}`,
  //     {},
  //     config
  //   );
  //   if (data.success) {
  //     reload();
  //   }
  //   toggleBottomNavigationView();
  // } catch (error) {
  //   console.log("some error occured");
  // }
  return (
    <BottomSheet
      visible={visible}
      //setting the visibility state of the bottom shee
      onBackButtonPress={toggleBottomNavigationView}
      //Toggling the visibility state on the click of the back botton
      onBackdropPress={toggleBottomNavigationView}
      //Toggling the visibility state on the clicking out side of the sheet
    >
      {/*Bottom Sheet inner View*/}
      <View style={styles.bottomNavigationView}>
        <View
          style={{
            flex: 1,
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <Text style={[styles.sheetHeading]}>Post Actions</Text>
          {isPoster ? (
            <View style={styles.actions}>
              <TouchableOpacity onPress={archivePost}>
                <View style={styles.iconAndTextWrapper}>
                  <MaterialIcons name="delete" size={40} color={Color.Red} />
                  <Text>delete</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => {}}>
                <View style={styles.iconAndTextWrapper}>
                  <MaterialIcons name="archive" size={40} />
                  <Text>Other Actions</Text>
                </View>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.actions}>
              <TouchableOpacity onPress={blockHandler}>
                <View style={styles.iconAndTextWrapper}>
                  <MaterialIcons name="block" size={40} color={Color.Red} />
                  <Text>Block User</Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => {}}>
                <View style={styles.iconAndTextWrapper}>
                  <MaterialIcons name="block" size={40} color={Color.Blue} />
                  <Text style={{}}>Other Actions</Text>
                </View>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  bottomNavigationView: {
    backgroundColor: "#fff",
    width: "100%",
    height: Dimensions.get("screen").height * 0.3,
    //justifyContent: "center",
    //alignItems: "center",
  },
  sheetHeading: {
    textAlign: "center",
    fontFamily: "Roboto_500Medium",
    padding: 20,
    fontSize: 20,
    color: Color.Blue,
  },
  actions: {
    flex: 1, //this means take all remaining space
    flexDirection: "row",
    justifyContent: "space-around",
  },
  iconAndTextWrapper: {
    alignItems: "center",
  },
});
