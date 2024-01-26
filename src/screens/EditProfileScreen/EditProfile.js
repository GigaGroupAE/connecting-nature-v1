import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Pressable,
} from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import HeaderNormal from '../../components/HeaderNormal';
import Color from '../../../assets/colors/Color';
import { BASE_URL } from '../../../CONSTANTS.js';
import InputText from '../../components/InputText';
import ButtonMain from '../../components/ButtonMain';
import axios from 'axios';
import { useUserStateActions, useUserState } from '../../slices/userSlice';
import { useStateContext } from '../../contexts/ContextProvider';
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';

import { SaveFormat, manipulateAsync } from 'expo-image-manipulator';
import CustomStatsBar from '../../components/CustomStatsBar';
const EditProfile = () => {
  const userState = useUserState();
  const navigation = useNavigation();

  const userStateActions = useUserStateActions();
  const [changes, setChanges] = useState(userState.fullName);
  const { setLoading } = useStateContext();
  const [image, setimage] = useState(null);
  const [userToken, setuserToken] = useState(userState.token);
  const [imageUri, setImageUri] = useState(
    `${BASE_URL}/images/${userState.profile}`,
  );
  const handleChanges = (props) => {
    setChanges(props);
  };

  // const supportedImageFormats = [
  //   'image/jpeg',
  //   'image/png',
  //   'image/gif',
  //   'image/bmp',
  //   'image/tiff',
  // ];

  const pick = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    let compressImage;
    let manipResult;
    if (!result.cancelled) {
      if ((result.type = 'image')) {
        manipResult = await manipulateAsync(result.uri, [], {
          compress: 0.3,
          format: SaveFormat.JPEG,
        });
        compressImage = await FileSystem.getInfoAsync(manipResult.uri);
      }
      setImageUri(compressImage.uri);
      setimage(compressImage);
    }
  };

  const handlesubmit = () => {
    const name = changes;
    const formData = new FormData();
    formData.append(changes);
    if (image !== null) {
      formData.append('profile', {
        name: `${userState.phoneNumber}.jpg`, // phone number is added to make sure data doesn't duplicate at any cost
        uri: image.uri,
        type: 'image/jpg',
      });
    }
    setLoading(true);

    axios
      .patch(`${BASE_URL}/user/updateUser/${userState.id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Accept: 'application/json',
        },
      })
      .then((res) => {
        userStateActions.setUser(res.data);
        userStateActions.settoken(userToken);
        setLoading(false);
        navigation.goBack();
      })
      .catch((e) => {
        setLoading(false);
      });
  };

  return (
    <SafeAreaProvider style={styles.container}>
      <CustomStatsBar backgroundColor={Color.White} />
      <HeaderNormal title="Edit Profile" />
      <View style={styles.mainContainer}>
        <Pressable onPress={pick}>
          <View style={styles.profileHead}>
            <Image style={styles.avatar} source={{ uri: imageUri }} />

            <View style={styles.userNameContainer}>
              <Text style={styles.userName}>{userState.fullName}</Text>
              <Text style={styles.userCategory}>{userState.type}</Text>
            </View>
          </View>
        </Pressable>
        <InputText
          value={changes}
          editable
          onchange={(val) => handleChanges(val)}
        />
        <TouchableOpacity style={{ alignSelf: 'center' }}>
          <ButtonMain title="Save Changes" callback={handlesubmit} />
        </TouchableOpacity>
      </View>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    paddingHorizontal: 19,
    backgroundColor: Color.White,
    height: Dimensions.get('screen').height,
  },
  profileHead: {
    paddingVertical: 15,
    alignItems: 'center',
  },
  avatar: {
    borderRadius: Dimensions.get('screen').height * 0.1,
    width: Dimensions.get('screen').height * 0.15,
    height: Dimensions.get('screen').height * 0.15,
    backgroundColor: Color.VeryLightGrey,
  },
  userName: {
    marginTop: 15,
    fontSize: 18,
    fontFamily: 'Roboto_600SemiBold',
    color: Color.Black,
    alignSelf: 'center',
  },
  userCategory: {
    alignSelf: 'center',
    fontSize: 14,
    fontFamily: 'Roboto_400Regular',
    color: Color.Blue,
  },
});

export default EditProfile;
