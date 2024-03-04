import { Dimensions, StyleSheet, View } from 'react-native';
import React from 'react';
import { MaterialCommunityIcons } from 'react-native-vector-icons';
import Color from '../../assets/colors/Color';
import { screenWidth } from '../utils/ScreenDimensions';

const Height = Dimensions.get('screen').height;

const AdminIcon = ({ userType }) => {
  const userRole = [
    'Operations',
    'Admin',
    'Manager',
    'Assistant Manager',
    'Super Admin',
    'celebrity',
  ];
  return (
    <View>
      {userRole?.includes(userType) && (
        <MaterialCommunityIcons
          name="check-decagram"
          style={styles.adminIcon}
        />
      )}
    </View>
  );
};

export default AdminIcon;

const styles = StyleSheet.create({
  adminIcon: {
    marginLeft: screenWidth * 0.012,
    alignSelf: 'center',
    fontSize: Height * 0.015,
    color: Color.Blue,
    marginTop: Height * 0.002,
  },
});
