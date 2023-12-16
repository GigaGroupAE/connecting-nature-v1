import {
  Dimensions,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useState } from "react";
import Color from "../../../../../assets/colors/Color";
import { useStateContext } from "../../../../contexts/ContextProvider";
import { useUserState } from "../../../../slices/userSlice";

const Height = Dimensions.get("screen").height;
const Width = Dimensions.get("screen").width;

const DeleteMessage = ({ modalVisible, setmodalVisible, item }) => {
  const userState = useUserState();
  const [refresh, setRefresh] = useState(false);

  const { group, globalSocket } = useStateContext();
  const deleteMessage = (props) => {
    console.log(props);
    setRefresh(true);
    if (props.from === userState.id) {
      globalSocket.emit("Delete_message", {
        chat: group._id,
        id: props._id,
      });
      setmodalVisible(false);
    } else {
      alert("You can only delete your own message");
      setmodalVisible(false);
    }
  };
  const handleCancel = () => {
    setmodalVisible(false);
  };
  return (
    <View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setmodalVisible(!modalVisible);
        }}
      >
        <View style={styles.ConfrmModel}>
          <View>
            <Text
              style={{
                fontFamily: "Roboto_400Regular",
                fontWeight: "400",
              }}
            >
              Do you really want to delete the Chat?
            </Text>
          </View>
          <View style={styles.model}>
            <TouchableOpacity onPress={() => deleteMessage(item)}>
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
    </View>
  );
};

export default DeleteMessage;

const styles = StyleSheet.create({
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
  model: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: Height * 0.03,
    width: Width * 0.9,
  },
});
