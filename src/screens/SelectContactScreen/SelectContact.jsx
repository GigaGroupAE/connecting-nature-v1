import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Dimensions,
  TextInput,
  Pressable,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import BouncyCheckbox from 'react-native-bouncy-checkbox';
import axios from 'axios';
import { useUserState } from './../../slices/userSlice';
import { useNavigation } from '@react-navigation/native';
import { BASE_URL } from '../../../CONSTANTS';
import { AntDesign, Ionicons, Entypo } from 'react-native-vector-icons';
import Color from '../../../assets/colors/Color';
import { TouchableOpacity } from 'react-native-gesture-handler';

export default function SelectContact(props) {
  const [isSearch, setIsSearch] = useState(false);

  const handleSearchBar = () => {
    setIsSearch(true);
  };

  const handleCancel = () => {
    setSearchQuery('');
    setIsSearch(false);
  };

  const [users, setuser] = useState([]);
  const userState = useUserState();
  const navigation = useNavigation();
  const onChangeSearch = (query) => setSearchQuery(query);
  const [searchQuery, setSearchQuery] = useState('');
  useEffect(() => {
    axios
      .get(`${BASE_URL}/user/new-chat-contacts`, {
        headers: {
          'auth-token': userState.token,
        },
      })
      .then((res) => {
        //now we have to exculde the loggedIn user and also those users that have blocked each other
        //1- EXCLUDING LOGGED IN USER
        const tempUsers = res.data.contacts.filter(
          (user) => user.phoneNumber !== userState.phoneNumber,
        );
        let users = tempUsers;
        if (props.route.params.IntranetChat === 'Intranet') {
          users = tempUsers.filter((user) => {
            return (
              user.type === 'Manager' ||
              user.type === 'Assistant Manager' ||
              user.type === 'Operations' ||
              user.type === 'Super Admin' ||
              user.type === 'Admin'
            );
          });
        }
        setuser([...users]);
      })
      .catch((e) => {});
  }, []);
  const render = true;
  const handleOnCheck = (user) => {
    navigation.goBack();
    props.route.params.selectedContact(user);
  };

  return (
    <View style={styles.body}>
      <View style={isSearch ? styles.searchHeader : styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <AntDesign name="arrowleft" size={28} color={Color.Black} />
        </TouchableOpacity>
        {!isSearch && <Text style={styles.title}>Contact List</Text>}

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
            onPress={handleSearchBar}
          >
            <Ionicons name="search" size={22} color={Color.Black} />
          </Pressable>
        )}

        {isSearch && (
          <Pressable
            android_ripple={{ color: Color.LightGrey, borderless: true }}
            onPress={handleCancel}
          >
            <Entypo name="cross" size={25} color={Color.Black} />
          </Pressable>
        )}
      </View>

      <ScrollView>
        {/* <Searchbar
          placeholder="Search"
          onChangeText={onChangeSearch}
          value={searchQuery}
        /> */}
        <Text
          style={{
            paddingHorizontal: 20,
            paddingVertical: 10,
            marginTop: 5,
            fontSize: 18,
            fontWeight: 'bold',
            color: Color.Black,
          }}
        >
          Recent Contact
        </Text>
        {searchQuery === ''
          ? render === true
            ? users.map((user, index) => {
                return (
                  <View
                    style={{
                      paddingHorizontal: 17,
                      backgroundColor: 'white',
                      width: '100%',
                      flexDirection: 'row',
                      alignItems: 'center',
                      marginTop: 5,
                    }}
                  >
                    <View
                      style={{
                        backgroundColor: Color.LightBlue,
                        // paddingHorizontal: 15,
                        paddingVertical: 7,
                        width: Dimensions.get('screen').height * 0.04,
                        height: Dimensions.get('screen').height * 0.04,
                        borderRadius: 100,
                      }}
                    >
                      <Text
                        style={{
                          alignSelf: 'center',
                          fontWeight: 'bold',
                          color: Color.Blue,
                        }}
                      >
                        {user.fullName[0]}
                      </Text>
                    </View>
                    <View
                      key={'contact-' + index}
                      style={[
                        styles.row,
                        {
                          paddingHorizontal: 15,
                          backgroundColor: 'white',
                          width: '100%',
                          // alignSelf: "center",
                          borderRadius: 7,
                          paddingVertical: 10,
                          marginVertical: 5,
                        },
                      ]}
                    >
                      <Text
                        numberOfLines={1}
                        ellipsizeMode="tail"
                        style={{
                          fontFamily: 'Roboto_500Medium',
                          color: Color.Black,
                          flex: 1,
                        }}
                      >
                        {props?.route?.params?.IntranetChat ===
                        'IntranetChat' ? (
                          <Text>{user?.phoneNumber || 'No Phone Number'}</Text>
                        ) : null}

                        <Text
                          style={{
                            color: Color.Black,
                            fontSize: 12,
                          }}
                        >
                          {' '}
                          {'     ~'}
                          {user.fullName}
                        </Text>
                      </Text>
                      {
                        <BouncyCheckbox
                          size={22}
                          fillColor={Color.LightGrey}
                          onPress={(isChecked) => {
                            if (isChecked === true) {
                              handleOnCheck(user);
                            }
                          }}
                          style={{
                            // marginLeft: "auto",
                            borderRadius: Dimensions.get('screen').height * 0.1,
                            backgroundColor: 'white',
                            elevation: 0,
                          }}
                          contentStyle={{ paddingHorizontal: 3, height: 35 }}
                          labelStyle={{
                            color: '#4582C3',
                            fontFamily: 'Roboto_600SemiBold',
                            fontSize: 12,
                          }}
                          mode="contained"
                        />
                      }
                    </View>
                  </View>
                );
              })
            : null
          : users.map((user) => {
              if (user.fullName.match(searchQuery)) {
                return null;
              }
            })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  body: {
    flex: 1,
    backgroundColor: Color.White,
    // alignItems: "center",
  },
  // use this attribute with View to create a new row
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
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  btnNormal: {
    backgroundColor: Color.Blue,
  },
  btnPress: {
    backgroundColor: 'gray',
  },
  title: {
    width: '82%',
    // color: Color.Grey,
    fontSize: 20,
    lineHeight: 30,
    marginTop: 2,
    marginLeft: 10,
    fontFamily: 'Roboto_600SemiBold',
  },
});
