import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React from 'react';
import { scale } from 'react-native-size-matters';
import Color from '../../assets/colors/Color';
import { Octicons } from 'react-native-vector-icons';
import { BASE_URL } from '../../CONSTANTS';
import { useUserState } from '../slices/userSlice';
import { useNavigation } from '@react-navigation/native';
import { useStateContext } from '../contexts/ContextProvider';
import { axiosInstance } from '../../axiosInstance';
import { screenHeight } from '../utils/ScreenDimensions';

const GroupMembersList = ({ group }) => {
  const userState = useUserState();
  const navigation = useNavigation();
  const { setgroup, showSnackbar } = useStateContext();

  // const selectcontact = (props) => {
  //   let first = false;
  //   let second = false;
  //   let foundGroup = {};
  //   const individualGroups = Messages;
  //   individualGroups.map((group) => {
  //     if (
  //       group.members[0].member?.phoneNumber === userState.phoneNumber ||
  //       group.members[0].member?.phoneNumber === props.phoneNumber
  //     ) {
  //       first = true;
  //       if (
  //         group.members[1].member?.phoneNumber === userState.phoneNumber ||
  //         group.members[1].member?.phoneNumber === props.phoneNumber
  //       ) {
  //         second = true;
  //         foundGroup = group;
  //       }
  //     }
  //   });
  //   if (first === true && second === true) {
  //     setgroup(foundGroup);
  //     navigation.navigate('ChatCRM', { group: foundGroup });
  //   } else {
  //     let members = [];
  //     members = [
  //       {
  //         member: userState.id,
  //       },
  //       {
  //         member: props._id,
  //       },
  //     ];
  //     const formData = new FormData();
  //     formData.append('name', userState.fullName);
  //     formData.append('type', 'individual');
  //     formData.append('title', 'test');
  //     formData.append('members', JSON.stringify(members));
  //     axios
  //       .post(`${BASE_URL}/groups/creategroup`, formData, {
  //         headers: {
  //           'Content-Type': 'multipart/form-data',
  //           Accept: 'application/json',
  //           'auth-token': userState.token,
  //         },
  //       })
  //       .then((response) => {
  //         axios
  //           .get(`${BASE_URL}/groups/getcrmmessages`, {
  //             headers: {
  //               'auth-token': userState.token,
  //             },
  //           })
  //           .then((res) => {
  //             const newgroup = res.data.filter((singlegroup) => {
  //               return singlegroup._id === response.data._id;
  //             });
  //             setgroup(newgroup[0]);
  //             navigation.navigate('ChatCRM', { group: newgroup[0] });
  //           })
  //           .catch((e) => console.log(e));
  //       })
  //       .catch((e) => console.log(e));
  //   }
  // };

  const selectcontact = async (props) => {
    try {
      const { data } = await axiosInstance.post(
        `/groups/get-orCreateGroup/${props?._id}`,
      );
      setgroup(data?.group);
      navigation.navigate('ChatCRM', { group: data?.group });
    } catch (error) {
      console.log(error);
    }
  };
  const handleUser = (user) => {
    if (user?._id === userState.id) {
      showSnackbar('You cannot text yourself');
      return;
    } else {
      selectcontact(user);
    }
  };

  return (
    <View>
      <FlatList
        data={group?.members}
        renderItem={({ item }) => {
          return (
            <View style={styles.container}>
              <TouchableOpacity
                style={styles.contentContainer}
                onPress={() => handleUser(item?.member)}
              >
                <View>
                  <Image
                    source={{
                      uri: `${item?.member?.profile}`,
                    }}
                    style={styles.userImage}
                  />
                </View>
                <View style={styles.detailContainer}>
                  <View style={styles.nameContainer}>
                    {item?.member._id === userState.id ? (
                      <Text style={styles.userName}>You</Text>
                    ) : (
                      <Text style={styles.userName}>
                        {item?.member?.fullName}
                      </Text>
                    )}

                    <Octicons
                      name="dot-fill"
                      style={{
                        color: 'rgba(112, 112, 112, 1)',
                        paddingHorizontal: scale(8),
                        fontSize: scale(7),
                      }}
                    />
                    <Text style={styles.userPrivilege}>{item?.privilege}</Text>
                  </View>
                  <View>
                    <Text style={styles.userType}>{item?.member?.type}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            </View>
          );
        }}
      />
    </View>
  );
};

export default GroupMembersList;

const styles = StyleSheet.create({
  container: {
    height: scale(58),
    borderBottomWidth: 0.7,
    borderBottomColor: Color.LightGrey,
    justifyContent: 'center',
    paddingHorizontal: scale(10),
    paddingVertical: scale(16),
  },
  userImage: {
    width: scale(40),
    height: scale(40),
    borderRadius: scale(20),
    resizeMode: 'cover',
  },
  contentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userName: {
    fontFamily: 'Roboto_700Bold',
    fontSize: screenHeight * 0.016,
    color: 'rgba(112, 112, 112, 1)',
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: scale(3),
    color: Color.Grey,
  },
  detailContainer: {
    flexDirection: 'column',
    justifyContent: 'space-evenly',
    paddingHorizontal: scale(10),
  },
  userPrivilege: {
    fontFamily: 'Roboto_500Medium',
    color: 'rgba(112, 112, 112, 1)',
    fontSize: screenHeight * 0.014,
  },
  userType: {
    color: 'rgba(112, 112, 112, 1)',
    fontFamily: 'Roboto_400Regular',
    fontSize: screenHeight * 0.014,
  },
});
