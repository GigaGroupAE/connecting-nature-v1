import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native"
import React, { useCallback } from "react"
import { BASE_URL } from "../../../CONSTANTS"
import { useNavigation } from "@react-navigation/native"

const height = Dimensions.get("screen").height

const PostImage = (props) => {
  const navigation = useNavigation()

  const { post, imageStyle } = props

  const handleNavigation = () => {
    navigation.navigate("FullPostView", {
      url: `${BASE_URL}/images/${post?.media?.name}`,
      message: "",
      post: post,
      screen: "home",
    })
  }

  return (
    <TouchableOpacity key={post?._id} onPress={handleNavigation}>
      <Image
        style={imageStyle}
        source={{
          uri: `${BASE_URL}/images/${post?.media?.name}`,
        }}
      />
    </TouchableOpacity>
  )
}

export default PostImage

const styles = StyleSheet.create({})
