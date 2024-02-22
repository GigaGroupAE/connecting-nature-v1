import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Button,
  Image,
  FlatList,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { axiosInstance } from '../../../axiosInstance';
import { BASE_URL } from '../../../CONSTANTS';

const AddDecorProduct = () => {
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [image, setImage] = useState(null);

  const [data, setdata] = useState([]);

  const openImagePicker = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.cancelled) {
      setImage(result.assets[0].uri);
    }
  };

  useEffect(() => {
    const fethData = async () => {
      try {
        const { data } = await axiosInstance.get(
          '/decorations/getDecorProducts',
        );
        setdata(data);
      } catch (error) {
        console.log(error);
      }
    };

    fethData();
  }, []);
  const handleSubmit = async () => {
    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('price', price);
      formData.append('image', {
        uri: image,
        name: 'image.jpg',
        type: 'image/jpeg',
      });

      const { data } = await axiosInstance.post(
        '/decorations/add-decor-product',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        },
      );

      // Handle response data if needed
      console.log('Decoration added successfully:', data);
    } catch (error) {
      // Handle network errors or other exceptions
      console.error('Error adding decoration:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Title</Text>
      <TextInput
        style={styles.input}
        value={title}
        onChangeText={setTitle}
        placeholder="Enter title"
      />
      <Text style={styles.label}>Price</Text>
      <TextInput
        style={styles.input}
        value={price}
        onChangeText={setPrice}
        placeholder="Enter price"
        keyboardType="numeric"
      />
      <Button title="Choose Image" onPress={openImagePicker} />
      {image && <Image source={{ uri: image }} style={styles.image} />}
      <Button title="Submit" onPress={handleSubmit} />

      {/* <View>
        <FlatList
          data={data}
          renderItem={({ item }) => {
            console.log(item, 'itm');
            return (
              <View>
                <Image source={{ uri: `${BASE_URL}/images/${item?.image}` }} />
                <Text>hello</Text>
              </View>
            );
          }}
        />
      </View> */}
    </View>
  );
};
export default AddDecorProduct;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 20,
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
    width: 200,
    height: 200,
    marginVertical: 20,
  },
});
