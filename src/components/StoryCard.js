import {
  View,
  Dimensions,
  Image,
  TouchableOpacity,
  Modal,
  Text,
  StyleSheet,
} from "react-native"
import React, { useState, useEffect } from "react"
import { BASE_URL } from "../../CONSTANTS"
import Color from "../../assets/colors/Color"
import { ProgressBar } from "react-native-paper"
import { useNavigation } from "@react-navigation/native"
import GradientBottomImage from "./GradientBottomImage"
import { useStateContext } from "../contexts/ContextProvider"

const Height = Dimensions.get("screen").height
const Width = Dimensions.get("screen").width
export default function StoryCard(props) {
  const [visible, setvisible] = useState(false)
  const [time, settime] = useState(0)

  const { setSelectedStory } = useStateContext()
  const navigation = useNavigation()

  const handleNavigation = (selectedStory) => {
    navigation.navigate("StoryComment")
    setSelectedStory(selectedStory)
  }
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => handleNavigation(props.story)}>
        <View style={styles.card}>
          <GradientBottomImage
            style={{
              height: Dimensions.get("screen").height * 0.17,
              width: Dimensions.get("screen").width * 0.8,
            }}
            source={{
              uri: `${BASE_URL}/images/${props.story.media.name}`,
            }}
            story={props.story}
          />

          <View style={styles.userContainer}>
            {props.story.media?.type === "image/jpeg" ||
            props.story.media?.type === "image/png" ||
            props.story.media?.type === "image/jpg" ||
            props.story.media?.type === "video/mp4" ? (
              <View>
                <TouchableOpacity key={props.index}>
                  <Image
                    source={{
                      uri: `${BASE_URL}/images/${props.story.postedby.profile}`,
                    }}
                    style={styles.userProfileImage}
                  />
                </TouchableOpacity>
              </View>
            ) : null}

            <Text style={styles.userFullName}>
              {props.story.postedby.fullName}
            </Text>
          </View>
        </View>
        <Modal animationType="slide" visible={visible}>
          <TouchableOpacity
            onPress={() => {
              setvisible(false)
            }}
          >
            <View>
              <Image
                style={styles.storyImage}
                source={{
                  uri: `${BASE_URL}/images/${props.story.media.name}`,
                }}
              />
              <ProgressBar progress={time} style={{ color: Color.Blue }} />
            </View>
          </TouchableOpacity>
        </Modal>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    height: "95%",
    borderBottomColor: Color.LightGrey,
    borderBottomWidth: 0.5,
  },
  card: {
    marginHorizontal: Width * 0.02,
    backgroundColor: Color.White,
    marginBottom: Height * 0.02,
    borderRadius: 8,
    shadowColor: Color.Grey,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.27,
    shadowRadius: 2.65,
    elevation: 4,
  },
  userContainer: {
    position: "absolute",
    top: Height * 0.12,
    left: 12,
    flexDirection: "row",
    alignItems: "center",
  },
  userProfileImage: {
    height: 30,
    width: 30,
    borderRadius: 15,
  },
  userFullName: { color: Color.White, marginLeft: 10 },
  storyImage: {
    marginTop: Height * 0.08,
    height: Height * 0.8,
    width: Width,
  },
})
