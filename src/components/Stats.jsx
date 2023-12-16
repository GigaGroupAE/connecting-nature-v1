import React from "react";
import { Text, View, Pressable, StyleSheet } from "react-native";

//theme
import Color from "../../assets/colors/Color";

import { Entypo } from "@expo/vector-icons";
import axios from "axios";
import { BASE_URL } from "../../CONSTANTS";
import { useUserState } from "../slices/userSlice";
import { useNavigation } from "@react-navigation/native";

import { useStateContext } from "../contexts/ContextProvider.js";

const Stats = ({ data, volunteers, campaignId }) => {
  const userState = useUserState();
  const navigate = useNavigation();
  const { loading, setLoading, showSnackbar } = useStateContext();

  const inviteAllVolunteers = async () => {
    setLoading(true);
    const headers = {
      headers: { "auth-token": userState.token },
    };
    volunteers.forEach((element) => {
      console.log("for each of invitesms----", element);
      // comment this code on 10-27-23 due to sms api restriction will be uncomment when clear
      // if (element.status === "invite") {
      //   axios
      //     .post(
      //       `${BASE_URL}/sms/inviteSMS`,
      //       {
      //         phoneNumber: element.number,
      //         message: `You have been invited to an event happening near you!!!`,
      //       },
      //       headers
      //     )
      //     .then((res) => {
      //       console.log("response is ", res.data);
      //     })
      //     .catch((e) => {
      //       console.log(e);
      //     });
      // }
    });
    // making data for notifications like this [{user,body,data}]
    let filterData = volunteers.filter((v) => v.status === "invite");
    let notifications = filterData.map((f) => {
      return {
        user: f.number,
        body: {
          title: "you've been invited to a campaign!",
        },
        data: {
          title: "campaign-invite",
          content: campaignId,
        },
      };
    });

    let { data } = await axios.post(
      `${BASE_URL}/notify/addMultipleNotifications`,
      { notifications },
      headers
    );
    if (data.success) {
      console.log("data is ", data.newNotifications);
    }
    // now i have to update the status to sent
    // TRANSFORMING DATA INTO HOW BACKEND WANTS IT.
    let usersToUpdate = filterData.map((data) => data.number);

    const { data: updateVolunteersResponse } = await axios.put(
      `${BASE_URL}/today/update-multiple-volunteers/${campaignId}`,
      usersToUpdate,
      headers
    );
    if (updateVolunteersResponse.success) {
      console.log(updateVolunteersResponse.updatedVolunteers);
    }
    setLoading(false);
    showSnackbar("Volunteers have been invited!");
    navigate.reset({
      index: 0,
      routes: [{ name: "Home" }],
    });
  };
  return (
    <View style={{ margin: "4%" }}>
      {/* <Pressable
        style={({ pressed }) =>
          pressed ? [styles.inviteAllBtn, styles.pressed] : styles.inviteAllBtn
        }
        disabled={loading}
        onPress={inviteAllVolunteers}
      >
        <Text
          style={{
            textAlign: "center",
            color: "white",
            paddingVertical: 10,
          }}
        >
          Invite all Volunteers
        </Text>
      </Pressable> */}

      {data.map((data, idx) => {
        return (
          <View style={styles.statsRow} key={idx}>
            <Text style={styles.statsTitle}>
              {data.title}
              {"  "}
              <Entypo name="info-with-circle" color={Color.Blue} />
            </Text>
            <Text style={styles.statsCount}>{data.count}</Text>
          </View>
        );
      })}
    </View>
  );
};

export default Stats;

const styles = StyleSheet.create({
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 4,
  },
  statsTitle: {
    fontFamily: "Roboto_400Regular",
    color: "#707070",
  },
  statsCount: {
    fontFamily: "Roboto_600SemiBold",
    color: "#707070",
  },
  inviteAllBtn: {
    marginBottom: 10,
    backgroundColor: Color.Blue,
    borderRadius: 8,
  },
  pressed: {
    opacity: 0.75,
  },
});
