import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useState } from 'react';
import { screenHeight, screenWidth } from '../utils/ScreenDimensions';
import Color from '../../assets/colors/Color';
import { MaterialIcons } from 'react-native-vector-icons';

const DecorationProductDetialsHeader = ({
  data,
  activeProduct,
  setactiveProduct,
}) => {
  const [isProductName, setisProductName] = useState(false);
  const [isCategorie, setisCategorie] = useState(false);

  const handleProudctName = () => {
    setisProductName(!isProductName);
    setisCategorie(false);
  };
  const handleProductCategorie = () => {
    setisCategorie(!isCategorie);
    setisProductName(false);
  };

  const handleSelectedtitle = (item) => {
    setactiveProduct(item);
    setisProductName(false);
  };

  return (
    <View>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text>{activeProduct?.title}</Text>
          <TouchableOpacity onPress={handleProudctName}>
            <MaterialIcons
              name="keyboard-arrow-down"
              style={styles.dropDownIcon}
            />
          </TouchableOpacity>
        </View>
        <View style={styles.headerRight}>
          <Text>{activeProduct?.categorie}</Text>
          <TouchableOpacity onPress={handleProductCategorie}>
            <MaterialIcons
              name="keyboard-arrow-down"
              style={styles.dropDownIcon}
            />
          </TouchableOpacity>
        </View>
      </View>
      {isProductName && (
        <FlatList
          data={data}
          renderItem={({ item, index }) => {
            return (
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  paddingHorizontal: 13,
                }}
              >
                {isProductName && (
                  <Pressable
                    onPress={() => handleSelectedtitle(item)}
                    style={{
                      paddingVertical: 8,
                      width: '60%',
                      paddingHorizontal: 12,
                      // borderColor: Color.VeryLightGrey,
                    }}
                  >
                    <Text>{item?.title}</Text>
                  </Pressable>
                )}
                {isCategorie && (
                  <View style={{ backgroundColor: 'yellow', flex: 1 }}>
                    <Text>{item?.categorie}</Text>
                  </View>
                )}
              </View>
            );
          }}
        />
      )}

      {isCategorie && (
        <FlatList
          data={data}
          renderItem={({ item, index }) => {
            return (
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  paddingHorizontal: 13,
                }}
              >
                <Pressable
                  onPress={() => handleSelectedtitle(item)}
                  style={{
                    paddingVertical: 8,
                    width: '60%',
                    paddingHorizontal: 12,
                    // borderColor: Color.VeryLightGrey,
                  }}
                >
                  <Text>{item?.categorie}</Text>
                </Pressable>
              </View>
            );
          }}
        />
      )}
    </View>
  );
};

export default DecorationProductDetialsHeader;

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    width: '96%',
    alignSelf: 'center',
    marginVertical: '2%',
    gap: 10,
    alignItems: 'center',
  },
  headerLeft: {
    width: '60%',
    paddingHorizontal: screenWidth * 0.03,
    paddingVertical: screenHeight * 0.009,
    borderWidth: 1,
    borderColor: Color.LightGrey,
    borderRadius: screenHeight * 0.01,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  headerRight: {
    paddingHorizontal: screenWidth * 0.03,
    paddingVertical: screenHeight * 0.009,
    borderWidth: 1,
    borderColor: Color.LightGrey,
    borderRadius: screenHeight * 0.01,
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '36%',
  },
  dropDownIcon: {
    fontSize: screenHeight * 0.02,
  },
});
