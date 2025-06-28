import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React from 'react';
import { Modal, Portal } from 'react-native-paper';
import { container, titleStyle } from '../screens/Decorations/ModalStyle';
import { screenHeight, screenWidth } from '../utils/ScreenDimensions';
import { BASE_URL } from '../../CONSTANTS';
import { useNavigation } from '@react-navigation/native';

const ShowScriptionDetailsModal = ({ isVisible, setisVisible, item }) => {
  const { navigate } = useNavigation();
  return (
    <Portal>
      <Modal visible={isVisible} onDismiss={() => setisVisible(false)}>
        <View style={container}>
          <Text style={titleStyle}>Member Details</Text>

          <View style={styles.contentContainer}>
            <View style={styles.itemContainer}>
              <Text style={styles.labelStyle}>Name:</Text>
              <Text style={styles.title}>{item?.fullName}</Text>
            </View>
            <View style={styles.itemContainer}>
              <Text style={styles.labelStyle}>Phone Number:</Text>
              <Text style={styles.title}>{item?.phoneNumber}</Text>
            </View>
            <View>
              <Text style={titleStyle}>Proof of Payment</Text>
              <TouchableOpacity
                onPress={() => {
                  navigate('ViewImage', {
                    url: `${item?.image}`,
                  });
                  setisVisible(false);
                }}
                style={{
                  // backgroundColor: 'red',
                  position: 'relative',
                  top: screenHeight * 0.004,
                }}
              >
                <Image
                  source={{ uri: `${item?.image}` }}
                  style={styles.image}
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </Portal>
  );
};

export default ShowScriptionDetailsModal;

const styles = StyleSheet.create({
  contentContainer: {
    width: '94%',
    gap: 12,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  labelStyle: {
    fontFamily: 'Poppins_500Medium',
    fontSize: screenHeight * 0.017,
  },
  title: {
    fontFamily: 'Roboto_400Regular',
    fontSize: screenHeight * 0.017,
  },
  image: {
    width: screenWidth * 0.83,
    height: screenHeight * 0.19,
    resizeMode: 'cover',
    borderRadius: screenHeight * 0.01,
    marginVertical: screenHeight * 0.012,
  },
});
