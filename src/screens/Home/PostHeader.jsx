import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
} from 'react-native';
import React, { useState } from 'react';
import { Entypo } from 'react-native-vector-icons';

import Color from '../../../assets/colors/Color';
import { BASE_URL } from '../../../CONSTANTS';
import { useNavigation } from '@react-navigation/native';
import { calculateTimeDifference } from '../../utils/timeDifference';
import AdminIcon from '../../components/AdminIcon';
import { scale } from 'react-native-size-matters';
import PostDescription from '../../components/PostDesciption';
import { Image } from 'expo-image';
import PostShareModal from '../../components/PostShareModal';
import { screenHeight } from '../../utils/ScreenDimensions';

const Height = Dimensions.get('screen').height;
const Width = Dimensions.get('screen').width;

const PostHeader = ({ data, setmodalVisible }) => {
  const navigation = useNavigation();

  // console.log(data);
  const userImage = data?.postedby.profile;
  const userName = data?.postedby?.fullName;
  const userType = data.postedby.type;
  const userPhoneNumber = data?.postedby?.phoneNumber;
  const [isShareModal, setisShareModal] = useState(false);

  const handleUserProfile = () => {
    navigation.navigate('UserProfile', {
      userPhoneNumber,
    });
  };

  const timePassed = calculateTimeDifference(data.createdAT);

  return (
    <View>
      <View style={styles.postHead}>
        <Image
          style={styles.userAvatar}
          source={{
            uri: `${userImage}`,
            cache: 'force-cache',
          }}
        />
        <View
          style={{
            gap: 3,
            position: 'relative',
            bottom: screenHeight * 0.003,
          }}
        >
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
                fontSize: screenHeight * 0.0135,
                paddingHorizontal: Width * 0.02,
                color: Color.Grey,
              }}
            />
          </View>
        </View>
        <View style={styles.threeDots} onPress={() => setmodalVisible(true)}>
          <TouchableOpacity onPress={() => setisShareModal(true)}>
            <Entypo name="dots-three-horizontal" style={styles.sideIcon} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setmodalVisible(true)}>
            <Entypo
              name="cross"
              style={{ ...styles.sideIcon, fontSize: screenHeight * 0.029 }}
            />
          </TouchableOpacity>
        </View>
      </View>
      <PostDescription description={data.description} />

      {isShareModal && (
        <PostShareModal
          modalVisible={isShareModal}
          setModalVisible={setisShareModal}
          id={data?._id}
          media={data?.media}
        />
      )}
    </View>
  );
};

export default PostHeader;

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
    fontSize: screenHeight * 0.0166,
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
    fontSize: screenHeight * 0.0135,
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
    // position: "relative",
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
    fontSize: screenHeight * 0.029,
    paddingHorizontal: scale(6),
  },
});
