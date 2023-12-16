import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableWithoutFeedback,
  Animated,
  TextInput,
} from "react-native";
import React, { useState } from "react";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Icon } from "react-native-elements";
import { Entypo, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { FontAwesome, FontAwesome5 } from "react-native-vector-icons";
import { Appbar, Button, Snackbar } from "react-native-paper";
import Color from "../../../../../assets/colors/Color";
export default function ChatBottomBar(props) {
  const [visible, setVisible] = React.useState(false);
  const onDismissSnackBar = () => setVisible(false);
  const [textmessage, settextmessage] = useState("");
  const [typing, setTyping] = useState(false);
  const onToggleSnackBar = () => setVisible(!visible);
  const [animation, setAnimation] = useState(new Animated.Value(0));
  const [recording, setRecording] = useState(false);
  const handleAnimation = () => {
    Animated.timing(animation, {
      toValue: 1,
      duration: 2000,
      useNativeDriver: false,
    }).start(() => {
      Animated.timing(animation, {
        toValue: 0,
        duration: 2000,
        useNativeDriver: false,
      }).start();
    });
  };
  const animatedStyle = {
    backgroundColor: boxInterpolation,
  };
  const boxInterpolation = animation.interpolate({
    inputRange: [0, 1],
    outputRange: ["rgb(224,0,99)", "rgb(100,0,0)"],
  });
  const handleChangeText = (text) => {
    if (text.length !== 0) {
      setTyping(true);
    } else {
      setTyping(false);
    }
    settextmessage(text);
  };
  return (
    <View
      style={{
        paddingVertical: 10,
        flexDirection: "row",
        alignItems: "center",
      }}
    >
      <Snackbar
        visible={visible}
        onDismiss={onDismissSnackBar}
        duration={70000}
        style={{
          bottom: 60,
          elevation: 3,
          backgroundColor: "#474747",
          borderRadius: 25,
          width: 190,
          paddingLeft: 25,
          // marginLeft: 100,
          alignSelf: "center",
        }}
      >
        <View style={{ flex: 1 }}>
          <TouchableWithoutFeedback onPress={handleAnimation}>
            <Animated.View
              style={{
                width: 13,
                height: 13,
                backgroundColor: "red",
                borderRadius: 50,
                elevation: 2,
                ...styles.box,
                ...animatedStyle,
              }}
            />
          </TouchableWithoutFeedback>
        </View>
        <Text> Recording...</Text>
      </Snackbar>
      <View style={styles.messageInputView}>
        <TouchableOpacity
          onPress={() => {
            props.pick();
          }}
        >
          {!typing && (
            <FontAwesome
              style={{ paddingLeft: 12 }}
              size={20}
              name="photo"
              color={Color.Black}
            />
          )}
        </TouchableOpacity>
        <TextInput
          defaultValue={textmessage}
          style={styles.messageInput}
          placeholder="Type your message"
          onChangeText={(text) => handleChangeText(text)}
          onSubmitEditing={() => {}}
          placeholderTextColor={Color.Black}
          multiline={true}
        />

        <TouchableOpacity
          onPress={() => {
            props.pickDoc();
          }}
        >
          <Entypo size={20} name="attachment" color={Color.Black} />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => props.handleCamera()}
          style={styles.cameraIcon}
        >
          {!typing && (
            <FontAwesome5 name="camera" size={20} color={Color.Black} />
          )}
        </TouchableOpacity>
      </View>
      {typing ? (
        <TouchableOpacity
          onPress={() => {
            props.sendtext(textmessage);
            settextmessage("");
            setTyping(false);
          }}
          disabled={props.disabled}
          style={[styles.messageSendView, { marginLeft: 0 }]}
        >
          <Icon
            name="send"
            type="material"
            size={20}
            color={Color.White}
            style={{
              alignSelf: "center",
            }}
          />
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          style={{
            backgroundColor: Color.Blue,
            height: Dimensions.get("screen").height * 0.055,
            width: Dimensions.get("screen").height * 0.055,
            borderRadius: Dimensions.get("screen").height * 0.1,
            justifyContent: "center",
            alignItems: "center",
            // marginLeft: 5,
          }}
        >
          {recording ? (
            <Icon
              onPress={() => {
                props.stopRecording();
                // handleSendAudioMessage();
                onDismissSnackBar();
                setRecording(!recording);
              }}
              name="send"
              size={22}
              color={Color.White}
              style={{
                marginLeft: 1.5,
                padding: 3,
                alignSelf: "center",
              }}
            />
          ) : (
            <FontAwesome
              onPress={() => {
                props.startRecording();
                // handleSendAudioMessage();
                onToggleSnackBar();
                setRecording(!recording);
              }}
              name="microphone"
              size={22}
              color={Color.White}
              style={{ justifyContent: "center", padding: 3 }}
            />
          )}
        </TouchableOpacity>
      )}
    </View>
  );
}
const styles = StyleSheet.create({
  messageInputView: {
    flexDirection: "row",
    marginHorizontal: Dimensions.get("screen").height * 0.01,
    backgroundColor: Color.White,
    elevation: 4,
    shadowColor: Color.Grey,
    borderRadius: Dimensions.get("screen").height * 0.1,
    width: "80%",
    alignItems: "center",
    alignSelf: "center",
  },
  messageInput: {
    height: Dimensions.get("screen").height * 0.055,
    flex: 1,
    paddingLeft: 15,
    paddingVertical: 3,
    fontFamily: "Roboto",
    fontSize: 16,
  },
  messageSendView: {
    // padding: 8,
    justifyContent: "center",
    backgroundColor: Color.Blue,
    height: Dimensions.get("screen").height * 0.055,
    width: Dimensions.get("screen").height * 0.055,
    borderRadius: Dimensions.get("screen").height * 0.1,
  },
  cameraIcon: {
    paddingHorizontal: 10,
    // marginRight: 12,
  },
  textMessageMainContainer: {
    flex: 1,
    flexDirection: "row",
    alignContent: "center",
    alignItems: "center",
  },
  textMessageContainer: {
    alignItems: "baseline",
    // alignSelf: "flex-start",
    backgroundColor: "white",
    maxWidth: "80%",
    borderLeftWidth: 4,
    borderColor: "#4582C3",
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
    marginVertical: 9,
    paddingHorizontal: 5,
  },
});
