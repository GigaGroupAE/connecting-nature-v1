import { Image, StyleSheet, Text, View, Pressable } from 'react-native';
import React, { useState } from 'react';
import Color from '../../../assets/colors/Color';
import HeaderNormal from '../../components/HeaderNormal';
import { useNavigation, useRoute } from '@react-navigation/native';
import { BASE_URL } from '../../../CONSTANTS';

import { screenHeight } from '../../utils/ScreenDimensions';
import {
  itemTitle,
  tagContainer,
  tagText,
  descriptionTextStyle,
} from './ModalStyle';
import DecorationImagesCard from '../../components/DecorationImagesCard';
import DecorationProductsCard from '../../components/DecorationProductsCard';

const DecorationProductDetails = () => {
  const { params } = useRoute();
  const navigation = useNavigation();
  const product = params?.item;
  const [coverImage, setcoverImage] = useState(product?.images[0]?.name);

  const shortTitle =
    product?.title?.length > 25
      ? product?.title?.slice(0, 25) + '...'
      : product?.title;

  const shortCategorieText =
    product?.categorie?.length > 20
      ? product?.categorie.slice(0, 20) + '...'
      : product?.categorie;
  return (
    <View style={styles.container}>
      <HeaderNormal title="Decoration" />
      <View>
        <Pressable
          style={{ width: '100%', height: '30%' }}
          onPress={() =>
            navigation.navigate('ViewImage', {
              url: `${BASE_URL}/images/${coverImage}`,
            })
          }
        >
          <Image
            source={{ uri: `${BASE_URL}/images/${coverImage}` }}
            style={styles.converImage}
          />
        </Pressable>
        <View>
          <DecorationImagesCard
            images={product?.images}
            setcoverImage={setcoverImage}
          />
        </View>

        <View style={styles.productDetails}>
          <View>
            <Text style={itemTitle}>{shortTitle}</Text>
            <View style={styles.typeContainer}>
              <Text style={{ ...descriptionTextStyle, marginTop: 0 }}>
                Type .
              </Text>
              <Text style={{ ...descriptionTextStyle, marginTop: 0 }}>
                {shortCategorieText}
              </Text>
            </View>
          </View>
          <View
            style={{
              flexDirection: 'column',
              gap: 2,
            }}
          >
            <Text style={itemTitle}>{product?.price} PKR</Text>
            <View style={tagContainer}>
              <Text style={tagText}>{product?.tag}</Text>
            </View>
          </View>
        </View>
        <View>
          <DecorationProductsCard items={product?.products} />
        </View>

        <View
          style={{
            ...styles.productDetails,
            flexDirection: 'column',
            // marginTop: '2.5%',
          }}
        >
          <Text style={itemTitle}>Other Details</Text>
          <Text style={descriptionTextStyle}>{product?.Description}</Text>
        </View>
      </View>
    </View>
  );
};

export default DecorationProductDetails;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Color.White,
  },
  converImage: {
    width: '100%',
    height: '100%',
  },
  images: {
    width: screenHeight * 0.12,
    height: screenHeight * 0.08,
    borderRadius: 10,
    resizeMode: 'center',
  },
  productDetails: {
    width: '95%',
    alignSelf: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  typeContainer: {
    flexDirection: 'row',
    gap: 4,
  },
});
