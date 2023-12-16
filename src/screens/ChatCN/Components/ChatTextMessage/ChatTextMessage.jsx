import { View } from "react-native";
import React, { useState, useEffect } from "react";
import { useStyles } from "./styles";
import { useUserState } from "../../../../slices/userSlice";
import Text from "../../../../components/Text";

const ChatTextMessage = (props) => {
  const [currentDate, setCurrentDate] = useState("");

  useEffect(() => {
    var hours = new Date().getHours(); // current Hours
    var min = new Date().getMinutes(); // current Minutes
    return () => {
      setCurrentDate(hours + ":" + min);
    };
  }, []);

  const UserState = useUserState();
  useEffect(() => console.log(props));
  const color = "#4582C3";

  const styles = useStyles(color);

  const TypeOfMessage =
    UserState.phoneNumber !== props.senderId
      ? { message: styles.sender, timestamp: styles.senderTimestamp }
      : { message: styles.receiver, timestamp: styles.receiverTimestamp };

  return (
    <View>
      <View style={[styles.message, TypeOfMessage.message]}>
        <Text variant="p" style={{ fontFamily: "Roboto" }}>
          {props.message}
        </Text>
        <Text style={[styles.timestamp, TypeOfMessage.timestamp]}>
          {props.timestamp ? "1hr" : "..."}
        </Text>
      </View>
    </View>
  );
};

export default ChatTextMessage;
