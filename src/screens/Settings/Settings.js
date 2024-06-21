import React from 'react';
import { View, Text, StyleSheet, Dimensions, Pressable } from 'react-native';
import HeaderNormal from '../../components/HeaderNormal';
import { Entypo } from 'react-native-vector-icons';
import { useUserStateActions, useUserState } from '../../slices/userSlice';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { BASE_URL } from '../../../CONSTANTS.js';

import Color from '../../../assets/colors/Color';
import axios from 'axios';
import { useCartStateActions } from '../../slices/cartSlice';
import { SETTINGS_DATA } from './settingsData';
import CustomStatsBar from '../../components/CustomStatsBar';

export default function Settings() {
  const CartActions = useCartStateActions();
  const userActions = useUserStateActions();
  const navigation = useNavigation();
  const userstate = useUserState();

  const Logout = () => {
    //delete the expo token from database
    const config = {
      headers: {
        'auth-token': userstate.token,
      },
    };
    axios
      .put(
        `${BASE_URL}/user/updateUserExpoToken`,
        { expoPushToken: null },
        config,
      )
      .then((res) => {
        userActions.resetState();
        CartActions.resetState();
        navigation.reset({
          index: 0,
          routes: [{ name: 'SignIn' }],
        });
      })
      .catch((err) => {});
  };

  const onSettingPressed = (setting) => {
    if (setting.screenToNavigate) {
      navigation.navigate(setting.screenToNavigate);
    }
    if (setting.title === 'Logout') {
      Logout();
    }
  };
  return (
    <SafeAreaProvider style={styles.container}>
      <CustomStatsBar backgroundColor={Color.White} />
      <HeaderNormal title="Settings" />
      <View>
        <View style={styles.mainListItems}>
          {SETTINGS_DATA.map((setting, idx) => {
            return (
              <Pressable
                android_ripple={{ color: Color.LightGrey }}
                style={styles.listItem}
                onPress={() => onSettingPressed(setting)}
                key={idx}
              >
                {setting.icon}
                <Text style={styles.itemText}>{setting.title}</Text>
                <View style={styles.arrowIconDark}>
                  <Entypo name="chevron-right" size={23} color={Color.Black} />
                </View>
              </Pressable>
            );
          })}
        </View>
      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    paddingHorizontal: 19,
    backgroundColor: Color.Blue,
  },
  profileHead: {
    paddingVertical: 15,
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    borderRadius: Dimensions.get('screen').height * 0.1,
    width: Dimensions.get('screen').height * 0.09,
    height: Dimensions.get('screen').height * 0.09,
  },
  userNameContainer: {
    justifyContent: 'center',
  },
  userName: {
    fontSize: 18,
    fontFamily: 'Roboto_600SemiBold',
    color: Color.White,
    alignSelf: 'center',
    marginLeft: 15,
  },
  userCategory: {
    marginLeft: 15,
    fontSize: 14,
    fontFamily: 'Roboto_400Regular',
    color: Color.White,
  },
  mainTextContainer: {
    marginLeft: 15,
  },
  profileContainerText: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'flex-end',
  },
  category: {
    fontFamily: 'Roboto',
    fontSize: 12,
    fontWeight: '400',
    lineHeight: 21,
    color: 'white',
    marginLeft: 11,
  },
  phoneNumber: {
    fontFamily: 'Roboto',
    fontSize: 12,
    fontWeight: '400',
    lineHeight: 21,
    color: 'white',
  },
  arrowIcon: {
    position: 'absolute',
    right: 0,
    width: 6,
    height: 10,
  },
  mainListItems: {
    paddingTop: 10,
    // paddingHorizontal: 17,
    backgroundColor: Color.White,
    height: Dimensions.get('screen').height,
  },
  listItem: {
    flexDirection: 'row',
    paddingVertical: 15,
    paddingHorizontal: 17,
  },
  itemText: {
    fontFamily: 'Roboto_500Medium',
    fontSize: 14,
    lineHeight: 21,
    color: Color.Black,
    marginLeft: 15,
    alignSelf: 'center',
  },
  arrowIconDark: {
    position: 'absolute',
    right: 17,
    alignSelf: 'center',
  },
  sectionHeading: {
    fontFamily: 'Roboto_600SemiBold',
    paddingVertical: 22,
    marginLeft: 17,
    fontSize: 13,
    lineHeight: 15,
    color: Color.LightGrey,
  },
});
