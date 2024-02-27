// import {
//   FlatList,
//   StyleSheet,
//   Text,
//   TouchableOpacity,
//   View,
//   Image,
//   Dimensions,
//   ScrollView,
// } from 'react-native';
// import React, { useEffect, useState } from 'react';
// import { axiosInstance } from '../../../axiosInstance';
// import Color from '../../../assets/colors/Color';
// import HeaderNormal from '../../components/HeaderNormal';
// import InputText from '../../components/InputText';
// import * as ImagePicker from 'expo-image-picker';
// import _debounce from 'lodash.debounce';
// import { useUserState } from '../../slices/userSlice';
// import { BASE_URL } from '../../../CONSTANTS';

// const DesignCategory = () => {
//   const userstate = useUserState();
//   const [DesignCategory, setDesignCategory] = useState([]);
//   const [selectedCategory, setselectedCategory] =
//     useState('Select Your Desing');

//   const [isCategoryOpen, setisCategoryOpen] = useState(false);

//   const [lawnName, setlawnName] = useState('');
//   const [description, setdescription] = useState('');
//   const [mainImages, setmainImages] = useState([]);
//   const [priceRange, setpriceRange] = useState(null);
//   const [searchProduct, setsearchProduct] = useState('');
//   const [products, setProducts] = useState([]);
//   const [productName, setProductName] = useState('');
//   const [quantity, setQuantity] = useState('');
//   const [productsData, setproductsData] = useState([]);

//   const [data, setdata] = useState([]);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const { data } = await axiosInstance.get('/decorations/get-design');
//         setDesignCategory(data);
//       } catch (error) {}
//     };

//     fetchData();
//   }, []);

//   const handleImagePicker = async () => {
//     let result = await ImagePicker.launchImageLibraryAsync({
//       mediaTypes: ImagePicker.MediaTypeOptions.All,

//       quality: 1,
//       allowsMultipleSelection: true,
//     });

//     if (!result.canceled) {
//       const imagesData = result.assets.map((item) => item?.uri);
//       setmainImages(imagesData);
//     }
//   };

//   const debouncedSearch = _debounce(async (query) => {
//     try {
//       const response = await axiosInstance.get(
//         `/decorations/search-decorProduct?search=${query}`,
//       );
//       setproductsData(response?.data?.data);
//     } catch (error) {
//       console.log(error);
//     }
//   }, 2000);

//   const onChangeSearch = (query) => {
//     setsearchProduct(query);
//     debouncedSearch(query);
//   };

//   const handleAddProduct = () => {
//     if (!productName || !quantity) {
//       alert('Please enter product name and quantity.');
//       return;
//     }

//     const newProduct = {
//       productId: productName,
//       quantity: parseInt(quantity),
//     };

//     setProducts([...products, newProduct]);
//     setProductName('');
//     setsearchProduct('');
//     setQuantity('');
//   };

//   const handleAddCatagory = async () => {
//     try {
//       const decorationData = new FormData();
//       decorationData.append('categorie', selectedCategory?.name);
//       decorationData.append('title', lawnName);
//       decorationData.append('Description', description);
//       decorationData.append('price', priceRange);
//       decorationData.append('tag', 'Example Tag');

//       products.forEach((product, index) => {
//         decorationData.append(
//           `products[${index}][productId]`,
//           product.productId,
//         );
//         decorationData.append(`products[${index}][quantity]`, product.quantity);
//       });

//       mainImages.forEach((link, index) => {
//         decorationData.append(`images`, {
//           name: link,
//           uri: link,
//           type: 'image/jpg',
//         });
//       });
//       console.log(decorationData);
//       const response = await axiosInstance.post(
//         '/decorations/add-decoration',
//         decorationData,
//         {
//           headers: {
//             'Content-Type': 'multipart/form-data',
//           },
//         },
//       );

//       // Handle success response
//     } catch (error) {
//       // Handle error response
//       console.log(error);
//     }
//   };

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const { data } = await axiosInstance.get('/decorations/get-decoration');
//         setdata(data);
//       } catch (error) {
//         console.log(error);
//       }
//     };

//     fetchData();
//   }, []);

//   return (
//     <ScrollView style={styles.container}>
//       <HeaderNormal title="Design Category" />

//       <View>
//         <TouchableOpacity
//           style={{ backgroundColor: 'red', width: '95%', alignSelf: 'center' }}
//           onPress={() => setisCategoryOpen(!isCategoryOpen)}
//         >
//           <Text>{selectedCategory?.name}</Text>
//         </TouchableOpacity>
//         {isCategoryOpen && (
//           <View>
//             <FlatList
//               data={DesignCategory}
//               renderItem={({ item }) => {
//                 return (
//                   <TouchableOpacity onPress={() => setselectedCategory(item)}>
//                     <Text>{item?.name}</Text>
//                   </TouchableOpacity>
//                 );
//               }}
//             />
//           </View>
//         )}

//         <View style={{ paddingHorizontal: '3%' }}>
//           <InputText
//             title="Lawn Name"
//             onchange={setlawnName}
//             value={lawnName}
//           />

//           <InputText
//             title="Description"
//             onchange={setdescription}
//             value={description}
//           />

//           <TouchableOpacity
//             style={{
//               paddingVertical: 10,
//               backgroundColor: 'red',
//               marginTop: 10,
//             }}
//             onPress={handleImagePicker}
//           >
//             <Text>Add Images</Text>
//           </TouchableOpacity>

//           {mainImages &&
//             mainImages.map((uri, idx) => {
//               return (
//                 <Image
//                   key={idx}
//                   style={styles.selectedImages}
//                   resizeMode="cover"
//                   source={{ uri }}
//                 />
//               );
//             })}

//           <InputText
//             title="Price Range"
//             onchange={setpriceRange}
//             value={priceRange}
//             keyboardType="number-pad"
//           />

//           <InputText
//             title="Search Products"
//             onchange={onChangeSearch}
//             value={searchProduct}
//           />

//           {searchProduct !== '' && (
//             <View>
//               <FlatList
//                 data={productsData}
//                 renderItem={({ item }) => {
//                   return (
//                     <TouchableOpacity onPress={() => setProductName(item?._id)}>
//                       <Text>{item?.title}</Text>
//                     </TouchableOpacity>
//                   );
//                 }}
//               />
//             </View>
//           )}
//           <InputText
//             title="Quantity"
//             onchange={setQuantity}
//             value={quantity}
//             keyboardType="number-pad"
//           />

//           <TouchableOpacity
//             style={{
//               backgroundColor: 'red',
//               paddingVertical: 30,
//               marginTop: 10,
//             }}
//             onPress={handleAddProduct}
//           >
//             <Text>Add</Text>
//           </TouchableOpacity>
//         </View>

//         <FlatList
//           data={products}
//           renderItem={({ item }) => {
//             return (
//               <TouchableOpacity onPress={() => setProductName(item?._id)}>
//                 <Text>{item?.name}</Text>
//                 <Text>{item?.quantity}</Text>
//               </TouchableOpacity>
//             );
//           }}
//         />

//         <TouchableOpacity
//           style={{ backgroundColor: 'blue', paddingVertical: 20 }}
//           onPress={handleAddCatagory}
//         >
//           <Text>Add to database</Text>
//         </TouchableOpacity>
//       </View>
//     </ScrollView>
//   );
// };

// export default DesignCategory;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: Color.White,
//   },
//   selectedImages: {
//     width: Dimensions.get('screen').height * 0.14,
//     height: Dimensions.get('screen').height * 0.14,
//     borderRadius: 8,
//     marginLeft: 10,
//   },
// });

import { Dimensions, StyleSheet, Text, View } from 'react-native';
import React, { useState } from 'react';
import Color from '../../../assets/colors/Color';
import HeaderNormal from '../../components/HeaderNormal';
import { ScrollView } from 'react-native-gesture-handler';
import DesignCategoryModal from './DesignCategoryModal';
import { useQuery } from 'react-query';
import { fetchDecorations } from '../../utils/Decorate';

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
    width: Dimensions.get('screen').height * 0.14,
    height: Dimensions.get('screen').height * 0.14,
    borderRadius: 8,
    marginLeft: 10,
  },
});
