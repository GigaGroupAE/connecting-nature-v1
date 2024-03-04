import { FlatList, StyleSheet, View, Image, Pressable } from 'react-native';
import React from 'react';
import { BASE_URL } from '../../CONSTANTS';

import { screenHeight } from '../utils/ScreenDimensions';

const DecorationImagesCard = ({ images, setcoverImage }) => {
  return (
    <View>
      <FlatList
        data={images}
        renderItem={({ item }) => {
          return (
            <Pressable onPress={() => setcoverImage(item?.name)}>
              <Image
                source={{
                  uri: `${BASE_URL}/images/${item.name}`,
                }}
                style={styles.images}
              />
            </Pressable>
          );
        }}
        horizontal
        contentContainerStyle={{
          gap: 10,
          marginVertical: '2.5%',
        }}
        showsHorizontalScrollIndicator={false}
      />
    </View>
  );
};

export default DecorationImagesCard;

const styles = StyleSheet.create({
  images: {
    width: screenHeight * 0.12,
    height: screenHeight * 0.08,
    borderRadius: 10,
    resizeMode: 'cover',
  },
});
