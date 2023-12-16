import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import React, { useState } from "react";
import BouncyCheckbox from "react-native-bouncy-checkbox";
import { Modal, Portal, Menu, Button } from "react-native-paper";
import axios from "axios";
import ButtonLarge from "../../components/ButtonLarge";
import { BASE_URL } from "../../../CONSTANTS";
import { useUserState } from "./../../slices/userSlice";
import InputText from "../../components/InputText";
import Color from "../../../assets/colors/Color";
export default function Contact(props) {
  const item = props.item;
  let height = Dimensions.get("screen").height;
  let width = Dimensions.get("screen").width;
  const [visible, setVisible] = useState(false);
  const [menuvisible, setmenuVisible] = useState(true);
  const [userName, setuserName] = useState("");
  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);
  const userState = useUserState();
  const [desingation, setdesignation] = useState("Select Designation");
  const containerStyle = {
    backgroundColor: "white",
    padding: 20,
    height: height * 0.5,
  };
  const handleOnCreate = () => {
    const formData = new FormData();

    //place profile pic her
    formData.append("fullName", userName);
    formData.append("phoneNumber", item.phoneNumber);
    formData.append("type", desingation);

    axios
      .post(`${BASE_URL}/user/register`, formData, {
        headers: {
          "auth-token": userState.token,
          "Content-Type": "multipart/form-data",
          Accept: "application/json",
        },
      })
      .then((res) => {
        console.log(res.data);
        hideModal();
        alert("User has been Invited");

        // comment this code on 10-27-23 due to Sms api restriction will remove when clear
        // const sms = {
        //   phoneNumber: item.phoneNumber,
        //   message: `You have been invited to join connecting nature with the designation of ${desingation}`,
        // };
        // axios
        //   .post(`${BASE_URL}/sms/inviteSMS`, sms, {
        //     headers: {
        //       "auth-token": userState.token,
        //     },
        //   })
        //   .then((res) => {
        //     console.log(res.data);
        //   })
        //   .catch((err) => console.log(err));
      })
      .catch((err) => console.log(err));
  };
  return (
    <View>
      <TouchableOpacity onPress={showModal}>
        <View
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
              // fontFamily: "Poppins_500Medium",
              color: Color.Black,
              flex: 1,
            }}
          >
            {item.phoneNumber !== "" ? item.phoneNumber : "No Phone Number"}
            <Text
              style={{
                color: Color.Black,
                fontSize: 12,
              }}
            >
              {"   ~ "}
              {item.name}
            </Text>
          </Text>
          {
            <BouncyCheckbox
              disabled={true}
              size={25}
              fillColor="#4582C3"
              style={{
                marginLeft: "auto",
                borderRadius: 25,
                backgroundColor: "white",
                elevation: 0,
              }}
              contentStyle={{ paddingHorizontal: 3, height: 35 }}
              labelStyle={{
                color: "#4582C3",
                //  fontFamily: "Poppins_600SemiBold",
                fontSize: 12,
              }}
              mode="contained"
            />
          }
        </View>
      </TouchableOpacity>
      <Portal
        style={{
          height: height * 0.6,
        }}
      >
        <Modal
          visible={visible}
          onDismiss={hideModal}
          contentContainerStyle={containerStyle}
        >
          <View>
            <Text
              style={{
                color: "#4582C3",
                fontFamily: "Roboto_400Regular",
                fontSize: 16,
                letterSpacing: 0.7,
                textAlign: "center",
                paddingVertical: 8,
              }}
            >
              Please Select Designation
            </Text>
            <Menu
              visible={menuvisible}
              onDismiss={() => setmenuVisible(false)}
              anchor={
                <Button
                  labelStyle={{
                    color: "#4582C3",
                    fontFamily: "Roboto_400Regular",
                    fontSize: 16,
                    letterSpacing: 0.7,
                    textAlign: "center",
                  }}
                  contentStyle={{
                    justifyContent: "flex-start",
                    paddingTop: 4,
                  }}
                  style={{
                    backgroundColor: "white",
                    width: width * 0.87,
                    height: 50,
                    elevation: 4,
                    justifyContent: "center",
                    alignSelf: "center",
                  }}
                  uppercase={false}
                  onPress={() => setmenuVisible(true)}
                >
                  {desingation}
                </Button>
              }
              style={{
                width: "78%",
                marginLeft: "9%",
              }}
            >
              <Menu.Item
                style={{
                  maxWidth: "100%",
                }}
                onPress={() => {
                  setdesignation("Manager");
                  setmenuVisible(false);
                }}
                title="Manager"
              />
              <Menu.Item
                style={{
                  maxWidth: "100%",
                }}
                onPress={() => {
                  setdesignation("Assistant Manager");
                  setmenuVisible(false);
                }}
                title="Assistant Manager"
              />
              <Menu.Item
                style={{
                  maxWidth: "100%",
                }}
                onPress={() => {
                  setdesignation("Admin");
                  setmenuVisible(false);
                }}
                title="Admin"
              />
              <Menu.Item
                style={{
                  maxWidth: "100%",
                }}
                onPress={() => {
                  setdesignation("Super Admin");
                  setmenuVisible(false);
                }}
                title="Super Admin"
              />
              <Menu.Item
                style={{
                  maxWidth: "100%",
                }}
                onPress={() => {
                  setdesignation("Operations");
                  setmenuVisible(false);
                }}
                title="Operations"
              />
            </Menu>
          </View>
          <InputText
            title={"User Name"}
            value={userName}
            onchange={setuserName}
            maxLength={30}
          />
          <ButtonLarge title={"Invite"} click={handleOnCreate} />
        </Modal>
      </Portal>
    </View>
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
