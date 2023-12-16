import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  FlatList,
} from "react-native";
import React from "react";
import { scale } from "react-native-size-matters";
import { FontAwesome, MaterialIcons, Entypo } from "react-native-vector-icons";
import Color from "../../assets/colors/Color";

import { Portal, Modal } from "react-native-paper";

const PostCampaignSelectModal = ({
  modalVisible,
  setModalVisible,
  handlepost,
  data,
}) => {
  const showModal = () => setModalVisible(true);
  const hideModal = () => setModalVisible(false);
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
          <Text style={styles.header}>Running Campaigns</Text>

          <FlatList
            data={data}
            renderItem={({ item }) => {
              return (
                <TouchableOpacity
                  style={styles.contentContainer}
                  onPress={() => handlepost(item?._id)}
                >
                  <View style={styles.container}>
                    <FontAwesome name="hashtag" />
                    <Text style={styles.title}>{item?.campaignName}</Text>
                  </View>
                  <View>
                    <MaterialIcons
                      name="keyboard-arrow-right"
                      style={styles.icon}
                    />
                  </View>
                </TouchableOpacity>
              );
            }}
            keyExtractor={() => Math.random().toString()} // Use a string as the key
            showsVerticalScrollIndicator={false}
          />
        </View>
      </Modal>
    </Portal>
  );
};

export default PostCampaignSelectModal;

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
    width: scale(300),
    backgroundColor: Color.White,
    justifyContent: "center",
    borderRadius: scale(8),
    paddingVertical: scale(15),
  },
  contentContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: scale(20),
    paddingVertical: scale(8),
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
    width: scale(230),
  },
  header: {
    alignSelf: "center",
    fontFamily: "Roboto_700Bold",
    fontSize: scale(18),
  },
});
