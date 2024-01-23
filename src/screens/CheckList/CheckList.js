import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  FlatList,
  TextInput,
  ActivityIndicator,
} from "react-native";
import { MaterialIcons, Entypo, AntDesign } from "react-native-vector-icons";
import { useNavigation } from "@react-navigation/native";
import Color from "../../../assets/colors/Color";
import { calculateTimeDifference } from "../../utils/timeDifference";
import InputText from "../../components/InputText";
import EditCheckList from "./EditCheckList";
import ReadMore from "./ReadMore";
import { useStateContext } from "../../contexts/ContextProvider";
import { axiosInstance } from "../../../axiosInstance";
import { useUserState } from "../../slices/userSlice";
import { scale } from "react-native-size-matters";
import { Portal, Modal } from "react-native-paper";
import { SafeAreaProvider } from "react-native-safe-area-context";
import CustomStatsBar from "../../components/CustomStatsBar";
const Height = Dimensions.get("screen").height;
const Width = Dimensions.get("screen").width;

const ALLOWED_ROLES = ["Owner", "Lead", "Co-Lead"];

const CheckList = ({ route }) => {
  const { sendNotificationMessage } = route.params;
  const navigation = useNavigation();
  const [edit, setedit] = useState(false);
  const [expandedUser, setExpandedUser] = useState(null);
  const [addTask, setAddTask] = useState(false);
  const [title, settitle] = useState("");
  const [description, setdescription] = useState("");
  const [ModelConfrm, setModelConfrm] = useState(false);
  const userState = useUserState();
  const {
    group,
    tasks,
    setTasks,
    campaignId,
    setCampaignId,
    currentUserprivilege,
    setLoading,
  } = useStateContext();

  const isCurrentUserAllowed = ALLOWED_ROLES.includes(currentUserprivilege);

  const handleEdit = () => {
    setedit(!edit);
  };

  const toggleExpand = (userId) => {
    setExpandedUser((prevState) => (prevState === userId ? null : userId));
  };

  useEffect(() => {
    //getting the group out of the group id
    const fetchData = async () => {
      try {
        setLoading(true);
        const { data } = await axiosInstance.get(
          `/task/get-by-query?group=${group._id}`
        );
        if (data.success) {
          setTasks(data.tasks);
          setCampaignId(data.campaignId);
        }
        setLoading(false);
      } catch (error) {
        setLoading(false);
        console.log(error);
      }
    };
    fetchData();
    return () => {
      setTasks(null);
      setCampaignId(null);
    };
  }, []);

  const handleDelete = async () => {};
  const handleCancel = () => {
    setModelConfrm(false);
  };
  const handleDiscard = () => {
    setModelConfrm(true);
    // setAddTask(false);
  };

  const handleCreate = async () => {
    try {
      setLoading(true);
      const { data } = await axiosInstance.post(
        `/campaigns/add-task/${campaignId}`,
        {
          title,
          description,
        }
      );

      if (data.success) {
        setTasks(data.tasks);
        setAddTask(false);
        settitle("");
        setdescription("");
        sendNotificationMessage({
          heading: title,
          subheading: `Task Created by ~ ${userState.fullName}`,
        });
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  const markComplete = async (id, title) => {
    try {
      setLoading(true);
      const { data } = await axiosInstance.patch(
        `/campaigns/edit-task/${campaignId}`,
        {
          taskId: id,
          status: "completed",
        }
      );

      if (data.success) {
        setTasks(data.tasks);
        sendNotificationMessage({
          heading: title,
          subheading: `Task Completed by ~ ${userState.fullName}`,
        });
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log("error is  ", error);
    }
  };

  const item = [];

  const Card = ({ item }) => {
    let timePassed = calculateTimeDifference(item.created_on);

    return (
      <View>
        <View style={styles.itemCard}>
          <View style={{ flex: 1 }}>
            <Text style={styles.itemTitle}>{item.title}</Text>
            {/* <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Text style={styles.assignee}>Assignee:</Text>
              <Text style={styles.userName}>{item.created_by.fullName}</Text>
            </View> */}
            <View style={styles.itemText}>
              <Text
                style={{
                  fontFamily: "Roboto_500Medium",
                  fontSize: Height * 0.018,
                }}
              >
                Note:
              </Text>
              <ReadMore description={item.description} />
            </View>
          </View>
          <View>
            {isCurrentUserAllowed && (
              <TouchableOpacity
                style={{
                  position: "relative",
                  top: Height * 0.022,
                }}
                onPress={() => markComplete(item._id, item.title)}
              >
                <AntDesign
                  name="checkcircle"
                  style={{ fontSize: 20, color: Color.Blue }}
                />
              </TouchableOpacity>
            )}
          </View>
          <View style={{ flex: 0.5 }}>
            {item.status === "pending" ? (
              <View>
                <Text style={[styles.status]}>{item.status}</Text>
                {isCurrentUserAllowed && (
                  <TouchableOpacity
                    style={styles.editbtn}
                    onPress={() => toggleExpand(item._id)}
                  >
                    <Text style={styles.btntext}>Edit</Text>
                  </TouchableOpacity>
                )}
              </View>
            ) : (
              <View>
                <Text
                  style={{
                    ...styles.status,
                    color: "#45C359",
                  }}
                >
                  {item.status}
                </Text>
                <Text
                  style={{
                    position: "absolute",
                    right: Width * 0.012,
                    top: Height * 0.035,
                    fontSize: Height * 0.016,
                  }}
                >
                  {timePassed}
                </Text>
              </View>
            )}
          </View>
        </View>
      </View>
    );
  };

  const renderItem = ({ item }) => {
    return (
      <View>
        <View>
          <View>
            <Card item={item} />
          </View>
          {expandedUser === item._id && (
            <View style={{ ...styles.itemCard, flexDirection: "column" }}>
              <EditCheckList
                item={item}
                sendNotificationMessage={sendNotificationMessage}
              />
            </View>
          )}
        </View>
      </View>
    );
  };
  const handleDismissModal = () => {
    setModelConfrm(false);
  };

  return (
    <SafeAreaProvider style={styles.container}>
      <CustomStatsBar backgroundColor={Color.White} />
      <View
        style={{
          width: "100%",
          height: "100%",
          backgroundColor: Color.White,
        }}
      >
        <View style={styles.header}>
          <View>
            <Text style={styles.headerTitle}></Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-around",
              // flex: 0.7,
            }}
          >
            {!addTask && isCurrentUserAllowed && (
              <TouchableOpacity
                style={{
                  marginRight: Width * 0.022,
                }}
                onPress={() => setAddTask(!addTask)}
              >
                <Text style={styles.addbtn}> Add Task</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Entypo name="cross" color={Color.Black} size={26} />
            </TouchableOpacity>
          </View>
        </View>
        <FlatList
          data={tasks}
          keyExtractor={(item) => item._id}
          renderItem={renderItem}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
        />

        {/* <TouchableOpacity
        style={styles.buttonContainer}
        onPress={() => setAddTask(true)}
      >
        <Text style={styles.buttonTitle}>Add Task</Text>
      </TouchableOpacity> */}
        <Portal>
          <Modal
            visible={ModelConfrm}
            onDismiss={handleDismissModal}
            transparent={true}
          >
            <View style={styles.cmodel}>
              <View>
                <Text
                  style={{
                    fontFamily: "Roboto_400Regular",
                    fontWeight: "400",
                  }}
                >
                  Do you really want to discard the task?
                </Text>
              </View>
              <View style={styles.model}>
                <TouchableOpacity onPress={() => console.log("deleted")}>
                  <Text style={styles.btn}>Yes Delete</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleCancel()}>
                  <Text
                    style={{
                      ...styles.btn,
                      backgroundColor: Color.White,
                      color: Color.Black,
                      borderWidth: 1,
                    }}
                  >
                    No, Cancel
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        </Portal>

        {addTask && (
          <View style={{ ...styles.itemCard, flexDirection: "column" }}>
            <TouchableOpacity onPress={() => setAddTask(!addTask)}>
              <Entypo
                name="cross"
                color={Color.Black}
                size={26}
                style={{ position: "relative", right: Width * -0.85 }}
              />
            </TouchableOpacity>
            <TextInput
              style={styles.input}
              onChangeText={settitle}
              value={title}
              placeholder="Task Title"
            />
            <TextInput
              style={styles.input}
              onChangeText={setdescription}
              value={description}
              placeholder="Description"
            />
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-around",
                marginTop: Height * 0.03,
              }}
            >
              <TouchableOpacity onPress={() => handleCreate()}>
                <Text style={styles.btn}>Create/Assign</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleDiscard()}>
                <Text
                  style={{
                    ...styles.btn,
                    backgroundColor: Color.White,
                    color: Color.Black,
                    borderWidth: 1,
                  }}
                >
                  Discard
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  header: {
    backgroundColor: Color.White,
    flexDirection: "row",
    paddingVertical: Height * 0.022,
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 1,
    paddingHorizontal: Width * 0.06,
    borderBottomColor: Color.Disable,
  },
  headerTitle: {
    fontFamily: "Roboto_500Medium",
    fontWeight: "600",
    fontSize: Height * 0.023,
  },
  itemCard: {
    marginVertical: 10,
    flexDirection: "row",
    backgroundColor: Color.White,

    justifyContent: "space-between",
    width: "95%",
    alignSelf: "center",
    paddingHorizontal: Width * 0.023,
    paddingVertical: Height * 0.018,
    marginTop: 10,
    borderRadius: 6,
    borderWidth: 0.7,
    borderColor: Color.LightGrey,
  },
  itemText: {
    flex: 1, // Use flex to allow the Text to expand vertically
    flexWrap: "wrap", // Wrap text to next line if it exceeds the width
    fontSize: 16,
    color: "black",
    flexDirection: "row",
    paddingVertical: scale(4),
  },

  itemTitle: {
    fontFamily: "Roboto_500Medium",
    fontWeight: "600",
    fontSize: Height * 0.0164,
  },
  assignee: {
    fontFamily: "Roboto_500Medium",
    fontWeight: "600",
    fontSize: Height * 0.018,
  },
  userName: {
    marginLeft: Width * 0.016,
    fontWeight: "500",
    fontSize: Height * 0.015,
    color: Color.Black,
    fontWeight: "400",
    fontFamily: "Roboto_400Regular",
  },
  descriptionText: {
    fontSize: 14,
    fontFamily: "Roboto_400Regular",
    color: Color.DarkGrey,
  },
  input: {
    backgroundColor: "#F5F6FA",
    paddingVertical: Height * 0.012,
    paddingHorizontal: Width * 0.03,
    marginTop: Height * 0.012,
    borderBottomWidth: 1,
    borderBottomColor: "#DADADA",
  },
  btn: {
    paddingVertical: Height * 0.012,
    backgroundColor: Color.Blue,
    paddingHorizontal: Width * 0.07,
    color: Color.White,
    fontFamily: "Roboto_500Medium",
    fontWeight: "600",
    borderRadius: Height * 0.01,
  },
  model: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: Height * 0.03,
    width: Width * 0.9,
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
    borderRadius: 6,
  },
  status: {
    color: "#FFD15B",
    position: "absolute",
    right: Width * 0.012,
    fontSize: Height * 0.018,
    fontWeight: "500",
    fontFamily: "Roboto_400Regular",
  },
  btntext: {
    paddingHorizontal: Width * 0.052,
    paddingVertical: Height * 0.0066,
    fontSize: Height * 0.017,
    fontWeight: "600",
    fontFamily: "Roboto_500Medium",
  },
  editbtn: {
    backgroundColor: "#EEEEEE",
    position: "absolute",
    right: Width * 0.012,
    top: Height * 0.03,
    borderRadius: Height * 0.01,
  },
  addbtn: {
    backgroundColor: Color.Blue,
    alignSelf: "center",
    paddingHorizontal: Width * 0.036,
    paddingVertical: Height * 0.006,
    fontFamily: "Roboto_500Medium",
    color: Color.White,
    borderRadius: Height * 0.01,
    fontWeight: "600",
    fontSize: Height * 0.017,
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

export default CheckList;
