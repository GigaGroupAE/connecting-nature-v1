import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
} from 'react-native';
import React, { useState } from 'react';
import { screenHeight, screenWidth } from '../utils/ScreenDimensions';
import Color from '../../assets/colors/Color';
import { titleStyle } from '../screens/Decorations/ModalStyle';
import ShowScriptionDetailsModal from './ShowScriptionDetailsModal';
import { useNavigation } from '@react-navigation/native';

const ApprovedSubscriptions = ({ item, refetch }) => {
  const { navigate } = useNavigation();
  const [isViewReceipt, setisViewReceipt] = useState(false);
  const [receiptData, setreceiptData] = useState(null);

  return (
    <View style={styles.container}>
      <FlatList
        data={item}
        renderItem={({ item }) => {
          return (
            <View style={styles.itemCard}>
              <View style={styles.contentContainer}>
                <TouchableOpacity
                  onPress={() =>
                    navigate('UserProfile', {
                      userPhoneNumber: item?.requestedBy?.phoneNumber,
                    })
                  }
                  style={styles.leftContainer}
                >
                  <Image
                    source={{ uri: item?.requestedBy?.profile }}
                    style={styles.image}
                  />

                  <View style={{ gap: 3 }}>
                    <Text style={titleStyle}>{item?.fullName}</Text>
                    <Text style={styles.phoneNumber}>{item?.phoneNumber}</Text>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    setisViewReceipt(true);
                    setreceiptData(item);
                  }}
                >
                  <Text style={styles.phoneNumber}>View Receipt</Text>
                </TouchableOpacity>
              </View>
            </View>
          );
        }}
      />

      <ShowScriptionDetailsModal
        isVisible={isViewReceipt}
        setisVisible={setisViewReceipt}
        item={receiptData}
      />
    </View>
  );
};

export default ApprovedSubscriptions;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: Color.White,

    width: screenWidth * 0.92,
    alignSelf: 'center',
  },
  itemCard: {
    borderRadius: 8,
    width: screenWidth * 0.91,
    marginTop: 16,
    backgroundColor: Color.White,
    shadowColor: Color.Grey,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
    elevation: 3,
    zIndex: 1000,
    position: 'relative',
    paddingHorizontal: screenWidth * 0.04,
    paddingVertical: screenHeight * 0.009,
    alignSelf: 'center',
    marginBottom: '0.5%',
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 25,
    resizeMode: 'cover',
    backgroundColor: 'red',
  },
  contentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  leftContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  phoneNumber: {
    fontFamily: 'Roboto_400Regular',
    fontSize: screenHeight * 0.016,
  },
  detailsContainer: {
    flexDirection: 'row',
    gap: 15,
    alignItems: 'center',
    marginVertical: screenHeight * 0.009,
  },
});
