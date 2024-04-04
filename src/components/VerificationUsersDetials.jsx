import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Pressable,
} from 'react-native';
import React, { useState } from 'react';
import { BASE_URL } from '../../CONSTANTS';
import { screenHeight, screenWidth } from '../utils/ScreenDimensions';
import Color from '../../assets/colors/Color';
import { Modal, Portal } from 'react-native-paper';

const VerificationUsersDetials = ({ item }) => {
  const [isViewUser, setisViewUser] = useState(false);
  const [isDecline, setisDecline] = useState(false);

  const hideViewModal = () => {
    setisViewUser(false);
  };
  return (
    <Pressable onPress={() => setisViewUser(true)} style={styles.container}>
      <View style={styles.leftContainer}>
        <Image
          source={{ uri: `${BASE_URL}/images/${item?.user?.profile}` }}
          style={styles.userImage}
        />
        <View style={{ gap: 8 }}>
          <Text style={{ ...styles.title, fontSize: screenHeight * 0.018 }}>
            {item?.user?.fullName}
          </Text>
          <View style={styles.roleContainer}>
            <Text style={styles.role}>Requested Role</Text>
            <Text style={styles.title}>{item?.requestedRole}</Text>
          </View>
        </View>
      </View>
      <View style={styles.rightContainer}>
        <TouchableOpacity style={styles.buttonContainer}>
          <Text style={{ ...styles.title, color: Color.White }}>Approve</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.denyButton}>
          <Text style={styles.title}>Deny</Text>
        </TouchableOpacity>
      </View>

      <Portal>
        <Modal visible={isViewUser} onDismiss={hideViewModal}>
          <View style={styles.viewUserModal}>
            <View style={styles.contentContainer}>
              <Text style={styles.label}>Full Name</Text>
              <Text style={styles.item}>{item?.fullName}</Text>
            </View>
          </View>
        </Modal>
      </Portal>
    </Pressable>
  );
};

export default VerificationUsersDetials;

const styles = StyleSheet.create({
  container: {
    // padding: screenHeight * 0.015,
    borderRadius: 8,
    width: screenWidth * 0.93,
    fontFamily: 'Roboto_500Medium',
    marginTop: 8,
    backgroundColor: Color.White,
    shadowColor: Color.Grey,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
    elevation: 3,
    zIndex: 100,
    position: 'relative',
    alignSelf: 'center',
    flex: 1,
    marginBottom: 2,
    flexDirection: 'row',
    paddingHorizontal: screenWidth * 0.03,
    paddingVertical: screenWidth * 0.025,
  },
  userImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  leftContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 2,
    // backgroundColor: 'red',
  },
  roleContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  title: {
    fontFamily: 'Roboto_700Bold',
    fontSize: screenHeight * 0.013,
  },
  role: {
    fontFamily: 'Roboto_400Regular',
    color: Color.Grey,
    fontSize: screenHeight * 0.013,
  },
  rightContainer: {
    flex: 1,
    // backgroundColor: 'yellow',
    alignItems: 'center',
    gap: 10,
    paddingLeft: screenWidth * 0.12,
  },
  buttonContainer: {
    backgroundColor: Color.Blue,
    paddingHorizontal: screenWidth * 0.05,
    paddingVertical: screenHeight * 0.006,
    borderRadius: 6,
  },
  denyButton: {
    borderWidth: 1,
    paddingHorizontal: screenWidth * 0.074,
    paddingVertical: screenHeight * 0.005,
    borderRadius: 6,
    borderColor: Color.Grey,
  },
  viewUserModal: {
    width: screenWidth * 0.9,
    height: screenHeight * 0.8,
    backgroundColor: Color.White,
    alignSelf: 'center',
    borderRadius: screenHeight * 0.01,
  },
  contentContainer: {
    width: '95%',
    alignSelf: 'center',
    marginVertical: screenHeight * 0.02,
  },
  label: {
    fontFamily: 'Roboto_400Regular',
    fontSize: screenHeight * 0.014,
    color: Color.DarkGrey,
  },
  item: {
    fontFamily: 'Roboto_500Medium',
    fontSize: screenHeight * 0.016,
    color: Color.DarkGrey,
    borderWidth: 1,
    borderColor: Color.Grey,
    borderRadius: 4,
    paddingHorizontal: screenWidth * 0.02,
    paddingVertical: screenHeight * 0.006,
    marginVertical: screenHeight * 0.004,
  },
});
