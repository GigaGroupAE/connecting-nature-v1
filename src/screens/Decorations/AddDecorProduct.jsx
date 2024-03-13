import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Image,
  TouchableOpacity,
  FlatList,
  Pressable,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import Color from '../../../assets/colors/Color';
import HeaderNormal from '../../components/HeaderNormal';
import { Modal, Portal } from 'react-native-paper';

import {
  buttonContainer,
  buttonTitle,
  container,
  editButton,
  editButtonTitle,
  inputstyle,
  itemTitle,
  mainContainer,
  titleStyle,
} from './ModalStyle';
import { screenHeight, screenWidth } from '../../utils/ScreenDimensions';
import { addProduct, getProducts } from '../../utils/Decorate';
import { useQuery } from 'react-query';
import { BASE_URL } from '../../../CONSTANTS';
import AffordableSkeletonLoad from './AffordableSkeletonLoad';
import NoItemIndicater from '../../components/NoItemIndicater';

const AddDecorProduct = ({ navigation }) => {
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [image, setImage] = useState(null);
  const [ismodalVisible, setismodalVisible] = useState(false);
  const [editProductDetails, seteditProductDetails] = useState(null);
  const [isEdit, setisEdit] = useState(false);

  const { data, isLoading, refetch } = useQuery('decorproducts', getProducts, {
    staleTime: 300000,
    cacheTime: 600000,
    refetchOnWindowFocus: false,
  });

  const openImagePicker = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.cancelled) {
      setImage(result.assets[0].uri);
    }
  };

  useEffect(() => {
    if (editProductDetails) {
      setTitle(editProductDetails?.title);
      setPrice(editProductDetails?.price?.toString());
    }
    if (!ismodalVisible) {
      seteditProductDetails('');
      setTitle('');
      setImage('');
      setPrice('');
      setisEdit(false);
    }
  }, [editProductDetails, ismodalVisible]);

  const handleSubmit = async () => {
    try {
      const data = await addProduct(
        title,
        price,
        image,
        setImage,
        setPrice,
        setTitle,
        refetch,
        setismodalVisible,
        editProductDetails,
      );
    } catch (error) {}
  };

  const hideModal = () => {
    setismodalVisible(false);
  };

  const handleEdit = (item) => {
    seteditProductDetails(item);
    setismodalVisible(true);
    setisEdit(true);
  };
  return (
    <View style={styles.container}>
      <HeaderNormal title="Products" setismodalVisible={setismodalVisible} />
      <View style={{ flex: 1 }}>
        {isLoading ? (
          <AffordableSkeletonLoad />
        ) : (
          <View style={{ flex: 1 }}>
            {data?.length === 0 ? (
              <NoItemIndicater
                title="No Products Found"
                description="Looks like there are no products available at the moment. When you add products, they will appear here."
                image={require('../../../assets/newPost.png')}
              />
            ) : (
              <FlatList
                data={data}
                renderItem={({ item }) => {
                  return (
                    <View style={mainContainer}>
                      <View style={styles.leftContainer}>
                        <Pressable
                          onPress={() =>
                            navigation.navigate('ViewImage', {
                              url: `${BASE_URL}/images/${item?.image}`,
                            })
                          }
                        >
                          <Image
                            source={{
                              uri: `${BASE_URL}/images/${item?.image}`,
                            }}
                            style={styles.productImage}
                          />
                        </Pressable>
                        <View
                          style={{
                            height: '80%',
                            gap: 5,
                          }}
                        >
                          <Text style={itemTitle}>{item?.title}</Text>
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
                              }}
                            >
                              Price :
                            </Text>
                            <Text style={itemTitle}>{item?.price}</Text>
                          </View>
                        </View>
                      </View>
                      <View style={styles.rightContainer}>
                        <TouchableOpacity
                          style={editButton}
                          onPress={() => handleEdit(item)}
                        >
                          <Text style={editButtonTitle}>Edit</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  );
                }}
                keyExtractor={(item) => item?._id}
                showsVerticalScrollIndicator={false}
              />
            )}
          </View>
        )}
      </View>
      <Portal>
        <Modal visible={ismodalVisible} onDismiss={hideModal}>
          <View style={container}>
            <Text style={titleStyle}>Add Product</Text>
            <View>
              <TextInput
                placeholder="Name"
                value={title}
                onChangeText={setTitle}
                style={inputstyle}
              />
              <TextInput
                placeholder="Unit Price"
                value={price}
                onChangeText={setPrice}
                style={inputstyle}
                keyboardType="numeric"
              />

              <TouchableOpacity style={inputstyle} onPress={openImagePicker}>
                <Text style={{ color: Color.LightGrey }}>Product Image</Text>
              </TouchableOpacity>

              {image ? (
                <Image source={{ uri: image }} style={styles.image} />
              ) : (
                <View>
                  {editProductDetails && (
                    <Image
                      source={{
                        uri: `${BASE_URL}/images/${editProductDetails?.image}`,
                      }}
                      style={styles.image}
                    />
                  )}
                </View>
              )}
            </View>
            <TouchableOpacity style={buttonContainer} onPress={handleSubmit}>
              {isEdit ? (
                <Text style={buttonTitle}>Update</Text>
              ) : (
                <Text style={buttonTitle}>Add</Text>
              )}
            </TouchableOpacity>
          </View>
        </Modal>
      </Portal>
    </View>
  );
};
export default AddDecorProduct;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Color.White,
  },
  label: {
    fontSize: 18,
    marginBottom: 5,
  },
  input: {
    width: '100%',
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  image: {
    width: screenWidth * 0.75,
    height: screenHeight * 0.2,
    marginVertical: screenHeight * 0.02,
    borderRadius: screenHeight * 0.01,
    resizeMode: 'cover',
  },
  leftContainer: {
    flex: 2,
    // justifyContent: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  rightContainer: {
    flex: 1,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  productImage: {
    width: screenWidth * 0.21,
    height: screenHeight * 0.053,
    resizeMode: 'cover',
    borderRadius: screenHeight * 0.01,
  },
});
