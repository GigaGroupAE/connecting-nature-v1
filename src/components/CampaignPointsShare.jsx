import {
  Dimensions,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  TextInput,
  Pressable,
  ActivityIndicator,
} from 'react-native';
import React, { useState } from 'react';
import { useUserState } from '../slices/userSlice';
import { useNavigation, useRoute } from '@react-navigation/native';
import Color from '../../assets/colors/Color';
import { AntDesign } from 'react-native-vector-icons';
import { BASE_URL } from '../../CONSTANTS';
import axios from 'axios';
import { useStateContext } from '../contexts/ContextProvider';
import { scale } from 'react-native-size-matters';

const CampaignPointsShare = () => {
  const userState = useUserState();
  const navigation = useNavigation();
  const route = useRoute();
  const { showSnackbar } = useStateContext();
  const [postType, setpostType] = useState(false);
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null); // this will be an array that will hold the uri's of images to post
  const imageUrl = route?.params;
  const [loading, setloading] = useState(false);
  // console.log(imageUrl);

  const handleonPost = async () => {
    if (!description) {
      showSnackbar("You can't share empty Post");
      return;
    }

    //creating form data
    const formData = new FormData();

    formData.append('description', description);
    //since we cannot add object to formdata and userState is an object
    //so we will STRINGIFY the userState and parse it at the backend
    formData.append('postedby', JSON.stringify(userState.id));
    formData.append('media', {
      name: imageUrl, // phone number is added to make sure data doesn't duplicate at any cost
      uri: imageUrl,
      type: 'image/jpeg',
    });

    const config = {
      headers: {
        'Content-Type': 'multipart/form-data',
        Accept: 'application/json',
        'auth-token': userState.token,
      },
    };
    //api call
    setloading(true);
    try {
      const { data } = await axios.post(
        `${BASE_URL}/posts/addpost/`,
        formData,
        config,
      );
      showSnackbar('Post created successfully');
      navigation.goBack();
      setloading(false);
    } catch (error) {
      console.log(error, 'error is ');
      setloading(false);
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
              marginRight: '30%',
              bottom: -2,
              fontFamily: 'Roboto_600SemiBold',
              color: Color.Grey,
              fontSize: 18,
            }}
          >
            Create Post
          </Text>
          <Pressable
            onPress={handleonPost}
            style={
              description
                ? styles.postButtonContainer
                : styles.disabledPostButtonContainer
            }
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator
                size={'small'}
                style={{ paddingVertical: scale(4) }}
              />
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

          {/* RENDER THE IMAGES HERE  */}

          <Image
            style={styles.selectedImages}
            resizeMode="center"
            source={{ uri: imageUrl }}
          ></Image>
        </View>
      </View>
    </View>
  );
};

export default CampaignPointsShare;

const styles = StyleSheet.create({
  mainContainer: {
    width: '100%',
    height: '100%',
    backgroundColor: '#fff',
    paddingHorizontal: 19,
    paddingVertical: 10,
  },
  postButtonContainer: {
    backgroundColor: Color.Blue,
    width: 80,
    borderRadius: 6,
    alignItems: 'center',
    marginRight: '3%',
  },
  disabledPostButtonContainer: {
    backgroundColor: Color.VeryLightGrey,
    width: 80,
    borderRadius: 6,
    alignItems: 'center',
    marginRight: '3%',
  },
  postButtonText: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    alignSelf: 'center',
    color: Color.White,
    fontFamily: 'Roboto_500Medium',
    fontSize: Dimensions.get('screen').height * 0.02,
  },
  disabledPostButtonText: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    alignSelf: 'center',
    color: Color.Grey,
    fontFamily: 'Roboto_500Medium',
    fontSize: Dimensions.get('screen').height * 0.02,
  },
  head: {
    marginTop: '2%',
    alignContent: 'center',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  headerAvatar: {
    marginTop: 40,
    alignSelf: 'flex-start',
    borderRadius: 100,
    width: Dimensions.get('screen').height * 0.08,
    height: Dimensions.get('screen').height * 0.08,
    backgroundColor: Color.VeryLightGrey,
  },
  postContent: {
    flexDirection: 'row',
    alignContent: 'center',
    alignItems: 'center',
  },
  inputField: {
    marginTop: 40,
    alignSelf: 'flex-start',
    paddingTop: 20,
    paddingHorizontal: 10,
    width: '80%',
    maxHeight: '65%',
    fontSize: 14,
    fontFamily: 'Roboto_400Regular',
    color: Color.Grey,
  },
  selectedImagesContainer: {
    flex: 1,
    position: 'absolute',
    bottom: 19,
    left: 9,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  selectedImages: {
    width: Dimensions.get('screen').height * 0.14,
    height: Dimensions.get('screen').height * 0.14,
    borderRadius: 8,
    marginLeft: 10,
  },
});
