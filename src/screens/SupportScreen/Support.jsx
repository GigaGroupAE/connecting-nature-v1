/* eslint-disable semi */
/* eslint-disable quotes */
/* eslint-disable @typescript-eslint/indent */
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Linking,
  Dimensions,
} from 'react-native';
import React, { useState } from 'react';

import { useTheme, IconButton, List } from 'react-native-paper';
import SubmitButton from '../../components/SubmitButton';

import Color from './../../../assets/colors/Color';

import { useUserState } from './../../slices/userSlice';
import { useNavigation } from '@react-navigation/native';

import HeaderNormal from '../../components/HeaderNormal';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import CustomStatsBar from '../../components/CustomStatsBar';
function Support(props) {
  const userState = useUserState();
  // const [groups, setgroups] = useState([]);
  const navigation = useNavigation();
  // Initializing theme context as colors object - used to get theme to work here and to use theme colors
  const { colors } = useTheme();

  // Stylesheet for this function/Complete Profile screen. Many other styles are inline as well.
  const styles = StyleSheet.create({
    body: {
      flex: 1,
      flexDirection: 'column',
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'flex-start',
    },
    // use this attribute with View to create a new row
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
    },
    btnNormal: {
      backgroundColor: colors.lighterBlue,
    },
    btnPress: {
      backgroundColor: colors.gray,
    },
    listTab: {
      padding: 15,
      flexDirection: 'row',
      alignSelf: 'center',
    },
    btnTab: {
      width: Dimensions.get('screen').width * 0.5,
      flexDirection: 'row',
      paddingHorizontal: 15,
      paddingVertical: 10,
      justifyContent: 'center',
      backgroundColor: '#F8F8F8',
    },
  });

  const [page, setPage] = useState('ContactUs');

  const ContactUs = () => {
    setPage('ContactUs');
  };

  const FAQs = () => {
    setPage('FAQs');
  };
  // useEffect(() => {
  //   axios
  //     .get(`${BASE_URL}/groups/getgroups`, {
  //       headers: {
  //         'auth-token': userState.token,
  //       },
  //     })
  //     .then((res) => {
  //       let groups = res.data.filter((group) => {
  //         const currentuser = group.members.filter((member) => {
  //           return member.phoneNumber === userState.phoneNumber;
  //         });
  //         return currentuser.length !== 0; //IF user present in members list of a group then take that group else ignore
  //       });
  //       setgroups([...groups]);
  //     })
  //     .catch((e) => console.log(e));
  // }, []);
  const handleNavigateAdminChat = () => {
    // let groupfound = false;
    // // navigation.navigate("ChatCRM");
    // const admingroup = groups.filter((group) => {
    //   return group.type === 'Admin';
    // });
    // admingroup.map((group) => {
    //   if (
    //     group.members[0].phoneNumber === userState.phoneNumber ||
    //     group.members[1].phoneNumber === userState.phoneNumber
    //   ) {
    //     if (group.type === 'Admin') {
    //       groupfound = true;
    //       navigation.navigate('ChatCRM', { group: group });
    //     }
    //   }
    // });
    // if (groupfound === false) {
    //   let members = [];
    //   members.push({
    //     name: userState.fullName,
    //     phoneNumber: userState.phoneNumber,
    //     type: userState.type,
    //     photo: userState.profile,
    //   });
    //   axios
    //     .get(`${BASE_URL}/user/getusers`, {
    //       headers: {
    //         'auth-token': userState.token,
    //       },
    //     })
    //     .then((res) => {
    //       let user = res.data.filter((admin) => {
    //         return admin.type === 'Admin';
    //       });
    //       members.push({
    //         name: user[0].fullName,
    //         phoneNumber: user[0].phoneNumber,
    //         type: user[0].type,
    //         photo: user[0].profile,
    //       });
    //       const formData = new FormData();
    //       formData.append('name', userState.fullName);
    //       formData.append('type', 'Admin');
    //       formData.append('title', 'Admin');
    //       formData.append('members', JSON.stringify(members));
    //       axios
    //         .post(`${BASE_URL}/groups/creategroup`, formData, {
    //           headers: {
    //             'Content-Type': 'multipart/form-data',
    //             Accept: 'application/json',
    //             'auth-token': userState.token,
    //           },
    //         })
    //         .then((res) => navigation.navigate('ChatCRM', { group: res.data }))
    //         .catch((e) => console.log(e));
    //     })
    //     .catch((e) => console.log(e));
    // }
  };

  // Function rendering the JSX for this screen.
  return (
    // Using ScrollView to dismiss keyboard when user clicks anywhere on the screen.
    <SafeAreaProvider style={styles.container}>
      <CustomStatsBar backgroundColor={Color.White} />
      <View style={[styles.body]}>
        {/* <Appbar.Header
        style={{
          width: "100%",
          height: 70,
          backgroundColor: Color.White,
          zIndex: 2,
        }}
      >
        <Appbar.BackAction
          color={Color.DarkGrey}
          onPress={() => props.navigation.goBack()}
        />
        <Appbar.Content
          title="Support"
          titleStyle={{ fontFamily: "Roboto_500Medium", fontSize: 18 }}
          color={Color.DarkGrey}
          style={{
            ...Platform.select({
              ios: {
                marginTop: 0,
                marginLeft: -4,
              },
              android: {
                marginTop: 4,
                marginLeft: -4,
              },
            }),
          }}
        />
      </Appbar.Header> */}
        <View style={{ width: '100%' }}>
          <HeaderNormal title={'Support'} onback={() => navigation.goBack()} />
        </View>

        <View style={[styles.row, { elevation: 2 }]}>
          <TouchableOpacity
            onPress={ContactUs}
            style={[
              styles.btnTab,
              { borderRightWidth: 1, borderRightColor: '#D3D3D3' },
            ]}
          >
            <Text
              style={{
                fontFamily: 'Roboto_500Medium',
                fontSize: 14,
                color: Color.Black,
              }}
            >
              Contact Us
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={FAQs}
            style={[
              styles.btnTab,
              { borderRightWidth: 1, borderRightColor: '#D3D3D3' },
            ]}
          >
            <Text
              style={{
                fontFamily: 'Roboto_500Medium',
                fontSize: 14,
                color: Color.Black,
              }}
            >
              FAQs
            </Text>
          </TouchableOpacity>
        </View>
        <ScrollView
          style={{
            flex: 1,
            width: '100%',
          }}
          contentContainerStyle={{
            alignItems: 'center',
          }}
        >
          {page === 'ContactUs' && (
            <>
              <View
                style={{
                  justifyContent: 'flex-start',
                  alignItems: 'flex-start',
                  padding: 20,
                  marginTop: 10,
                }}
              >
                <Text
                  style={{
                    fontFamily: 'Roboto_600SemiBold',
                    fontSize: 16,
                    color: Color.Black,
                  }}
                >
                  EMAIL US
                </Text>
                <TouchableOpacity
                  onPress={() => Linking.openURL('mailto:contact@intranet.com')}
                  style={[
                    {
                      width: '100%',
                      alignItems: 'center',
                      justifyContent: 'center',
                    },
                  ]}
                >
                  <View
                    style={[
                      styles.row,
                      {
                        marginTop: 10,
                        marginBottom: 10,
                        paddingTop: 5,
                        paddingBottom: 5,
                        borderRadius: 5,
                        width: '100%',
                        justifyContent: 'flex-start',
                        alignSelf: 'center',
                      },
                    ]}
                  >
                    <IconButton
                      icon="email"
                      color={Color.Black}
                      size={20}
                      style={{
                        backgroundColor: '#EDEDED',
                        borderWidth: 0,
                        borderColor: Color.White,
                      }}
                    />
                    <View
                      style={{
                        marginLeft: 12,
                        flexDirection: 'column',
                      }}
                    >
                      <Text
                        style={{
                          fontFamily: 'Roboto_500Medium',
                          fontSize: 15,
                          color: Color.Black,
                        }}
                      >
                        contact@intranet.com
                      </Text>
                    </View>
                    <IconButton
                      icon="chevron-right"
                      color={Color.Black}
                      size={25}
                      style={{
                        marginLeft: 'auto',
                        margin: 0,
                        marginRight: 10,
                        padding: 0,
                      }}
                    />
                  </View>
                </TouchableOpacity>
              </View>
              <View
                style={{
                  justifyContent: 'flex-start',
                  alignItems: 'flex-start',
                  padding: 20,
                }}
              >
                <Text
                  style={{
                    fontFamily: 'Roboto_600SemiBold',
                    fontSize: 16,
                    color: Color.Black,
                  }}
                >
                  Call US
                </Text>
                <TouchableOpacity
                  onPress={() => {
                    Linking.openURL(`tel:${'+923441234567'}`);
                  }}
                  style={[
                    {
                      width: '100%',
                      alignItems: 'center',
                      justifyContent: 'center',
                    },
                  ]}
                >
                  <View
                    style={[
                      styles.row,
                      {
                        marginTop: 10,
                        marginBottom: 10,
                        paddingTop: 5,
                        paddingBottom: 5,
                        borderRadius: 5,
                        width: '100%',
                        justifyContent: 'flex-start',
                        alignSelf: 'center',
                      },
                    ]}
                  >
                    <IconButton
                      icon="phone"
                      color={Color.Black}
                      size={20}
                      style={{
                        backgroundColor: '#EDEDED',
                        borderWidth: 0,
                        borderColor: Color.White,
                      }}
                    />
                    <View
                      style={{
                        marginLeft: 12,
                        flexDirection: 'column',
                      }}
                    >
                      <Text
                        style={{
                          fontFamily: 'Roboto_500Medium',
                          fontSize: 15,
                          color: colors.text,
                        }}
                      >
                        +92 34 1234567
                      </Text>
                    </View>
                    <IconButton
                      icon="chevron-right"
                      color={Color.Black}
                      size={25}
                      style={{
                        marginLeft: 'auto',
                        margin: 0,
                        marginRight: 10,
                        padding: 0,
                      }}
                    />
                  </View>
                </TouchableOpacity>
              </View>
              <View style={{ marginVertical: 30 }}>
                <SubmitButton
                  width={Dimensions.get('screen').width * 0.5}
                  labelStyle={{ fontSize: 18, letterSpacing: 0.7 }}
                  style={{
                    alignSelf: 'center',
                    borderRadius: 8,
                    backgroundColor: '#4582C3',
                  }}
                  onPress={() => {
                    handleNavigateAdminChat();
                  }}
                >
                  Chat Admin
                </SubmitButton>
              </View>
              <View
                style={{
                  backgroundColor: '#E4F1FF',
                  marginHorizontal: 20,
                  padding: 25,
                }}
              >
                <Text
                  style={{
                    fontFamily: 'Roboto_500Medium',
                    fontSize: 14,
                    color: Color.Black,
                  }}
                >
                  We will respond to emails in 24 hours. It might take 1 week
                  because of COVID. We are doing our best to serve you. Thank
                  you for your patience.
                </Text>
              </View>
            </>
          )}

          {page === 'FAQs' && (
            <View
              style={{
                flex: 1,

                flexDirection: 'column',
                width: '100%',
              }}
            >
              <List.AccordionGroup>
                <List.Accordion
                  title=" What do you mean by a Service Provider?"
                  id="1"
                  style={{
                    width: Dimensions.get('screen').width * 0.9,
                    alignSelf: 'center',
                    marginBottom: 10,
                    marginTop: 25,
                    backgroundColor: '#f8f8f8',
                    borderRadius: 10,
                  }}
                  titleStyle={{
                    fontFamily: 'Roboto_500Medium',
                    fontSize: 14,
                    color: '#777777',
                  }}
                >
                  <List.Item
                    title="A Service Provider is someone who has a skill and is available for hire to lend you their services using their skill and talent. A Service can be Nursing service, Gardening service, Tution service, hence Nurses,"
                    titleNumberOfLines={16}
                    titleStyle={{
                      fontFamily: 'Roboto_400Regular',
                      fontSize: 14,
                    }}
                    style={{ padding: 20, paddingVertical: 0 }}
                  />
                </List.Accordion>
                <List.Accordion
                  title=" What do you mean by a Service Provider?"
                  id="2"
                  style={{
                    width: Dimensions.get('screen').width * 0.9,
                    alignSelf: 'center',
                    marginVertical: 10,
                    backgroundColor: '#f8f8f8',
                    borderRadius: 10,
                  }}
                  titleStyle={{
                    fontFamily: 'Roboto_500Medium',
                    fontSize: 14,
                    color: '#777777',
                  }}
                >
                  <List.Item
                    title="A Service Provider is someone who has a skill and is available for hire to lend you their services using their skill and talent. A Service can be Nursing service, Gardening service, Tution service, hence Nurses,"
                    titleNumberOfLines={16}
                    titleStyle={{
                      fontFamily: 'Roboto_400Regular',
                      fontSize: 14,
                    }}
                    style={{ padding: 20, paddingVertical: 0 }}
                  />
                </List.Accordion>
                <List.Accordion
                  title=" What do you mean by a Service Provider?"
                  id="3"
                  style={{
                    width: Dimensions.get('screen').width * 0.9,
                    alignSelf: 'center',
                    marginVertical: 10,
                    backgroundColor: '#f8f8f8',
                    borderRadius: 10,
                  }}
                  titleStyle={{
                    fontFamily: 'Roboto_500Medium',
                    fontSize: 14,
                    color: '#777777',
                  }}
                >
                  <List.Item
                    title="A Service Provider is someone who has a skill and is available for hire to lend you their services using their skill and talent. A Service can be Nursing service, Gardening service, Tution service, hence Nurses,"
                    titleNumberOfLines={16}
                    titleStyle={{
                      fontFamily: 'Roboto_400Regular',
                      fontSize: 14,
                    }}
                    style={{ padding: 20, paddingVertical: 0 }}
                  />
                </List.Accordion>
                <List.Accordion
                  title=" What do you mean by a Service Provider?"
                  id="4"
                  style={{
                    width: Dimensions.get('screen').width * 0.9,
                    alignSelf: 'center',
                    marginVertical: 10,
                    backgroundColor: '#f8f8f8',
                    borderRadius: 10,
                  }}
                  titleStyle={{
                    fontFamily: 'Roboto_500Medium',
                    fontSize: 14,
                    color: '#777777',
                  }}
                >
                  <List.Item
                    title="A Service Provider is someone who has a skill and is available for hire to lend you their services using their skill and talent. A Service can be Nursing service, Gardening service, Tution service, hence Nurses,"
                    titleNumberOfLines={16}
                    titleStyle={{
                      fontFamily: 'Roboto_400Regular',
                      fontSize: 14,
                    }}
                    style={{ padding: 20, paddingVertical: 0 }}
                  />
                </List.Accordion>
                <List.Accordion
                  title=" What do you mean by a Service Provider?"
                  id="5"
                  style={{
                    width: Dimensions.get('screen').width * 0.9,
                    alignSelf: 'center',
                    marginVertical: 10,
                    backgroundColor: '#f8f8f8',
                    borderRadius: 10,
                  }}
                  titleStyle={{
                    fontFamily: 'Roboto_500Medium',
                    fontSize: 14,
                    color: '#777777',
                  }}
                >
                  <List.Item
                    title="A Service Provider is someone who has a skill and is available for hire to lend you their services using their skill and talent. A Service can be Nursing service, Gardening service, Tution service, hence Nurses,"
                    titleNumberOfLines={16}
                    titleStyle={{
                      fontFamily: 'Roboto_400Regular',
                      fontSize: 14,
                    }}
                    style={{ padding: 20, paddingVertical: 0 }}
                  />
                </List.Accordion>
                <List.Accordion
                  title=" What do you mean by a Service Provider?"
                  id="6"
                  style={{
                    width: Dimensions.get('screen').width * 0.9,
                    alignSelf: 'center',
                    marginVertical: 10,
                    backgroundColor: '#f8f8f8',
                    borderRadius: 10,
                  }}
                  titleStyle={{
                    fontFamily: 'Roboto_500Medium',
                    fontSize: 14,
                    color: '#777777',
                  }}
                >
                  <List.Item
                    title="A Service Provider is someone who has a skill and is available for hire to lend you their services using their skill and talent. A Service can be Nursing service, Gardening service, Tution service, hence Nurses,"
                    titleNumberOfLines={16}
                    titleStyle={{
                      fontFamily: 'Roboto_400Regular',
                      fontSize: 14,
                    }}
                    style={{ padding: 20, paddingVertical: 0 }}
                  />
                </List.Accordion>
                <List.Accordion
                  title=" What do you mean by a Service Provider?"
                  id="7"
                  style={{
                    width: Dimensions.get('screen').width * 0.9,
                    alignSelf: 'center',
                    marginVertical: 10,
                    backgroundColor: '#f8f8f8',
                    borderRadius: 10,
                  }}
                  titleStyle={{
                    fontFamily: 'Roboto_500Medium',
                    fontSize: 14,
                    color: '#777777',
                  }}
                >
                  <List.Item
                    title="A Service Provider is someone who has a skill and is available for hire to lend you their services using their skill and talent. A Service can be Nursing service, Gardening service, Tution service, hence Nurses,"
                    titleNumberOfLines={16}
                    titleStyle={{
                      fontFamily: 'Roboto_400Regular',
                      fontSize: 14,
                    }}
                    style={{ padding: 20, paddingVertical: 0 }}
                  />
                </List.Accordion>
              </List.AccordionGroup>
            </View>
          )}
        </ScrollView>
      </View>
    </SafeAreaProvider>
  );
}
export default Support;
