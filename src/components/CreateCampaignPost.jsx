import React, { useEffect, useState } from "react";
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
  ActivityIndicator,
} from "react-native";
//icons import
import { MaterialIcons, AntDesign } from "react-native-vector-icons";
import * as FileSystem from "expo-file-system";
import { manipulateAsync, SaveFormat } from "expo-image-manipulator";

//document picker
import * as DocumentPicker from "expo-document-picker";
import { useNavigation, useRoute } from "@react-navigation/native";
import axios from "axios";
import { SafeAreaView } from "react-native-safe-area-context";
import { useUserState } from "../slices/userSlice";
import { useStateContext } from "../contexts/ContextProvider";
import { BASE_URL } from "../../CONSTANTS";
import Color from "../../assets/colors/Color";

export default function CreateCampaignPost() {
  //images
  const [image, setImage] = useState(null); // this will be an array that will hold the uri's of images to post
  const navigation = useNavigation();
  const userState = useUserState();
  const [description, setDescription] = useState("");
  const [data, setData] = useState(null);
  const [compressImg, setCompressImg] = useState(null);
  const { params } = useRoute();
  const [loading, setLoading] = useState();
  let hashTag = params?.title;
  hashTag = "#" + hashTag.split(" ").join("");
  const { showSnackbar, setcampaignPosts } = useStateContext();

  const fetchData = async () => {
    try {
      const res = await axios.get(
        `${BASE_URL}/posts/getPostByCampaign/${params?.id}`,
        {
          headers: {
            "auth-token": userState.token,
          },
        }
      );

      res?.data?.posts?.sort(
        (a, b) => new Date(b.createdAT) - new Date(a.createdAT)
      );
      setcampaignPosts(res?.data?.posts);
    } catch (error) {
      console.log(error);
    }
  };
  const handleCampaignPost = async () => {
    if (!description) {
      showSnackbar("You can't share empty Post");
      return;
    }
    setLoading(true);
    const formData = new FormData();
    formData.append("description", `${description}${hashTag}`);
    formData.append("postedby", JSON.stringify(userState.id));
    formData.append("ref", params?.id);
    if (!image) {
      formData.append("media", null);
    } else {
      formData.append("media", {
        name: data.name,
        uri: compressImg.uri,
        type: data.mimeType,
      });
    }
    const config = {
      headers: {
        "Content-Type": "multipart/form-data",
        Accept: "application/json",
        "auth-token": userState.token,
      },
    };
    //api call
    try {
      const { data } = await axios.post(
        `${BASE_URL}/posts/addpost/`,
        formData,
        config
      );
      showSnackbar("Post created successfully");
      fetchData();
      navigation.goBack();
      setLoading(false);
    } catch (error) {
      console.log(error, "error is ");
      setLoading(false);
    }
  };

  const supportedImageFormats = [
    "image/jpeg",
    "image/png",
    "image/gif",
    "image/bmp",
    "image/tiff",
  ];

  const pick = async () => {
    try {
      let result = await DocumentPicker.getDocumentAsync({});

      if (!result.cancelled) {
        let compressImage;
        let manipResult;

        if (supportedImageFormats.includes(result.mimeType)) {
          let compressionQuality = 0.8;
          while (compressionQuality >= 0.1) {
            manipResult = await manipulateAsync(result.uri, [], {
              compress: compressionQuality,
              format: SaveFormat.JPEG,
            });
            compressImage = await FileSystem.getInfoAsync(manipResult.uri);
            if (compressImage.size <= 1024 * 1024) {
              break;
            }
            compressionQuality -= 0.1;
          }
        } else {
          compressImage = result;
        }
        setCompressImg(compressImage);
        setData(result);
        setImage([result.uri]);
      }
    } catch (error) {
      console.log(error);
    } finally {
    }
  };
  return (
    <View style={{ backgroundColor: Color.LightBlue }}>
      <View style={styles.mainContainer}>
        <View style={styles.head}>
          <TouchableOpacity
            onPress={() => {
              navigation.goBack();
            }}
          >
            <AntDesign name="arrowleft" size={28} color="#707070" />
          </TouchableOpacity>
          <Text
            style={{
              marginRight: "30%",
              bottom: -2,
              fontFamily: "Roboto_600SemiBold",
              color: Color.Grey,
              fontSize: 18,
            }}
          >
            Create Post
          </Text>
          <Pressable
            onPress={handleCampaignPost}
            disabled={loading}
            style={
              description
                ? styles.postButtonContainer
                : styles.disabledPostButtonContainer
            }
          >
            {loading ? (
              <ActivityIndicator size="small" style={{ paddingVertical: 3 }} />
            ) : (
              <Text
                style={
                  description
                    ? styles.postButtonText
                    : styles.disabledPostButtonText
                }
              >
                Post
              </Text>
            )}
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
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    width: "100%",
    height: "100%",
    backgroundColor: "#fff",
    paddingHorizontal: 19,
    paddingVertical: 10,
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
});
