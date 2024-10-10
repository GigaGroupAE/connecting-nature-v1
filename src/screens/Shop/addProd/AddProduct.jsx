import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  ToastAndroid,
  TouchableHighlight,
  Dimensions,
  Alert,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Avatar } from 'react-native-paper';
import { useState, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { useStateContext } from '../../../contexts/ContextProvider';

//location package
import InputText from '../../../components/InputText';
import Header from '../../../components/Header';
import ButtonMain from '../../../components/ButtonMain';
import Color from '../../../../assets/colors/Color';
import { BASE_URL } from '../../../../CONSTANTS';
import { useUserState } from '../../../slices/userSlice';
import {
  useAddProductMutation,
  useEditProductMutation,
} from '../../../slices/ProductsApi';

const AddProduct = (props) => {
  const { loading, setLoading, showSnackbar } = useStateContext();
  const [fileExtension, setFileExtension] = useState('');
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');
  const [deal_quantity, setDeal_quantity] = useState('');
  const [image, setimage] = useState(null);
  const [galleryPermission, setGalleryPermission] = useState(null);
  const [imageUri, setImageUri] = useState(null);
  const [btnText, setBtnText] = useState('');
  const [imageChanged, setImageChanged] = useState(false);

  const [addProduct, { isLoading }] = useAddProductMutation();
  const [editProduct] = useEditProductMutation();

  const userState = useUserState();

  const onChangeTitle = (props) => {
    setTitle(props);
  };
  const onChangePrice = (props) => {
    setPrice(props);
  };
  const OnChangeStock = (props) => {
    setStock(props);
  };
  const OnChangeDeal_Quantity = (props) => {
    setDeal_quantity(props);
  };

  const setToastMsg = (msg) => {
    ToastAndroid.showWithGravity(msg, ToastAndroid.SHORT, ToastAndroid.CENTER);
  };

  const permisionFunction = async () => {
    const imagePermission = await ImagePicker.getMediaLibraryPermissionsAsync();

    setGalleryPermission(imagePermission.status === 'granted');

    if (imagePermission.status !== 'granted') {
      setToastMsg('Permission for media access needed.');
    }
  };

  useEffect(() => {
    if (props.route.params?.product) {
      //we're editing a prod

      setTitle(props.route.params.product.item.title);
      setPrice(`${props.route.params.product.item.price}`);
      setStock(`${props.route.params.product.item.stock}`);
      setDeal_quantity(`${props.route.params.product.item.deal_quantity}`);
      setImageUri(`${BASE_URL}${props.route.params.product.item.image}`);
      setBtnText('Save Changes');
    } else {
      //we're creating a prod
      setBtnText('Upload Product');
    }
    permisionFunction();

    //console.log(props.route.params.item, "items");
  }, []);

  const pick = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.5,
    });

    if (!result.cancelled) {
      const uriParts = result.uri.split('.');
      setFileExtension(uriParts[uriParts.length - 1]);
      setImageUri(result.uri);
      setimage(result);
      setImageChanged(true);
    }
  };
  const navigation = useNavigation();
  const handleClick = async () => {
    //validation
    if (title.length <= 0) {
      Alert.alert('Error', 'title not provided');
      return;
    }
    if (isNaN(parseInt(price)) || parseInt(price) <= 0) {
      Alert.alert('Error', 'Price should be greater than 0');
      return;
    }
    if (isNaN(parseInt(stock)) || parseInt(stock) <= 0) {
      Alert.alert('Error', 'stock not provided');
      return;
    }
    if (isNaN(parseInt(deal_quantity)) || parseInt(deal_quantity) <= 0) {
      Alert.alert('Error', 'deal quantity should at least be 1');
      return;
    }

    if (!imageUri) {
      Alert.alert('Error', 'Please select an image');
      return;
    }

    //creating form

    const formData = new FormData();

    if (image !== null && imageChanged) {
      formData.append('image', {
        name: `${Date.now()}.${fileExtension}`,
        uri: image.uri,
        type: 'image/jpg',
      });
    }

    formData.append('title', title);
    formData.append('price', price);
    formData.append('stock', stock);
    formData.append('deal_quantity', deal_quantity);

    try {
      setLoading(true);
      let result;

      if (btnText === 'Save Changes') {
        result = await editProduct({
          token: userState.token,
          id: props.route.params.product.item._id,
          data: formData,
        });
        showSnackbar('Product Edited Successfully');
      } else if (btnText === 'Upload Product') {
        result = await addProduct({ token: userState.token, data: formData });
        showSnackbar('Product Added Successfully');
      }
      navigation.goBack();
    } catch (error) {
      Alert.alert(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={{ backgroundColor: Color.Blue }}>
      <Header title={'Upload Product'} />
      <View style={styles.container}>
        <View style={styles.profileImage}>
          <TouchableHighlight onPress={pick} underlayColor="rgba(0,0,0,0)">
            <Avatar.Image
              size={150}
              source={{
                uri: imageUri,
              }}
            />
          </TouchableHighlight>
        </View>

        <InputText title={'Title'} onchange={onChangeTitle} value={title} />

        <InputText
          title={'Price'}
          onchange={onChangePrice}
          keyboardType={'number-pad'}
          value={price}
        />
        <InputText
          title={'Stock'}
          onchange={OnChangeStock}
          value={stock}
          keyboardType={'number-pad'}
        />
        <InputText
          title={'Deal Quantity'}
          onchange={OnChangeDeal_Quantity}
          value={deal_quantity}
          keyboardType={'number-pad'}
        />

        <ButtonMain title={btnText} callback={handleClick} />
      </View>
    </SafeAreaView>
  );
};

export default AddProduct;

const styles = StyleSheet.create({
  container: {
    backgroundColor: Color.White,
    width: Dimensions.get('screen').width,
    height: Dimensions.get('screen').height,
    alignContent: 'center',
    alignItems: 'center',
  },
  profileImage: {
    marginBottom: 40,
    marginTop: 14,
    width: 120,
    height: 120,
    backgroundColor: '#EAEAEA',
    borderRadius: 100,
    alignItems: 'center',
  },
  innerContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 100,
  },
  createNew: {
    fontFamily: 'Roboto_600SemiBold',
    fontSize: 14,
    color: Color.Blue,
    marginLeft: 8,
    textDecorationLine: 'underline',
  },
  createNewContainer: {
    flexDirection: 'row',
    alignSelf: 'center',
    position: 'absolute',
    bottom: '18%',
  },
});
