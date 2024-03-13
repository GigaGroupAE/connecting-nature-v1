import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
  Image,
  Animated,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import Color from '../../../assets/colors/Color';
import HeaderNormal from '../../components/HeaderNormal';
import {
  fetchAffordabilityData,
  fetchDecorations,
  getDesignType,
  toggleSave,
} from '../../utils/Decorate';
import { useQuery } from 'react-query';
import { BASE_URL } from '../../../CONSTANTS';
import { screenHeight, screenWidth } from '../../utils/ScreenDimensions';
import { AntDesign } from 'react-native-vector-icons';

import {
  container,
  descriptionTextStyle,
  itemTitle,
  tagContainer,
  tagText,
  titleStyle,
  inputstyle,
} from './ModalStyle';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { shortenText } from '../../utils/isFollowing';
import { Modal, Portal } from 'react-native-paper';
import { FadeIn, FadeOut } from 'react-native-reanimated';
import CheckedBox from '../../components/SVG/CheckedBox';
import UnCheckedBox from '../../components/SVG/unCheckedBox';
import SavedWhiteSvg from '../../components/SVG/SavedWhiteSvg';
import UnSavedWhiteSvg from '../../components/SVG/UnSavedWhite';
import { useUserState } from '../../slices/userSlice';

const Decoration = () => {
  const userState = useUserState();
  const isFocused = useIsFocused();
  const { data, refetch } = useQuery('DesignCategoryClient', fetchDecorations);
  const [isFilterModal, setisFilterModal] = useState(false);
  const navigation = useNavigation();
  const [isDesignTypeModalOpen, setisDesignTypeModalOpen] = useState(false);
  const [productType, setproductType] = useState('');
  const [priceRangers, setpriceRangers] = useState([]);
  const [isSavedOpen, setisSavedOpen] = useState(false);

  const { data: designData } = useQuery('designData', getDesignType, {
    staleTime: 300000,
    cacheTime: 600000,
  });

  useEffect(() => {
    refetch();
  }, [isFocused]);

  const { data: Affordabilites } = useQuery(
    'Affordability',
    fetchAffordabilityData,
  );

  const handlenavigation = (item) => {
    navigation.navigate('DecorationProductDetails', {
      item: item,
      data: data,
    });
  };

  const hideModal = () => {
    setisFilterModal(false);
  };

  const handelProductType = (item) => {
    setproductType(item);
    setisDesignTypeModalOpen(false);
  };

  const handleAddProduct = (item) => {
    setpriceRangers((prevPriceRangers) => {
      const isAlreadyAdded = prevPriceRangers?.includes(item?.name);
      if (isAlreadyAdded) {
        return prevPriceRangers?.filter((name) => name !== item?.name);
      } else {
        return [...prevPriceRangers, item?.name];
      }
    });
  };

  const handleSavedProduct = async (id) => {
    try {
      const data = await toggleSave(id, userState?.id);
      refetch();
    } catch (error) {}
  };

  const handleViewSaved = () => {
    setisSavedOpen(!isSavedOpen);
  };

  const handleSavednavigation = () => {
    navigation.navigate('SavedDecoration');
  };

  return (
    <View style={styles.container}>
      <HeaderNormal
        title="Decoration"
        openFilterModal={() => setisFilterModal(true)}
        openSavedProducts={handleViewSaved}
        screen="Decoration"
      />
      <View style={{ flex: 1, marginVertical: '3%' }}>
        <FlatList
          data={
            priceRangers?.length > 0 && productType
              ? data?.filter(
                  (item) =>
                    priceRangers.includes(item?.tag) &&
                    item?.categorie === productType,
                )
              : priceRangers?.length > 0
                ? data?.filter((item) => priceRangers.includes(item?.tag))
                : productType
                  ? data.filter((item) => item?.categorie === productType)
                  : data
          }
          renderItem={({ item }) => {
            const shortTitle = shortenText(item?.title, 25);
            const shortCategorieText = shortenText(item?.categorie, 20);
            const isSave = item?.isSaved?.some((id) => id === userState?.id);

            return (
              <Pressable
                style={styles.productContainer}
                onPress={() => handlenavigation(item)}
              >
                <View style={styles.imageContainer}>
                  <Image
                    source={{
                      uri: `${BASE_URL}/images/${item?.images[0]?.name}`,
                    }}
                    style={styles.productImage}
                  />
                </View>

                <TouchableOpacity
                  style={{
                    position: 'absolute',
                    right: screenWidth * 0.07,
                    top: screenHeight * 0.02,
                  }}
                  onPress={() => handleSavedProduct(item?._id)}
                >
                  {isSave ? <SavedWhiteSvg /> : <UnSavedWhiteSvg />}
                </TouchableOpacity>

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
          contentContainerStyle={{ gap: 12, flex: 1 }}
          showsVerticalScrollIndicator={false}
        />
      </View>

      <Portal>
        <Modal visible={isFilterModal} onDismiss={hideModal}>
          <View
            style={{
              ...container,
              maxHeight: screenHeight * 0.85,
            }}
          >
            <ScrollView
              contentContainerStyle={{
                alignItems: 'center',
              }}
              showsVerticalScrollIndicator={false}
            >
              <Text style={titleStyle}>Filter Products</Text>

              <View
                style={{
                  ...inputstyle,
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                {productType === '' ? (
                  <Text>Select Product Type</Text>
                ) : (
                  <Text>{productType}</Text>
                )}
                <TouchableOpacity
                  onPress={() =>
                    setisDesignTypeModalOpen(!isDesignTypeModalOpen)
                  }
                >
                  <AntDesign name="down" style={styles.downIcon} />
                </TouchableOpacity>
              </View>
              {isDesignTypeModalOpen && (
                <Animated.View entering={FadeIn} exiting={FadeOut}>
                  <View style={styles.designModalContainer}>
                    <FlatList
                      data={designData}
                      renderItem={({ item }) => {
                        return (
                          <TouchableOpacity
                            style={styles.desingContainer}
                            onPress={() => handelProductType(item?.name)}
                          >
                            <Text style={styles.title}>{item?.name}</Text>
                          </TouchableOpacity>
                        );
                      }}
                      keyExtractor={(item) => item._id}
                      showsVerticalScrollIndicator={false}
                    />
                  </View>
                </Animated.View>
              )}

              <View
                style={{
                  alignSelf: 'flex-start',
                  marginVertical: '2%',
                }}
              >
                <View style={{ marginBottom: '2%' }}>
                  <Text style={descriptionTextStyle}>Pricing Range</Text>
                </View>

                <FlatList
                  data={Affordabilites}
                  renderItem={({ item }) => {
                    const isChecked = priceRangers.includes(item?.name);
                    return (
                      <Pressable
                        style={styles.priceContainer}
                        onPress={() => handleAddProduct(item)}
                      >
                        {isChecked ? <CheckedBox /> : <UnCheckedBox />}
                        <Text
                          style={{
                            ...descriptionTextStyle,
                            color: Color.Black,
                          }}
                        >
                          {item?.name}
                        </Text>
                      </Pressable>
                    );
                  }}
                  contentContainerStyle={{ gap: 10 }}
                />
              </View>
            </ScrollView>
          </View>
        </Modal>
      </Portal>

      {isSavedOpen && (
        <TouchableOpacity
          style={styles.savedContainer}
          onPress={handleSavednavigation}
        >
          <Text style={styles.titleSaved}>Saved Decoration</Text>
        </TouchableOpacity>
      )}
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
  designModalContainer: {
    backgroundColor: Color.White,
    width: screenWidth * 0.75,
    maxHeight: screenHeight * 0.2,
    marginTop: '3%',
    borderColor: Color.LightGrey,
    borderWidth: 1,
    borderRadius: screenHeight * 0.01,
    paddingHorizontal: '3%',
    paddingVertical: '2%',
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  title: {
    fontFamily: 'Roboto_400Regular',
    paddingVertical: 6,
    fontSize: 12,
  },
  savedContainer: {
    backgroundColor: Color.White,
    position: 'absolute',
    right: screenWidth * 0.1,
    width: screenWidth * 0.4,
    paddingHorizontal: screenWidth * 0.03,
    paddingVertical: screenHeight * 0.015,
    top: screenHeight * 0.05,
    borderRadius: screenHeight * 0.01,
    shadowColor: Color.Black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
  },
  titleSaved: {
    fontFamily: 'Roboto_500Medium',
    fontSize: screenHeight * 0.016,
  },
});
