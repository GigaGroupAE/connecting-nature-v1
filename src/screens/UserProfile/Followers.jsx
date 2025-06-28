import {
  Dimensions,
  FlatList,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from 'react-native';
import React, { useState } from 'react';
import Color from '../../../assets/colors/Color';
import HeaderNormal from '../../components/HeaderNormal';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useUserState, useUserStateActions } from '../../slices/userSlice';
import UserFollowers from './UserFollowers';
import NoFollower from './NoFollower';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import CustomStatsBar from '../../components/CustomStatsBar';

const Height = Dimensions.get('screen').height;
const Width = Dimensions.get('screen').width;

const renderItem = ({ item }, screen, user) => {
  return (
    <View>
      <UserFollowers item={item} screen={screen} user={user} />
    </View>
  );
};

const Followers = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const userState = useUserState();
  const userActions = useUserStateActions();
  const [following, setFollowing] = useState(userState.following);
  const [activeFollowers, setactiveFollowers] = useState(true);
  const [activeFollowing, setactiveFollowing] = useState(false);

  const { userFollowing, screen, user } = route.params;

  const handleActiveFollower = () => {
    setactiveFollowers(true);
    setactiveFollowing(false);
  };
  const handleActiveFollowing = () => {
    setactiveFollowers(false);
    setactiveFollowing(true);
  };
  return (
    <SafeAreaProvider style={styles.container}>
      <CustomStatsBar backgroundColor={Color.White} />
      <View style={styles.container}>
        <HeaderNormal title={user.fullName} />

        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-around',
            width: '100%',
            borderBottomWidth: 1,
            borderBottomColor: Color.VeryLightGrey,
            height: Height * 0.05,
          }}
        >
          <TouchableOpacity
            style={
              activeFollowers ? styles.activeScreen : styles.followerContainer
            }
            onPress={handleActiveFollower}
          >
            <Text style={styles.title}>{userFollowing?.followers?.length}</Text>
            <Text style={styles.title}>followers</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={
              activeFollowing ? styles.activeScreen : styles.followerContainer
            }
            onPress={handleActiveFollowing}
          >
            <Text style={styles.title}>{userFollowing?.following?.length}</Text>
            <Text style={styles.title}>following</Text>
          </TouchableOpacity>
        </View>

        {activeFollowers ? (
          <View style={{ flex: 1 }}>
            {userFollowing.followers.length === 0 ? (
              <View>
                {userFollowing.phoneNumber === userState.phoneNumber ? (
                  <NoFollower
                    titleMain="No Follower Currently"
                    title="There are no users that followed you"
                    subtitle="at the moment."
                  />
                ) : (
                  <NoFollower
                    titleMain="No Follower Currently"
                    title="This user currently has no followers"
                  />
                )}
              </View>
            ) : (
              <FlatList
                data={userFollowing.followers}
                renderItem={({ item }) =>
                  renderItem(
                    { item },
                    screen,
                    navigation,
                    userState,
                    user,
                    userActions,
                    setFollowing,
                  )
                } // Pass 'screen' as a parameter
                keyExtractor={(item) => Math.random()}
              />
            )}
          </View>
        ) : (
          <View style={{ flex: 1 }}>
            {userFollowing.following.length === 0 ? (
              <View>
                {userFollowing.phoneNumber === userState.phoneNumber ? (
                  <NoFollower
                    titleMain="You did not Followed anyone"
                    title="There are no users that you followed"
                    subtitle="at the moment."
                  />
                ) : (
                  <NoFollower
                    titleMain="No Followed Currently"
                    title="This user is not following anyone at the moment"
                  />
                )}
              </View>
            ) : (
              <FlatList
                data={userFollowing.following}
                renderItem={({ item }) =>
                  renderItem(
                    { item },
                    screen,
                    navigation,
                    userState,
                    user,
                    userActions,
                    setFollowing,
                  )
                } // Pass 'screen' as a parameter
                keyExtractor={(item) => Math.random()}
              />
            )}
          </View>
        )}
      </View>
    </SafeAreaProvider>
  );
};

export default Followers;

const styles = StyleSheet.create({
  container: {
    backgroundColor: Color.White,
    flex: 1,
  },
  followerCard: {
    flexDirection: 'row',
    marginVertical: Height * 0.009,

    backgroundColor: Color.White,
    borderRadius: 8,
    shadowColor: Color.Grey,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
    elevation: 8,
    width: '90%',
    alignSelf: 'center',
    paddingVertical: Height * 0.01,
    paddingHorizontal: Width * 0.04,
  },
  userImage: {
    borderRadius: Height * 0.1,
    width: '100%',
    height: '100%',
    resizeMode: 'center',
  },
  imageContainer: {
    width: Width * 0.125,
    height: Height * 0.059,
    borderRadius: Height * 1,
    overflow: 'hidden',
    alignItems: 'center',
  },
  nameContainer: {
    flexDirection: 'row',
    width: '85%',
    marginLeft: Width * 0.02,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  userName: {
    fontFamily: 'Roboto_500Medium',
    fontSize: Height * 0.0177,
  },
  userRole: {
    // marginLeft: Width * 0.02,
    fontFamily: 'Roboto_400Regular',
    color: Color.Blue,
    marginTop: '-1.5%',
    fontSize: Height * 0.016,
  },
  button: {
    alignSelf: 'center',
    backgroundColor: Color.Blue,
    marginVertical: 'auto',
    paddingVertical: Height * 0.01,
    paddingHorizontal: Width * 0.05,
    borderRadius: Height * 0.01,
  },
  buttonTitle: {
    color: Color.White,
    fontFamily: 'Roboto_500Medium',
    textTransform: 'capitalize',
  },
  adminIcon: {
    marginLeft: 5,
    alignSelf: 'center',
    fontSize: Height * 0.018,
    color: Color.Blue,
  },
  title: {
    fontFamily: 'Roboto_500Medium',
    fontSize: Height * 0.02,
    paddingHorizontal: Width * 0.01,
  },
  activeScreen: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '40%',

    borderBottomColor: Color.Blue,
    borderBottomWidth: 2,
    justifyContent: 'center',
  },
  followerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '40%',
    display: 'flex',
    justifyContent: 'center',
  },
});
