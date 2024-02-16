import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
} from 'react-native';
import React from 'react';
import { Entypo } from 'react-native-vector-icons';
import { Image } from 'expo-image';

import { useNavigation } from '@react-navigation/native';
import { calculateTimeDifference } from '../utils/timeDifference';
import { scale } from 'react-native-size-matters';
import Color from '../../assets/colors/Color';
import AdminIcon from './AdminIcon';
import PostDescription from './PostDesciption';
import { BASE_URL } from '../../CONSTANTS';
const Height = Dimensions.get('screen').height;
const Width = Dimensions.get('screen').width;

const PostSharedHeader = ({
  postedBy,
  sharedBy,
  setmodalVisible,
  description,
  createdAT,
}) => {
  const navigation = useNavigation();
  const userImage = postedBy?.profile;
  const userName = postedBy?.fullName;
  const userType = postedBy?.type;
  const userPhoneNumber = postedBy?.postedby?.phoneNumber;
  const ownerImage = sharedBy?.postedby?.profile;
  const ownerName = sharedBy?.postedby?.fullName;
  const ownerPhoneNumber = sharedBy?.postedby?.phoneNumber;
  const ownerType = sharedBy?.postedby?.type;

  const handleUserProfile = () => {
    navigation.navigate('UserProfile', {
      userPhoneNumber,
    });
  };
  const handleOwnerProfileNavigation = () => {
    navigation.navigate('UserProfile', {
      userPhoneNumber: ownerPhoneNumber,
    });
  };

  const timePassed = calculateTimeDifference(createdAT);
  const postTime = calculateTimeDifference(sharedBy?.createdAT);
  return (
    <View>
      <View style={styles.sharedContainer}>
        <View>
          <View style={styles.postHead}>
            <Image
              style={styles.userAvatar}
              source={{
                uri: `${BASE_URL}/images/${userImage}`,
                cache: 'force-cache',
              }}
            />
            <View>
              <TouchableOpacity
                style={{ flexDirection: 'row' }}
                onPress={handleUserProfile}
              >
                <Text style={styles.userName}>{userName}</Text>
                <AdminIcon userType={userType} />
              </TouchableOpacity>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                }}
              >
                {timePassed === '0m ago' ? (
                  <Text style={styles.postTime}>Just now</Text>
                ) : (
                  <Text style={styles.postTime}>{timePassed}</Text>
                )}
                <Entypo
                  name="globe"
                  color={Color.Black}
                  style={{
                    fontSize: 12,
                    paddingHorizontal: Width * 0.02,
                    color: Color.Grey,
                  }}
                />
              </View>
            </View>
            <View
              style={styles.threeDots}
              onPress={() => setmodalVisible(true)}
            >
              <TouchableOpacity onPress={() => setmodalVisible(false)}>
                <Entypo name="dots-three-horizontal" style={styles.sideIcon} />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setmodalVisible(true)}>
                <Entypo
                  name="cross"
                  style={{ ...styles.sideIcon, fontSize: scale(23) }}
                />
              </TouchableOpacity>
            </View>
          </View>
          <PostDescription description={description} />
        </View>
        <View style={styles.postOwner}>
          <View style={styles.sharedPostContainer}>
            <Image
              style={{ ...styles.userAvatar, width: 30, height: 30 }}
              source={{
                uri: `${BASE_URL}/images/${ownerImage}`,
                cache: 'force-cache',
              }}
            />
            <View>
              <TouchableOpacity
                style={{ flexDirection: 'row' }}
                onPress={handleOwnerProfileNavigation}
              >
                <Text style={{ ...styles.userName, fontSize: 12 }}>
                  {ownerName}
                </Text>

                <AdminIcon userType={ownerType} />
              </TouchableOpacity>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                }}
              >
                {postTime === '0m ago' ? (
                  <Text style={styles.postTime}>Just now</Text>
                ) : (
                  <Text style={styles.postTime}>{postTime}</Text>
                )}
                <Entypo
                  name="globe"
                  color={Color.Black}
                  style={{
                    fontSize: 12,
                    paddingHorizontal: Width * 0.02,
                    color: Color.Grey,
                  }}
                />
              </View>
            </View>
          </View>
          <PostDescription description={sharedBy?.description} />
        </View>
      </View>
    </View>
  );
};

export default PostSharedHeader;

const styles = StyleSheet.create({
  postHead: {
    width: '100%',
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
    alignContent: 'center',
    paddingHorizontal: 17,
  },
  userAvatar: {
    marginRight: 10,
    backgroundColor: Color.VeryLightGrey,
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  userName: {
    color: Color.Black,
    fontSize: 14,
    fontFamily: 'Roboto_600SemiBold',
    alignSelf: 'center',
  },
  type: {
    color: Color.Blue,
    fontSize: 12,
    marginLeft: 5,
    fontFamily: 'Roboto_400Regular',
    alignSelf: 'center',
  },
  postTime: {
    fontFamily: 'Roboto_400Regular',
    color: Color.Black,
    fontSize: 11,
  },
  cross: {
    position: 'absolute',
    right: 45,
    top: 0,
  },
  threeDots: {
    position: 'absolute',
    right: '4%',
    top: 0,
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-end',
  },
  adminIcon: {
    marginLeft: 5,
    alignSelf: 'center',
    fontSize: Height * 0.018,
    color: Color.Blue,
  },
  sideIcon: {
    alignSelf: 'center',
    marginTop: Height * 0.015,
    color: Color.Black,
    fontSize: Height * 0.026,
    paddingHorizontal: scale(6),
  },
  sharedPostContainer: {
    width: '100%',
    alignSelf: 'center',
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
    alignContent: 'center',
    paddingHorizontal: 17,
  },
  postOwner: {
    width: '88%',
    alignSelf: 'center',
    borderRightWidth: 1,
    borderLeftWidth: 1,
    borderColor: Color.LightGrey,
    marginTop: scale(7),
    borderTopWidth: 1,
  },
});
