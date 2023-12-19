import React, { useEffect, useState } from "react"
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  TextInput,
  TouchableHighlight,
  Dimensions,
  Pressable,
} from "react-native"
//icons import
import { MaterialIcons, AntDesign } from "react-native-vector-icons"
import * as FileSystem from "expo-file-system"
import { manipulateAsync, SaveFormat } from "expo-image-manipulator"

//document picker
import * as DocumentPicker from "expo-document-picker"

import { useNavigation } from "@react-navigation/native"
import axios from "axios"
import { useUserState } from "./../../slices/userSlice"
import { BASE_URL } from "../../../CONSTANTS.js"
import { SafeAreaView } from "react-native-safe-area-context"
import Color from "../../../assets/colors/Color.js"

import { useStateContext } from "../../contexts/ContextProvider.js"
import PostTypeModal from "../../components/PostTypeModal"
import PostCampaignSelectModal from "../../components/PostCampaignSelectModal"
import { axiosInstance } from "../../../axiosInstance"

export default function NewPost(props) {
  //images
  const [image, setImage] = useState(null) // this will be an array that will hold the uri's of images to post
  const navigation = useNavigation()
  const userState = useUserState()
  const [description, setDescription] = useState("")
  const [data, setData] = useState(null)
  const [compressImg, setCompressImg] = useState(null)
  const [modalCampaign, setmodalCampaign] = useState(false)
  const [campaignsName, setcampaignsName] = useState("")
  const [campaign, setcampaign] = useState([])

  const [postType, setpostType] = useState(false)

  const { loading, setLoading, showSnackbar } = useStateContext()
  const handleonPost = async () => {
    setpostType(false)
    setmodalCampaign(false)
    if (!description) {
      showSnackbar("You can't share empty Post")
      return
    }
    navigation.goBack()

    //creating form data
    const formData = new FormData()

    formData.append("description", description)
    //since we cannot add object to formdata and userState is an object
    //so we will STRINGIFY the userState and parse it at the backend
    formData.append("postedby", JSON.stringify(userState.id))

    if (!image) {
      formData.append("media", null)
    } else {
      formData.append("media", {
        name: data.name, // phone number is added to make sure data doesn't duplicate at any cost
        uri: compressImg.uri,
        type: data.mimeType,
      })
    }
    const config = {
      headers: {
        "Content-Type": "multipart/form-data",
        Accept: "application/json",
        "auth-token": userState.token,
      },
    }
    //api call
    try {
      if (props.route.params.origin === "post") {
        const { data } = await axios.post(
          `${BASE_URL}/posts/addpost/`,
          formData,
          config
        )
        showSnackbar("Post created successfully")
        props?.route?.params?.reload()
      } else {
        if (image !== null) {
          const { data } = await axios.post(
            `${BASE_URL}/story/addstory/`,
            formData,
            config
          )
          props?.route?.params?.storyReload()

          showSnackbar("Story created successfully")
        } else {
          alert("Cannot create a story without an image")
        }
      }
    } catch (error) {
      console.log(error, "error is ")
    }
  }

  const supportedImageFormats = [
    "image/jpeg",
    "image/png",
    "image/gif",
    "image/bmp",
    "image/tiff",
  ]

  const pick = async () => {
    try {
      let result = await DocumentPicker.getDocumentAsync({})

      if (!result.cancelled) {
        let compressImage
        let manipResult

        if (supportedImageFormats.includes(result?.assets[0]?.mimeType)) {
          let compressionQuality = 0.8
          while (compressionQuality >= 0.1) {
            manipResult = await manipulateAsync(result.assets[0]?.uri, [], {
              compress: compressionQuality,
              format: SaveFormat.JPEG,
            })
            compressImage = await FileSystem.getInfoAsync(manipResult.uri)
            if (compressImage.size <= 1024 * 1024) {
              break
            }
            compressionQuality -= 0.1
          }
        } else {
          compressImage = result
        }
        setCompressImg(compressImage)
        setData(result.assets[0])
        setImage([result.assets[0].uri])
      }
    } catch (error) {
      console.log(error)
    } finally {
    }
  }

  const handlePostType = () => {
    if (campaign?.length === 0) {
      handleonPost()
    } else if (props.route.params.origin === "post") {
      setpostType(true)
    } else {
      handleonPost()
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosInstance.get(
          "/campaigns/get-multiple-by-query?status=executed"
        )

        setcampaignsName(response?.data?.campaigns)
      } catch (error) {
        console.log("Error:", error)
      }
    }

    fetchData()
  }, [])

  const handleCampaignPost = async (campaignId) => {
    setpostType(false)
    setmodalCampaign(false)
    if (!description) {
      showSnackbar("You can't share empty Post")
      return
    }
    navigation.goBack()

    //creating form data
    const formData = new FormData()

    formData.append("description", description)
    //since we cannot add object to formdata and userState is an object
    //so we will STRINGIFY the userState and parse it at the backend
    formData.append("postedby", JSON.stringify(userState.id))
    formData.append("ref", campaignId)
    if (!image) {
      formData.append("media", null)
    } else {
      formData.append("media", {
        name: data.name, // phone number is added to make sure data doesn't duplicate at any cost
        uri: compressImg.uri,
        type: data.mimeType,
      })
    }
    const config = {
      headers: {
        "Content-Type": "multipart/form-data",
        Accept: "application/json",
        "auth-token": userState.token,
      },
    }

    //api call
    try {
      const { data } = await axios.post(
        `${BASE_URL}/posts/addpost/`,
        formData,
        config
      )

      showSnackbar("Post created successfully")
      props?.route?.params?.reload()
    } catch (error) {
      console.log(error, "error is ")
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosInstance.get(
          "/campaigns/mostrecentcampaign"
        )

        if (response?.data?.campaigns) {
          setcampaign(response?.data?.campaigns)
        }
      } catch (error) {
        console.log("Error:", error)
      }
    }

    fetchData()
  }, [])
  return (
    <SafeAreaView style={{ backgroundColor: Color.LightBlue }}>
      <View style={styles.mainContainer}>
        <View style={styles.head}>
          <TouchableOpacity
            onPress={() => {
              navigation.goBack()
            }}
          >
            <AntDesign name="arrowleft" size={28} color="#707070" />
          </TouchableOpacity>
          <Text style={styles.storyButton}>
            {props.route.params.origin === "story"
              ? "Create Story"
              : "Create Post"}
          </Text>
          <Pressable
            onPress={handlePostType}
            disabled={loading}
            style={
              description
                ? styles.postButtonContainer
                : styles.disabledPostButtonContainer
            }
          >
            <Text
              style={
                description
                  ? styles.postButtonText
                  : styles.disabledPostButtonText
              }
            >
              Post
            </Text>
          </Pressable>
        </View>
        <View style={styles.postContent}>
          <Image
            style={styles.headerAvatar}
            source={{ uri: `${BASE_URL}/images/${userState.profile}` }}
          />
          <TextInput
            style={styles.inputField}
            placeholder="What's Happening?"
            value={description}
            onChangeText={(e) => setDescription(e)}
            multiline
            numberOfLines={15}
            textAlignVertical="top"
          />
        </View>
        <View style={styles.selectedImagesContainer}>
          {/* SELECT IMAGE ICON */}
          <View
            style={[
              styles.selectedImages,
              {
                backgroundColor: "#F5F5F5",
                alignItems: "center",
                justifyContent: "center",
              },
            ]}
          >
            <TouchableHighlight underlayColor="rgba(0,0,0,0)" onPress={pick}>
              <MaterialIcons name="camera-alt" color={Color.Grey} size={40} />
            </TouchableHighlight>
          </View>
          {/* RENDER THE IMAGES HERE  */}
          {image &&
            image.map((uri, idx) => (
              <Image
                key={idx}
                style={styles.selectedImages}
                resizeMode="cover"
                source={{ uri }}
              ></Image>
            ))}

          <PostTypeModal
            modalVisible={postType}
            setModalVisible={setpostType}
            handlepost={handleonPost}
            setmodalCampaign={setmodalCampaign}
          />

          <PostCampaignSelectModal
            modalVisible={modalCampaign}
            setModalVisible={setmodalCampaign}
            data={campaignsName}
            handlepost={handleCampaignPost}
          />
        </View>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  mainContainer: {
    width: "100%",
    height: "100%",
    backgroundColor: "#fff",
    paddingHorizontal: 19,
    paddingVertical: 10,
  },
  storyButton: {
    marginRight: "30%",
    bottom: -2,
    fontFamily: "Roboto_600SemiBold",
    color: Color.Grey,
    fontSize: 18,
  },
  postButtonContainer: {
    backgroundColor: Color.Blue,
    width: 80,
    borderRadius: 6,
    alignItems: "center",
    marginRight: "3%",
  },
  disabledPostButtonContainer: {
    backgroundColor: Color.VeryLightGrey,
    width: 80,
    borderRadius: 6,
    alignItems: "center",
    marginRight: "3%",
  },
  postButtonText: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    alignSelf: "center",
    color: Color.White,
    fontFamily: "Roboto_500Medium",
    fontSize: Dimensions.get("screen").height * 0.02,
  },
  disabledPostButtonText: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    alignSelf: "center",
    color: Color.Grey,
    fontFamily: "Roboto_500Medium",
    fontSize: Dimensions.get("screen").height * 0.02,
  },
  head: {
    marginTop: "2%",
    alignContent: "center",
    alignItems: "center",
    justifyContent: "space-between",
    flexDirection: "row",
  },
  headerAvatar: {
    marginTop: 40,
    alignSelf: "flex-start",
    borderRadius: 100,
    width: Dimensions.get("screen").height * 0.08,
    height: Dimensions.get("screen").height * 0.08,
    backgroundColor: Color.VeryLightGrey,
  },
  postContent: {
    flexDirection: "row",
    alignContent: "center",
    alignItems: "center",
  },
  inputField: {
    marginTop: 40,
    alignSelf: "flex-start",
    paddingTop: 20,
    paddingHorizontal: 10,
    width: "80%",
    maxHeight: "65%",
    fontSize: 14,
    fontFamily: "Roboto_400Regular",
    color: Color.Grey,
  },
  selectedImagesContainer: {
    flex: 1,
    position: "absolute",
    bottom: 19,
    left: 9,
    flexDirection: "row",
    flexWrap: "wrap",
  },
  selectedImages: {
    width: Dimensions.get("screen").height * 0.14,
    height: Dimensions.get("screen").height * 0.14,
    borderRadius: 8,
    marginLeft: 10,
  },
})
