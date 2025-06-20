import { Dimensions, Image, StyleSheet, Text, View } from 'react-native';
import React from 'react';
import Color from '../../../assets/colors/Color';
import user from '../../../assets/user.jpg';
import { AntDesign, Entypo, Ionicons } from 'react-native-vector-icons';
import { BASE_URL } from '../../../CONSTANTS';

const Width = Dimensions.get('screen').width;
const Height = Dimensions.get('screen').height;

const AdminHeader = (props) => {
  const { name, role, image, notification } = props;
  return (
    <View style={styles.container}>
      <View>
        <Image style={styles.userImg} source={{ uri: `${image}` }} />
      </View>
      <View style={{ flex: 1, marginLeft: Width * 0.02 }}>
        <Text style={styles.title}>{name}</Text>
        <Text style={styles.role}>{role}</Text>
      </View>

      {/* temporary comment  till  next update  */}

      {/* <View
        style={{
          flexDirection: "row",
          flex: 0.3,
          justifyContent: "space-between",
        }}
      >
        <AntDesign name="search1" size={22} />
        {notification === "0" ? (
          <Ionicons name="notifications-outline" size={22} />
        ) : (
          <View style={{ flexDirection: "row" }}>
            <Ionicons name="notifications-outline" size={22} />
            <Text
              style={{
                fontSize: 83,
                position: "absolute",
                bottom: Height * -0.01,
                left: Width * 0.02,
                color: Color.Blue,
              }}
            >
              .
            </Text>
          </View>
        )}
      </View> */}
    </View>
  );
};

export default AdminHeader;

const styles = StyleSheet.create({
  container: {
    backgroundColor: Color.White,
    alignContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: 17,
    paddingVertical: 10,
    borderBottomWidth: 2,
    borderColor: Color.VeryLightGrey,
    justifyContent: 'space-between',
  },
  title: {
    fontFamily: 'Roboto_600SemiBold',
    fontWeight: '600',
    color: Color.Black,
    fontSize: Height * 0.021,
  },
  role: {
    fontFamily: 'Roboto_500Medium',
    fontWeight: '400',
    color: Color.Black,
    fontSize: Height * 0.015,
  },
  userImg: {
    width: Width * 0.12,
    height: Height * 0.059,
    borderRadius: Height * 0.1,
    resizeMode: 'contain',
  },
});
