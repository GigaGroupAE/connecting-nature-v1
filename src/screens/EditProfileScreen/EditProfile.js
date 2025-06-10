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
    try {
      // const result = await DocumentPicker.getDocumentAsync({});
      const result = await ImagePicker.launchImageLibraryAsync({
        quality: 0.8,
        mediaTypes: 'All',
      });
      if (!result.canceled) {
        setImageUri(result.assets[0].uri);
        setimage(result.assets[0]);
      }
    } catch {
    } finally {
    }
  };

  const handlesubmit = async () => {
    try {
      setLoading(true);

      const formData = new FormData();

      // Append changes (assuming 'changes' is an object or value you want to send)
      formData.append('fullName', changes);

      if (image) {
        // Append image data
        formData.append('profile', {
          name: `${userState.phoneNumber}.jpg`,
          uri: image.uri,
          type: 'image/jpg',
        });
      }

      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
          Accept: 'application/json',
        },
      };

      const response = await axios.patch(
        `${BASE_URL}/user/updateUser/${userState.id}`,
        formData,
        config,
      );

      // Assuming userToken is available and set elsewhere
      userStateActions.setUser(response.data);
      userStateActions.settoken(userToken);

      setLoading(false);
      navigation.goBack();
    } catch (error) {
      console.error('Error updating user:', error);
      setLoading(false);
      // You can also show a user-friendly error message here
    }
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
