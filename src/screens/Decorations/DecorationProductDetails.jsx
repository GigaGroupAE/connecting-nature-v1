import {
  Image,
  StyleSheet,
  Text,
  View,
  Pressable,
  FlatList,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import Color from '../../../assets/colors/Color';
import HeaderNormal from '../../components/HeaderNormal';
import { useNavigation, useRoute } from '@react-navigation/native';
import { BASE_URL } from '../../../CONSTANTS';

import { screenHeight, screenWidth } from '../../utils/ScreenDimensions';
import {
  itemTitle,
  tagContainer,
  tagText,
  descriptionTextStyle,
} from './ModalStyle';
import DecorationImagesCard from '../../components/DecorationImagesCard';
import DecorationProductsCard from '../../components/DecorationProductsCard';
import { shortenText } from '../../utils/isFollowing';
import DecorationProductDetialsHeader from '../../components/DecorationProductDetialsHeader';
import { useUserState } from '../../slices/userSlice';
const DecorationProductDetails = () => {
  const { params } = useRoute();
  const userState = useUserState();
  const navigation = useNavigation();
  const product = params?.item;
  const data = params?.data;
  const [coverImage, setcoverImage] = useState(product?.images[0]?.name);
  const [activeProduct, setactiveProduct] = useState(product);
  const shortTitle = shortenText(activeProduct?.title, 25);
  const shortCategorieText = shortenText(activeProduct?.categorie, 20);
  const [finalPrice, setfinalPrice] = useState(activeProduct?.price);
  const [isSaved, setisSaved] = useState(activeProduct?.isSaved);
  const [save, setSave] = useState(false);
  const [removedProduct, setremovedProduct] = useState({
    isAdd: false,
    item: null,
  });

  useEffect(() => {
    setisSaved((prevReactions) => {
      if (prevReactions !== activeProduct?.isSaved) {
        setSave(
          activeProduct?.isSaved.some((user) => {
            return user._id === userState.id;
          }),
        );
        return activeProduct?.isSaved;
      }
      return prevReactions;
    });
  }, [activeProduct]);

  useEffect(() => {
    if (!removedProduct?.item) return;

    const { quantity, productId } = removedProduct.item;
    const totalPrice = quantity * productId.price;

    setfinalPrice((prevPrice) => {
      return removedProduct.isAdd
        ? prevPrice + totalPrice
        : prevPrice - totalPrice;
    });
  }, [removedProduct]);

  const handleSavedProduct = () => {
    if (!save) {
      const tempSave = [...isSaved];
      const newSave = {
        _id: userState.id,
      };
      tempSave.push(newSave);
      // updatereactions(templike, true);
      setSave(true);
    } else {
      const newSave = isSaved.filter((e) => {
        return e._id !== userState.id;
      });
      // updatereactions(newlikes, false);
      setSave(false);
    }
  };

  return (
    <View style={styles.container}>
      <HeaderNormal
        title="Decoration"
        screen="DecorationProduct"
        isSaved={handleSavedProduct}
      />
      <View>
        <View>
          <DecorationProductDetialsHeader
            data={data}
            activeProduct={activeProduct}
            setactiveProduct={setactiveProduct}
          />
        </View>
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
            images={activeProduct?.images}
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
          <DecorationProductsCard
            items={activeProduct?.products}
            setremovedProduct={setremovedProduct}
            removedProduct={removedProduct}
          />
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

        <View style={styles.approxAmountContainer}>
          <Text style={styles.approxAmount}>Approximate Amount</Text>
          <Text style={{ ...itemTitle, fontSize: screenHeight * 0.018 }}>
            {finalPrice} PKR
          </Text>
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
  approxAmount: {
    fontFamily: 'Roboto_500Medium',
    color: Color.Grey,
    fontSize: screenHeight * 0.016,
  },
  approxAmountContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    position: 'absolute',
    bottom: screenHeight * -0.17,
    height: screenHeight * 0.055,
    width: '100%',
    paddingHorizontal: screenWidth * 0.06,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
  },
});
