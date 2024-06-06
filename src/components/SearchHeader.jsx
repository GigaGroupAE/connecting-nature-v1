import {
  StyleSheet,
  Text,
  View,
  Pressable,
  Dimensions,
  TouchableOpacity,
  TextInput,
  Platform,
} from 'react-native';
import { AntDesign, Ionicons, Entypo } from 'react-native-vector-icons';

import { useNavigation } from '@react-navigation/native';
import Color from '../../assets/colors/Color';

import { useState } from 'react';
import { Image } from 'expo-image';
import { screenHeight } from '../utils/ScreenDimensions';

const width = Dimensions.get('screen').width;

export default function SearchHeader({
  title,
  searchQuery,
  setSearchQuery,
  screen,
  handleInvite,
}) {
  const [isSearch, setisSearch] = useState(false);
  const onChangeSearch = (query) => setSearchQuery(query);
  const navigation = useNavigation();

  return (
    <View style={isSearch ? styles.searchHeader : styles.header}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: 10,
        }}
      >
        {title !== 'admin' && (
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <AntDesign name="arrowleft" size={28} color={Color.Black} />
          </TouchableOpacity>
        )}

        {!isSearch && title !== 'admin' && (
          <Text style={styles.title}>{title}</Text>
        )}

        {title === 'admin' && !isSearch && (
          <Image
            source={require('../../assets/crmlogo.png')}
            style={styles.logo}
          />
        )}
      </View>

      {!isSearch && (
        <View style={{ flexDirection: 'row', gap: 30 }}>
          {screen === 'groupInvite' && (
            <TouchableOpacity onPress={handleInvite}>
              <Text
                style={{
                  fontFamily: 'Roboto_500Medium',
                  fontSize: screenHeight * 0.018,
                  color: Color.Blue,
                }}
              >
                Invite
              </Text>
            </TouchableOpacity>
          )}
          <Pressable
            android_ripple={{ color: Color.LightGrey, borderless: true }}
            onPress={() => setisSearch(!isSearch)}
            style={{
              // width: 500,
              // marginRight: 30,
              // paddingRight: 20,
              // flex: 1,
              alignSelf: 'center',
            }}
          >
            <Ionicons
              name="search"
              size={22}
              color={Color.Black}
              // style={{ paddingRight: 40 }}
            />
          </Pressable>
        </View>
      )}

      {isSearch && (
        <TextInput
          style={{
            width: screen === 'groupInvite' ? '70%' : '80%',
            // height: 15,
            backgroundColor: '#F1F1F1',
            paddingVertical: Platform.OS === 'ios' ? 10 : 5,
            paddingHorizontal: 20,
            borderRadius: Dimensions.get('screen').height * 0.1,
          }}
          placeholder="Search"
          onChangeText={onChangeSearch}
          value={searchQuery}
          autoFocus
          placeholderTextColor={Color.Black}
        />
      )}

      {isSearch && (
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
          {screen === 'groupInvite' && (
            <TouchableOpacity onPress={handleInvite}>
              <Text
                style={{
                  fontFamily: 'Roboto_500Medium',
                  fontSize: screenHeight * 0.018,
                  color: Color.Blue,
                }}
              >
                Invite
              </Text>
            </TouchableOpacity>
          )}
          <Pressable
            android_ripple={{ color: Color.LightGrey, borderless: true }}
            onPress={() => setisSearch(false)}
          >
            <Entypo name="cross" size={25} color={Color.Black} />
          </Pressable>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  // container: {
  //   backgroundColor: Color.White,
  //   alignContent: 'center',
  //   alignItems: 'center',
  //   flexDirection: 'row',
  //   paddingHorizontal: 17,
  //   paddingVertical: 10,
  //   borderBottomWidth: 2,
  //   borderColor: Color.VeryLightGrey,
  //   justifyContent: 'space-between',
  // },
  // title: {
  //   color: Color.Black,
  //   fontSize: 17,
  //   fontFamily: 'Roboto_600SemiBold',
  //   marginLeft: 10,
  //   marginTop: 2,
  //   lineHeight: 30,
  //   textAlignVertical: 'center',
  // },
  // affordabContainer: {
  //   backgroundColor: Color.Blue,
  //   width: width * 0.22,
  //   flexDirection: 'row',
  //   alignItems: 'center',
  //   justifyContent: 'center',
  //   paddingVertical: '1.7%',
  //   borderRadius: screenHeight * 0.01,
  //   gap: 4,
  // },
  // affordableTitle: {
  //   color: Color.White,
  //   fontFamily: 'Roboto_700Bold',
  //   fontSize: screenHeight * 0.016,
  // },
  // decorContainer: {
  //   flexDirection: 'row',
  //   alignItems: 'center',
  //   gap: 12,
  //   paddingHorizontal: '3%',
  // },
  header: {
    width: '100%',
    flexDirection: 'row',
    paddingVertical: 10,
    paddingHorizontal: 14,
    // alignContent: 'center',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1.5,
    borderColor: Color.VeryLightGrey,
    backgroundColor: Color.White,
  },
  searchHeader: {
    flexDirection: 'row',
    paddingVertical: 5.5,
    paddingHorizontal: 14,
    // alignContent: 'center',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1.5,
    borderColor: Color.VeryLightGrey,
    backgroundColor: Color.White,
  },
  title: {
    // width: '77%',
    // color: Color.Grey,
    fontSize: 17,
    lineHeight: 30,
    marginTop: 2,
    marginLeft: 10,
    fontFamily: 'Roboto_600SemiBold',
  },
  logo: {
    width: 90,
    height: 58,
    resizeMode: 'contain',
  },
});
