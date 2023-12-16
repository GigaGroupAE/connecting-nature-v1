import { View } from "react-native";
import React from "react";
import TextInput from "../../../../components/TextInput";
import { Button } from "react-native-paper";
import { useStyles } from "./styles";
import useChatInput from "../../hooks/useChatInput";
import { Pages } from "../../../../Pages";

const ChatInputContainer = (props) => {
  const styles = useStyles();

  const {
    message,
    setMessage,
    handleSendTextMessage,
    handleSendAudioMessage,
    handleSendDocumentMessage,
    renderAudioButtonText,
  } = useChatInput();

  const handleTakePicture = () => {
    // console.log({props});
    props.navigation.navigate(Pages.Camera);
  };

  return (
    <View>
      <TextInput
        style={styles.input}
        value={message}
        onChangeText={setMessage}
      />
      <Button onPress={handleSendTextMessage}>send message</Button>
      <Button onPress={handleSendAudioMessage}>{renderAudioButtonText}</Button>
      <Button onPress={handleTakePicture}>send picture</Button>
      <Button onPress={handleSendDocumentMessage}>send doc</Button>
    </View>
  );
};

export default ChatInputContainer;
