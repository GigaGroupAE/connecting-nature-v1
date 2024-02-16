import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import { BASE_URL } from '../../../CONSTANTS.js';
import Color from '../../../assets/colors/Color.js';
import { useStateContext } from '../../contexts/ContextProvider.js';
import * as Location from 'expo-location';

import Header from '../../components/Header.js';
import InputText from '../../components/InputText.js';
import ButtonMain from '../../components/ButtonMain.js';
import { useUserStateActions } from '../../slices/userSlice.js';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import CustomStatsBar from '../../components/CustomStatsBar.js';

const Height = Dimensions.get('screen').height;
const Width = Dimensions.get('screen').width;

const SignIn = () => {
  const navigation = useNavigation();
  const [phoneNumber, setPhoneNumber] = useState('');
  // state context
  const { loading, setLoading, showSnackbar } = useStateContext();
  const userActions = useUserStateActions();
  const [location, setLocation] = useState(null);

  const onHandleClick = () => {
    // if (phoneNumber.length !== 11) {
    //   showSnackbar('Phone number should be 11 digits');
    //   return;
    // }

    if (loading) return;

    setLoading(true);

    axios
      .post(`${BASE_URL}/user/login`, { phoneNumber })
      .then((res) => {
        if (res.data.status === undefined) {
          axios
            .post(`${BASE_URL}/user/otp`, { phoneNumber })
            .then((response) => {
              if (response.data.status === 200) {
                setLoading(false);
                navigation.navigate('OtpScreen', {
                  otp: response.data.message,
                  token: res.headers.auth_token,
                  user: res.data,
                  location: location,
                });
              }
            })
            .catch((e) => {
              setLoading(false);
              console.log(e);
            });
        } else {
          showSnackbar(res.data.message);
        }
      })
      .catch((err) => {
        setLoading(false);
      });
  };

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        showSnackbar('Permission to access location was denied');
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      setLocation(location.coords);
      userActions.setLocation(location?.coords);
    })();
  }, []);

  return (
    <SafeAreaProvider>
      <CustomStatsBar backgroundColor={Color.White} />
      <Header title="Sign In" />
      <View style={styles.container}>
        <Image
          style={styles.logo}
          source={require('../../../assets/loginIcon.png')}
        />
        <View style={styles.subHeaderTextContainer}>
          <Text style={styles.subHeaderText}>
            Connecting Nature is a mobile social media app that encourages users
            to plant trees and share pictures of nature.
          </Text>
        </View>
        <InputText
          title="Phone Number"
          onchange={setPhoneNumber}
          value={phoneNumber}
          keyboardType="number-pad"
        />
        <ButtonMain
          title="Sign In"
          callback={onHandleClick}
          disabled={loading}
        />
      </View>
      <View style={styles.createNewContainer}>
        <Text style={styles.createNewText}>Don't have an account?</Text>
        <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
          <Text style={styles.createNew}>Sign Up!</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaProvider>
  );
};
export default SignIn;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
  container: {
    backgroundColor: Color.White,
    alignContent: 'center',
    alignItems: 'center',
    height: Height,
  },
  logo: {
    marginTop: 18,
    marginBottom: 32,
    width: Width * 0.9,
    height: Height * 0.18,
    resizeMode: 'contain',
  },
  subHeaderTextContainer: {
    width: Width * 0.8,
    position: 'relative',
    alignItems: 'center',
    top: -20,
  },
  subHeaderText: {
    fontFamily: 'Roboto_400Regular',
    color: Color.Grey,
    fontSize: Height * 0.018,
    textAlign: 'center',
    lineHeight: 23,
  },
  createNewContainer: {
    flexDirection: 'row',
    alignSelf: 'center',
    position: 'absolute',
    bottom: '4%',
  },
  createNewText: {
    fontFamily: 'Roboto_400Regular',
    color: Color.Grey,
  },
  createNew: {
    fontFamily: 'Roboto_600SemiBold',
    fontSize: 14,
    color: Color.Blue,
    marginLeft: 8,
    textDecorationLine: 'underline',
  },
});
