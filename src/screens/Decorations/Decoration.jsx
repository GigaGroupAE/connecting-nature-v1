import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
  Image,
} from 'react-native';
import React, { useEffect } from 'react';
import Color from '../../../assets/colors/Color';
import HeaderNormal from '../../components/HeaderNormal';
import { fetchDecorations } from '../../utils/Decorate';
import { useQuery } from 'react-query';
import { BASE_URL } from '../../../CONSTANTS';
import { screenHeight, screenWidth } from '../../utils/ScreenDimensions';

import {
  descriptionTextStyle,
  itemTitle,
  tagContainer,
  tagText,
} from './ModalStyle';
import { useNavigation } from '@react-navigation/native';

const Decoration = () => {
  const { data, refetch } = useQuery('DesignCategoryClient', fetchDecorations);
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <HeaderNormal title="Decoration" />
      <View style={{ flex: 1, marginVertical: '3%' }}>
        <FlatList
          data={data}
          renderItem={({ item }) => {
            const shortTitle =
              item?.title?.length > 25
                ? item?.title?.slice(0, 25) + '...'
                : item?.title;

            const shortCategorieText =
              item?.categorie?.length > 20
                ? item?.categorie.slice(0, 20) + '...'
                : item?.categorie;

            return (
              <Pressable
                style={styles.productContainer}
                onPress={() =>
                  navigation.navigate('DecorationProductDetails', {
                    item: item,
                  })
                }
              >
                <View style={styles.imageContainer}>
                  <Image
                    source={{
                      uri: `${BASE_URL}/images/${item?.images[0]?.name}`,
                    }}
                    style={styles.productImage}
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
                    <Text style={itemTitle}>{item?.price} PKR</Text>
                    <View style={tagContainer}>
                      <Text style={tagText}>{item?.tag}</Text>
                    </View>
                  </View>
                </View>
              </Pressable>
            );
          }}
          contentContainerStyle={{ gap: 12 }}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </View>
  );
};

export default Decoration;

const styles = StyleSheet.create({
  container: {
    backgroundColor: Color.White,
    flex: 1,
  },
  productContainer: {
    width: screenWidth * 0.95,
    alignSelf: 'center',
    gap: 10,
    height: screenHeight * 0.27,
    // backgroundColor: 'red',
    borderRadius: screenHeight * 0.01,
    shadowColor: Color.Black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
    zIndex: 900,
    backgroundColor: Color.White,
  },
  imageContainer: {
    width: '100%',
    height: '75%',
  },
  productImage: {
    width: '100%',
    height: '100%',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    resizeMode: 'cover',
  },
  productDetails: {
    width: '95%',
    alignSelf: 'center',
    height: '25%',
    // backgroundColor: 'red',
    flexDirection: 'row',
    justifyContent: 'space-between',
    // backgroundColor: 'red',
  },
  typeContainer: {
    flexDirection: 'row',
    gap: 4,
  },
});
