import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { BASE_URL } from '../../../CONSTANTS';
import { useUserState } from '../../slices/userSlice';
import Color from '../../../assets/colors/Color';

import cnlogo from '../../../assets/CNlogo.png';
import { Fontisto } from 'react-native-vector-icons';
import { crmSideRole } from '../../utils/AdminRoles';
import MessageSvg from '../../components/SVG/MessageSvg';
import AdminSvg from '../../components/SVG/AdminSvg';
import NotificationsSvg from '../../components/SVG/NotificationSvg';
import CrmSideSvg from '../../components/SVG/CrmSideSvg';

const Height = Dimensions.get('screen').height;
const Width = Dimensions.get('screen').width;

const HomeHeader = () => {
  const userstate = useUserState();
  const navigation = useNavigation();
  const handleNotificationNavigation = () => {
    navigation.navigate('NotificationsScreen');
  };
  const handlecrm = () => {
    navigation.navigate('AdminHome');
  };
  const handleHeaderImageClick = () => {
    navigation.navigate('ChatList');
    // navigation.navigate('UserProfile', { type: 'current' });
  };
  // const canGoToAdminScreen = authorized(
  //   userstate.type,
  //   'Admin',
  //   'Manager',
  //   'Assistant Manager',
  //   'Super Admin',
  //   'Operations',
  // );

  const canGoToAdminScreen = crmSideRole.includes(userstate?.type);
  return (
    <View style={styles.headContainer}>
      <View>
        <Image
          source={cnlogo}
          style={{
            resizeMode: 'contain',
            width: Width * 0.08,
            height: Height * 0.08,
            marginLeft: Width * 0.05,
          }}
        />
      </View>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
        }}
      >
        {canGoToAdminScreen && (
          <TouchableOpacity
            // style={{
            //   marginLeft: '15%',
            //   backgroundColor: Color.Blue,
            //   paddingHorizontal: Width * 0.06,
            //   paddingVertical: Height * 0.004,
            //   borderRadius: Height * 0.01,
            //   position: 'absolute',
            //   right: Width * 0.322,
            // }}
            onPress={handlecrm}
          >
            {/* <Text
              style={{
                fontFamily: 'Roboto_500Medium',
                textTransform: 'capitalize',
                color: Color.White,
                fontSize: Height * 0.017,
              }}
            >
              admin
            </Text> */}

            <CrmSideSvg />
          </TouchableOpacity>
        )}
        <TouchableOpacity
          style={{ paddingHorizontal: Width * 0.07 }}
          onPress={handleHeaderImageClick}
        >
          {/* <Fontisto name="bell" size={20} color={Color.Black} /> */}
          <MessageSvg />
        </TouchableOpacity>
        <TouchableOpacity
          style={{ marginRight: Width * 0.05 }}
          onPress={handleNotificationNavigation}
        >
          {/* <Image
            style={styles.headerAvatar}
            source={{ uri: `${BASE_URL}/images/${userstate.profile}` }}
            resizeMode="contain"
          /> */}
          {/* <MessageSvg /> */}
          <NotificationsSvg />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default HomeHeader;
const styles = StyleSheet.create({
  pageContainer: {
    alignContent: 'flex-start',
    backgroundColor: Color.VeryLightGrey,
    height: '100%',
    paddingBottom: Height * 0.06,
  },
  headContainer: {
    backgroundColor: '#fff',
    // paddingHorizontal: 17,
    alignItems: 'center',
    alignContent: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    height: 50,
    borderBottomWidth: 0.6,
    borderColor: Color.LightGrey,
  },
  headerAvatar: {
    // marginRight: 155,
    borderRadius: 100,
    width: 35,
    height: 35,
    backgroundColor: '#eee',
  },
});
