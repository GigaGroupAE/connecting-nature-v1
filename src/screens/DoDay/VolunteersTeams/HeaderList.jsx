import {
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useState } from "react";
import { AntDesign, Entypo } from "react-native-vector-icons";

import { useNavigation } from "@react-navigation/native";
import { Dimensions } from "react-native";
import Color from "../../../../assets/colors/Color";
import { useStateContext } from "../../../contexts/ContextProvider";
import { axiosInstance } from "../../../../axiosInstance";
import { Portal, Modal } from "react-native-paper";
import { scale } from "react-native-size-matters";

const Height = Dimensions.get("screen").height;
const Width = Dimensions.get("screen").width;
const HeaderList = (props) => {
  const navigation = useNavigation();
  const [modalVisible, setModalVisible] = useState(false);
  const [leadModal, setleadModal] = useState(false);

  const { activeCampaign, setActiveCampaign, setLoading } = useStateContext();
  const leader =
    props.currentPage === "Team B"
      ? activeCampaign?.teamB?.leader
      : activeCampaign?.teamA?.leader;
  const membersLength =
    props.currentPage === "Team B"
      ? activeCampaign?.teamB?.members?.length
      : activeCampaign?.teamA?.members?.length;

  const makeAutoLead = async () => {
    try {
      setLoading(true);
      const { data } = await axiosInstance.patch(
        `/campaigns/auto-lead/${activeCampaign?._id}`,
        {
          teamName: props.currentPage === "Team B" ? "teamB" : "teamA",
        }
      );
      setActiveCampaign(data?.campaign);
      setLoading(false);
      setleadModal(false);
    } catch (error) {
      setLoading(false);
      console.error(error.response.data);
    }
  };
  const handleDoDay = () => {
    navigation.navigate("Setting ");
    setModalVisible(false);
  };

  const hideModal = () => {
    setleadModal(false);
  };

  const handlemodalVisible = () => {
    setModalVisible(false);
  };

  return (
    <View>
      <View style={styles.container}>
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            flex: 2,
            alignItems: "center",
          }}
        >
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <AntDesign
              name="arrowleft"
              size={28}
              color={Color.Black}
              style={{ alignSelf: "center", alignItems: "center" }}
            />
          </TouchableOpacity>

          <Text style={styles.title}>{props.title}</Text>
        </View>
        <View>
          {/* <Entypo name="new-message" size={25} color={Color.Blue} /> */}
          {props.title === "Volunteers" && (
            <Pressable
              onPress={() => navigation.goBack()}
              style={{
                alignSelf: "center",
                position: "relative",
                width: Width * 0.12,
                flexDirection: "row",
                // marginRight: width * 0.0,
                width: Width * 0.2,
                justifyContent: "space-between",
              }}
            >
              <Text
                style={{
                  color: Color.Blue,
                  fontSize: 14,
                  fontWeight: "500",
                  fontFamily: "Roboto_400Regular",
                }}
              >
                Teams
              </Text>
              <Entypo name="dots-three-vertical" size={18} />
            </Pressable>
          )}
          {/* <Entypo name="new-message" size={25} color={Color.Blue} /> */}
          {props.title === "Teams" && (
            <Pressable
              onPress={() => {
                navigation.navigate("VolunteersList");
              }}
              style={{}}
            >
              <View
                style={{
                  flexDirection: "row",
                  marginRight: Width * -0.012,
                  alignItems: "center",
                }}
              >
                <Text
                  style={{
                    color: Color.Blue,
                    fontSize: 14,
                    fontWeight: "500",
                    fontFamily: "Roboto_400Regular",
                    marginRight: Width * 0.03,
                  }}
                >
                  Volunteers
                </Text>
                {
                  //show the auto lead button only if there isn't alraeady a leader
                  !leader && membersLength > 0 && (
                    <TouchableOpacity onPress={() => setleadModal(true)}>
                      <Text
                        style={{
                          backgroundColor: Color.Blue,
                          paddingHorizontal: Width * 0.028,
                          paddingVertical: Height * 0.007,
                          color: Color.White,
                          borderRadius: Height * 0.01,
                        }}
                      >
                        Auto Lead
                      </Text>
                    </TouchableOpacity>
                  )
                }
              </View>
              <Portal>
                <Modal
                  animationType="fade"
                  transparent={true}
                  visible={leadModal}
                  onRequestClose={() => {
                    setleadModal(!leadModal);
                  }}
                  onDismiss={hideModal}
                >
                  <View style={styles.cmodel}>
                    <View>
                      <View>
                        <Text
                          style={{
                            fontFamily: "Roboto_400Regular",
                            fontWeight: "400",
                            paddingHorizontal: Width * 0.03,
                            paddingHorizontal: scale(16),
                          }}
                        >
                          Do you want to make the person with the highest points
                          lead?
                        </Text>
                      </View>
                      <View style={styles.model}>
                        <TouchableOpacity onPress={makeAutoLead}>
                          <Text style={styles.btn}>Yes</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => console.log("cancel")}>
                          <Text
                            style={{
                              ...styles.btn,
                              backgroundColor: Color.White,
                              color: Color.Black,
                              borderWidth: 1,
                            }}
                          >
                            Cancel
                          </Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                </Modal>
              </Portal>
            </Pressable>
          )}
          {props.title === "Do-Day Portal" && (
            <View>
              <TouchableOpacity onPress={() => setModalVisible(true)}>
                <Entypo name="dots-three-vertical" size={18} />
              </TouchableOpacity>
              <Portal>
                <Modal
                  animationType="fade"
                  transparent={true}
                  visible={modalVisible}
                  onRequestClose={() => {
                    setModalVisible(!modalVisible);
                  }}
                  onDismiss={handlemodalVisible}
                >
                  <View
                    style={{
                      backgroundColor: Color.White,
                      width: Width * 0.55,
                      paddingVertical: Height * 0.02,
                      paddingHorizontal: Width * 0.042,
                      borderRadius: Height * 0.01,
                      position: "relative",
                      right: scale(-130),
                      top: scale(-280),
                    }}
                  >
                    <TouchableOpacity onPress={() => handleDoDay()}>
                      <Text style={styles.ModelTitile}>Settings</Text>
                    </TouchableOpacity>

                    <TouchableOpacity>
                      <Text style={styles.ModelTitile}>Share Board</Text>
                    </TouchableOpacity>
                  </View>
                </Modal>
              </Portal>
            </View>
          )}
        </View>
      </View>
    </View>
  );
};

export default HeaderList;

const styles = StyleSheet.create({
  container: {
    backgroundColor: Color.White,
    alignContent: "center",
    alignItems: "center",
    flexDirection: "row",
    paddingHorizontal: 17,
    paddingVertical: 10,
    borderBottomWidth: 2,
    borderColor: Color.VeryLightGrey,
    justifyContent: "space-between",
  },
  title: {
    color: Color.Black,
    fontSize: 20,
    fontFamily: "Roboto_600SemiBold",
    marginLeft: 10,
    marginTop: 2,
    lineHeight: 30,
    textAlignVertical: "center",
  },
  ModelTitile: {
    fontSize: Height * 0.018,
    fontFamily: "Roboto_500Medium",
    fontWeight: "500",
    marginVertical: Height * 0.009,
  },
  cmodel: {
    alignSelf: "center",
    position: "absolute",
    alignSelf: "center",

    flex: 0.3,
    justifyContent: "center",
    alignItems: "center",
    marginTop: Height * 0.4,

    backgroundColor: Color.White,
    shadowColor: Color.Grey,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
    elevation: 8,
    alignSelf: "center",
    paddingVertical: Height * 0.019,
    // marginTop: 10,
    width: "90%",
    borderRadius: 6,
  },
  model: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: Height * 0.03,
    width: Width * 0.9,
  },
  btn: {
    paddingVertical: Height * 0.01,
    backgroundColor: Color.Blue,
    color: Color.White,
    fontFamily: "Roboto_500Medium",
    fontWeight: "600",
    borderRadius: Height * 0.01,
    width: scale(90),

    textAlign: "center",
  },
});
