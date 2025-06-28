import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
  Pressable,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from 'react-native-vector-icons';
import { BASE_URL } from '../../../CONSTANTS';
import { Audio } from 'expo-av';
import { Button } from 'react-native-paper';
import { useUserState } from '../../slices/userSlice';
import Color from '../../../assets/colors/Color';
import { useFocusEffect, useNavigation } from '@react-navigation/native';

const Width = Dimensions.get('screen').width;
const Height = Dimensions.get('screen').height;

export default function RecordingVoiceMessage(props) {
  const [sound, setSound] = React.useState();
  const userState = useUserState();
  const navigation = useNavigation();
  const [isPlaying, setIsPlaying] = useState(false);

  const [audioPlayback, setAudioPlayback] = React.useState('Not Playing');
  const { socket, item } = props;

  const playSound = async () => {
    try {
      setAudioPlayback('Loading');
      const { sound } = await Audio.Sound.createAsync({
        uri: `${item.content}`,
      });
      setSound(sound);
      await sound.playAsync().then(() => {
        setAudioPlayback('Playing');
        setIsPlaying(true);
      });
      sound.setOnPlaybackStatusUpdate((playbackStatus) => {
        if (playbackStatus.didJustFinish && !playbackStatus.isLooping) {
          setAudioPlayback('Not Playing');
          setIsPlaying(false);
        }
      });
    } catch {}
  };

  const handlePlay = async () => {
    try {
      if (sound) {
        if (isPlaying) {
          await sound.pauseAsync();
          setIsPlaying(false);
        } else {
          await sound.playAsync();
          setIsPlaying(true);
        }
      }
    } catch {}
  };

  useEffect(() => {
    return sound
      ? () => {
          setAudioPlayback('Not Playing');
          setIsPlaying(false);
        }
      : undefined;
  }, [sound]);

  useFocusEffect(
    React.useCallback(() => {
      return () => {
        if (isPlaying) {
          handlePlay();
        }
      };
    }, [isPlaying]),
  );

  return (
    <View>
      <Pressable
        style={[
          userState.id === item?.from?._id
            ? styles.receiverTextMessageMainContainer
            : styles.senderTextMessageMainContainer,
        ]}
        onLongPress={() => props?.longPress(item._id, item?.from)}
      >
        <TouchableOpacity
          style={[
            userState.id === item?.from?._id
              ? styles.receiverTextMessageContainer
              : styles.senderTextMessageContainer,
          ]}
          onLongPress={() => props?.longPress(item._id, item?.from)}
        >
          {userState.id !== item?.from?._id ? (
            <View>
              {props?.groupTitle !== 'test' ? (
                <View>
                  <Text style={styles.senderName}>{item.from.fullName}</Text>
                </View>
              ) : null}
            </View>
          ) : null}
          <Pressable onLongPress={() => props?.longPress(item._id, item?.from)}>
            {audioPlayback === 'Not Playing' ? (
              <Button
                icon="play"
                loading={false}
                onPress={() => {
                  setAudioPlayback('Playing');
                  playSound();
                }}
                style={{
                  marginVertical: 5,
                  paddingHorizontal: 20,
                  backgroundColor: '#4582c3',
                  borderRadius: 15,
                }}
                labelStyle={{
                  fontFamily: 'Roboto_400Regular',
                  color: 'white',
                }}
              >
                Play Audio
              </Button>
            ) : audioPlayback === 'Loading' ? (
              <Button
                icon="play"
                loading
                onPress={() => {
                  setAudioPlayback('Not Playing');
                }}
                style={{
                  marginVertical: 5,
                  backgroundColor: '#4582c3',
                  borderRadius: 15,
                }}
                labelStyle={{
                  fontFamily: 'Roboto_400Regular',
                  color: 'white',
                }}
              >
                Loading Audio
              </Button>
            ) : (
              <Button
                icon="pause"
                loading={false}
                onPress={() => {
                  setAudioPlayback('Not Playing');
                  handlePlay();
                }}
                style={{
                  marginVertical: 5,
                  backgroundColor: '#4582c3',
                  borderRadius: 25,
                }}
                labelStyle={{
                  fontFamily: 'Roboto_400Regular',
                  color: 'white',
                }}
              >
                Playing Audio
              </Button>
            )}
          </Pressable>
          <View style={styles.timeContainer}>
            <Text style={styles.time}>{props.time}</Text>
            <Ionicons
              name="checkmark"
              size={14}
              style={{ marginRight: 3, color: 'grey' }}
            />
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            userState.id == item?.from?._id
              ? styles.shareMessage
              : styles.receiverShareMessage,
          ]}
          onPress={() =>
            navigation.navigate('MessageForwardCRM', {
              forwardFrom: userState?.id,
              forwardChat: 'chatId',
              forwardType: 'audio',
              forwardContent: item.content,
              socket: socket,
            })
          }
        >
          <View>
            <MaterialCommunityIcons
              name="share"
              size={22}
              style={{ color: 'white' }}
            />
          </View>
        </TouchableOpacity>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  senderTextMessageMainContainer: {
    flex: 1,
    flexDirection: 'row',
    alignContent: 'center',
    alignItems: 'center',
  },
  receiverTextMessageMainContainer: {
    flex: 1,
    flexDirection: 'row-reverse',
    alignContent: 'center',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  senderTextMessageContainer: {
    backgroundColor: Color.White,
    maxWidth: '80%',
    borderRadius: 15,
    marginVertical: 4,
    paddingHorizontal: 5,
  },
  receiverTextMessageContainer: {
    backgroundColor: Color.White,
    maxWidth: '80%',
    borderRadius: 15,
    paddingHorizontal: 5,
    marginVertical: 4,
  },
  main: {
    backgroundColor: 'white',
    width: Dimensions.get('screen').width * 0.5,
    borderLeftWidth: 4,
    borderColor: '#4582C3',
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
    paddingVertical: 3,
    paddingBottom: 5,
  },
  username: {
    marginLeft: 9,
    paddingVertical: 3,
    fontSize: 14,
    fontWeight: 'bold',
    fontFamily: 'Roboto',
    color: '#4582C3',
  },
  playerWrapper: {
    flexDirection: 'row',
    marginLeft: 9,
    alignContent: 'center',
    alignItems: 'center',
  },

  timeContainer: {
    flexDirection: 'row',
    alignSelf: 'flex-end',
    marginVertical: '1%',
  },
  time: {
    fontSize: 12,
    color: Color.Grey,
    fontFamily: 'Roboto',
    marginLeft: '10%',
  },
  shareMessage: {
    // position: "absolute",
    // right: Width * 0.62,
    // bottom: -15,
    backgroundColor: '#CFCFCF',
    marginLeft: 9,
    borderRadius: 50,
    padding: 3,
    marginHorizontal: Width * 0.018,
  },
  receiverShareMessage: {
    backgroundColor: '#CFCFCF',
    marginLeft: 9,
    borderRadius: 50,
    padding: 3,
    marginHorizontal: Width * 0.018,
  },
  senderName: {
    fontFamily: 'Roboto_500Medium',
    fontSize: Height * 0.017,
    color: Color.Blue,
    paddingHorizontal: Width * 0.02,
    paddingVertical: Height * 0.003,
  },
});
