import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import React from "react";
import { scale } from "react-native-size-matters";
import * as Clipboard from "expo-clipboard";
import {
  AntDesign,
  FontAwesome,
  MaterialCommunityIcons,
} from "react-native-vector-icons";
import Color from "../../assets/colors/Color";

import { Portal, Modal } from "react-native-paper";
import { useUserState } from "../slices/userSlice";
import { axiosInstance } from "../../axiosInstance";

const DeleteCommentModal = ({
  modalVisible,
  setModalVisible,
  comment,
  handleDelete,
  updatereactions,
  index,
}) => {
  const showModal = () => setModalVisible(true);
  const hideModal = () => setModalVisible(false);
  const userState = useUserState();
  const handleCopy = async () => {
    await Clipboard.setString(comment?.description);
    setModalVisible(false);
  };

  const handleDeleteComment = () => {
    handleDelete(comment?._id);
    setModalVisible(false);
  };

  return (
    <Portal>
      <Modal
        visible={modalVisible}
        onDismiss={hideModal}
        animationType="slide"
        style={styles.modal}
        transparent={true}
      >
        <View style={styles.modalContainer}>
          <TouchableOpacity
            style={styles.contentContainer}
            // onPress={handleDownloadFile}
            onPress={() => updatereactions(comment, index)}
          >
            <MaterialCommunityIcons
              name="comment-outline"
              style={styles.icon}
            />
            <Text style={styles.title}>Reply</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.contentContainer}
            onPress={handleCopy}
          >
            <FontAwesome name="copy" style={styles.icon} />
            <Text style={styles.title}>Copy</Text>
          </TouchableOpacity>
          {comment?.commented_by?._id === userState.id && (
            <TouchableOpacity
              style={styles.contentContainer}
              onPress={handleDeleteComment}
            >
              <AntDesign name="delete" style={styles.icon} />
              <Text style={styles.title}>Delete</Text>
            </TouchableOpacity>
          )}
        </View>
      </Modal>
    </Portal>
  );
};

export default DeleteCommentModal;

const styles = StyleSheet.create({
  modal: {
    alignItems: "center",
    justifyContent: "center",
  },
  module: {
    height: "30%",
  },
  modalContainer: {
    height: scale(170),
    width: scale(300),
    backgroundColor: Color.White,
    justifyContent: "center",
    borderRadius: scale(10),
  },
  contentContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: scale(20),
    paddingVertical: scale(12),
  },
  title: {
    fontFamily: "Roboto_400Regular",
    fontSize: scale(17),
    paddingHorizontal: scale(12),
  },
  icon: {
    fontSize: scale(18),
  },
  crossIcon: {
    alignItems: "center",
    paddingVertical: scale(10),
    width: scale(60),
    alignSelf: "flex-end",
  },
  cross: {
    fontSize: scale(20),
  },
});
