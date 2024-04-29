import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native"
import React from "react"
import { useNavigation } from "@react-navigation/native"
import { BASE_URL } from "../../CONSTANTS"

const height = Dimensions.get("screen").height

const StoryImage = ({ mediaDesciption, media, id, imageStyle }) => {
  const navigation = useNavigation()
  return (
    <TouchableOpacity
      key={id}
      onPress={() =>
        navigation.navigate("PostView", {
          url: `${BASE_URL}/images/${media}`,
          message: mediaDesciption,
        })
      }
    >
      <Image
        style={imageStyle}
        source={{
          uri: `${BASE_URL}/images/${media}`,
        }}
      />
    </TouchableOpacity>
  )
}

export default StoryImage

const styles = StyleSheet.create({})
