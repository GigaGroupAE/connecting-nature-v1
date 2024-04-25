import {
  StyleSheet,
  Text,
  View,
  Pressable,
  Dimensions,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { AntDesign, Ionicons, Entypo } from 'react-native-vector-icons';

import { useNavigation } from '@react-navigation/native';
import Color from '../../assets/colors/Color';

import { useState } from 'react';

const width = Dimensions.get('screen').width;

export default function SearchHeader({ title, searchQuery, setSearchQuery }) {
  const [isSearch, setisSearch] = useState(false);
  const onChangeSearch = (query) => setSearchQuery(query);
  const navigation = useNavigation();

  return (
    <View style={isSearch ? styles.searchHeader : styles.header}>
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <AntDesign name="arrowleft" size={28} color={Color.Black} />
      </TouchableOpacity>
      {!isSearch && <Text style={styles.title}>{title}</Text>}

      {isSearch && (
        <TextInput
          style={{
            width: '80%',
            // height: 15,
            backgroundColor: '#F1F1F1',
            paddingVertical: 5,
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

      {!isSearch && (
        <Pressable
          android_ripple={{ color: Color.LightGrey, borderless: true }}
          onPress={() => setisSearch(!isSearch)}
        >
          <Ionicons name="search" size={22} color={Color.Black} />
        </Pressable>
      )}

      {isSearch && (
        <Pressable
          android_ripple={{ color: Color.LightGrey, borderless: true }}
          onPress={() => setisSearch(false)}
        >
          <Entypo name="cross" size={25} color={Color.Black} />
        </Pressable>
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
    alignContent: 'center',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1.5,
    borderColor: Color.VeryLightGrey,
  },
  searchHeader: {
    flexDirection: 'row',
    paddingVertical: 5.5,
    paddingHorizontal: 14,
    alignContent: 'center',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1.5,
    borderColor: Color.VeryLightGrey,
  },
  title: {
    width: '82%',
    // color: Color.Grey,
    fontSize: 17,
    lineHeight: 30,
    marginTop: 2,
    marginLeft: 10,
    fontFamily: 'Roboto_600SemiBold',
  },
});
