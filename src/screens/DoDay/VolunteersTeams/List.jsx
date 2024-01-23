import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  View,
  Pressable,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useState } from "react";
import User from "../../../../assets/user.jpg";
import Color from "../../../../assets/colors/Color";
import { AntDesign, Entypo } from "react-native-vector-icons";
import { fonts } from "react-native-elements/dist/config";
import { BASE_URL } from "../../../../CONSTANTS";
import { axiosInstance } from "../../../../axiosInstance";
import { useStateContext } from "../../../contexts/ContextProvider";
import { Portal, Modal } from "react-native-paper";
import { scale } from "react-native-size-matters";

const Height = Dimensions.get("screen").height;
const Width = Dimensions.get("screen").width;

const List = ({ data, CurrentPage }) => {
  const [userData, setUserData] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [visible, setVisible] = useState(false);
  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);
  useEffect(() => {
    setUserData(data);
  }, []);

  const { activeCampaign, setActiveCampaign, loading, setLoading } =
    useStateContext();
  const containerStyle = {
    backgroundColor: Color.White,

    zIndex: 2,
    position: "absolute",
    right: Width * 0.06,
    paddingHorizontal: Width * 0.05,
    paddingVertical: Height * 0.02,
    flex: 1,
  };

  const removeFromTeam = async (teamName, volunteer) => {
    try {
      setLoading(true);
      const { data } = await axiosInstance.patch(
        `/campaigns/remove-volunteer/${activeCampaign?._id}`,
        { teamName, volunteer }
      );
      setActiveCampaign(data.updatedCampaign);
      setLoading(false);
      setModalVisible(false);
    } catch (error) {
      console.log("error is ", error.response.data);
      setLoading(false);
    }
  };

  const moveToTeam = async (teamName, volunteer, presentTeam) => {
    try {
      setLoading(true);
      const { data } = await axiosInstance.patch(
        `/campaigns/add-volunteer/${activeCampaign._id}`,
        { teamName, volunteer, presentTeam }
      );
      setActiveCampaign(data?.updatedCampaign);
      setLoading(false);
      setModalVisible(false);
    } catch (error) {
      console.log("error is ", error?.response?.data?.message);
      setLoading(false);
    }
  };

  const makeLead = async (teamName, volunteer) => {
    try {
      setLoading(true);
      const { data } = await axiosInstance.patch(
        `/campaigns/make-lead/${activeCampaign._id}`,
        { teamName, volunteer }
      );
      setActiveCampaign(data?.updatedCampaign);
      setLoading(false);
      setModalVisible(false);
    } catch (error) {
      console.log("error is ", error?.response?.data?.message);
      setLoading(false);
    }
  };

  const isLeader =
    CurrentPage === "Team A"
      ? activeCampaign?.teamA?.leader?._id === data._id
      : activeCampaign?.teamB?.leader?._id === data._id;

  // if (CurrentPage === "Team A") {
  //   console.log(activeCampaign.teamA?.leader._id);
  // } else {
  //   console.log(activeCampaign.teamB?.leader._id);
  // }

  const handleHideModal = () => {
    setModalVisible(false);
  };
  return (
    <View>
      <View style={styles.container}>
        <View style={styles.contentContainer}>
          <View
            style={{
              width: Width * 0.16,
              paddingVertical: Height * 0.005,
            }}
          >
            <Image
              source={{ uri: `${BASE_URL}/images/${data.profile}` }}
              style={styles.userImg}
            />
          </View>
          <View
            style={{
              width: Width * 0.56,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <Text style={styles.userName}>{data.fullName}</Text>
              {isLeader && (
                <View>
                  <Text style={styles.userRole}> Special Volunteer</Text>
                </View>
              )}
            </View>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  width: Width * 0.2,
                  justifyContent: "space-between",
                }}
              >
                <Text style={styles.pts}>pts</Text>
                <Text style={styles.points}>{data.points || 0}</Text>
                <Text style={{ marginBottom: Height * 0.01 }}>.</Text>
              </View>
              {isLeader ? (
                <View>
                  <Text style={styles.userRole}> Leader</Text>
                </View>
              ) : (
                <Text style={styles.invitation}>Volunteer</Text>
              )}
            </View>
          </View>
          <View style={{ marginLeft: Width * 0.13 }}>
            <Pressable onPress={() => setModalVisible(!modalVisible)}>
              <Entypo name="dots-three-vertical" size={22} color={Color.Grey} />
            </Pressable>
          </View>
        </View>
      </View>

      <Portal>
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onDismiss={handleHideModal}
          onRequestClose={() => {
            setModalVisible(!modalVisible);
          }}
        >
          <View style={styles.model}>
            {isLeader ? (
              <View style={{ paddingVertical: Height * 0.01 }}>
                <TouchableOpacity
                  onPress={() =>
                    removeFromTeam(
                      CurrentPage === "Team A" ? "teamA" : "teamB",
                      data._id
                    )
                  }
                >
                  <Text style={styles.points}>Remove</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View>
                {CurrentPage === "Team A" ? (
                  <TouchableOpacity
                    onPress={() => moveToTeam("teamB", data._id, "teamA")}
                  >
                    <Text style={styles.points}>Move to Team B</Text>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    onPress={() => moveToTeam("teamA", data._id, "teamB")}
                  >
                    <Text style={styles.points}>Move to Team A</Text>
                  </TouchableOpacity>
                )}
                <TouchableOpacity
                  onPress={() =>
                    makeLead(
                      CurrentPage === "Team A" ? "teamA" : "teamB",
                      data._id
                    )
                  }
                  style={{ paddingVertical: Height * 0.016 }}
                >
                  <Text style={{ ...styles.points }}>Make Lead</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() =>
                    removeFromTeam(
                      CurrentPage === "Team A" ? "teamA" : "teamB",
                      data._id
                    )
                  }
                >
                  <Text style={styles.points}>Remove</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </Modal>
      </Portal>
    </View>
  );
};

export default List;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    marginVertical: Height * 0.009,

    backgroundColor: Color.White,
    borderRadius: 8,
    shadowColor: Color.Grey,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
    elevation: 4,
    justifyContent: "space-between",
    width: "92%",
    alignSelf: "center",
    position: "relative",
    zIndex: 0,
  },
  contentContainer: {
    flexDirection: "row",
    paddingVertical: Height * 0.007,
    alignContent: "center",
    marginLeft: Width * 0.03,
    justifyContent: "space-around",
    alignItems: "center",
  },
  userImg: {
    borderRadius: Height * 0.1,
    resizeMode: "contain",
    width: 50,
    height: 50,
  },
  userName: {
    fontFamily: "Roboto",
    fontSize: 14,
    fontWeight: "600",
  },
  userRole: {
    marginLeft: Width * 0.02,
    fontFamily: "Roboto_500Medium",
    color: Color.Blue,
    fontSize: 10,
    alignSelf: "center",
  },
  userPoints: {
    position: "absolute",
    left: Width * 0.43,
    alignSelf: "center",

    fontFamily: "Roboto",
    fontSize: 10,
  },
  pts: {
    color: Color.Black,
    fontFamily: "Roboto",
    fontWeight: "500",
  },
  points: {
    color: Color.Black,
    fontFamily: "Roboto",
    fontWeight: "900",
    fontSize: 14,
    paddingVertical: scale(2),
    paddingHorizontal: scale(10),
  },
  btnContainer: {
    alignSelf: "center",
    marginRight: Width * 0.03,
  },
  btn: {
    textAlign: "center",
    color: Color.White,
    fontFamily: "Roboto_600SemiBold",
    paddingHorizontal: Width * 0.07,
    paddingVertical: Height * 0.0055,
    backgroundColor: Color.Blue,
    borderRadius: 8,
  },
  invitation: {
    fontFamily: "Roboto",
    fontSize: 12,
    fontWeight: "500",
    marginLeft: Width * 0.02,
    color: Color.DarkGrey,
  },
  modelTitle: {
    fontSize: Height * 0.018,
    fontFamily: "Roboto_500Medium",
    color: Color.DarkGrey,
  },
  model: {
    backgroundColor: "white",
    borderRadius: Height * 0.01,
    paddingVertical: Height * 0.02,
    marginHorizontal: Width * 0.05,
    zIndex: 1,
    width: Width * 0.8,
    alignSelf: "center",

    backgroundColor: Color.White,
    borderRadius: 8,
    shadowColor: Color.Grey,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
    elevation: 2,
    justifyContent: "space-between",
    paddingHorizontal: Width * 0.02,
  },
});
