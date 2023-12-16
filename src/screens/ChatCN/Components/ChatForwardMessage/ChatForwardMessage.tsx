// import { View } from "react-native";
// import React from "react";
// import moment from "moment";
// import { MessageInterface } from "../../../../modals";
// import { Timestamp } from "firebase/firestore";
// import { useStyles } from "./styles";
// import { useUserState } from "../../../../slices/userSlice";
// import Text from "../../../../components/Text";
// import { useGroupState } from "../../../../slices/groupSlice";

// // to forward a message, just take the old messages and add a new one with the same content and make it type of forward

// const ChatForwardMessage = (props: MessageInterface) => {
//   const UserState = useUserState();
//   const GroupState = useGroupState();

//   const color = GroupState?.members.find(
//     (member) => member.uid === props.senderId,
//   )?.color;

//   const styles = useStyles(color);

//   const TypeOfMessage =
//     UserState.phoneNumber === props.senderId
//       ? { message: styles.sender, timestamp: styles.senderTimestamp }
//       : { message: styles.receiver, timestamp: styles.receiverTimestamp };

//   return (
//     <View>
//       <View style={[styles.message, TypeOfMessage.message]}>
//         <Text style={styles.forward}>forward</Text>
//         <Text variant="p">{props.message}</Text>
//         <Text style={[styles.timestamp, TypeOfMessage.timestamp]}>
//           {props.timestamp
//             ? moment((props.timestamp as Timestamp).toDate()).format("LT")
//             : "..."}
//         </Text>
//       </View>
//     </View>
//   );
// };

// export default ChatForwardMessage;
import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

const ChatForwardMessage = () => {
  return (
    <View>
      <Text>ChatForwardMessage</Text>
    </View>
  )
}

export default ChatForwardMessage

const styles = StyleSheet.create({})
