import React from 'react';
import { View, Text, StyleSheet, Dimensions, Pressable } from 'react-native';
import Color from '../../../assets/colors/Color';
import { useUserState } from '../../slices/userSlice';

import { calculateTimeDifference } from '../../utils/timeDifference';
import { screenHeight } from '../../utils/ScreenDimensions';

const NormalMessageCn = (props) => {
  const userState = useUserState();

  // const [modalVisible, setmodalVisible] = useState(false);
  const { item } = props;
  const timePassed = calculateTimeDifference(item.date);

  return (
    <Pressable
      onLongPress={() => props?.longPress(item._id, item?.from)}
      style={[
        props.LongPressed
          ? {
              backgroundColor: Color.LightBlue,
              // opacity: 0.7,
            }
          : null,
      ]}
      android_ripple={{ foreground: true, color: Color.LightGrey }}
    >
      <View>
        {/* <View style={styles.textMessageMainContainer}> */}
        {/* TODO :: SINCE 2 USERS CAN HAVE THE SAME NAME SO CHANGE THE LOGIC TO CHECK WITH PHONE NUMBERS */}
        <View
          style={[
            userState.id === item?.from
              ? styles.receiverTextMessageMainContainer
              : styles.senderTextMessageMainContainer,
          ]}
        >
          <View
            style={[
              userState.id === item?.from
                ? styles.receiverTextMessageContainer
                : styles.senderTextMessageContainer,
            ]}
          >
            <Text
              style={[
                userState.id == item?.from
                  ? styles.receiverTextMessage
                  : styles.message,
              ]}
            >
              {item.content}
            </Text>
            <View style={styles.timeContainer}>
              <Text
                style={[
                  userState.id == item?.from
                    ? styles.time
                    : styles.messageReciveTime,
                ]}
              >
                {timePassed}
              </Text>
              {/* <Ionicons
                name="checkmark"
                size={14}
                style={{ marginHorizontal: 2, color: "grey" }}
              /> */}
            </View>
          </View>
          {/* <TouchableOpacity
            onPress={() =>
              navigation.navigate("MsgShare", {
                forwardFrom:userState?.id,
                forwardChat: forwardChat,
                forwardType: "text",
                forwardContent: item.content,
                socket: socket,
              })
            }
            android_ripple={{ color: Color.DarkGrey, radius: 20 }}
            style={[
              userState.id === item?.from
                ? styles.shareMessage
                : styles.receiverShareMessage,
            ]}
          >
            <View>
              <MaterialCommunityIcons
                name="share"
                size={22}
                style={{ color: "white" }}
              />
            </View>
          </TouchableOpacity> */}
        </View>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  senderTextMessageMainContainer: {
    flex: 1,
    flexDirection: 'row',
    alignContent: 'center',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  receiverTextMessageMainContainer: {
    flex: 1,
    flexDirection: 'row-reverse',
    alignContent: 'center',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  senderTextMessageContainer: {
    maxWidth: '80%',
    backgroundColor: Color.Blue,
    borderTopRightRadius: 15,
    borderBottomRightRadius: 15,
    borderBottomLeftRadius: 15,
    marginVertical: 4,
    paddingHorizontal: 5,
  },
  receiverTextMessageContainer: {
    maxWidth: '80%',
    backgroundColor: Color.VeryLightGrey,
    borderTopLeftRadius: 15,
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
    paddingHorizontal: 10,
    paddingVertical: 2,
    marginVertical: 4,
  },
  username: {
    fontSize: 14,
    fontWeight: 'bold',
    paddingHorizontal: 5,
    fontFamily: 'Roboto_500Medium',
    paddingVertical: 2,
    color: '#4582C3',
  },
  message: {
    fontSize: screenHeight * 0.015,
    paddingHorizontal: 5,
    fontFamily: 'Roboto_400Regular',
    paddingVertical: 4,
    lineHeight: 20,
    color: Color.White,
  },
  receiverTextMessage: {
    // fontSize: 15.5,
    paddingHorizontal: 5,
    fontFamily: 'Roboto_400Regular',
    paddingVertical: 4,
    lineHeight: 20,
    fontSize: screenHeight * 0.015,
  },
  timeContainer: {
    // marginLeft: "15%",
    flexDirection: 'row',
    alignSelf: 'flex-end',
    marginTop: '-2%',
    marginVertical: 5,
  },
  time: {
    fontSize: 12,
    color: Color.Grey,
    fontFamily: 'Roboto_400Regular',
    marginLeft: '10%',
  },
  shareMessage: {
    backgroundColor: '#CFCFCF',
    marginLeft: 9,
    borderRadius: 50,
    padding: 3,
    // flex: 2,
  },
  imageMessage: {
    maxWidth: '100%',
    height: Dimensions.get('screen').height * 0.4,
    width: Dimensions.get('screen').width * 0.6,
    marginVertical: 0,
    // alignSelf: "flex-start",
  },
  // shareMessage: {
  //   // position: "absolute",
  //   // right: Width * 0.62,
  //   // bottom: -15,
  //   backgroundColor: '#CFCFCF',
  //   marginLeft: 9,
  //   borderRadius: 50,
  //   padding: 3,
  //   marginHorizontal: Width * 0.016,
  // },
  receiverShareMessage: {
    // position: "absolute",
    // right: -40,
    // bottom: -15,
    backgroundColor: '#CFCFCF',
    marginLeft: 9,
    borderRadius: 50,
    padding: 3,
    // left: Width * 0.61,
  },
  messageReciveTime: {
    fontSize: 12,
    color: Color.White,
    fontFamily: 'Roboto',
    marginLeft: '10%',
  },
});

export default NormalMessageCn;
