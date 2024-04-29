import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React from 'react';
import { BASE_URL } from '../../CONSTANTS';
import { MaterialCommunityIcons } from 'react-native-vector-icons';
import { isFollowing } from '../utils/isFollowing';
import { useNavigation } from '@react-navigation/native';
import { useUserState, useUserStateActions } from '../slices/userSlice';
import Color from '../../assets/colors/Color';
import axios from 'axios';
import { useStateContext } from '../contexts/ContextProvider';
import { axiosInstance } from '../../axiosInstance';
import AdminIcon from './AdminIcon';

const Height = Dimensions.get('screen').height;
const Width = Dimensions.get('screen').width;

const UserProfileState = ({ user, postCount, refetch }) => {
  const { setgroup } = useStateContext();
  const navigation = useNavigation();
  const userState = useUserState();
  const userActions = useUserStateActions();
  // const { data: CNGroups, isLoading: chatLoading } = useQuery(
  //   'userChat',
  //   getMyChat,
  // );

  const handleFollow = async () => {
    try {
      const { data } = await axios.patch(
        `${BASE_URL}/user/toggleFollow/${user.phoneNumber}`,
        {},
        {
          headers: {
            'auth-token': userState.token,
          },
        },
      );
      if (data.success) {
        userActions.setFollowing(data.following);
        refetch();
      }
    } catch (error) {
      console.log(error);
    }
  };

  // const selectcontact = (props) => {
  //   let first = false;
  //   let second = false;
  //   let foundGroup = {};
  //   const individualGroups = CNGroups;
  //   individualGroups.map((group) => {
  //     if (
  //       group.members[0].phoneNumber === userState.phoneNumber ||
  //       group.members[0].phoneNumber === props.phoneNumber
  //     ) {
  //       first = true;
  //       if (
  //         group.members[1].phoneNumber === userState.phoneNumber ||
  //         group.members[1].phoneNumber === props.phoneNumber
  //       ) {
  //         second = true;
  //         foundGroup = group;
  //       }
  //     }
  //   });
  //   if (first === true && second === true) {
  //     setgroup(foundGroup);
  //     navigation.navigate('ChatCN', { group: foundGroup });
  //   } else {
  //     console.log('login user is ===>', userState.id);
  //     console.log('props user is =====>', props._id);

  //     let members = [userState.id, props._id];
  //     let data;

  //     data = {
  //       members: members,
  //       messages: [],
  //     };
  //     axios
  //       .post(`${BASE_URL}/chat/createchat`, data, {
  //         headers: {
  //           'auth-token': userState.token,
  //         },
  //       })
  //       .then((response) => {
  //         axios
  //           .get(`${BASE_URL}/chat/get-my-chats`, {
  //             headers: {
  //               'auth-token': userState.token,
  //             },
  //           })
  //           .then((res) => {
  //             const newgroup = res.data.myChats.filter((singlegroup) => {
  //               return singlegroup._id === response.data._id;
  //             });
  //             setgroup(newgroup[0]);
  //             navigation.navigate('ChatCN', { group: newgroup[0] });
  //           })
  //           .catch((e) => console.log(e));
  //       })
  //       .catch((e) => console.log(e));
  //   }
  // };

  const selectcontact = async (props) => {
    try {
      const { data } = await axiosInstance.post(
        `/chat/getOrCreate/${props?._id}`,
      );
      // console.log(data?.chat, 'data');
      setgroup(data?.chat);
      navigation.navigate('ChatCN', { group: data?.chat });
    } catch (error) {
      console.log(error);
    }
  };

  const handleFollowers = () => {
    navigation.navigate('Followers', {
      userFollowing: user,
      screen: 'Followers',
      user: user,
    });
  };

  const handleFollowing = () => {
    navigation.navigate('Followers', {
      userFollowing: user,
      screen: 'Following',
      user: user,
    });
  };

  const handleEditProfile = () => {
    navigation.navigate('EditProfile');
  };
  const handleAddPost = () => {
    navigation.navigate('AddPost', { origin: 'post' });
  };
  return (
    <View style={styles.profileContainer}>
      <View>
        <View style={styles.profileTitle}>
          <Image
            style={styles.avatar}
            source={{
              uri: `${BASE_URL}/images/${user.profile}`,
            }}
          />

          <View style={styles.userNameContainer}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
              }}
            >
              <Text style={styles.userName}>{user.fullName}</Text>

              {/* {(user.type === 'Operations' ||
                user.type === 'Admin' ||
                user.type === 'Manager' ||
                user.type === 'Assistant Manager' ||
                user.type === 'Super Admin' ||
                user.type === 'celebrity') && (
                <MaterialCommunityIcons
                  name="check-decagram"
                  style={styles.adminIcon}
                />
              )} */}
              <AdminIcon userType={user.type} />
            </View>

            <View style={styles.userProfileStats}>
              <TouchableOpacity style={styles.followersStats}>
                <Text style={styles.statCount}>{postCount}</Text>
                <Text style={styles.statText}>Posts</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.followersStats}
                onPress={handleFollowers}
              >
                <Text style={styles.statCount}>{user.followers.length}</Text>
                <Text style={styles.statText}>Followers</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.followingStats}
                onPress={handleFollowing}
              >
                <Text style={styles.statCount}>{user.following.length}</Text>
                <Text style={styles.statText}>Following</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>

      {user.phoneNumber !== userState.phoneNumber ? (
        <View style={styles.buttons}>
          <TouchableOpacity style={styles.FollowButton} onPress={handleFollow}>
            <Text style={styles.title}>
              {isFollowing(userState.following, user.phoneNumber)
                ? 'Following'
                : 'Follow +'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              ...styles.FollowButton,
              backgroundColor: Color.White,
              borderColor: Color.Black,
              borderWidth: 0.7,
              marginLeft: Width * 0.07,
            }}
            onPress={() => selectcontact(user)}
          >
            <Text style={{ ...styles.title, color: Color.Black }}>Message</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.buttons}>
          <TouchableOpacity style={styles.FollowButton} onPress={handleAddPost}>
            <Text style={styles.title}>Create Post</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              ...styles.FollowButton,
              backgroundColor: Color.White,
              borderColor: Color.Black,
              borderWidth: 0.7,
              marginLeft: Width * 0.07,
            }}
            onPress={handleEditProfile}
          >
            <Text style={{ ...styles.title, color: Color.Black }}>
              Edit Profile
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default UserProfileState;

const styles = StyleSheet.create({
  profileContainer: {
    backgroundColor: Color.White,
    paddingHorizontal: 17,
    paddingTop: 10,
    borderBottomWidth: 2,
    borderColor: Color.VeryLightGrey,
  },
  profileTitle: {
    flexDirection: 'row',
  },
  avatar: {
    borderRadius: Dimensions.get('screen').height * 0.1,
    width: Dimensions.get('screen').height * 0.09,
    height: Dimensions.get('screen').height * 0.09,
    backgroundColor: Color.VeryLightGrey,
  },
  userNameContainer: {
    justifyContent: 'center',
  },
  userName: {
    fontSize: 15,
    fontFamily: 'Roboto_600SemiBold',
    color: Color.Black,
    alignSelf: 'center',
    marginLeft: 15,
  },
  userCategory: {
    marginLeft: 15,
    fontSize: 14,
    fontFamily: 'Roboto_400Regular',
    color: Color.Blue,
  },
  userDescription: {
    marginTop: 14,
    fontSize: 14,
    fontFamily: 'Roboto_400Regular',
    color: Color.Black,
    textAlign: 'left',
  },
  userProfileStats: {
    flexDirection: 'row',
    marginTop: 16,
    // paddingHorizontal: 35,
    justifyContent: 'space-between',
    width: '73%',
    position: 'relative',
    top: Height * -0.02,
    left: Width * 0.038,
    paddingVertical: Height * 0.008,
  },
  postsStats: {
    alignItems: 'center',
  },
  followersStats: {
    alignItems: 'center',
  },
  followingStats: {
    alignItems: 'center',
  },
  statCount: {
    fontSize: Height * 0.025,
    fontFamily: 'Roboto_600SemiBold',
    color: Color.Black,
    fontWeight: '700',
  },
  statText: {
    fontSize: Height * 0.017,
    // fontWeight: "500",
    fontFamily: 'Roboto_700Bold',
    lineHeight: 21,
    color: Color.Black,
  },
  buttons: {
    flexDirection: 'row',
    marginBottom: 16,
    width: '80%',
  },
  adminIcon: {
    marginLeft: 5,
    alignSelf: 'center',
    fontSize: Height * 0.019,
    color: Color.Blue,
  },
  safeArea: {
    backgroundColor: Color.White,
    flex: 1,
  },

  noPostsText: {
    fontFamily: 'Roboto_500Medium',
    fontSize: Height * 0.02,
    alignSelf: 'center',
    justifyContent: 'center',
  },
  heading: {
    fontFamily: 'Roboto_700Bold',
    color: Color.Black,
    fontSize: Height * 0.019,
    paddingVertical: Height * 0.01,
  },
  subHeading: {
    fontFamily: 'Roboto_500Medium',
    color: Color.Black,
    fontSize: Height * 0.016,
  },
  bellIcon: {
    width: Width * 0.3,
    height: Height * 0.13,
    resizeMode: 'contain',
  },
  button: {
    backgroundColor: Color.Blue,
    marginTop: Height * 0.05,
    paddingHorizontal: Width * 0.06,
    paddingVertical: Height * 0.013,
    borderRadius: Height * 0.01,
  },
  buttonTitle: {
    fontFamily: 'Roboto_600SemiBold',
    color: Color.White,
    fontSize: Height * 0.02,
  },
  FollowButton: {
    backgroundColor: Color.Blue,
    // paddingHorizontal: Width * 0.02,
    width: '45%',
    alignItems: 'center',
    paddingVertical: Height * 0.009,
    borderRadius: Height * 0.01,
  },
  title: {
    alignSelf: 'center',
    color: Color.White,
    fontFamily: 'Roboto_600SemiBold',
    fontSize: 14,
  },
});
