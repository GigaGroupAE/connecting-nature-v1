import {
  FlatList,
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
} from 'react-native';
import React, { useState } from 'react';
import { BASE_URL } from '../../CONSTANTS';
import { screenHeight, screenWidth } from '../utils/ScreenDimensions';

import Color from '../../assets/colors/Color';
import {
  descriptionTextStyle,
  itemTitle,
} from '../screens/Decorations/ModalStyle';

const DecorationProductsCard = ({
  items,
  setremovedProduct,
  removedProduct,
}) => {
  const [products, setproducts] = useState(items);
  const handleProduct = (item) => {
    const activeIndex = products?.findIndex((e) => e?._id === item?._id);
    const updatedProducts = [...products];
    if (activeIndex !== -1) {
      updatedProducts.splice(activeIndex, 1);
      setproducts(updatedProducts);
      setremovedProduct({
        isAdd: false,
        item: item,
      });
    } else {
      setremovedProduct({
        isAdd: true,
        item: item,
      });
      setproducts([...products, item]);
    }
  };

  return (
    <View style={{ marginLeft: screenWidth * 0.016 }}>
      <FlatList
        data={items}
        renderItem={({ item }) => {
          const shortTitle =
            item?.productId?.title.length > 16
              ? item?.productId?.title?.slice(0, 16) + '...'
              : item?.productId?.title;
          const isSelected = products.some((e) => e?._id === item?._id);
          const totlePrice = item?.quantity * item?.productId?.price;

          return (
            <TouchableOpacity
              style={isSelected ? styles.activeCard : styles.card}
              onPress={() => handleProduct(item)}
            >
              <Image
                source={{
                  uri: `${BASE_URL}/images/${item?.productId?.image}`,
                }}
                style={styles.images}
              />
              <View style={styles.productTitle}>
                <Text style={{ ...itemTitle, fontSize: screenHeight * 0.016 }}>
                  {shortTitle}
                </Text>
                <Text
                  style={{
                    ...descriptionTextStyle,
                    fontSize: 12,
                    marginTop: 0,
                  }}
                >
                  x {item?.quantity}
                </Text>
              </View>

              <View style={styles.priceContainer}>
                <Text style={itemTitle}>{totlePrice}</Text>
                <Text
                  style={{
                    ...descriptionTextStyle,
                    fontSize: 12,
                    marginTop: 0,
                  }}
                >
                  PKR
                </Text>
              </View>
            </TouchableOpacity>
          );
        }}
        horizontal
        contentContainerStyle={{
          gap: 10,
          marginVertical: '2.5%',
        }}
      />
    </View>
  );
};

export default DecorationProductsCard;

const styles = StyleSheet.create({
  card: {
    width: screenWidth * 0.28,
    height: screenHeight * 0.18,
    borderRadius: screenHeight * 0.01,
    backgroundColor: Color.LightBlue,
    // borderWidth: 0.9,
    // borderColor: Color.Blue,
    padding: '3%',
  },
  activeCard: {
    width: screenWidth * 0.28,
    height: screenHeight * 0.18,
    borderRadius: screenHeight * 0.01,
    backgroundColor: Color.LightBlue,
    borderWidth: 0.9,
    borderColor: Color.Blue,
    padding: '3%',
  },
  images: {
    width: '100%',
    height: '56%',
    borderRadius: screenHeight * 0.01,
    resizeMode: 'cover',
  },
  productTitle: {
    flexDirection: 'row',
    marginVertical: '2.5%',
    gap: 10,
  },
  priceContainer: {
    backgroundColor: Color.VeryLightGrey,
    alignItems: 'center',
    flexDirection: 'row',
    borderRadius: screenHeight * 0.1,
    padding: '8%',
    justifyContent: 'center',
    alignSelf: 'auto',
    marginTop: '4%',
    gap: 3,
  },
});
