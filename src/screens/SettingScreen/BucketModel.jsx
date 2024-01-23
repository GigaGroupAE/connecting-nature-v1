import React, { useState } from "react";
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

import {
  QueryClient,
  useMutation,
  useQuery,
  useQueryClient,
} from "react-query";
import { axiosInstance } from "../../../axiosInstance";
import { useStateContext } from "../../contexts/ContextProvider";

const Height = Dimensions.get("screen").height;
const Width = Dimensions.get("screen").width;

const mutation = async (payload) => {
  const { data } = await axiosInstance.post("/buckets/create", payload);
  return data;
};

const BucketModel = (props) => {
  const navigation = useNavigation();
  const [bucketName, setbucketName] = useState("");
  const [plantName, setplantName] = useState("");
  const [numOfPlants, setnoOfPlant] = useState("");
  const [points, setpoints] = useState("");
  const queryClient = useQueryClient();

  const { setLoading } = useStateContext();

  const AddBucketMutation = useMutation({
    mutationFn: mutation,
    onSuccess: (data) => {
      queryClient.invalidateQueries(["Buckets"]);
    },
  });

  const handleAddBucket = async () => {
    const response = await AddBucketMutation.mutateAsync({
      bucketName,
      points,
      plantName,
      numOfPlants,
    });
    props.hideModal();
  };

  return (
    <Provider>
      <Portal>
        <Modal
          visible={props.visible}
          onDismiss={props.hideModal}
          contentContainerStyle={props.containerStyle}
        >
          <View>
            <Text style={styles.title}>Add New Bucket</Text>
          </View>
          <View style={styles.bodyContainer}>
            <TextInput
              placeholder="Bucket Name"
              style={{
                color: Color.Grey,
                paddingHorizontal: Width * 0.02,
                paddingVertical: Height * 0.012,
              }}
              textAlignVertical="center"
              value={bucketName}
              onChange={(value) => setbucketName(value.nativeEvent.text)}
            />
          </View>
          <View style={styles.bodyContainer}>
            <TextInput
              placeholder="Plant Name"
              style={{
                color: Color.Grey,
                paddingHorizontal: Width * 0.02,
                paddingVertical: Height * 0.012,
              }}
              textAlignVertical="center"
              value={plantName}
              onChange={(value) => {
                setplantName(value.nativeEvent.text);
              }}
            />
          </View>
          <View
            style={{
              width: "90%",
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              alignSelf: "center",
            }}
          >
            <View style={{ ...styles.bodyContainer, width: "50%" }}>
              <TextInput
                placeholder="No of Plants in Bucket"
                style={{
                  color: Color.Grey,
                  paddingHorizontal: Width * 0.02,
                  paddingVertical: Height * 0.012,
                  fontSize: 13,
                }}
                textAlignVertical="center"
                value={numOfPlants}
                onChange={(value) => setnoOfPlant(value.nativeEvent.text)}
                keyboardType="number-pad"
              />
            </View>
            <View style={{ ...styles.bodyContainer, width: "45%" }}>
              <TextInput
                placeholder="Points"
                style={{
                  color: Color.Grey,
                  paddingHorizontal: Width * 0.02,
                  paddingVertical: Height * 0.012,
                }}
                textAlignVertical="center"
                value={points}
                onChange={(value) => setpoints(value.nativeEvent.text)}
                keyboardType="number-pad"
              />
            </View>
          </View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-around",
              marginTop: Height * 0.03,
              width: "90%",
              alignSelf: "center",
            }}
          >
            <TouchableOpacity onPress={handleAddBucket}>
              <Text
                style={{
                  ...styles.btn,
                  paddingHorizontal: Height * 0.06,
                }}
              >
                Save
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={props.hideModal}>
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
    color: Color.White,
    fontFamily: "Roboto_500Medium",
    fontWeight: "600",
    borderRadius: Height * 0.01,
    paddingHorizontal: Width * 0.09,
  },

  bodyContainer: {
    flexDirection: "row",
    marginVertical: Height * 0.01,
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
    width: "90%",
    alignSelf: "center",
  },
});

export default BucketModel;
