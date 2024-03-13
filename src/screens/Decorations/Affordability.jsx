import {
  FlatList,
  StyleSheet,
  TouchableOpacity,
  View,
  Text,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import Color from '../../../assets/colors/Color';
import HeaderNormal from '../../components/HeaderNormal';
import { useQuery } from 'react-query';
import { fetchAffordabilityData } from '../../utils/Decorate';

import { screenHeight, screenWidth } from '../../utils/ScreenDimensions';
import AffordableSkeletonLoad from './AffordableSkeletonLoad';
import AddAfforablilityModal from './AddAfforablilityModal';
import {
  descriptionTextStyle,
  editButton,
  editButtonTitle,
  itemTitle,
} from './ModalStyle';

const Affordability = () => {
  const [ismodalVisible, setismodalVisible] = useState(false);
  const [itemData, setitemData] = useState(null);
  const [isEdit, setisEdit] = useState(false);
  const { data, isLoading, refetch } = useQuery(
    'Affordability',
    fetchAffordabilityData,
  );

  const handleEdit = (item) => {
    setitemData(item);
    setismodalVisible(true);
    setisEdit(true);
  };
  useEffect(() => {
    setitemData('');
    setisEdit(false);
  }, [ismodalVisible]);

  return (
    <View style={styles.container}>
      <HeaderNormal
        title="Affordability"
        setismodalVisible={setismodalVisible}
      />

      <View style={{ flex: 1 }}>
        {isLoading ? (
          <AffordableSkeletonLoad />
        ) : (
          <FlatList
            data={data}
            renderItem={({ item }) => {
              return (
                <View style={styles.mainContainer}>
                  <View style={styles.leftContainer}>
                    <Text style={itemTitle}>{item?.name}</Text>
                    <Text style={descriptionTextStyle}>
                      Admin who have access to this feature can edit the price
                      range as per market in the future.
                    </Text>
                  </View>
                  <View style={styles.rightContainer}>
                    <View style={styles.priceRange}>
                      <Text style={styles.price}>{item?.minRange}</Text>
                      <Text style={styles.price}>-</Text>
                      <Text style={styles.price}>{item?.maxRange}</Text>
                    </View>
                    <TouchableOpacity
                      style={{ ...editButton, marginTop: screenHeight * 0.016 }}
                      onPress={() => handleEdit(item)}
                    >
                      <Text style={editButtonTitle}>Edit</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              );
            }}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>
      {ismodalVisible && (
        <AddAfforablilityModal
          ismodalVisible={ismodalVisible}
          setismodalVisible={setismodalVisible}
          refetch={refetch}
          item={itemData}
          setisEdit={setisEdit}
          isEdit={isEdit}
        />
      )}
    </View>
  );
};

export default Affordability;

const styles = StyleSheet.create({
  container: {
    backgroundColor: Color.White,
    flex: 1,
  },
  mainContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignSelf: 'center',
    overflow: 'hidden',
    borderBottomWidth: 0.9,
    borderBottomColor: Color.VeryLightGrey,
    paddingHorizontal: screenWidth * 0.06,
    paddingVertical: screenHeight * 0.015,
  },
  leftContainer: {
    flex: 2,
  },
  rightContainer: {
    flex: 1,
    alignItems: 'flex-end',
  },
  description: {
    fontFamily: 'Roboto_400Regular',
    fontSize: screenHeight * 0.015,
    color: Color.Grey,
    marginTop: '2%',
    lineHeight: 18,
  },
  priceRange: {
    flexDirection: 'row',
    gap: 3,
  },
  price: {
    fontFamily: 'Roboto_700Bold',
    fontSize: screenHeight * 0.018,
  },
});
