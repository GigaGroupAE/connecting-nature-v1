import {
  StyleSheet,
  View,
  ToastAndroid,
  TouchableHighlight,
  Dimensions,
  TouchableOpacity,
  Text,
  Alert,
  KeyboardAvoidingView,
  Modal,
  // Pressable,
  // FlatList,
} from 'react-native';
import Header from '../../components/Header.js';
import InputText from '../../components/InputText.js';
import ButtonMain from '../../components/ButtonMain.js';
import * as ImagePicker from 'expo-image-picker';
import { Avatar, Checkbox } from 'react-native-paper';
import { useState, useEffect } from 'react';
import RadioButton from '../../components/RadioButton.js';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import { useStateContext } from '../../contexts/ContextProvider.js';

//location package
import * as Location from 'expo-location';

//BASE ADDRESS IMPORT
import { BASE_URL } from '../../../CONSTANTS.js';
import Color from '../../../assets/colors/Color.js';

import TermsCondition from './TermsCondition.jsx';
import AcceptPolicy from './AcceptPolicy.jsx';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import CustomStatsBar from '../../components/CustomStatsBar.js';
import { MaterialCommunityIcons } from 'react-native-vector-icons';
// import { scale } from 'react-native-size-matters';
// import { inputstyle } from '../Decorations/ModalStyle.js';
import { screenHeight, screenWidth } from '../../utils/ScreenDimensions.js';
// import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';

const Height = Dimensions.get('screen').height;

const data = [
  {
    id: 1,
    title: 'Admin',
  },
  {
    id: 2,
    title: 'Channel Subscriber',
  },
];

export default function CompleteProfile() {
  const { setLoading, showSnackbar } = useStateContext();
  const [name, setName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [gender, setGender] = useState(null);
  const [image, setimage] = useState(null);
  const [agree, setAgree] = useState(false);
  const [accept, setAccept] = useState(false);
  const [modalTerms, setmodalTerms] = useState(false);
  const [modalPolicy, setmodalPolicy] = useState(false);
  const [isPremium, setiPremium] = useState(false);

  const onChangePhone = (props) => {
    setPhoneNumber(props);
  };
  const onChangeName = (props) => {
    setName(props);
  };
  const optionSelected = (props) => {
    setGender(props);
  };

  const [galleryPermission, setGalleryPermission] = useState(null);
  const [imageUri, setImageUri] = useState(null);

  const setToastMsg = (msg) => {
    ToastAndroid.showWithGravity(msg, ToastAndroid.SHORT, ToastAndroid.CENTER);
  };

  const permisionFunction = async () => {
    const imagePermission = await ImagePicker.getMediaLibraryPermissionsAsync();

    setGalleryPermission(imagePermission.status === 'granted');

    if (imagePermission.status !== 'granted') {
      setToastMsg('Permission for media access needed.');
    }
  };

  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  const locationPermission = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();

    if (status !== 'granted') {
      setErrorMsg('Permission to access location was denied');
      return;
    }
    try {
      const location = await Location.getCurrentPositionAsync({});
      setLocation(location);
    } catch (error) {
      setErrorMsg('Failed to get location. Please try again later.');
    }
  };
  useEffect(() => {
    permisionFunction();
    locationPermission();
  }, []);
  const pick = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!result.cancelled) {
      setImageUri(result.uri);
      setimage(result);
    }
  };
  const navigation = useNavigation();

  const handleClick = async () => {
    // if (phoneNumber.length !== 11) {
    //   Alert.alert('Error', 'Phone number must be of 11 digits');
    //   return;
    // }

    if (name.length <= 0) {
      Alert.alert('Error', 'Name not provided');
      return;
    }

    if (!gender) {
      Alert.alert('Error', 'Please select a gender');
      return;
    }

    if (!agree) {
      Alert.alert('Error', 'Please accept terms and conditions');
      return;
    }

    if (!accept) {
      Alert.alert('Error', 'Please accept privacy policy');
      return;
    }

    const formData = new FormData();

    if (image !== null) {
      const { uri } = image;
      formData.append('profile', {
        name: `${phoneNumber}.jpg`,
        uri,
        type: 'image/jpg',
      });
    }

    const tempLocation = {
      latitude: location?.coords?.latitude,
      longitude: location?.coords?.longitude,
    };

    formData.append('fullName', name);
    formData.append('phoneNumber', phoneNumber);
    formData.append('type', 'user');
    formData.append('location', JSON.stringify(tempLocation));
    formData.append('gender', gender);

    const config = {
      headers: {
        'Content-Type': 'multipart/form-data',
        Accept: 'application/json',
      },
    };

    try {
      setLoading(true);

      const { data, headers } = await axios.post(
        `${BASE_URL}/user/register`,
        formData,
        config,
      );

      setLoading(false);

      if (data) {
        showSnackbar('Account Created Successfully');
        axios
          .post(`${BASE_URL}/user/otp`, { phoneNumber })
          .then((response) => {
            if (response.data.status === 200) {
              setLoading(false);
              navigation.navigate('OtpScreen', {
                otp: response.data.message,
                token: headers.auth_token,
                user: data,
                phoneNumber: phoneNumber,
                isPremium: isPremium,
              });
            }
          })
          .catch((err) => {});
      }
    } catch (error) {
      setLoading(false);
      if (error?.response?.data?.message) {
        showSnackbar(error?.response?.data?.message);
      } else {
        showSnackbar('Error! Please try again later');
        setLoading(false);
      }
      setLoading(false);
    }
  };
  return (
    <SafeAreaProvider>
      <CustomStatsBar backgroundColor={Color.White} />
      <Header title="Sign Up" />
      <KeyboardAvoidingView>
        <Modal
          animationType="slide"
          transparent
          visible={modalTerms}
          onRequestClose={() => {
            setmodalTerms(!modalTerms);
          }}
        >
          <View
            style={{
              position: 'absolute',
              width: '100%',
              height: '100%',
              backgroundColor: Color.White,
              zIndex: 100,
            }}
          >
            <TermsCondition setmodalTerms={setmodalTerms} />
          </View>
        </Modal>

        <Modal
          animationType="slide"
          transparent
          visible={modalPolicy}
          onRequestClose={() => {
            setmodalPolicy(!modalPolicy);
          }}
        >
          <View
            style={{
              position: 'absolute',
              width: '100%',
              height: '100%',
              backgroundColor: Color.White,
              zIndex: 100,
            }}
          >
            <AcceptPolicy setmodalPolicy={setmodalPolicy} />
          </View>
        </Modal>

        <View style={styles.container}>
          <View style={styles.profileImage}>
            <TouchableHighlight onPress={pick} underlayColor="rgba(0,0,0,0)">
              {imageUri ? (
                <Avatar.Image
                  size={150}
                  source={{
                    uri: imageUri,
                  }}
                />
              ) : (
                <Avatar.Image
                  size={150}
                  source={require('../../../assets/avatar-placeholder.png')}
                />
              )}
            </TouchableHighlight>
          </View>

          <InputText
            title="Phone Number (e.g. 03XXXXXXXXX)"
            onchange={onChangePhone}
            keyboardType="number-pad"
            value={phoneNumber}
          />
          <InputText title="Full Name" onchange={onChangeName} value={name} />
          <RadioButton
            option1="Male"
            option2="Female"
            onselect={optionSelected}
          />

          <View style={styles.CheckboxContainer}>
            <View style={styles.checkBox}>
              {/* <Checkbox
                status={accept ? 'checked' : 'unchecked'}
                onPress={() => {
                  setAccept(!accept);
                }}
                color="#007BFF"
                uncheckedColor={Color.Black}
              /> */}
              <TouchableOpacity
                style={styles.checkBox}
                onPress={() => {
                  setiPremium(!isPremium);
                }}
              >
                {isPremium ? (
                  <MaterialCommunityIcons
                    name="checkbox-marked"
                    style={styles.checkBoxIcon}
                    color={Color.Blue}
                  />
                ) : (
                  <MaterialCommunityIcons
                    name="checkbox-blank-outline"
                    style={styles.checkBoxIcon}
                  />
                )}
              </TouchableOpacity>
              <Text
                style={styles.terms}
                accessibilityLabel="Premium (optional)"
              >
                Premium (optional)
              </Text>
            </View>

            <View style={styles.checkBox}>
              <TouchableOpacity
                style={styles.checkBox}
                onPress={() => {
                  setAgree(!agree);
                }}
              >
                {agree ? (
                  <MaterialCommunityIcons
                    name="checkbox-marked"
                    style={styles.checkBoxIcon}
                    color={Color.Blue}
                  />
                ) : (
                  <MaterialCommunityIcons
                    name="checkbox-blank-outline"
                    style={styles.checkBoxIcon}
                  />
                )}
              </TouchableOpacity>
              <Text style={styles.terms}>
                I agree to the Terms and Conditions
              </Text>
              <TouchableOpacity onPress={() => setmodalTerms(true)}>
                <Text style={styles.learn}> Learn More</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.checkBox}>
              <TouchableOpacity
                style={styles.checkBox}
                onPress={() => {
                  setAccept(!accept);
                }}
              >
                {accept ? (
                  <MaterialCommunityIcons
                    name="checkbox-marked"
                    style={styles.checkBoxIcon}
                    color={Color.Blue}
                  />
                ) : (
                  <MaterialCommunityIcons
                    name="checkbox-blank-outline"
                    style={styles.checkBoxIcon}
                  />
                )}
              </TouchableOpacity>
              <Text style={styles.terms}>I accept the Privacy Policy</Text>
              <TouchableOpacity onPress={() => setmodalPolicy(true)}>
                <Text style={styles.learn}> Learn More</Text>
              </TouchableOpacity>
            </View>
          </View>
          <ButtonMain title="Get OTP" callback={handleClick} />

          <View style={styles.createNewContainer}>
            <Text
              style={{ fontFamily: 'Roboto_400Regular', color: Color.Grey }}
            >
              Already have an account?
            </Text>
            <TouchableOpacity
              onPress={() => {
                navigation.goBack();
              }}
            >
              <Text style={styles.createNew}>Sign In!</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Color.White,
    width: Dimensions.get('screen').width,
    height: Dimensions.get('screen').height,
    alignContent: 'center',
    alignItems: 'center',
  },
  profileImage: {
    marginBottom: 40,
    marginTop: 14,
    width: 120,
    height: 120,
    backgroundColor: '#EAEAEA',
    borderRadius: 100,
    alignItems: 'center',
  },
  innerContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 100,
  },
  createNew: {
    fontFamily: 'Roboto_600SemiBold',
    fontSize: 14,
    color: Color.Blue,
    marginLeft: 8,
    textDecorationLine: 'underline',
  },
  createNewContainer: {
    flexDirection: 'row',
    alignSelf: 'center',
    position: 'absolute',
    bottom: Height * 0.14,
  },
  terms: {
    fontFamily: 'Roboto_400Regular',
    color: Color.Grey,
    fontSize: Height * 0.016,
  },
  learn: {
    fontFamily: 'Roboto_600SemiBold',
    fontSize: Height * 0.016,
  },
  CheckboxContainer: {
    width: '90%',
    marginTop: Height * 0.03,
  },
  checkBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  groupContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  designModalContainer: {
    backgroundColor: Color.White,
    width: screenWidth * 0.84,
    maxHeight: screenHeight * 0.4,
    marginTop: '3%',
    borderColor: Color.LightGrey,
    borderWidth: 1,
    borderRadius: screenHeight * 0.01,
    paddingHorizontal: '3%',
    paddingVertical: '2%',
  },
  checkBoxIcon: {
    // backgroundColor: 'red',
    paddingLeft: screenWidth * 0.03,
    fontSize: screenHeight * 0.025,
    paddingVertical: screenHeight * 0.0035,
  },
});
