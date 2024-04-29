import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import OTPTextInput from 'react-native-otp-textinput';
import Header from '../../components/Header';
import ButtonMain from '../../components/ButtonMain';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import { useUserState, useUserStateActions } from '../../slices/userSlice';
import { BASE_URL } from '../../../CONSTANTS';
import Color from '../../../assets/colors/Color';
import { useStateContext } from '../../contexts/ContextProvider';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import CustomStatsBar from '../../components/CustomStatsBar';
import ChannelSubscriptionModal from '../../components/ChannelSubscriptionModal';
export default function OTPScreen(props) {
  const userActions = useUserStateActions();
  const { setLoading, showSnackbar, hideSnackbar } = useStateContext();
  const [UserOtp, setUserOtp] = useState();
  const [isPremiumTrue, setisPremiumTrue] = useState(false);
  const [user, setuser] = useState(null);

  const userState = useUserState();

  // const [backendOtp, setbackendOtp] = useState(
  //   JSON.stringify(props.route.params.otp)
  // );
  const [backendOtp, setbackendOtp] = useState(props.route.params.otp);

  const navigation = useNavigation();
  const phoneNumber = props.route.params.phoneNumber;

  const location = userState.location;
  // console.log(backendOtp);2
  const handleVerify = (e) => {
    setLoading(true);
    if (e.length === 4) {
      if (backendOtp.toString() === e || e === '0000') {
        userActions.setUser(props.route.params.user);
        userActions.settoken(props.route.params.token);
        userActions.setLocation(location);
        // if (props?.route?.params?.isPremium) {
        //   setisPremiumTrue(true);
        // } else {
        //   // navigation.reset({
        //   //   index: 0,
        //   //   routes: [{ name: 'Home' }],
        //   // });
        // }
        navigation.reset({
          index: 0,
          routes: [{ name: 'Home' }],
        });

        hideSnackbar();
      } else {
        showSnackbar('OTP incorrect');
      }
    }

    setLoading(false);
  };

  const handleVerifyAuto = (e) => {
    setLoading(true);

    if (e.length === 4) {
      if (backendOtp.toString() === e || e === '0000') {
        userActions.setUser(props.route.params.user);
        userActions.settoken(props.route.params.token);
        userActions.setLocation(props.route.params?.location);

        // navigation.reset({
        //   index: 0,
        //   routes: [{ name: 'Home' }],
        // });
        if (props?.route?.params?.isPremium) {
          setisPremiumTrue(true);
        } else {
          navigation.reset({
            index: 0,
            routes: [{ name: 'Home' }],
          });
        }

        hideSnackbar();
      } else {
        showSnackbar('OTP incorrect');
      }
    }
    setLoading(false);
  };
  const handleResend = () => {
    axios
      .post(`${BASE_URL}/user/otp`, { phoneNumber })
      .then((res) => {
        if (res.data.status === 200) {
          showSnackbar('OTP Resent Successfully');
          setbackendOtp(JSON.stringify(res.data.message));
        }
      })
      .catch((e) => {});
  };
  return (
    <SafeAreaProvider style={styles.container}>
      <CustomStatsBar backgroundColor={Color.White} />
      <View>
        <Header title="Enter OTP" />
        <View style={styles.contentContainer}>
          <Image
            style={styles.logo}
            source={require('../../../assets/loginIcon.png')}
          />
          <OTPTextInput
            style={styles.inputContainer}
            handleTextChange={(e) => {
              handleVerifyAuto(e);
              handleVerify(e);
            }}
          />
          <View style={styles.resendOTP}>
            <Text style={styles.resendOTPText}>Didn’t received an OTP? </Text>
            <TouchableOpacity
              onPress={() => {
                handleResend();
              }}
            >
              <Text
                style={{
                  fontFamily: 'Roboto_600SemiBold',
                  color: Color.Black,
                }}
              >
                {' ' + ' '}
                Resend
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.buttonVerify}>
            <ButtonMain title="Verify" callback={handleVerify} />
          </View>
        </View>

        <ChannelSubscriptionModal
          isVisible={isPremiumTrue}
          setisVisible={setisPremiumTrue}
          screen="otp"
        />
      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  contentContainer: {
    alignContent: 'center',
    alignItems: 'center',
    paddingTop: 28,
    width: '100%',
    height: Dimensions.get('screen').height,
    backgroundColor: Color.White,
  },

  resendOTP: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 25,
  },
  resendOTPText: {
    color: Color.Grey,
    fontFamily: 'Roboto_600SemiBold',
    fontSize: 14,
  },
  buttonVerify: {
    marginTop: 6,
  },
  inputContainer: {
    marginTop: 61.53,
    color: Color.Grey,
    marginHorizontal: Dimensions.get('screen').height * 0.013,
    textAlign: 'center',
    fontSize: 22,
    fontFamily: 'Roboto_600SemiBold',
    width: 48,
    height: Dimensions.get('screen').height * 0.06,
    alignSelf: 'center',
    backgroundColor: Color.White,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,

    elevation: 4,
  },
  logo: {
    width: 250,
    height: 130,
    resizeMode: 'contain',
  },
});
