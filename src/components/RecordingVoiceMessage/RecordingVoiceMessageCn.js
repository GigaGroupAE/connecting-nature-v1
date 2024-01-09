import React, { useState, useEffect } from "react"
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Dimensions,
  Pressable,
} from "react-native"
import { MaterialCommunityIcons } from "react-native-vector-icons"
import { BASE_URL } from "../../../CONSTANTS"
import { Audio } from "expo-av"
import { Appbar, Button, FAB } from "react-native-paper"
import { useUserState } from "../../slices/userSlice"
import Color from "../../../assets/colors/Color"
import { useNavigation } from "@react-navigation/native"
import { calculateTimeDifference } from "../../utils/timeDifference"

const Width = Dimensions.get("screen").width

export default function RecordingVoiceMessageCn(props) {
  const userState = useUserState()
  const navigation = useNavigation()
  const { socket, item } = props

  let timePassed = calculateTimeDifference(item.date)

  const [audioPlayback, setAudioPlayback] = React.useState("Not Playing")
  const [sound, setSound] = useState(null)
  const [isPlaying, setIsPlaying] = useState(false)

  const playSound = async () => {
    try {
      setAudioPlayback("Loading")
      const { sound } = await Audio.Sound.createAsync({
        uri: `${BASE_URL}/messageMedia/${item.content}`,
      })
      setSound(sound)
      await sound.playAsync().then(() => {
        setAudioPlayback("Playing")
        setIsPlaying(true)
      })
      sound.setOnPlaybackStatusUpdate((playbackStatus) => {
        if (playbackStatus.didJustFinish && !playbackStatus.isLooping) {
          setAudioPlayback("Not Playing")
          setIsPlaying(false)
        }
      })
    } catch (error) {
      console.log("Error playing sound", error)
    }
  }
  const handlePlay = async () => {
    try {
      if (sound) {
        if (isPlaying) {
          await sound.pauseAsync()
          setIsPlaying(false)
        } else {
          await sound.playAsync()
          setIsPlaying(true)
        }
      }
    } catch (error) {
      console.log("Error playing sound", error)
    }
  }

  useEffect(() => {
    return sound
      ? () => {
          setAudioPlayback("Not Playing")
          setIsPlaying(false)
        }
      : undefined
  }, [sound])

  return (
    <View>
      <Pressable
        style={[
          userState.id === item?.from
            ? styles.receiverTextMessageMainContainer
            : styles.senderTextMessageMainContainer,
        ]}
        onLongPress={() => props?.    longPress(item._id,item?.from)}

      >
        <Pressable
          style={[
            userState.id === item?.from
              ? styles.receiverTextMessageContainer
              : styles.senderTextMessageContainer,
          ]}
          android_ripple={{ foreground: true, color: Color.LightGrey }}
          onLongPress={() => props?.    longPress(item._id,item?.from)}

        >
          <View>
            {audioPlayback === "Not Playing" ? (
              <Button
                icon={"play"}
                loading={false}
                onPress={() => {
                  setAudioPlayback("Playing")
                  playSound()
                }}
                style={[
                  userState.id === item?.from
                    ? styles.receiverPlayerContainer
                    : styles.senderPlayerContainer,
                ]}
                labelStyle={{
                  fontFamily: "Roboto_400Regular",
                  color: "white",
                }}
              >
                Play Audio
              </Button>
            ) : audioPlayback === "Loading" ? (
              <Button
                icon={"play"}
                loading={true}
                onPress={() => {
                  setAudioPlayback("Not Playing")
                }}
                style={{
                  marginVertical: 5,
                  backgroundColor: "#4582c3",
                  borderRadius: 15,
                }}
                labelStyle={{
                  fontFamily: "Roboto_400Regular",
                  color: "white",
                }}
              >
                Loading Audio
              </Button>
            ) : (
              <Button
                icon={"pause"}
                loading={false}
                onPress={() => {
                  setAudioPlayback("Not Playing")
                  handlePlay()
                }}
                style={{
                  marginVertical: 5,
                  backgroundColor: "#4582c3",
                  borderRadius: 25,
                }}
                labelStyle={{
                  fontFamily: "Roboto_400Regular",
                  color: "white",
                }}
              >
                Playing Audio
              </Button>
            )}
          </View>
        </Pressable>
        <TouchableOpacity
          onPress={() =>
            navigation.navigate("MsgShare", {
              forwardFrom: userState?.id,
              forwardChat: "chatId",
              forwardType: "audio",
              forwardContent: item.content,
              socket: socket,
            })
          }
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
        </TouchableOpacity>
      </Pressable>
    </View>
  )
}

const styles = StyleSheet.create({
  senderTextMessageMainContainer: {
    flex: 1,
    flexDirection: "row",
    alignContent: "center",
    alignItems: "center",
  },
  receiverTextMessageMainContainer: {
    flex: 1,
    flexDirection: "row",
    alignContent: "center",
    alignItems: "center",
    justifyContent: "flex-end",
  },
  senderTextMessageContainer: {
    backgroundColor: Color.White,
    maxWidth: "80%",
    borderRadius: 15,
    marginVertical: 4,
    paddingHorizontal: 5,
  },
  receiverTextMessageContainer: {
    backgroundColor: Color.White,
    maxWidth: "80%",
    borderRadius: 15,
    paddingHorizontal: 5,
    marginVertical: 4,
  },
  main: {
    backgroundColor: "white",
    width: Dimensions.get("screen").width * 0.5,
    borderLeftWidth: 4,
    borderColor: "#4582C3",
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
    paddingVertical: 3,
    paddingBottom: 5,
  },
  username: {
    marginLeft: 9,
    paddingVertical: 3,
    fontSize: 14,
    fontWeight: "bold",
    fontFamily: "Roboto",
    color: "#4582C3",
  },
  playerWrapper: {
    flexDirection: "row",
    marginLeft: 9,
    alignContent: "center",
    alignItems: "center",
  },

  timeContainer: {
    flexDirection: "row",
    alignSelf: "flex-end",
    marginVertical: "1%",
  },
  time: {
    fontSize: 12,
    color: Color.Grey,
    fontFamily: "Roboto",
    marginLeft: "10%",
  },
  shareMessage: {
    position: "absolute",
    right: 200,
    // bottom: -15,
    backgroundColor: "#CFCFCF",
    marginLeft: 9,
    borderRadius: 50,
    padding: 3,
  },
  receiverShareMessage: {
    position: "absolute",
    backgroundColor: "#CFCFCF",
    marginLeft: 9,
    borderRadius: 50,
    padding: 3,
    left: Width * 0.52,
  },
  receiverPlayerContainer: {
    marginVertical: 5,
    paddingHorizontal: 20,
    backgroundColor: Color.Blue,
    borderRadius: 15,
  },
  senderPlayerContainer: {
    marginVertical: 5,
    paddingHorizontal: 20,
    backgroundColor: Color.Blue,
    borderRadius: 15,
  },
})
