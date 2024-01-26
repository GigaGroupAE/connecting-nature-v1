import React from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Dimensions,
  Alert,
} from 'react-native';
import Color from '../../../../assets/colors/Color';
import HeaderNormal from '../../../components/HeaderNormal';

import ProductRow from './ProductRow';
import { useUserState } from '../../../slices/userSlice';
import { useGetProductsQuery } from '../../../slices/ProductsApi';
const height = Dimensions.get('screen').height;
const width = Dimensions.get('screen').width;

const ProductList = (props) => {
  //const [data, setData] = useState([]);

  const userState = useUserState();

  const { data, isLoading, error } = useGetProductsQuery(userState.token);

  if (isLoading)
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Loading....</Text>
      </View>
    );

  if (error) {
    Alert.alert('error', error.data);

    return;
  }

  return (
    <View style={styles.container}>
      <HeaderNormal title="Orders" />

      <FlatList
        data={data.products}
        renderItem={(item) => {
          return <ProductRow item={item} />;
        }}
        keyExtractor={(prod) => prod._id}
        style={styles.listContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,

    // backgroundColor: Color.Blue,
    backgroundColor: Color.White,
  },
  listContainer: {
    width: '100%',
  },
  userContainer: {
    width: width * 0.9,
    height: height * 0.07,
    marginTop: 12,
    backgroundColor: Color.White,
    borderRadius: 8,
    shadowColor: Color.DarkGrey,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
    elevation: 8,
    overflow: 'hidden',
    alignSelf: 'center',
  },
  userImage: {
    width: width * 0.13,
    height: height * 0.06,
    borderRadius: 10,
    resizeMode: 'contain',
    alignSelf: 'center',
    // marginTop: 3,
    margin: 5,
  },
  Productname: {
    flexWrap: 'wrap',
    margin: 6,
    width: width / 3.4,
    backgroundColor: '#8329 ',
    color: Color.Grey,
    alignSelf: 'center',
    fontSize: 17,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    backgroundColor: Color.White,
    borderRadius: 20,
    // paddingHorizontal: 20,
    // paddingVertical: 10,
    // alignItems: "center",
    borderRadius: 8,
    shadowColor: Color.DarkGrey,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
    elevation: 8,
    width: width * 0.8,
    height: height * 0.13,
  },
  btnContainer: {
    marginTop: 42,
    alignItems: 'center',
    width: 120,
    height: 48,
    borderRadius: 6,
    flexDirection: 'row',
  },

  buttonClose: {
    position: 'absolute',
    right: 5,
    top: 5,
  },
  btn: {
    // marginBottom: ,
    width: width * 0.3,
    height: height * 0.05,
    borderRadius: 8,
    textAlign: 'center',
    paddingTop: 8,
    fontSize: 20,
    fontWeight: '500',
  },
});

export default ProductList;
