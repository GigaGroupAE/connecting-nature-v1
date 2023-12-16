import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Pressable,
  TouchableOpacity,
} from "react-native";
import React, { useState } from "react";
import { Dimensions } from "react-native";
import Color from "../../../assets/colors/Color";
import { useStateContext } from "../../contexts/ContextProvider";
import { axiosInstance } from "../../../axiosInstance";
import { useUserState } from "../../slices/userSlice";
import { Portal, Modal } from "react-native-paper";
import { scale } from "react-native-size-matters";

const Height = Dimensions.get("screen").height;
const Width = Dimensions.get("screen").width;

const EditCheckList = (props) => {
  const [itemtitle, setitemTitle] = useState(props.item.title);
  const userState = useUserState();
  const [itemdescription, setitemDescription] = useState(
    props.item.description
  );
  const [modalVisible, setModalVisible] = useState(false);

  const { campaignId, setTasks, setLoading } = useStateContext();

  const hanldeDelete = () => {
    setModalVisible(true);
  };

  const handleCancel = () => {
    setModalVisible(!modalVisible);
  };

  const handleUpdate = async () => {
    setLoading(true);
    try {
      const { data } = await axiosInstance.patch(
        `/campaigns/edit-task/${campaignId}`,
        {
          taskId: props.item._id,
          title: itemtitle,
          description: itemdescription,
        }
      );
      setLoading(false);

      if (data.success) {
        setTasks(data.tasks);
        props.sendNotificationMessage({
          heading: itemtitle,
          subheading: `Task Updated by ~ ${userState.fullName}`,
        });
      }
    } catch (error) {
      setLoading(false);
      console.log("error is  ", error);
    }

    //TODO :: ADD SOCKET MESSAGE
  };
  const handleDelete = async () => {
    setLoading(true);
    try {
      const { data } = await axiosInstance.delete(
        `/campaigns/delete-task/${campaignId}?taskId=${props.item._id}`
      );
      setTasks(data.tasks);
      setModalVisible(false);
      setLoading(false);
      if (data.success) {
        props.sendNotificationMessage({
          heading: itemtitle,
          subheading: `Task Deleted by ~ ${userState.fullName}`,
        });
      }
    } catch (error) {
      setLoading(false);
      console.log("error is  ", error);
      setModalVisible(false);
    }

    //TODO :: ADD SOCKET MESSAGE
  };

  const hideModal = () => {
    setModalVisible(false);
  };
  return (
    <View style={{ ...styles.itemCard, flexDirection: "column" }}>
      <TextInput
        style={styles.input}
        onChangeText={setitemTitle}
        value={itemtitle}
      />
      <TextInput
        style={styles.input}
        onChangeText={setitemDescription}
        value={itemdescription}
      />
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-around",
          marginTop: Height * 0.03,
        }}
      >
        <TouchableOpacity onPress={() => handleUpdate()}>
          <Text style={styles.btn}>Update Task</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setModalVisible(true)}>
          <Text
            style={{
              ...styles.btn,
              backgroundColor: Color.White,
              color: Color.Black,
              borderWidth: 1,
            }}
          >
            Delete Task
          </Text>
        </TouchableOpacity>
        <View>
          <Portal>
            <Modal
              animationType="slide"
              transparent={true}
              visible={modalVisible}
              onDismiss={hideModal}
              onRequestClose={() => {
                setModalVisible(!modalVisible);
              }}
            >
              <View style={styles.ConfrmModel}>
                <View>
                  <Text
                    style={{
                      fontFamily: "Roboto_400Regular",
                      fontWeight: "400",
                      fontSize: scale(15),
                    }}
                  >
                    Do you really want to delete the task?
                  </Text>
                </View>
                <View style={styles.model}>
                  <TouchableOpacity onPress={() => handleDelete()}>
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
        </View>
      </View>
    </View>
  );
};

export default EditCheckList;

const styles = StyleSheet.create({
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
  ConfrmModel: {
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Color.White,
    shadowColor: Color.Grey,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
    elevation: 4,
    alignSelf: "center",
    paddingVertical: Height * 0.03,

    borderRadius: 6,
  },
  model: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: Height * 0.03,
    width: Width * 0.9,
  },
});
