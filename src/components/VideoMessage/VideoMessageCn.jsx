import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Pressable,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from 'react-native-vector-icons';
import Color from '../../../assets/colors/Color';
import { useUserState } from '../../slices/userSlice';
import { useNavigation } from '@react-navigation/native';
import VideoPlayer from 'expo-video-player';
import { BASE_URL } from '../../../CONSTANTS';
import { calculateTimeDifference } from '../../utils/timeDifference';

const Width = Dimensions.get('screen').width;

const VideoMessageCn = (props) => {
  const video = React.useRef(null);

  const userState = useUserState();
  const navigation = useNavigation();
  const { socket, item } = props;
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
    >
      <View>
        {/* <View style={styles.textMessageMainContainer}> */}
        {/* TODO :: SINCE 2 USERS CAN HAVE THE SAME NAME SO CHANGETHE LOGIC TO CHECK WITH PHONE NUMBERS */}
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
            <Pressable
              key={props.index}
              onPress={props.onPress}
              onLongPress={() => props?.longPress(item._id, item?.from)}
              android_ripple={{ foreground: true, color: Color.LightGrey }}
            >
              {item.content !== '' && (
                <Pressable
                  style={{
                    overflow: 'hidden',
                    backgroundColor: Color.White,
                    borderWidth: 3,
                    borderColor: Color.VeryLightGrey,
                    borderTopLeftRadius: 15,
                    borderBottomLeftRadius: 15,
                    borderBottomRightRadius: 15,
                  }}
                >
                  <VideoPlayer
                    style={{ width: 205, height: 300, borderRadius: 20 }}
                    fullscreen={{
                      enterFullscreen: () => {
                        video.current.setStatusAsync({
                          shouldPlay: false,
                        });
                        navigation.navigate('PostView', {
                          url: `${BASE_URL}/messageMedia/${item?.content}`,
                          message: '',
                          mediatype: 'video',
                          description: '',
                          //video: props.video,
                          screen: 'message',
                        });
                      },
                      exitFullscreen: (e) => console.log(e),
                    }}
                    defaultControlsVisible
                    // timeVisible={false}
                    // slider={false}
                    videoProps={{
                      isLooping: false,
                      ref: video,
                      source: {
                        uri: `${BASE_URL}/messageMedia/${item?.content}`,
                      },
                      shouldPlay: false,
                      resizeMode: 'contain',
                    }}
                  />
                </Pressable>
              )}
            </Pressable>
            <View
              style={[
                props.message
                  ? styles.timeContainer
                  : styles.OverlayTimeContainer,
              ]}
            >
              <Text style={[props.message ? styles.time : styles.overlayTime]}>
                {timePassed}
              </Text>
              {props.message ? (
                <Ionicons
                  name="checkmark"
                  size={14}
                  style={{ marginHorizontal: 2, color: Color.Grey }}
                />
              ) : (
                <Ionicons
                  name="checkmark"
                  size={14}
                  style={{ marginHorizontal: 2, color: Color.LightGrey }}
                />
              )}
            </View>
          </View>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('MsgShare', {
                forwardFrom: userState.id,
                forwardChat: 'chatId',
                forwardType: 'video',
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
                style={{ color: 'white' }}
              />
            </View>
          </TouchableOpacity>
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
  },
  receiverTextMessageMainContainer: {
    flex: 1,
    flexDirection: 'row',
    alignContent: 'center',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  senderTextMessageContainer: {
    maxWidth: '80%',
  },
  receiverTextMessageContainer: {
    maxWidth: '80%',
  },
  timeContainer: {
    flexDirection: 'row',
    alignSelf: 'flex-end',
    marginTop: '-1%',
    marginVertical: '1%',
  },
  OverlayTimeContainer: {
    position: 'absolute',
    bottom: 10,
    right: 0,
    flexDirection: 'row',
    alignSelf: 'flex-end',
  },
  time: {
    fontSize: 12,
    color: Color.Grey,
    fontFamily: 'Roboto_400Regular',
    marginLeft: '10%',
  },
  overlayTime: {
    fontSize: 12,
    color: Color.LightGrey,
    fontFamily: 'Roboto_400Regular',
    marginLeft: '10%',
  },
  shareMessage: {
    position: 'absolute',
    right: Width * 0.62,
    // bottom: -15,
    backgroundColor: '#CFCFCF',
    marginLeft: 9,
    borderRadius: 50,
    padding: 3,
  },
  receiverShareMessage: {
    position: 'absolute',
    // right: -40,
    // bottom: -15,
    backgroundColor: '#CFCFCF',
    marginLeft: 9,
    borderRadius: 50,
    padding: 3,
    left: Width * 0.61,
  },
  senderImageMessage: {
    backgroundColor: Color.White,
    borderWidth: 5,
    borderColor: Color.VeryLightGrey,
    borderTopRightRadius: 15,
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
    height: Dimensions.get('screen').height * 0.4,
    width: Dimensions.get('screen').width * 0.6,
  },
  receiverImageMessage: {
    backgroundColor: Color.White,
    borderWidth: 5,
    borderColor: Color.LightBlue,
    borderTopLeftRadius: 15,
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
    height: Dimensions.get('screen').height * 0.4,
    width: Dimensions.get('screen').width * 0.6,
  },
});

export default VideoMessageCn;
