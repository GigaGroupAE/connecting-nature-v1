import React from 'react';
import { StyleSheet, View, TouchableOpacity, Dimensions } from 'react-native';
import { Ionicons, MaterialIcons, Feather } from 'react-native-vector-icons';

import { useNavigation } from '@react-navigation/native';
import Color from '../../assets/colors/Color';
import { useUserState } from '../slices/userSlice';
import { Image } from 'expo-image';
import { BASE_URL } from '../../CONSTANTS';
import { screenHeight } from '../utils/ScreenDimensions';

const Height = Dimensions.get('screen').height;

export default function AdminBottomTab(props) {
  const userState = useUserState();
  const navigation = useNavigation();
  return (
    <View style={styles.mainContainer}>
      <TouchableOpacity
        style={styles.tabStyle}
        onPress={() => navigation.navigate('Home')}
      >
        <Feather name="grid" size={screenHeight * 0.03} color="#000" />
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.tabStyle}
        onFocus
        onPress={() => {
          if (userState.type === 'Admin') {
            alert('You cannot text yourself');
          } else {
            props.onPressAdmin();
          }
        }}
      >
        <View style={styles.tabStyle}>
          <MaterialIcons
            name="support-agent"
            // size={Dimensions.get('screen').width * 0.08}
            size={screenHeight * 0.032}
            color="#000"
          />
        </View>
      </TouchableOpacity>

      {/* temporary comment  till  next update  */}

      {/* <TouchableOpacity
        style={styles.tabStyle}
        onPress={() => {
          navigation.navigate("CallList");
        }}
      >
        <Ionicons name="ios-call" size={26} color="#000" />
        <Text style={styles.tabText}>Call</Text>
      </TouchableOpacity> */}
      <TouchableOpacity
        style={styles.tabStyle}
        onPress={() => navigation.navigate('DirectChat')}
      >
        <Ionicons
          name="chatbubble-ellipses-outline"
          // size={Dimensions.get('screen').width * 0.08}
          size={screenHeight * 0.03}
          color="#000"
        />
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.tabProfile}
        onPress={() => navigation.navigate('SettingsCRM')}
      >
        {/* <EvilIcons
          name="user"
          size={Dimensions.get('screen').width * 0.11}
          color="black"
        /> */}
        <Image
          style={styles.headerAvatar}
          source={{ uri: `${BASE_URL}/images/${userState.profile}` }}
          contentFit="cover"
        />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    position: 'absolute',
    bottom: 0,
    paddingHorizontal: Dimensions.get('screen').width * 0.02,
    alignContent: 'center',
    alignItems: 'center',
    justifyContent: 'space-around',
    flexDirection: 'row',
    backgroundColor: Color.White,
    width: '100%',
    height: 65,
    borderTopWidth: 1,
    borderColor: Color.LightGrey,
  },
  tabStyle: {
    alignContent: 'center',
    alignItems: 'center',
    // flexDirection: "row",
  },
  adminChatButton: {
    backgroundColor: Color.Blue,
    paddingHorizontal: 20,
    paddingVertical: Dimensions.get('screen').height * 0.013,
    borderRadius: 8,
  },
  adminChatButtonText: {
    fontSize: Dimensions.get('screen').height * 0.018,
    fontFamily: 'Roboto_600SemiBold',
    color: Color.White,
  },
  tabText: {
    marginBottom: Height * 0.02,
    marginTop: Height * 0.009,
    fontSize: Height * 0.016,
    fontFamily: 'Roboto_500Medium',
    color: Color.Black,
  },
  tabProfile: {
    marginBottom: Height * 0.01,
    marginTop: Height * 0.009,
  },
  headerAvatar: {
    // marginRight: 155,
    borderRadius: 100,
    width: 35,
    height: 35,
    backgroundColor: '#eee',
  },
});
