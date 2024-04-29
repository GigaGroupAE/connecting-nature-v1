import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  KeyboardAvoidingView,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import HeaderNormal from '../../components/HeaderNormal';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import InputText from '../../components/InputText';
import AddGroupLeaderBtn from '../../components/AddGroupLeaderBtn';
import ButtonLarge from '../../components/ButtonLarge';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';
import { useUserState } from './../../slices/userSlice';
import SelectList from 'react-native-dropdown-select-list';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { BASE_URL } from '../../../CONSTANTS';
import Color from '../../../assets/colors/Color';
import { useStateContext } from '../../contexts/ContextProvider.js';
import CustomStatsBar from '../../components/CustomStatsBar';
import { adminRole } from '../../utils/AdminRoles';
export default function CreateGroup() {
  const [loading, setLoading] = useState(false);

  // const route = useRoute();
  const { showSnackbar } = useStateContext();
  const height = Dimensions.get('screen').height;
  const width = Dimensions.get('screen').width;
  const userState = useUserState();
  const navigation = useNavigation();
  const groupType = [
    { key: '1', value: 'Managerial Groups' },
    { key: '2', value: 'Departmental Groups' },
    { key: '3', value: 'Social Groups' },
    { key: '4', value: 'Outsource Groups' },
  ];

  const normalUserGroup = [{ key: '3', value: 'Social Groups' }];
  const [selected, setSelected] = useState(null);
  // Image Picker Code Start -------------------------------------------------
  const [hasGalleryPermission, setHasGalleryPermission] = useState(null);
  const [image, setImage] = useState(null);
  const [title, setTitle] = useState('');

  useEffect(() => {
    (async () => {
      const galleryStatus =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      setHasGalleryPermission(galleryStatus.status === 'granted');
    })();
  }, []);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [3, 4],
      quality: 1,
    });

    if (!result.cancelled) {
      setImage(result.uri);
    }
  };

  //Image Picker Code End ----------------------------------------------------

  const handlebackpress = () => {
    navigation.goBack();
  };

  const generateRandomCode = () => {
    const min = 100000;
    const max = 999999;
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  // Common prefix for the code
  const prefix = 'GB';

  const ownerCode = prefix + generateRandomCode();
  const leadCode = prefix + generateRandomCode();

  const handleOnCreate = async () => {
    if (!title && !selected) {
      return;
    }
    setLoading(true);
    let type = '';
    if (selected == 1) {
      type = 'Managerial';
    } else if (selected == 2) {
      type = 'Departmental';
    } else if (selected == 3) {
      type = 'Social';
    } else {
      type = 'Outsource';
    }
    const members = [
      { member: userState.id, privilege: 'Owner' },
      { member: groupLeader._id, privilege: 'Lead' },
    ];
    // const Communitymembers = [
    //   { member: userState.id, privilege: 'Owner', code: ownerCode },
    //   { member: groupLeader._id, privilege: 'Lead', code: leadCode },
    // ];

    //creating form here
    const formData = new FormData();
    formData.append('name', userState.fullName);
    formData.append('type', type);
    formData.append('title', title);

    formData.append('members', JSON.stringify(members));

    if (image !== null) {
      formData.append('groupPic', {
        name: `groupPic.jpg`, // phone number is added to make sure data doesn't duplicate at any cost
        uri: image,
        type: 'image/jpg',
      });
    }
    const config = {
      headers: {
        'Content-Type': 'multipart/form-data',
        Accept: 'application/json',
        'auth-token': userState.token,
      },
    };

    //console.log("form data is ", formData);

    // let route;
    // if (type === 'Bidding Chaneel') {
    //   route = axios.post(
    //     `${BASE_URL}/bidChannel/createchannel`,
    //     formData,
    //     config,
    //   );
    // } else {
    //   route = axios.post(`${BASE_URL}/groups/creategroup`, formData, config);
    // }

    try {
      const { data } = await axios.post(
        `${BASE_URL}/groups/creategroup`,
        formData,
        config,
      );

      navigation.goBack();
      setLoading(false);
      showSnackbar('Group Created Successfully');
    } catch (error) {}
  };
  const [groupLeader, setgroupLeader] = useState(null);
  const selectedcontact = (props) => {
    setgroupLeader(props);
  };

  const isAdminRole = adminRole.includes(userState?.type);
  return (
    <SafeAreaProvider style={styles.container}>
      <CustomStatsBar backgroundColor={Color.White} />
      <View style={styles.main}>
        <HeaderNormal title="Create Profile" onback={handlebackpress} />
        <KeyboardAvoidingView behavior="padding">
          <View>
            <TouchableOpacity
              onPress={() => pickImage()}
              style={{
                marginTop: height * 0.02,
                width: width * 0.31,
                alignSelf: 'center',
              }}
            >
              <Image
                style={{
                  justifyContent: 'center',
                  alignSelf: 'center',
                  borderRadius: height * 0.1,
                  width: height * 0.16,
                  height: height * 0.16,
                }}
                source={require('../../../assets/avatar-placeholder.png')}
              />
              {image && (
                <Image
                  source={{ uri: image }}
                  style={{
                    position: 'absolute',
                    justifyContent: 'center',
                    alignSelf: 'center',
                    borderRadius: height * 0.1,
                    width: height * 0.16,
                    height: height * 0.16,
                  }}
                />
              )}
            </TouchableOpacity>
          </View>

          <View style={styles.inputContainer}>
            <InputText
              title="Group Name"
              value={title}
              onchange={setTitle}
              maxLength={30}
            />
            {isAdminRole ? (
              <SelectList
                onSelect={() => selected}
                placeholder="Group Type"
                setSelected={(val) => {
                  setSelected(val);
                }}
                save="value"
                data={groupType}
                arrowicon={
                  <FontAwesome name="chevron-down" size={14} color="#707070" />
                }
                searchicon={
                  <FontAwesome name="search" size={14} color="#707070" />
                }
                search={false}
                boxStyles={{
                  marginTop: 15,
                  borderRadius: 8,
                  backgroundColor: 'white',
                  borderWidth: 0,
                  elevation: 8,
                  shadowColor: '#707070',
                  paddingVertical: 15,
                  color: '#707070',
                }} //override default styles
                inputStyles={{
                  color: '#707070',
                  fontFamily: 'Roboto',
                  marginLeft: -4,
                }}
                dropdownStyles={{
                  borderWidth: 0,
                  backgroundColor: '#f4f4f4',
                }}
                defaultOption={
                  {
                    // key: "1",
                    // value: "Group Type",
                  }
                } //default selected option
              />
            ) : (
              <SelectList
                onSelect={() => console.log(selected)}
                placeholder="Group Type"
                setSelected={(val) => {
                  setSelected(val);
                }}
                save="value"
                data={normalUserGroup}
                arrowicon={
                  <FontAwesome name="chevron-down" size={14} color="#707070" />
                }
                searchicon={
                  <FontAwesome name="search" size={14} color="#707070" />
                }
                search={false}
                boxStyles={{
                  marginTop: 15,
                  borderRadius: 8,
                  backgroundColor: 'white',
                  borderWidth: 0,
                  elevation: 8,
                  shadowColor: '#707070',
                  paddingVertical: 15,
                  color: '#707070',
                }} //override default styles
                inputStyles={{
                  color: '#707070',
                  fontFamily: 'Roboto',
                  marginLeft: -4,
                }}
                dropdownStyles={{
                  borderWidth: 0,
                  backgroundColor: '#f4f4f4',
                }}
                defaultOption={
                  {
                    // key: "1",
                    // value: "Group Type",
                  }
                } //default selected option
              />
            )}

            <View style={{ marginTop: height * 0.025 }}>
              <AddGroupLeaderBtn
                onPress={() =>
                  navigation.navigate('SelectContact', {
                    selectedContact: selectedcontact,
                    IntranetChat: 'Intranet',
                  })
                }
              />
              {groupLeader !== null ? (
                <View
                  style={{
                    marginTop: 10,
                    padding: 20,
                    borderRadius: 5,
                    justifyContent: 'center',
                    alignSelf: 'center',
                    width: width * 0.8,
                  }}
                >
                  <View
                    style={{
                      flexDirection: 'row',
                    }}
                  >
                    <Text
                      style={{
                        fontFamily: 'Roboto_500Medium',
                        fontSize: 14,
                        color: 'blue',
                      }}
                    >
                      {groupLeader.fullName}
                    </Text>
                  </View>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                    }}
                  >
                    <Text
                      style={{
                        fontFamily: 'Roboto_400Regular',
                        fontSize: 12,
                        color: 'grey',
                      }}
                    >
                      {groupLeader.phoneNumber}
                    </Text>

                    <Text
                      style={{
                        fontFamily: 'Roboto_400Regular',
                        fontSize: 14,
                        textDecorationLine: 'underline',
                        color: 'blue',
                        marginLeft: 'auto',
                      }}
                      onPress={() => {
                        navigation.navigate('SelectContact', {
                          selectedContact: selectedcontact,
                          IntranetChat: 'Intranet',
                        });
                      }}
                    >
                      Change
                    </Text>
                  </View>
                </View>
              ) : null}
            </View>

            <ButtonLarge
              title={
                !loading ? (
                  <ActivityIndicator color={Color.White} />
                ) : (
                  'Create Group'
                )
              }
              click={handleOnCreate}
              disabled={loading}
            />
          </View>
        </KeyboardAvoidingView>
      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  main: {
    width: '100%',
    backgroundColor: 'white',
  },
  inputContainer: {
    paddingHorizontal: 27,
    marginTop: 15,
    width: '100%',
    height: '100%',
  },
});
