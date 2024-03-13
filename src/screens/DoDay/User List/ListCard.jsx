import {
  Dimensions,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React from 'react';
import Color from '../../../../assets/colors/Color';
import { useStateContext } from '../../../contexts/ContextProvider';
import { axiosInstance } from '../../../../axiosInstance';
import { BASE_URL } from '../../../../CONSTANTS';
import { MaterialCommunityIcons } from 'react-native-vector-icons';

const Height = Dimensions.get('screen').height;
const Width = Dimensions.get('screen').width;

const ListCard = (props) => {
  const username =
    props.user.fullName.length > 10
      ? props.user.fullName.slice(0, 9) + '..'
      : props.user.fullName;
  const getStatusStyle = () => {
    switch (props.data.status) {
      case 'invite':
        return styles.success;

      default:
        return styles.sent;
    }
  };
  const { loading, setLoading } = useStateContext();
  const inviteVolunteer = async () => {
    try {
      setLoading(true);
      const { data } = await axiosInstance.patch(
        `/campaigns/invite-volunteer/${props.data.campaignId}`,
        {
          phoneNumbers: [props.user.phoneNumber],
          usersToUpdate: [props.user._id],
        },
      );
      if (data.success) {
        props.data.setRefetch(Math.random()); // will cause a refetch
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };
  return (
    <View style={styles.container}>
      <View style={styles.contentContainer}>
        <Image
          source={{ uri: `${BASE_URL}/images/${props?.user?.profile}` }}
          style={styles.userImg}
        />
        <View
          style={{
            marginTop: Height * 0.008,
            flex: 0,
            // alignSelf: "center",
            flexDirection: 'row',
          }}
        >
          <Text style={styles.userName}>{username}</Text>
          {(props.user?.type === 'Operations' ||
            props.user?.type === 'Admin' ||
            props.user?.type === 'Manager' ||
            props.user?.type === 'Assistant Manager' ||
            props.user?.type === 'Super Admin' ||
            props.user?.type === 'celebrity') && (
            <MaterialCommunityIcons
              name="check-decagram"
              style={styles.adminIcon}
            />
          )}
        </View>
      </View>
      <View style={styles.userPoints}>
        <Text style={styles.pts}>Pts</Text>
        <Text style={styles.points}>{props?.user?.points || '0'}</Text>
      </View>

      <View style={styles.btnContainer}>
        <Pressable
          disabled={props.data.status !== 'invite' || loading}
          onPress={inviteVolunteer}
          style={({ pressed }) => (pressed ? [{ opacity: 0.5 }] : null)}
        >
          <Text style={[styles.pressed, getStatusStyle()]}>
            {' '}
            {props.data.status}{' '}
          </Text>
        </Pressable>
      </View>
    </View>
  );
};

export default ListCard;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    // marginVertical: Height * 0.002,

    backgroundColor: Color.White,
    borderRadius: 8,
    // shadowColor: Color.Grey,
    // shadowOffset: {
    //   width: 0,
    //   height: 4,
    // },
    // shadowOpacity: 0.27,
    // shadowRadius: 4.65,
    // elevation: 4,
    justifyContent: 'space-between',
    width: '95%',
    alignSelf: 'center',
    borderBottomWidth: 0.7,
    borderColor: Color.LightGrey,
  },
  contentContainer: {
    flexDirection: 'row',
    paddingVertical: Height * 0.01,
    alignContent: 'center',
    marginLeft: Width * 0.03,
    justifyContent: 'space-between',
  },
  userImg: {
    width: 45,
    height: 45,
    borderRadius: 25,
    resizeMode: 'contain',
  },
  userName: {
    fontFamily: 'Roboto_500Medium',
    marginLeft: Width * 0.02,
    fontSize: Height * 0.0177,
  },
  userRole: {
    marginLeft: Width * 0.02,
    fontFamily: 'Roboto_400Regular',
    color: Color.Blue,
    marginTop: '-1.5%',
    fontSize: Height * 0.016,
  },
  userPoints: {
    position: 'absolute',
    left: Width * 0.48,
    alignSelf: 'center',
  },
  pts: {
    color: Color.Black,
    fontFamily: 'Roboto_400Regular',
    fontWeight: '500',
  },
  points: {
    color: Color.Black,
    fontFamily: 'Roboto_500Medium',
    fontSize: Height * 0.018,
  },
  btnContainer: {
    alignSelf: 'center',
    marginRight: Width * 0.03,
    // width: Width * 0.35,
  },
  btn: {},
  pressed: {
    textAlign: 'center',
    color: Color.White,
    fontFamily: 'Roboto_500Medium',
    paddingHorizontal: Width * 0.07,
    paddingVertical: Height * 0.0055,
    backgroundColor: Color.Blue,
    borderRadius: 8,
    fontSize: Height * 0.019,
  },
  success: {
    color: Color.White,
  },
  sent: {
    backgroundColor: Color.Disable,
    color: Color.Grey,
    fontFamily: 'Roboto_500Medium',
    fontSize: Height * 0.019,
  },
  adminIcon: {
    // marginLeft: 5,
    // alignSelf: "center",
    fontSize: Height * 0.018,
    color: Color.Blue,
    marginTop: '4%',
  },
});
