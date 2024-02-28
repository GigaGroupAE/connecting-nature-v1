import { FlatList, StyleSheet, Text, View, Image } from 'react-native';
import React, { useState } from 'react';
import Color from '../../../assets/colors/Color';
import HeaderNormal from '../../components/HeaderNormal';
import { ScrollView } from 'react-native-gesture-handler';
import DesignCategoryModal from './DesignCategoryModal';
import { useQuery } from 'react-query';
import { fetchDecorations } from '../../utils/Decorate';
import { itemTitle, mainContainer } from './ModalStyle';
import { BASE_URL } from '../../../CONSTANTS';
import { screenHeight, screenWidth } from '../../utils/ScreenDimensions';
const DesignCategory = () => {
  const [ismodalVisible, setismodalVisible] = useState(false);
  const { data, refetch } = useQuery('DesignCategory', fetchDecorations, {
    staleTime: 300000,
    cacheTime: 600000,
    refetchOnWindowFocus: false,
  });
  return (
    <ScrollView style={styles.container}>
      <HeaderNormal
        title="Design Category"
        setismodalVisible={setismodalVisible}
      />
      <View>
        <FlatList
          data={data}
          renderItem={({ item }) => {
            const shortTitle =
              item?.title?.length > 15
                ? item?.title?.slice(0, 17) + '...'
                : item?.title;

            const shortCategorieText =
              item?.categorie?.length > 15
                ? item?.categorie.slice(0, 15) + '...'
                : item?.categorie;
            return (
              <View style={mainContainer}>
                <View style={styles.leftContainer}>
                  <Image
                    source={{
                      uri: `${BASE_URL}/images/${item?.images[0]?.name}`,
                    }}
                    style={styles.productImage}
                  />
                  <View
                    style={{
                      height: '80%',
                      gap: 5,
                    }}
                  >
                    <Text style={itemTitle}>{shortTitle}</Text>
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                      }}
                    >
                      <Text
                        style={{
                          ...itemTitle,
                          fontFamily: 'Roboto_500Medium',
                          color: Color.Grey,
                          fontSize: screenHeight * 0.017,
                        }}
                      >
                        Type.
                      </Text>
                      <Text
                        style={{
                          ...itemTitle,
                          fontFamily: 'Roboto_500Medium',
                          color: Color.Grey,
                          fontSize: screenHeight * 0.017,
                        }}
                      >
                        {shortCategorieText}
                      </Text>
                    </View>
                  </View>
                </View>
                <View style={styles.rightContainer}>
                  <Text style={itemTitle}>{item?.price} PKR</Text>
                  <View style={styles.tagContainer}>
                    <Text style={styles.tagText}>{item?.tag}</Text>
                  </View>
                </View>
              </View>
            );
          }}
        />
      </View>
      <DesignCategoryModal
        setisModalVisible={setismodalVisible}
        ismodalVisible={ismodalVisible}
        refetch={refetch}
      />
    </ScrollView>
  );
};

export default DesignCategory;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Color.White,
  },
  selectedImages: {
    width: screenWidth * 0.14,
    height: screenHeight * 0.14,
    borderRadius: 8,
    marginLeft: 10,
  },
  leftContainer: {
    flex: 2,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  rightContainer: {
    flex: 1,
    alignItems: 'flex-end',
    justifyContent: 'space-evenly',
  },
  productImage: {
    width: screenWidth * 0.19,
    height: screenHeight * 0.064,
    resizeMode: 'cover',
    borderRadius: screenHeight * 0.01,
  },
  tagContainer: {
    backgroundColor: Color.Purple,
    width: screenWidth * 0.25,
    paddingVertical: screenHeight * 0.007,
    alignItems: 'center',
    borderRadius: screenHeight * 0.01,
  },
  tagText: {
    color: Color.White,
    fontFamily: 'Roboto_500Medium',
    fontSize: screenHeight * 0.015,
  },
});
