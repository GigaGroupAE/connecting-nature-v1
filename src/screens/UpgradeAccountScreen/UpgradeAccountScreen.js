import React, { useState } from "react";
import {
  Alert,
  Dimensions,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from "react-native";

//state import
import { useUserState } from "../../slices/userSlice";

//network imports

import { useNavigation } from "@react-navigation/native";
import Color from "../../../assets/colors/Color";
import ButtonMain from "../../components/ButtonMain";
import SelectList from "react-native-dropdown-select-list";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import KeybordWrapper from "../../components/KeyboardWrappers";
import { useAddRequestMutation } from "../../slices/AccoutUpgradeApi";
import { useStateContext } from "../../contexts/ContextProvider";
import InputTextLink from "./InputTextLink";

const height = Dimensions.get("screen").height;
const width = Dimensions.get("screen").width;

const UpgradeAccountScreen = () => {
  const navigation = useNavigation();
  const userState = useUserState();
  const { setLoading, showSnackbar } = useStateContext();

  const [facebookProfile, setFacebookProfile] = useState("");
  const [instagramProfile, setInstaProfile] = useState("");
  const [twitterProfile, setTwitterProfile] = useState("");

  const [selected, setSelected] = useState(null);

  const [addRequest] = useAddRequestMutation();

  const groupType = [
    { key: "1", value: "celebrity" },
    { key: "2", value: "volunteer" },
  ];

  const submitRequest = async () => {
    let requestedRole = selected === "1" ? "celebrity" : "volunteer";
    let body = {
      facebookProfile,
      instagramProfile,
      twitterProfile,
      requestedRole,
    };

    if (
      requestedRole === "celebrity" &&
      (instagramProfile.length <= 0 ||
        facebookProfile.length <= 0 ||
        twitterProfile.length <= 0)
    ) {
      Alert.alert("All social links are required");
      return;
    }

    try {
      setLoading(true);
      const { data } = await addRequest({
        token: userState.token,
        body,
      });
      if (data.success) {
        showSnackbar("Request submitted successfully");
        navigation.goBack();
      }
    } catch (error) {
      console.log("error is ", error);
      Alert.alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeybordWrapper>
        <View
          style={{
            height: height * 0.9,
            backgroundColor: Color.White,
            flex: 1,
          }}
        >
          <View
            style={{
              height: height * 0.27,
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: Color.Blue,
            }}
          >
            <Text
              style={{
                fontSize: 25,
                color: Color.White,
                fontWeight: "500",
              }}
            >
              Account Upgradation
            </Text>
          </View>
          <View
            style={{
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
              marginTop: -20,
              backgroundColor: Color.White,
              height: height * 0.6,
            }}
          >
            <View
              style={{
                marginLeft: 40,
                width: width * 0.6,
              }}
            >
              <SelectList
                onSelect={() => selected}
                placeholder={"Account preference"}
                setSelected={(val) => {
                  setSelected(val);
                }}
                save="value"
                data={groupType}
                arrowicon={
                  <FontAwesome
                    name="chevron-down"
                    size={14}
                    color={"#707070"}
                  />
                }
                searchicon={
                  <FontAwesome name="search" size={14} color={"#707070"} />
                }
                search={false}
                boxStyles={{
                  marginTop: 15,
                  borderRadius: 8,
                  backgroundColor: "white",
                  borderWidth: 0,
                  elevation: 8,
                  shadowColor: "#707070",
                  paddingVertical: 15,
                  color: "#707070",
                  width: width * 0.8,
                }} //override default styles
                inputStyles={{
                  fontSize: 16,
                  fontFamily: "Roboto_500Medium",
                  color: Color.LightGrey,
                }}
                dropdownStyles={{
                  borderWidth: 0,
                  backgroundColor: Color.White,
                  width: width * 0.8,
                  shadowColor: "#433",
                  elevation: 8,
                  fontSize: 16,
                  fontFamily: "Roboto_500Medium",
                  color: Color.LightGrey,
                  // flex: 1,
                  // height: 100,
                }}
                defaultOption={
                  {
                    // key: "1",
                    // value: "Group Type",
                  }
                } //default selected option
              />
            </View>
            {selected === "1" ? (
              <View style={{ alignItems: "center" }}>
                <View style={{ width: width * 0.8 }}>
                  <InputTextLink
                    title="Paste your facebook link"
                    onchange={setFacebookProfile}
                    value={facebookProfile}
                  />
                </View>
                <View style={{ width: width * 0.8 }}>
                  <InputTextLink
                    title="Paste your Instagram link"
                    onchange={setInstaProfile}
                    value={instagramProfile}
                  />
                </View>
                <View style={{ width: width * 0.8 }}>
                  <InputTextLink
                    title="Paste your Twitter link"
                    onchange={setTwitterProfile}
                    value={twitterProfile}
                  />
                </View>
              </View>
            ) : (
              ""
            )}

            <View style={{ alignItems: "center" }}>
              <ButtonMain title="Submit Request" callback={submitRequest} />
            </View>
          </View>
        </View>
      </KeybordWrapper>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  InputContainer: {},
});

export default UpgradeAccountScreen;
