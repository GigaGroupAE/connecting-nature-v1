import { TouchableOpacity, View } from "react-native";
import React, { useState, useEffect, useRef } from "react";
import { Dimensions } from "react-native";
import { Camera as ExpoCamera } from "expo-camera";
import { Button, FAB } from "react-native-paper";
import { CameraCapturedPicture, CameraPictureOptions } from "expo-camera";
import Text from "../../components/Text";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
const CameraScreen = (props) => {
  const hasCameraPermission = true;
  const cameraRef = useRef(null);
  useEffect(() => {
    (async () => {
      await ExpoCamera.requestCameraPermissionsAsync()
        .then((res) => console.log(res))
        .catch((e) => console.log(e));
    })();
  }, []);
  const [cameraType, setCameraType] = useState("back");
  const toggleFrontCamera = () => setCameraType("front");
  const toggleBackCamera = () => setCameraType("back");
  const navigation = useNavigation();
  const handleBack = () => {
    navigation.goBack();
  };
  const handleSendPictureMessage = async () => {
    const options = {
      quality: 0.8,
      exif: false,
    };

    const newPhoto = await cameraRef?.current.takePictureAsync(options);

    console.log("picture..", newPhoto);
    props.route.params.handleTakePicture(newPhoto);
  };
  if (hasCameraPermission === null) {
    return <Text>No access to camera</Text>;
  }
  if (hasCameraPermission === false) {
    return <Text>No access to camera</Text>;
  }
  return (
    <SafeAreaView style={{ flex: 1, justifyContent: "center" }}>
      <ExpoCamera
        ref={cameraRef}
        style={{
          height: Dimensions.get("screen").height,
        }}
        type={cameraType}
        ratio="16:9"
      >
        <View
          style={{
            marginTop: Dimensions.get("screen").height * 0.83,
            flex: 1,
            flexDirection: "row",
          }}
        >
          {cameraType === "back" ? (
            <View
              style={{
                flexDirection: "column",
                width: "33%",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <FAB
                icon="camera-switch"
                color="white"
                style={{
                  backgroundColor: "#303030",
                }}
                onPress={toggleFrontCamera}
              />
            </View>
          ) : (
            <View
              style={{
                flexDirection: "column",
                width: "33%",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <FAB
                icon="camera-switch"
                color="white"
                style={{
                  backgroundColor: "#303030",
                }}
                onPress={toggleBackCamera}
              />
            </View>
          )}
          <View
            style={{
              flexDirection: "column",
              width: "33%",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {/* <FAB
              icon="checkbox-blank-circle"
              color="red"
              onPress={() => {
                handleSendPictureMessage().then(() => {
                  handleBack();
                });
              }}
            /> */}
            <TouchableOpacity
              style={{
                width: "45%",
                height: "45%",
                backgroundColor: "#303030",
                borderRadius: 50,
                justifyContent: "center",
              }}
            >
              <TouchableOpacity
                onPress={() => {
                  handleSendPictureMessage().then(() => {
                    navigation.goBack();
                  });
                }}
                style={{
                  width: "70%",
                  height: "70%",
                  backgroundColor: "white",
                  borderRadius: 30,
                  alignSelf: "center",
                }}
              ></TouchableOpacity>
            </TouchableOpacity>
          </View>
          <View
            style={{
              flexDirection: "column",
              width: "33%",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <FAB
              icon="close-thick"
              color="white"
              style={{ backgroundColor: "#303030" }}
              onPress={handleBack}
            />
          </View>
        </View>
      </ExpoCamera>
    </SafeAreaView>
  );
};

export default CameraScreen;
