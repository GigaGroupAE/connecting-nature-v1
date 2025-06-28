import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React from 'react';
import { BASE_URL } from '../../../CONSTANTS';
import { calculateTimeDifference } from '../../utils/timeDifference';
import { useStateContext } from '../../contexts/ContextProvider';
import { useNavigation } from '@react-navigation/native';
import { MaterialCommunityIcons, Entypo } from 'react-native-vector-icons';
import Color from '../../../assets/colors/Color';
import AdminSvg from '../../components/SVG/AdminSvg';
import AdminIcon from '../../components/AdminIcon';

const height = Dimensions.get('screen').height;
const width = Dimensions.get('screen').width;
const StoryCommentHeader = ({ setmodalVisible }) => {
  const { selectedStory } = useStateContext();

  const timePassed = calculateTimeDifference(selectedStory.createdAT);

  const navigation = useNavigation();

  return (
    <View>
      {/* User Details Container */}
      <View
        style={[
          styles.userContainer,
          {
            width: '93%',
            alignSelf: 'center',
            marginTop: height * 0.01,
          },
        ]}
      >
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('UserProfile', {
              userPhoneNumber: selectedStory.postedby.phoneNumber,
            });
          }}
        >
          <View style={{ flex: 1 }}>
            {/* User Image */}
            <Image
              style={styles.userImg}
              source={{
                uri: `${selectedStory?.postedby?.profile}`,
              }}
              resizeMode="cover"
            />
          </View>
        </TouchableOpacity>

        {/* User Details */}
        <View style={{ flex: 1, marginLeft: width * 0.03 }}>
          {/* User Type */}
          <View style={styles.userContainer}>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('UserProfile', {
                  userPhoneNumber: selectedStory.postedby.phoneNumber,
                });
              }}
              style={styles.userNameContainer}
            >
              <Text style={styles.userName}>
                {selectedStory?.postedby?.fullName}
              </Text>

              {/* {userRole?.includes(selectedStory?.postedby?.type) && (
                <MaterialCommunityIcons
                  name="check-decagram"
                  style={styles.adminIcon}
                />
              )} */}

              <View
                style={{
                  position: 'relative',
                  right: width * 0.002,
                }}
              >
                <AdminIcon userType={selectedStory?.postedby?.type} />
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              style={{ position: 'absolute', right: 16, alignSelf: 'center' }}
              onPress={() => setmodalVisible(true)}
            >
              <Entypo
                name="dots-three-horizontal"
                size={15}
                color={Color.Black}
              />
            </TouchableOpacity>
          </View>
          <Text style={styles.postDuration}>{timePassed} </Text>
        </View>
      </View>
    </View>
  );
};

export default StoryCommentHeader;

const styles = StyleSheet.create({
  userContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 2,
  },
  userImg: {
    width: 40,
    height: 40,
    resizeMode: 'contain',
    borderRadius: height * 0.1,
  },
  userName: {
    fontWeight: 'bold',
    color: Color.Black,
    paddingRight: width * 0.01,
  },
  userNameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    overflow: 'hidden',
  },
  postDuration: {
    fontSize: 14,
    fontWeight: '400',
    fontFamily: 'Roboto_400Regular',
    color: Color.DarkGrey,
  },
  adminIcon: {
    alignSelf: 'center',
    fontSize: height * 0.015,
    color: Color.Blue,
  },
});
