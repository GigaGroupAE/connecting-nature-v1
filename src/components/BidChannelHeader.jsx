import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  Pressable,
} from 'react-native';
import React from 'react';
import Color from '../../assets/colors/Color';
import { MaterialIcons, Entypo } from 'react-native-vector-icons';
import { BASE_URL } from '../../CONSTANTS';
import { screenHeight, screenWidth } from '../utils/ScreenDimensions';
import { useNavigation } from '@react-navigation/native';

const BidChannelHeader = ({ item }) => {
  const { goBack, navigate } = useNavigation();

  const admin = item?.members?.filter((item) => item?.privilege === 'Owner');

  return (
    <View style={styles.container}>
      <View style={styles.leftContainer}>
        <TouchableOpacity onPress={() => goBack()}>
          <MaterialIcons
            name="arrow-back-ios"
            size={24}
            color={Color.White}
            // style={{ alignSelf: 'center', alignItems: 'center' }}
          />
        </TouchableOpacity>
        <Image
          source={{ uri: `${BASE_URL}/images/${item?.groupPic}` }}
          style={styles.userImg}
        />
        <Pressable
          style={styles.nameContainer}
          onPress={() => navigate('channelSetting', { groupData: item })}
        >
          <Text style={styles.title}>{item?.title}</Text>
          <Text style={styles.subTitle}>{admin[0]?.member?.fullName}</Text>
        </Pressable>
      </View>
      <View style={styles.rightContainer}>
        <MaterialIcons name="search" color="#fff" size={screenHeight * 0.03} />
        <Entypo name="dots-three-vertical" style={styles.icon} />
      </View>
    </View>
  );
};

export default BidChannelHeader;

const styles = StyleSheet.create({
  container: {
    backgroundColor: Color.Blue,
    flexDirection: 'row',
    paddingHorizontal: screenWidth * 0.06,
    paddingVertical: screenHeight * 0.009,
  },
  userImg: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  leftContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    flex: 2,
  },
  nameContainer: {
    paddingHorizontal: screenWidth * 0.02,
    gap: 2,
  },
  title: {
    fontFamily: 'Roboto_700Bold',
    color: Color.White,
    fontSize: screenHeight * 0.018,
  },
  subTitle: {
    fontFamily: 'Roboto_500Medium',
    color: Color.White,
  },
  rightContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    gap: 10,
  },
  icon: {
    fontSize: screenHeight * 0.025,
    color: Color.White,
  },
});
