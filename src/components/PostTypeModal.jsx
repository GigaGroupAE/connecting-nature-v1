import { StyleSheet, Text, View, TouchableOpacity, Image } from "react-native";
import React, { useEffect } from "react";
import { scale } from "react-native-size-matters";
import { FontAwesome, MaterialIcons, Entypo } from "react-native-vector-icons";
import Color from "../../assets/colors/Color";

import { Portal, Modal } from "react-native-paper";
import axios from "axios";
import { BASE_URL } from "../../CONSTANTS";
import { useUserState } from "../slices/userSlice";

const PostTypeModal = ({
  modalVisible,
  setModalVisible,
  handlepost,
  setmodalCampaign,
}) => {
  const showModal = () => setModalVisible(true);
  const hideModal = () => setModalVisible(false);

  const handleSelectCampaign = () => {
    setModalVisible(false);
    setmodalCampaign(true);
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
          <Text style={styles.header}>Choose Post Type</Text>
          <View style={styles.contentContainer}>
            {/* Left Container  */}
            <TouchableOpacity
              onPress={handleSelectCampaign}
              style={styles.container}
            >
              <Image
                source={require("../../assets/postCampaign.png")}
                style={styles.image}
              />
              <Text style={styles.title}>Share in Campaign</Text>
            </TouchableOpacity>
            <View>
              <MaterialIcons name="keyboard-arrow-right" style={styles.icon} />
            </View>
          </View>
          {/* Right Container  */}
          <View style={styles.contentContainer}>
            <TouchableOpacity style={styles.container} onPress={handlepost}>
              <Image
                source={require("../../assets/postLogo.png")}
                style={styles.image}
              />
              <Text style={styles.title}>Share on Feeds</Text>
            </TouchableOpacity>
            <MaterialIcons name="keyboard-arrow-right" style={styles.icon} />
          </View>
        </View>
      </Modal>
    </Portal>
  );
};

export default PostTypeModal;

const styles = StyleSheet.create({
  modal: {
    justifyContent: "center",
    alignItems: "center",
  },

  module: {
    alignItems: "flex-end",
    height: "30%",
  },
  modalContainer: {
    height: scale(170),
    width: scale(300),
    backgroundColor: Color.White,
    justifyContent: "center",
    borderRadius: scale(8),
  },
  contentContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: scale(20),
    paddingVertical: scale(10),
    justifyContent: "space-between",
  },
  title: {
    fontFamily: "Roboto_400Regular",
    fontSize: scale(16),
    paddingHorizontal: scale(10),
  },
  icon: {
    fontSize: scale(21),
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
  image: {
    width: scale(20),
    height: scale(26),
    resizeMode: "contain",
  },
  container: {
    flexDirection: "row",
    alignItems: "center",
  },
  header: {
    alignSelf: "center",
    fontFamily: "Roboto_500Medium",
    fontSize: scale(18),
    paddingBottom: scale(14),
  },
});
