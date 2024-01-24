import React from "react"
import { View, Text, StyleSheet } from "react-native"
import { FontAwesome, Ionicons, MaterialIcons } from "react-native-vector-icons"
import { calculateTimeDifference } from "../utils/timeDifference"
import Color from "../../assets/colors/Color"

const MessagePreview = ({ item }) => {
  const { messages } = item
  const latestMessage =
    messages?.length > 0 ? messages[messages.length - 1] : null

  const getMessageDetails = () => {
    if (!latestMessage) return { messagePreview: "", messageType: "" }

    const timePassed = calculateTimeDifference(latestMessage.createdAt)
    let messagePreview = ""
    let messageType = ""

    switch (latestMessage.type) {
      case "text":
        messagePreview = latestMessage.content.replace(/[\r\n]+/g, " ")
        messagePreview =
          messagePreview.length > 40
            ? messagePreview.slice(0, 38) + "..."
            : messagePreview
        messageType = ""
        break
      case "video":
        messageType = "Video"
        break
      case "image":
        messageType = "Photo"
        break
      case "document":
        messageType = "Document"
        break
      case "audio":
        messageType = "Voice"
        break
      default:
        break
    }

    return { timePassed, messagePreview, messageType }
  }

  const { messagePreview, messageType } = getMessageDetails()

  const renderIcon = (iconName) => {
    switch (iconName) {
      case "video":
        return <FontAwesome name="video-camera" style={styles.icon} />
      case "photo":
        return <FontAwesome name={iconName} style={styles.icon} />
      case "document":
        return <Ionicons name={iconName} style={styles.icon} />
      case "voice":
        return <MaterialIcons name="keyboard-voice" style={styles.icon} />
      default:
        return null
    }
  }

  return (
    <View>
      {messageType === "" && (
        <Text style={styles.msgText}>{messagePreview}</Text>
      )}
      {messageType && (
        <View style={styles.messageType}>
          {renderIcon(messageType.toLowerCase())}
          <Text style={{ ...styles.msgText, marginLeft: 6 }}>
            {messageType}
          </Text>
        </View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  msgText: {
    fontFamily: "Roboto_400Regular",
    fontSize: 12,
    lineHeight: 22,
    color: Color.Black,
    marginLeft: 11,
  },
  icon: {
    fontSize: 14,
    color: Color.Grey,
  },
  messageType: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 11,
  },
})

export default MessagePreview
