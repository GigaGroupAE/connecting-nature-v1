import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { AntDesign, Feather } from 'react-native-vector-icons';
import Color from '../../assets/colors/Color';
import { useNavigation } from '@react-navigation/native';
import { screenHeight } from '../utils/ScreenDimensions';

const HeaderUserProfile = (props) => {
  const navigation = useNavigation();

  return (
    <View>
      <View style={styles.mainContainer}>
        <View style={styles.headerIcons}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'flex-start',
            }}
            // style={{
            //   marginRight: "60%",
            //   flexDirection: "row",
            //   alignItems: "center",
            // }}
          >
            {props.type === 'other' && (
              <Text style={styles.title}>Profile</Text>
            )}

            <TouchableOpacity
              onPress={() => {
                navigation.goBack();
              }}
              style={{ marginRight: '60%' }}
            >
              <AntDesign
                name="arrowleft"
                color={Color.Black}
                style={{
                  fontSize: screenHeight * 0.026,
                }}
              />
            </TouchableOpacity>
            <Text
              style={{
                position: 'absolute',
                left: '10%',
                color: Color.Black,
                // fontSize: 18,
                fontFamily: 'Roboto_600SemiBold',
                marginLeft: 10,
                marginTop: 2,
                lineHeight: 30,
                textAlignVertical: 'center',
                fontSize: screenHeight * 0.019,
              }}
            >
              {props.type === 'current' ? 'Profile' : props.type}
            </Text>
          </View>
          <TouchableOpacity style={styles.shareIcon}>
            {/* <AntDesign name="sharealt" size={22} color={Color.Grey} /> */}
          </TouchableOpacity>
          {props.type === 'current' && (
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('Settings');
              }}
            >
              <Feather name="settings" size={22} color={Color.Black} />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    width: '100%',
    backgroundColor: Color.White,
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderBottomWidth: 1.5,
    borderColor: Color.VeryLightGrey,
  },
  headerIcons: {
    alignContent: 'center',
    alignItems: 'center',
    // paddingHorizontal: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  shareIcon: {
    // position: "absolute",
    // right: 50,
  },
  title: {
    color: Color.Grey,
    fontSize: 20,
    fontFamily: 'Roboto_600SemiBold',
    marginLeft: 10,
    marginTop: 2,
    lineHeight: 30,
    textAlignVertical: 'center',
  },
});

export default HeaderUserProfile;
