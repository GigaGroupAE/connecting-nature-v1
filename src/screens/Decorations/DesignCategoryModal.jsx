import {
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Image,
  ScrollView,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { Modal, Portal } from 'react-native-paper';
import {
  buttonContainer,
  buttonTitle,
  inputstyle,
  itemTitle,
  titleStyle,
} from './ModalStyle';
import { useQuery } from 'react-query';
import {
  fetchAffordabilityData,
  getDesignType,
  handleAddCatagory,
} from '../../utils/Decorate';
import { AntDesign } from 'react-native-vector-icons';
import { screenHeight, screenWidth } from '../../utils/ScreenDimensions';
import Color from '../../../assets/colors/Color';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import * as ImagePicker from 'expo-image-picker';
import _debounce from 'lodash.debounce';
import { axiosInstance } from '../../../axiosInstance';
import LockIconSvg from '../../components/SVG/LockIconSvg';

const DesignCategoryModal = ({
  ismodalVisible,
  setisModalVisible,
  refetch,
  product,
}) => {
  const [isDesignTypeModalOpen, setisDesignTypeModalOpen] = useState(false);
  const [selectedDesign, setselectedDesign] = useState(
    product?.categorie || 'Design Type',
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [title, settitle] = useState(product?.title || '');
  const [Description, setDescription] = useState(product?.Description || '');
  const [mainImages, setmainImages] = useState([]);
  const [price, setprice] = useState(0);
  const [searchProduct, setsearchProduct] = useState('');
  const [products, setProducts] = useState([]);
  const [quantity, setQuantity] = useState('');
  const [productsData, setproductsData] = useState([]);
  const [showProductModal, setshowProductModal] = useState(false);
  const [showProducts, setshowProducts] = useState(product?.products || []);
  const [addedProducts, setaddedProducts] = useState(null);
  const [totalPrice, settotalPrice] = useState(product?.price?.toString() || 0);
  const [tag, settag] = useState('Affordability (Automatic)');

  const hideModal = () => {
    setisModalVisible(false);
  };

  const { data } = useQuery('designData', getDesignType, {
    staleTime: 300000,
    cacheTime: 600000,
    refetchOnWindowFocus: false,
  });

  const { data: Affordabilites, isLoading } = useQuery(
    'Affordability',
    fetchAffordabilityData,
  );

  const filteredData = data?.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleSelectDesign = (e) => {
    setselectedDesign(e);
    setisDesignTypeModalOpen(false);
    setSearchQuery('');
  };
  useEffect(() => {
    let closestObject = null;
    let minDifference = Infinity;
    if (Affordabilites) {
      for (const obj of Affordabilites) {
        const midpoint = (obj?.minRange + obj?.maxRange) / 2;
        const difference = Math?.abs(midpoint - totalPrice);
        if (difference < minDifference) {
          closestObject = obj;
          minDifference = difference;
        }
      }
    }
    settag(closestObject?.name);
  }, [totalPrice]);

  const handleImagePicker = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,

      quality: 1,
      allowsMultipleSelection: true,
    });

    if (!result.canceled) {
      const imagesData = result.assets.map((item) => item?.uri);
      setmainImages(imagesData);
    }
  };

  const handleAddProduct = () => {
    if (!addedProducts || !quantity) {
      alert('Please enter product name and quantity.');
      return;
    }

    const productPrice = addedProducts?.price * parseInt(quantity);

    settotalPrice(totalPrice + productPrice);

    const newProduct = {
      productId: addedProducts?._id,
      quantity: parseInt(quantity),
    };
    const showProductsUi = {
      quantity: parseInt(quantity),
      productId: {
        title: addedProducts?.title,
        price: addedProducts?.price,
        image: addedProducts?.price,
      },
    };

    setProducts([...products, newProduct]);
    setshowProducts([...showProducts, showProductsUi]);
    setsearchProduct('');
    setQuantity('');
  };
  const debouncedSearch = _debounce(async (query) => {
    try {
      const response = await axiosInstance.get(
        `/decorations/search-decorProduct?search=${query}`,
      );
      setproductsData(response?.data?.data);
    } catch (error) {
      console.log(error);
    }
  }, 2000);

  const onChangeSearch = (query) => {
    setsearchProduct(query);
    debouncedSearch(query);
    setshowProductModal(true);
  };
  const handleSelectproduct = (item) => {
    setsearchProduct(item?.title);
    setshowProductModal(false);
    setaddedProducts(item);
  };
  const handleAdd = async () => {
    try {
      const data = await handleAddCatagory(
        selectedDesign,
        title,
        Description,
        totalPrice,
        products,
        mainImages,
        refetch,
        tag,
      );
      resetState();
    } catch (error) {
      console.log(error);
    }
  };

  const handlePrice = (e) => {
    setprice(e);
  };
  const resetState = () => {
    setselectedDesign('');
    settitle('');
    setDescription('');
    setprice('');
    setProducts([]);
    setaddedProducts([]);
    setmainImages([]);
    setisModalVisible(false);
  };
  handlePricefous = () => {
    settotalPrice(totalPrice - price);
  };
  return (
    <Portal>
      <Modal visible={ismodalVisible} onDismiss={hideModal}>
        <ScrollView
          style={styles.mainContainer}
          contentContainerStyle={{ alignItems: 'center' }}
          showsVerticalScrollIndicator={false}
        >
          <Text style={titleStyle}>Add Design Type</Text>

          <View
            style={{
              ...inputstyle,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <Text>{selectedDesign}</Text>
            <TouchableOpacity
              onPress={() => setisDesignTypeModalOpen(!isDesignTypeModalOpen)}
            >
              <AntDesign name="down" style={styles.downIcon} />
            </TouchableOpacity>
          </View>
          {isDesignTypeModalOpen && (
            <Animated.View entering={FadeIn} exiting={FadeOut}>
              <View style={styles.designModalContainer}>
                <TextInput
                  style={styles.searchInput}
                  placeholder="Search..."
                  onChangeText={setSearchQuery}
                  value={searchQuery}
                />
                <FlatList
                  data={searchQuery ? filteredData : data}
                  renderItem={({ item }) => {
                    return (
                      <TouchableOpacity
                        style={styles.desingContainer}
                        onPress={() => handleSelectDesign(item?.name)}
                      >
                        <Text>{item?.name}</Text>
                      </TouchableOpacity>
                    );
                  }}
                  keyExtractor={(item) => item._id}
                  showsVerticalScrollIndicator={false}
                />
              </View>
            </Animated.View>
          )}

          <TextInput
            placeholder="Lawn Name"
            value={title}
            onChangeText={settitle}
            style={inputstyle}
          />

          <TextInput
            placeholder="Description"
            value={Description}
            onChangeText={setDescription}
            style={inputstyle}
            // multiline
          />

          <TouchableOpacity style={buttonContainer} onPress={handleImagePicker}>
            <Text style={buttonTitle}>+ Add Images</Text>
          </TouchableOpacity>
          {mainImages?.length !== 0 && (
            <View
              style={{
                width: screenHeight * 0.35,
                gap: 10,
                marginTop: '4%',
              }}
            >
              <FlatList
                data={mainImages}
                renderItem={({ item, index }) => (
                  <View>
                    <Image
                      key={index}
                      style={styles.selectedImages}
                      resizeMode="cover"
                      source={{ uri: item }}
                    />
                  </View>
                )}
                keyExtractor={(item, index) => index.toString()}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ gap: 15 }}
              />
            </View>
          )}

          <TextInput
            placeholder="Additional charges"
            value={price}
            onChangeText={(e) => handlePrice(e)}
            style={inputstyle}
            onBlur={() => settotalPrice(totalPrice + parseInt(price))}
            onFocus={handlePricefous}
          />

          <View
            style={{
              ...inputstyle,
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <Text>{tag}</Text>
            <LockIconSvg />
          </View>

          <View style={{ flexDirection: 'row', gap: 16 }}>
            <TextInput
              placeholder="Search Product"
              value={searchProduct}
              onChangeText={onChangeSearch}
              style={{ ...inputstyle, width: screenWidth * 0.46 }}
            />
            <TextInput
              placeholder="Qty"
              value={quantity}
              onChangeText={setQuantity}
              style={{ ...inputstyle, width: screenWidth * 0.25 }}
            />
          </View>

          {showProductModal && productsData?.length !== 0 && (
            <Animated.View entering={FadeIn} exiting={FadeOut}>
              <View style={styles.designModalContainer}>
                <FlatList
                  data={productsData}
                  renderItem={({ item }) => {
                    return (
                      <TouchableOpacity
                        style={styles.desingContainer}
                        onPress={() => handleSelectproduct(item)}
                      >
                        <Text>{item?.title}</Text>
                      </TouchableOpacity>
                    );
                  }}
                  keyExtractor={(item) => item._id}
                  showsVerticalScrollIndicator={false}
                />
              </View>
            </Animated.View>
          )}
          <TouchableOpacity
            style={{ ...buttonContainer, marginBottom: '4%' }}
            onPress={handleAddProduct}
          >
            <Text style={buttonTitle}>+ Add Product</Text>
          </TouchableOpacity>
          {showProducts?.length !== 0 && (
            <Animated.View entering={FadeIn} exiting={FadeOut}>
              <View
                style={{
                  width: screenWidth * 0.75,
                  gap: 10,
                  marginBottom: screenHeight * 0.018,
                }}
              >
                <FlatList
                  data={showProducts}
                  renderItem={({ item }) => {
                    const totlePrice = item?.quantity * item?.productId?.price;
                    return (
                      <View style={styles.showProductContainer}>
                        <View
                          style={{
                            flexDirection: 'row',
                            justifyContent: 'center',
                            alignItems: 'center',
                            gap: 10,
                          }}
                        >
                          <Text style={styles.productTitle}>
                            {item?.productName || item?.productId?.title}
                          </Text>
                          <Text style={styles.quantity}>{item?.quantity}x</Text>
                        </View>
                        <View style={styles.totalPriceContainer}>
                          <Text style={styles.totalPriceTitle}>
                            PKR {totlePrice}
                          </Text>
                        </View>
                      </View>
                    );
                  }}
                  keyExtractor={(item) => item._id}
                  showsVerticalScrollIndicator={false}
                  contentContainerStyle={{ gap: 10 }}
                />
              </View>
            </Animated.View>
          )}
          <View style={styles.approxAmountContainer}>
            <Text style={styles.approxAmount}>Approximate Amount</Text>
            <Text style={{ ...itemTitle, fontSize: screenHeight * 0.018 }}>
              {totalPrice} PKR
            </Text>
          </View>

          <TouchableOpacity
            style={{ ...buttonContainer, marginBottom: screenHeight * 0.04 }}
            onPress={handleAdd}
          >
            <Text style={buttonTitle}>Save</Text>
          </TouchableOpacity>
        </ScrollView>
      </Modal>
    </Portal>
  );
};

export default DesignCategoryModal;

const styles = StyleSheet.create({
  downIcon: {
    fontSize: 17,
  },
  desingContainer: {
    paddingVertical: '2.5%',
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
  searchInput: {
    borderBottomWidth: 1,
    borderBottomColor: Color.LightGrey,
    paddingVertical: '3%',
    marginBottom: '3%',
  },
  selectedImages: {
    width: screenWidth * 0.23,
    height: screenHeight * 0.1,
    resizeMode: 'contain',
    borderRadius: screenHeight * 0.01,
  },
  productTitle: {
    fontFamily: 'Roboto_700Bold',
    fontSize: screenHeight * 0.018,
    lineHeight: 21,

    width: screenWidth * 0.22,
  },
  quantity: {
    fontFamily: 'Roboto_500Medium',
    color: Color.Grey,
    fontSize: screenHeight * 0.018,
  },
  totalPriceContainer: {
    backgroundColor: Color.Blue,
    width: screenWidth * 0.22,
    alignItems: 'center',
    paddingVertical: screenHeight * 0.006,
    color: Color.White,
    borderRadius: 6,
  },
  totalPriceTitle: {
    color: Color.White,
    fontFamily: 'Roboto_700Bold',
    fontSize: screenHeight * 0.0165,
  },
  showProductContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: screenHeight * 0.01,
    borderRadius: screenHeight * 0.01,
    borderWidth: 0.9,
    borderColor: Color.Blue,
    paddingHorizontal: screenWidth * 0.03,
    backgroundColor: Color.LightBlue,
  },
  mainContainer: {
    backgroundColor: Color.White,
    width: screenWidth * 0.9,
    alignSelf: 'center',
    paddingVertical: screenHeight * 0.03,
    borderRadius: screenHeight * 0.01,
    maxHeight: screenHeight * 0.85,
  },
  approxAmount: {
    fontFamily: 'Roboto_500Medium',
    color: Color.Grey,
    fontSize: screenHeight * 0.016,
  },
  approxAmountContainer: {
    width: screenWidth * 0.75,
    flexDirection: 'row',
    justifyContent: 'space-between',
    // marginTop: '4%',
  },
});
