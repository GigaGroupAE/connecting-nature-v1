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

const PostShare = () => {
  const userState = useUserState();
  const navigation = useNavigation();
  const route = useRoute();
  const { showSnackbar } = useStateContext();
  const [postType, setpostType] = useState(false);
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null); // this will be an array that will hold the uri's of images to post
  const imageUrl = route?.params?.post?.media?.name;
  const [loading, setloading] = useState(false);
  const [shares, setshares] = useState([...route?.params?.post?.shares]);
  const apiroute = `${BASE_URL}/posts/updateposts/${route?.params?.post?._id}`;

  const handleonPost = async () => {
    setloading(true);
    try {
      let tempshares = [...shares];
      tempshares.push(userState.id);
      const formData = new FormData();
      ['shares', 'comments', 'reactions'].forEach((e) =>
        formData.append(e, JSON.stringify([])),
      );
      formData.append('description', description);
      formData.append('postedby', JSON.stringify(userState.id));
      formData.append('sharedBy', route?.params?.post?._id);
      if (route?.params?.post.media) {
        formData.append('media', {
          name: route?.params?.post.media.name,
          uri: `${route?.params?.post?.media.name}`,
          type: route?.params?.post?.media.type,
        });
      } else {
        formData.append('media', null);
      }
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
          Accept: 'application/json',
          'auth-token': userState.token,
        },
      };
      const postResponse = await axios.post(
        `${BASE_URL}/posts/addpost`,
        formData,
        config,
      );
      //   if (userState.id !== props.post.postedby._id) {
      //     handleLocalNotification();
      //   }
      route?.params.reload();
      showSnackbar('The post has been shared');
      navigation.goBack();
      const patchResponse = await axios.patch(
        apiroute,
        { shares: tempshares },
        {
          headers: {
            'auth-token': userState.token,
          },
        },
      );
      setloading(false);
      setshares([...patchResponse.data.shares]);
    } catch (error) {
      console.log(error);
      showSnackbar(
        "Sorry, we couldn't share the post at the moment. Please try again later.",
      );
      setloading(false);
    }
  };
  return (
    <SafeAreaView style={{ backgroundColor: Color.LightBlue }}>
      <View style={styles.mainContainer}>
        <View style={styles.head}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
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
            style={styles.postButtonContainer}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator
                size={'small'}
                style={{ paddingVertical: scale(4) }}
              />
            ) : (
              <Text style={styles.postButtonText}>Post</Text>
            )}
          </Pressable>
        </View>
        <View style={styles.postContent}>
          <Image
            style={styles.headerAvatar}
            source={{ uri: `${userState.profile}` }}
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
          <Image
            style={styles.selectedImages}
            resizeMode="center"
            source={{ uri: `${imageUrl}` }}
          ></Image>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default PostShare;

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
