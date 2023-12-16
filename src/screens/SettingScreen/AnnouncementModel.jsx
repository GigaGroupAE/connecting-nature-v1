import * as React from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Dimensions,
  TextInput,
} from "react-native";
import { Modal, Portal, Button, Provider } from "react-native-paper";
import { FontAwesome5, Entypo, Ionicons } from "react-native-vector-icons";
import { useNavigation } from "@react-navigation/native";
import Color from "../../../assets/colors/Color";
import { TouchableOpacity } from "react-native-gesture-handler";
import { scale } from "react-native-size-matters";

const Height = Dimensions.get("screen").height;
const Width = Dimensions.get("screen").width;

const AnnouncementModel = ({ modalVisible, setModalVisible }) => {
  const navigation = useNavigation();
  const [description, setdescription] = React.useState("");

  const handleDelete = () => {};
  const handleCancel = () => {};

  const handleDismiss = () => {
    setModalVisible(false);
  };

  return (
    <Provider>
      <Portal>
        <Modal visible={modalVisible} onDismiss={handleDismiss}>
          <View style={styles.modalContainer}>
            <View>
              <Text style={styles.title}>Announcement</Text>
            </View>
            <View style={styles.mainContainer}>
              <View>
                <TextInput
                  placeholder="Type here..."
                  style={{
                    color: Color.Grey,
                    marginTop: Height * 0.016,
                    paddingHorizontal: Width * 0.03,
                  }}
                  textAlignVertical="top"
                  multiline={true}
                  // maxLength={200}aaaaaaaa
                  value={description}
                  onChangeText={(text) => setdescription(text)}
                />
              </View>
            </View>
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.button}>
                <Text style={styles.btn}>Announce</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.button}>
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
              <View></View>
            </View>
          </View>
        </Modal>
      </Portal>
    </Provider>
  );
};

const styles = StyleSheet.create({
  subTitle: {
    color: Color.Grey,
    fontFamily: "Roboto_400Regular",
    fontSize: Height * 0.017,
  },
  title: {
    color: Color.Black,
    fontFamily: "Roboto_600SemiBold",
    width: "100%",
    fontWeight: "600",
    fontSize: Height * 0.02,
  },
  buttonWrapper: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: Width * 0.06,
    paddingVertical: Height * 0.015,
  },
  icon: {
    position: "absolute",
    right: Width * 0.045,
    color: Color.Black,
    fontSize: Height * 0.028,
  },
  mainContainer: {
    backgroundColor: Color.White,
    borderRadius: 8,
    shadowColor: Color.Grey,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
    elevation: 8,
    // paddingVertical: Height * 0.045,
    width: "90%",
    alignSelf: "center",
    height: Height * 0.18,
  },
  textInput: {
    padding: 15,
    borderRadius: 8,
    width: 318,
    height: 150,
    fontSize: 14,
    fontFamily: "Roboto_500Medium",
  },
  title: {
    fontWeight: "700",
    fontSize: Height * 0.021,
    marginLeft: Width * 0.036,
    fontFamily: "Roboto",
    alignSelf: "center",
    paddingVertical: Height * 0.018,
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
  modalContainer: {
    backgroundColor: Color.White,
    width: "90%",
    alignSelf: "center",
    borderRadius: scale(10),
    paddingVertical: scale(10),
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: Height * 0.03,
    alignItems: "center",
    justifyContent: "center",
  },
  button: {
    paddingHorizontal: scale(15),
    marginBottom: scale(10),
  },
});

export default AnnouncementModel;
