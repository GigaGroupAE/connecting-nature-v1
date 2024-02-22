import React, { useEffect, useState } from 'react';
import { Button, StyleSheet, TextInput, View } from 'react-native';
import { axiosInstance } from '../../../axiosInstance';

const DesignType = () => {
  const [typeName, setTypeName] = useState('');
  const [data, setdata] = useState([]);

  const handleAddDecoration = async () => {
    if (!typeName) {
      alert('Please fill all fields.');
      return;
    }
    try {
      const decoration = {
        name: typeName,
      };

      const { data } = await axiosInstance.post(
        '/decorations/post-design',
        decoration,
      );

      //   console.log(decoration);

      // onAddDecoration(decoration);

      setTypeName('');
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Type Name"
        value={typeName}
        onChangeText={setTypeName}
      />

      <Button title="Add Decoration" onPress={handleAddDecoration} />
    </View>
  );
};

export default DesignType;

const styles = StyleSheet.create({
  container: {
    margin: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 10,
  },
});
