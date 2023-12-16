import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Modal,
  Alert,
  Pressable,
  Linking,
} from "react-native";
import axios from "axios";
import Color from "../../../assets/colors/Color";
import HeaderNormal from "../../components/HeaderNormal";
import {
  AntDesign,
  Entypo,
  MaterialCommunityIcons,
} from "react-native-vector-icons";
import ButtonMain from "../../components/ButtonMain";
import DescInputText from "../../components/DescInputText";
import {
  useApproveRequestMutation,
  useDeclineRequestMutation,
  useGetRequestsQuery,
} from "../../slices/AccoutUpgradeApi";
import { useUserState } from "../../slices/userSlice";
import { BASE_URL } from "../../../CONSTANTS";
import { useStateContext } from "../../contexts/ContextProvider";
import { ActivityIndicator } from "react-native";
import verification from "../../../assets/verification.png";

const height = Dimensions.get("screen").height;
const width = Dimensions.get("screen").width;

const UserList = () => {
  const [decr, setdecr] = useState("");
  const [expandedUser, setExpandedUser] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const userState = useUserState();
  const { data, isLoading, error } = useGetRequestsQuery(userState.token);
  const [approveRequest] = useApproveRequestMutation();
  const [declineRequest] = useDeclineRequestMutation();
  const { setLoading } = useStateContext();
  const approveHandler = async (id, newUserType) => {
    try {
      setLoading(true);
      const { data: approveData } = await approveRequest({
        token: userState.token,
        id,
        body: { newUserType },
      });
    } catch (error) {
      console.log("error while approving req is ", error);
      Alert.alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  const declineHandler = async (id) => {
    try {
      setLoading(true);
      const { data: declineData } = await declineRequest({
        token: userState.token,
        id,
        body: { declinedReason: decr },
      });
    } catch (error) {
      console.log("error while declining req is ", error);
      Alert.alert(error.message);
    } finally {
      setModalVisible(false);
      setLoading(false);
    }
  };

  if (isLoading)
    return (
      <View style={{ flex: 1 }}>
        <HeaderNormal title="Verification Request" />

        <ActivityIndicator
          style={{ position: "absolute", bottom: "20%", left: "48%" }}
          size={"large"}
          color={Color.Blue}
        />
      </View>
    );

  if (error) {
    console.log("error is ", error);
    Alert.alert("error", error.data);

    return;
  }

  //toggle function for expend
  const toggleExpand = (userId) => {
    setExpandedUser((prevState) => (prevState === userId ? null : userId));
  };
  //toggle function End

  // function to check UserName length
  const MAX_USERNAME_LENGTH = 15;
  const MAX_SOCIAL_LINK_LENGTH = 35;
  const shortenUsername = (username, maxLength) => {
    if (username.length <= maxLength) {
      return username;
    } else {
      return username.substring(0, maxLength) + "...";
    }
  };
  // function to check UserName length End

  const renderItem = ({ item }) => {
    const UserName = shortenUsername(item.user.fullName, MAX_USERNAME_LENGTH);
    const facebookProfile = shortenUsername(
      item.facebookProfile,
      MAX_SOCIAL_LINK_LENGTH
    );
    const instagramProfile = shortenUsername(
      item.instagramProfile,
      MAX_SOCIAL_LINK_LENGTH
    );
    return (
      <View>
        <View style={styles.userContainer}>
          {/* Model appare if user decline request */}
          <Modal
            animationType="fade"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => {
              Alert.alert("Modal has been closed.");
              setModalVisible(!modalVisible);
            }}
          >
            <View style={styles.centeredView}>
              <View style={styles.modalView}>
                <Text
                  style={{
                    fontSize: 15,
                    fontWeight: "600",
                    color: Color.DarkGrey,
                    position: "absolute",
                    top: "5%",
                    fontFamily: "Roboto_500Medium",
                  }}
                >
                  Send Decline Reason
                </Text>
                <View style={{ marginTop: "10%" }}>
                  <DescInputText
                    textAlignVertical="top"
                    multiline
                    maxLength={200}
                    title="Type reason..."
                    value={decr}
                    editable={true}
                    onchange={(value) => setdecr(value)}
                  />
                </View>
                <View
                  style={{
                    flexDirection: "row",
                    // alignItems: "flex-end",
                    justifyContent: "space-between",
                    marginTop: "8%",
                    width: width * 0.85,
                  }}
                >
                  <TouchableOpacity
                    style={{
                      ...styles.approveBtnContainer,
                      backgroundColor: Color.Blue,
                    }}
                  >
                    <Text
                      onPress={() => {
                        declineHandler(item._id);
                      }}
                      style={{ ...styles.btn, color: Color.White }}
                    >
                      Send
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={{
                      ...styles.approveBtnContainer,
                      borderWidth: 0.3,
                      borderColor: Color.Black,
                    }}
                    onPress={() => setModalVisible(false)}
                  >
                    <Text style={styles.btn}> Cancel</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>
          <TouchableOpacity style={styles.user}>
            <Image
              source={{ uri: `${BASE_URL}/images/${item.user.profile}` }}
              style={styles.userImage}
            />
            <View
              style={{
                flexDirection: "row",
                maxWidth: "90%",
                justifyContent: "space-between",
                top: 15,
                left: 65,
                position: "absolute",
                alignItems: "center",
              }}
            >
              <Text
                style={styles.userName}
                numberOfLines={2}
                ellipsizeMode="tail"
              >
                {UserName}
              </Text>

              {(item.user.type === "Operations" ||
                item.user.type === "Admin" ||
                item.user.type === "Manager" ||
                item.user.type === "Assistant Manager" ||
                item.user.type === "Super Admin" ||
                item.user.type === "celebrity") && (
                <MaterialCommunityIcons
                  name="check-decagram"
                  style={styles.adminIcon}
                />
              )}
              {/* <Text style={styles.UserRole}> {item.user.type}</Text> */}
            </View>
            <Text style={styles.request}>
              Requestion for {item.requestedRole}
            </Text>
            <TouchableOpacity
              style={styles.expandArrow}
              onPress={() => toggleExpand(item._id)}
            >
              <AntDesign name="down" size={18} color={Color.Grey} />
            </TouchableOpacity>
          </TouchableOpacity>
        </View>
        {expandedUser === item._id && (
          <View style={styles.productsContainer}>
            <View style={styles.UserAccounts}>
              <Entypo
                name="facebook"
                size={20}
                onPress={() => {
                  Linking.openURL("https://" + item.facebookProfile);
                }}
              />
              <Text style={styles.AccountLink}>{facebookProfile}</Text>
              <Text style={styles.VisitBtn}>Visit</Text>
            </View>
            <View style={styles.UserAccounts}>
              <Entypo
                name="instagram"
                size={20}
                onPress={() => {
                  Linking.openURL("https://" + item.instagramProfile);
                }}
              />
              <Text style={styles.AccountLink}>{instagramProfile}</Text>
              <Text style={styles.VisitBtn}>Visit</Text>
            </View>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-around",
                marginTop: 10,
              }}
            >
              <TouchableOpacity
                style={{
                  ...styles.approveBtnContainer,
                  backgroundColor: Color.Blue,
                }}
                onPress={() => {
                  approveHandler(item._id, item.requestedRole);
                }}
              >
                <Text style={{ ...styles.btn, color: Color.White }}>
                  Approved
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  ...styles.approveBtnContainer,
                  borderWidth: 0.3,
                  borderColor: Color.Black,
                }}
                onPress={() => setModalVisible(true)}
              >
                <Text style={styles.btn}>Decline</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>
    );
  };

  return (
    <View style={{ flex: 1 }}>
      <HeaderNormal title="Verification Request" />
      <View style={styles.container}>
        {data?.requests?.length == 0 ? (
          <View style={styles.noRequestContainer}>
            <View style={{ alignItems: "center", marginBottom: height * 0.18 }}>
              <Image source={verification} style={styles.bellIcon} />
              <Text style={styles.heading}>
                No Verification Request Received Yet!
              </Text>
              <Text style={styles.subHeading}>
                There are no verification request received yet
              </Text>
              <Text style={styles.subHeading}>
                . Once you received the requests it will be listed{" "}
              </Text>
              <Text style={styles.subHeading}>in this section.</Text>
            </View>
          </View>
        ) : (
          <FlatList
            data={data.requests}
            renderItem={renderItem}
            keyExtractor={(item) => item._id}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 10,
    backgroundColor: Color.White,
  },
  userContainer: {
    // marginVertical: 16,
    backgroundColor: Color.White,
    borderRadius: 8,
    // shadowColor: Color.DarkGrey,
    // shadowOffset: {
    //   width: 0,
    //   height: 4,
    // },
    // shadowOpacity: 1,
    // shadowRadius: 2.65,
    // elevation: 2,
    height: height * 0.09,
    zIndex: 100,
    // marginVertical: height * 0.005,
    marginHorizontal: width * 0.003,
    borderBottomWidth: 0.7,
    borderColor: Color.LightGrey,
    // paddingVertical: 16,
    // marginVertical: 10,
  },
  user: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    // backgroundColor: "red",
    // paddingVertical: 10,
  },
  userImage: {
    width: 45,
    height: 45,
    borderRadius: 23,
    marginRight: 10,
    position: "absolute",
    top: 10,
    left: 10,
  },
  userName: {
    fontWeight: "bold",
    fontSize: 15,
    color: Color.DarkGrey,
    flexWrap: "wrap",
    fontFamily: "Roboto_700Bold",
  },
  UserRole: {
    fontWeight: "bold",
    fontSize: 12,
    left: 15,
    color: Color.Blue,
    fontFamily: "Roboto_400Regular",
  },
  request: {
    fontSize: 12,
    position: "absolute",
    left: 65,
    top: 35,
    color: Color.Grey,
    fontFamily: "Roboto_400Regular",
  },

  productsContainer: {
    marginTop: 6,
    backgroundColor: Color.White,
    shadowColor: Color.DarkGrey,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2.65,
    elevation: 4,
    height: height * 0.18,
    borderRadius: 8,
    marginBottom: 10,
  },
  expandArrow: {
    position: "absolute",
    right: 10,
    top: 25,
    borderRadius: 8,
  },
  sectionTitle: {
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 10,
  },
  UserAccounts: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
  },
  AccountLink: {
    fontSize: 13,
    color: Color.Blue,
    fontWeight: "500",
    width: "83%",
    paddingHorizontal: width * 0.02,
    fontFamily: "Roboto_500Medium",
  },
  VisitBtn: {
    position: "absolute",
    right: 10,
    top: 10,
    color: Color.Grey,
    fontSize: 12,
    fontWeight: "500",
    fontFamily: "Roboto_500Medium",
  },
  btn: {
    fontSize: 13,
    fontFamily: "Roboto_500Medium",
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalView: {
    borderRadius: 8,
    alignItems: "center",
    backgroundColor: Color.White,
    shadowColor: Color.DarkGrey,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.6,
    shadowRadius: 2.65,
    elevation: 4,
    width: width * 0.9,
    height: height * 0.37,
  },
  noRequestContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  noRequestTitle: {
    fontSize: height * 0.022,
    fontFamily: "Roboto_400Regular",
  },
  heading: {
    fontFamily: "Roboto_700Bold",
    color: Color.DarkGrey,
    fontSize: height * 0.019,
    paddingVertical: height * 0.01,
  },
  subHeading: {
    fontFamily: "Roboto_500Medium",
    color: Color.DarkGrey,
    fontSize: height * 0.016,
  },
  bellIcon: {
    width: width * 0.4,
    height: height * 0.18,
    resizeMode: "contain",
  },
  button: {
    backgroundColor: Color.Blue,
    marginTop: height * 0.05,
    paddingHorizontal: width * 0.06,
    paddingVertical: height * 0.013,
    borderRadius: height * 0.01,
  },
  buttonTitle: {
    fontFamily: "Roboto_600SemiBold",
    color: Color.White,
    fontSize: height * 0.02,
  },
  approveBtnContainer: {
    width: "33%",
    alignItems: "center",
    paddingVertical: height * 0.01,
    borderRadius: height * 0.01,
  },
  adminIcon: {
    marginLeft: 5,
    alignSelf: "center",
    fontSize: height * 0.018,
    color: Color.Blue,
  },
});
export default UserList;
