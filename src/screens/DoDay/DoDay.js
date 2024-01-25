import React, { useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Alert,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useState } from "react";
import Header from "../../components/Header";
import InputText from "../../components/InputText";
import InputTextLarge from "../../components/InputTextLarge";
import ButtonLarge from "../../components/ButtonLarge";
import { useNavigation } from "@react-navigation/native";
import { useUserState, useUserStateActions } from "../../slices/userSlice";
import { usePostState } from "../../slices/postsSlice";
import { Pressable } from "react-native";
//icons
import Entypo from "react-native-vector-icons/Entypo.js";
import Color from "../../../assets/colors/Color";

//DATE TIME PICKER
import DateTimePickerModal from "react-native-modal-datetime-picker";
import KeybordWrapper from "../../components/KeyboardWrappers";
import * as Location from "expo-location";
import { useStateContext } from "../../contexts/ContextProvider";
import { scale } from "react-native-size-matters";
import { SafeAreaProvider } from "react-native-safe-area-context";
import CustomStatsBar from "../../components/CustomStatsBar";

//Responsive Width and Height
const Width = Dimensions.get("screen").width;
const Height = Dimensions.get("screen").height;

export default function DoDay() {
  const postState = usePostState();
  const navigation = useNavigation();
  const userState = useUserState();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [radius, setRadius] = useState("");
  const [endTime, setEndTime] = useState("");
  const [numberOfVolunteers, setNumberOfVolunteers] = useState("");
  const [searchCampaign, setSearchCampaign] = useState("");
  const [venue, setVenue] = useState("");
  const { showSnackbar } = useStateContext();

  const userActions = useUserStateActions();

  const [location, setLocation] = useState(null);

  //date and time  picker variables start
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [endTimerVisible, setEndTimerVisible] = useState(false);
  //current date
  let minimumDate = new Date();

  const showDatePicker = () => {
    console.log("press");
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const showEndTimer = () => {
    console.log("press");
    setEndTimerVisible(true);
  };

  const hideEndTimer = () => {
    setEndTimerVisible(false);
  };

  const handleConfirm = (date) => {
    setDate(date);
    hideDatePicker();
  };

  const handleConfirmEndTime = (time) => {
    setEndTime(time);
    hideEndTimer();
  };
  //date and time  picker variables end

  const handleCreate = () => {
    if (
      name.length < 3 ||
      description.length < 3 ||
      date === "" ||
      endTime === null ||
      isNaN(radius) ||
      Number(radius) < 1
    ) {
      Alert.alert("error", "please fill out the form correctly");
      return;
    }

    if (!userState.location) {
      handleUserLocation();
      console.log("locations error ");
      return;
    }
    const doday = {
      campaignName: name,
      radius: radius,
      startTime: date,
      description: description,
      location: userState?.location,
      volunteers: [],
      volunteersRequired: numberOfVolunteers,
      searchTag: searchCampaign,

      endTime,
      venue,
    };
    console.log(doday, "doday");
    const dodayJson = JSON.stringify(doday); // Convert doday object to JSON
    console.log(dodayJson, "json");
    navigation.navigate("Invite", { dodayJson, userState });
  };

  useEffect(() => {
    if (!useState.location) {
      handleUserLocation();
    }
  }, []);

  const handleUserLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      showSnackbar("Permission to access location was denied");
      Alert.alert(
        "Permission Required",
        "To create the campaign, we need your location permission.",
        [
          {
            text: "OK",
            onPress: getUserLocation,
          },
        ]
      );
      return;
    }

    let location = await Location.getCurrentPositionAsync({});
    setLocation(location.coords);
    userActions.setLocation(location?.coords);
  };

  const getUserLocation = () => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        showSnackbar("Permission to access location was denied");

        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location.coords);
      userActions.setLocation(location?.coords);
    })();
  };

  return (
    <SafeAreaProvider style={styles.container}>
      <CustomStatsBar backgroundColor={Color.White} />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : ""}
        style={{ flex: 1 }}
      >
        <View style={{ flex: 1 }}>
          <Header
            title={"Create Do-Day"}
            icon={
              <TouchableOpacity
                onPress={() => {
                  navigation.goBack();
                }}
              >
                <Entypo name="cross" color={"#707070"} size={30} />
              </TouchableOpacity>
            }
          />

          <Text style={styles.noteText}>
            <Text style={styles.important}>Important! </Text> Fill out the Form
            carefully. The data will be shown upon your radius selection.{" "}
          </Text>
          <View style={styles.formContainer}>
            <InputText
              title={"Campaign Name"}
              onchange={setName}
              value={name}
            />
            <InputTextLarge
              title={"Description"}
              onchange={setDescription}
              value={description}
            />
            <Pressable onPress={showDatePicker}>
              <InputText
                title={"Start Date"}
                onchange={setDate}
                value={date.toLocaleString()}
                edit={false}
              />
            </Pressable>

            <Pressable onPress={showEndTimer}>
              <InputText
                title={"End Date"}
                onchange={setEndTime}
                value={endTime.toLocaleString()}
                edit={false}
              />
            </Pressable>

            <InputText
              title={"Radius in "}
              value={radius}
              onchange={setRadius}
              keyboardType="number-pad"
            />
            <InputText
              title={"Campaign Venue Name"}
              value={venue}
              onchange={setVenue}
            />
            <Pressable>
              <InputText
                title={"No of Volunteers Required"}
                onchange={setNumberOfVolunteers}
                value={numberOfVolunteers}
                keyboardType="number-pad"
              />
            </Pressable>
            <Pressable>
              <InputText
                title={"#Search Campaign"}
                onchange={setSearchCampaign}
                value={searchCampaign}
              />
            </Pressable>

            <TouchableOpacity
              style={styles.buttonContainer}
              onPress={handleCreate}
            >
              <Text style={styles.buttonTitle}>Create & Find Volunteer</Text>
            </TouchableOpacity>

            {/* <ButtonLarge title={"Create & Find Volunteer"} click={handleCreate} /> */}
          </View>

          {/* {CAPMAIGN START DATE AND TIME} */}
          <DateTimePickerModal
            isVisible={isDatePickerVisible}
            mode="datetime"
            onConfirm={handleConfirm}
            onCancel={hideDatePicker}
            minimumDate={minimumDate}
          />

          {/* // CAMPAIGN END TIMER  */}
          <DateTimePickerModal
            isVisible={endTimerVisible}
            mode="datetime"
            onConfirm={handleConfirmEndTime}
            onCancel={hideEndTimer}
            minimumDate={minimumDate}
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  formContainer: {
    // flex: 1,
    paddingHorizontal: Width * 0.045,
    backgroundColor: Color.White,
    width: "100%",
    height: "100%",
  },
  description: {
    padding: 15,
    borderRadius: 8,
    height: 94,
    fontSize: 14,
    fontFamily: "Roboto",
  },
  noteText: {
    fontFamily: "Roboto_400Regular",
    fontSize: 14,
    color: Color.Grey,
    backgroundColor: Color.LightBlue,
    paddingHorizontal: Width * 0.045,
    paddingVertical: Height * 0.005,
    // backgroundColor: "red",
  },
  important: {
    fontFamily: "Roboto_600SemiBold",
    fontSize: 14,
    color: Color.Grey,
  },
  timeEnd: {
    backgroundColor: Color.Black,
    paddingVertical: 12,
    borderRadius: 8,
    shadowColor: Color.Grey,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.27,
    shadowRadius: 2.65,
    elevation: 3,
    width: "47%",
    paddingLeft: 10,
  },
  modalHeader: {
    backgroundColor: Color.Red, // Change to your desired header color
  },
  // Style for the selected date icon
  dateIcon: {
    // Change the color property to your desired icon color
    color: Color.Red,
  },
  buttonContainer: {
    backgroundColor: Color.Blue,
    alignSelf: "center",
    marginVertical: scale(14),
    paddingVertical: scale(10),
    alignItems: "center",
    borderRadius: scale(10),
    paddingHorizontal: scale(20),
  },
  buttonTitle: {
    fontFamily: "Roboto_500Medium",
    color: Color.White,
    fontSize: scale(16),
  },
});
