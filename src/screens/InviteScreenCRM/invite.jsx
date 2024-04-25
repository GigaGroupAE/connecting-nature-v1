// import React, { useState } from 'react';
// import { Searchbar } from 'react-native-paper';

// import {
//   View,
//   ScrollView,
//   StyleSheet,
//   FlatList,
//   Dimensions,
// } from 'react-native';

// import { useNavigation } from '@react-navigation/native';
// import {
//   useContactState,
//   useContactsStateActions,
// } from './../../slices/contactslice';
// import Color from '../../../assets/colors/Color';
// import Contact from './contact';
// import { SafeAreaProvider } from 'react-native-safe-area-context';
// import HeaderNormal from '../../components/HeaderNormal';
// import CustomStatsBar from '../../components/CustomStatsBar';
// export default function Invite() {
//   //const contactstate = useContactsState();
//   const [searchQuery, setSearchQuery] = useState('');
//   const contactstateactions = useContactsStateActions();

//   const onChangeSearch = (query) => setSearchQuery(query);
//   const contactstate = useContactState();

//   let postUsers = [];
//   let userstoinvite = [];
//   let checkedusers = [];
//   const handleOnCheck = (prop) => {
//     if (prop !== null) {
//       checkedusers.push(prop);
//       let userdir = 'user/' + prop.phoneNumber;
//       postUsers.push({
//         color: '#00FFFF',
//         privilege: 'user',
//         uid: prop.phoneNumber,
//         user: userdir,
//       });
//       userstoinvite.push({
//         designation: '',
//         displayName: prop.name,
//         isAdmin: false,
//         phoneNumber: prop.phoneNumber,
//         photoURL: '',
//         status: 'invited',
//       });
//     } else {
//       postUsers.pop();
//       userstoinvite.pop();
//     }
//   };

//   return (
//     <SafeAreaProvider style={styles.container}>
//       <CustomStatsBar backgroundColor={Color.White} />
//       <HeaderNormal title="Add Participants" />

//       <View style={[styles.body]}>
//         {/* <Appbar.Header
//           style={{
//             width: "100%",
//             height: 70,
//             backgroundColor: "white",
//             zIndex: 2,
//           }}
//         >
//           <Appbar.BackAction
//             color={"grey"}
//             onPress={() => navigation.goBack()}
//           />
//           <Appbar.Content
//             title="Add Participants"
//             titleStyle={{ fontFamily: "Roboto_500Medium", fontSize: 18 }}
//             color={"grey"}
//             style={{
//               ...Platform.select({
//                 ios: {
//                   marginTop: 0,
//                   marginLeft: -4,
//                 },
//                 android: {
//                   marginTop: 4,
//                   marginLeft: -4,
//                 },
//               }),
//             }}
//           />
//         </Appbar.Header> */}

//         <ScrollView showsVerticalScrollIndicator={false} style={{}}>
//           <Searchbar
//             placeholder="Search"
//             onChangeText={onChangeSearch}
//             value={searchQuery}
//           />
//           {searchQuery === '' ? (
//             <FlatList
//               data={contactstate.resolvedContacts}
//               keyExtractor={(item) => item.id}
//               renderItem={({ item }) => <Contact item={item} />}
//             />
//           ) : (
//             contactstate.resolvedContacts.map((user, index) => {
//               if (user.name.match(searchQuery)) {
//                 return <Contact item={user} />;
//               } else {
//                 return null;
//               }
//             })
//           )}
//         </ScrollView>
//       </View>
//     </SafeAreaProvider>
//   );
// }

// const styles = StyleSheet.create({
//   body: {
//     //this flex : 1 was causing the invisibility of contacts
//     //flex: 1,
//     flexDirection: 'column',
//     backgroundColor: Color.White,
//   },
//   // use this attribute with View to create a new row
//   row: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   btnNormal: {
//     backgroundColor: 'aqua',
//   },
//   btnPress: {
//     backgroundColor: 'gray',
//   },
//   chatSearchContainer: {
//     flexDirection: 'row',
//     alignContent: 'center',
//     alignItems: 'center',
//     marginTop: 10,
//     marginHorizontal: 10,
//   },
//   searchContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     paddingHorizontal: 20,
//     paddingVertical: 4,
//     marginLeft: 10,
//     borderRadius: Dimensions.get('screen').height * 0.1,
//     backgroundColor: '#F1F1F1',
//   },
//   textBox: {
//     fontSize: 14,
//     marginTop: 3,
//     fontFamily: 'Roboto_400Regular',
//     width: '82%',
//   },
// });

import {
  ActivityIndicator,
  Alert,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useState } from 'react';
import Color from '../../../assets/colors/Color';
import HeaderNormal from '../../components/HeaderNormal';

import { useContactState } from './../../slices/contactslice';
import { FlashList } from '@shopify/flash-list';
import BouncyCheckbox from 'react-native-bouncy-checkbox';
import { screenHeight, screenWidth } from '../../utils/ScreenDimensions';
import { Modal, Portal } from 'react-native-paper';
import {
  buttonContainer,
  buttonTitle,
  container,
  inputstyle,
  modalTitle,
} from '../Decorations/ModalStyle';
import { MaterialIcons } from 'react-native-vector-icons';
import { scale } from 'react-native-size-matters';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import RadioButton from '../../components/RadioButton';
import axios from 'axios';
import { BASE_URL } from '../../../CONSTANTS';
import { useUserState } from '../../slices/userSlice';
import { useStateContext } from '../../contexts/ContextProvider';
import SearchHeader from '../../components/SearchHeader';

const roleData = [
  {
    id: 1,
    title: 'Manager',
  },
  {
    id: 2,
    title: 'Assistant Manager',
  },
  {
    id: 3,
    title: 'Admin',
  },
  {
    id: 4,
    title: 'Super Admin',
  },
  {
    id: 5,
    title: 'Operations',
  },
];

const Invite = () => {
  const userState = useUserState();
  const contactstate = useContactState();
  const [isAddUserModal, setisAddUserModal] = useState(false);
  const [userNumber, setuserNumber] = useState(false);
  const [isDesignationModal, setisDesignationModal] = useState(false);
  const [selectedRole, setselectedRole] = useState(null);
  const [userName, setuserName] = useState('');
  const [gender, setGender] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { showSnackbar } = useStateContext();
  const optionSelected = (props) => {
    setGender(props);
  };

  const handleInvite = (item) => {
    setisAddUserModal(true);
    setuserNumber(item);
  };

  const handleOnCreate = async () => {
    try {
      setLoading(true);
      const formData = new FormData();

      formData.append('fullName', userName);
      formData.append('phoneNumber', userNumber?.phoneNumber);
      formData.append('type', selectedRole?.title); // Fixed the spelling of 'designation'
      formData.append('gender', gender); // Fixed the spelling of 'designation'

      const response = await axios.post(`${BASE_URL}/user/register`, formData, {
        headers: {
          'auth-token': userState.token,
          'Content-Type': 'multipart/form-data',
          Accept: 'application/json',
        },
      });
      setLoading(false);

      // if (response.status === 200) {
      //   hideModal();
      //   alert('User has been Invited');

      //   // Uncomment if you want to send SMS
      //   // const sms = {
      //   //   phoneNumber: item.phoneNumber,
      //   //   message: `You have been invited to join connecting nature with the designation of ${designation}`,
      //   // };

      //   // await axios.post(`${BASE_URL}/sms/inviteSMS`, sms, {
      //   //   headers: {
      //   //     "auth-token": userState.token,
      //   //   },
      //   // });
      // } else {
      //   throw new Error('Failed to invite user');
      // }
    } catch (error) {
      // console.error('Error inviting user:', error);
      Alert.alert(error?.response?.data?.message);
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
  const filteredContacts = contactstate.resolvedContacts.filter((item) => {
    const nameMatch = item.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const phoneNumberMatch = item.phoneNumber
      ?.toLowerCase()
      .includes(searchQuery.toLowerCase());

    return nameMatch || phoneNumberMatch;
  });

  return (
    <View style={styles.container}>
      {/* <HeaderNormal title="Add Participants" /> */}
      <SearchHeader title="Add Participants" setSearchQuery={setSearchQuery} />

      <View style={{ flex: 1 }}>
        <FlashList
          data={searchQuery ? filteredContacts : contactstate.resolvedContacts}
          renderItem={({ item }) => {
            return (
              <View>
                <TouchableOpacity onPress={() => handleInvite(item)}>
                  <View style={styles.row}>
                    {/* <Text style={styles.text}>
                      {item.phoneNumber || 'No Phone Number'} ~ {item.name}
                    </Text> */}
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        gap: 5,
                      }}
                    >
                      <Text style={styles.text}>{item?.name} ~ </Text>
                      <Text> {item.phoneNumber || 'No Phone Number'} </Text>
                    </View>
                    <BouncyCheckbox
                      disabled
                      size={18}
                      fillColor={Color.LightGrey}
                      style={styles.bouncyCheckbox}
                      contentStyle={{ height: 35 }}
                      labelStyle={{ color: '#4582C3', fontSize: 12 }}
                      mode="contained"
                    />
                  </View>
                </TouchableOpacity>
              </View>
            );
          }}
          estimatedItemSize={200}
        />
      </View>

      {isAddUserModal && (
        <Portal>
          <Modal
            visible={isAddUserModal}
            onDismiss={() => setisAddUserModal(false)}
          >
            <View style={container}>
              <Text style={modalTitle}> Add Partiipant</Text>

              <View style={styles.contentContainer}>
                <View>
                  <View
                    style={{
                      ...inputstyle,
                      width: '100%',
                    }}
                  >
                    <TouchableOpacity>
                      <Pressable
                        onPress={() =>
                          setisDesignationModal(!isDesignationModal)
                        }
                        style={styles.groupContainer}
                      >
                        {selectedRole ? (
                          <Text>{selectedRole?.title}</Text>
                        ) : (
                          <Text style={styles.groupTitle}>
                            Please Select Designation
                          </Text>
                        )}

                        <MaterialIcons
                          name={
                            isDesignationModal
                              ? 'keyboard-arrow-up'
                              : 'keyboard-arrow-down'
                          }
                          style={{ fontSize: scale(20) }}
                        />
                      </Pressable>
                    </TouchableOpacity>
                  </View>
                  {isDesignationModal && (
                    <Animated.View entering={FadeIn} exiting={FadeOut}>
                      <View style={styles.designModalContainer}>
                        <FlatList
                          data={roleData}
                          renderItem={({ item, index }) => {
                            return (
                              <Pressable
                                style={{
                                  flexDirection: 'row',
                                  alignItems: 'center',
                                  gap: 4,
                                  borderBottomWidth: 1,
                                  borderBottomColor: Color.VeryLightGrey,
                                  paddingVertical: screenHeight * 0.01,
                                }}
                                onPress={() => {
                                  // setselectedUser(item);
                                  setisDesignationModal(false);
                                  setselectedRole(item);
                                }}
                              >
                                <View>
                                  <View style={styles.desingContainer}>
                                    <Text style={styles.title}>
                                      {item?.title}
                                    </Text>
                                  </View>
                                </View>
                              </Pressable>
                            );
                          }}
                          keyExtractor={(item) => item._id}
                          showsVerticalScrollIndicator={false}
                        />
                      </View>
                    </Animated.View>
                  )}

                  <TextInput
                    style={{
                      ...inputstyle,
                      width: '100%',
                    }}
                    value={userName}
                    onChangeText={(e) => setuserName(e)}
                    placeholder="User Name"
                    maxLength={30}
                  />
                  <View
                    style={{
                      width: screenWidth * 0.97,
                      position: 'relative',
                      right: screenWidth * 0.075,
                    }}
                  >
                    <RadioButton
                      option1="Male"
                      option2="Female"
                      onselect={optionSelected}
                    />
                  </View>

                  <TouchableOpacity
                    style={{ ...buttonContainer, width: '100%' }}
                    onPress={handleOnCreate}
                  >
                    {loading ? (
                      <ActivityIndicator color={Color.White} />
                    ) : (
                      <Text style={buttonTitle}>Invite</Text>
                    )}
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>
        </Portal>
      )}
    </View>
  );
};

export default Invite;

const styles = StyleSheet.create({
  container: {
    backgroundColor: Color.White,
    flex: 1,
  },
  contentContainer: {
    // flexDirection: 'row',
    // alignItems: 'center',
    width: screenWidth * 0.82,
  },
  row: {
    paddingHorizontal: screenWidth * 0.06,
    backgroundColor: 'white',

    alignSelf: 'center',
    borderRadius: 7,
    paddingVertical: screenHeight * 0.006,
    marginVertical: 5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: Color.VeryLightGrey,
    width: '100%',
  },
  groupContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  designModalContainer: {
    backgroundColor: Color.White,
    width: '100%',
    maxHeight: screenHeight * 0.4,
    marginTop: '3%',
    borderColor: Color.LightGrey,
    borderWidth: 1,
    borderRadius: screenHeight * 0.01,
    paddingHorizontal: '3%',
    paddingVertical: '2%',
  },
  desingContainer: {
    paddingVertical: '1%',
  },
  text: {
    fontFamily: 'Roboto_500Medium',
    fontSize: screenHeight * 0.018,
  },
});
