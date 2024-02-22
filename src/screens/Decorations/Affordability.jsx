import React, { useState } from 'react';
import { Button, StyleSheet, Text, TextInput, View } from 'react-native';
import { axiosInstance } from '../../../axiosInstance';

const Affordability = ({ onAddDecoration }) => {
  const [typeName, setTypeName] = useState('');
  const [minNumber, setMinNumber] = useState('');
  const [maxNumber, setMaxNumber] = useState('');

  const handleAddDecoration = async () => {
    if (!typeName || !minNumber || !maxNumber) {
      alert('Please fill all fields.');
      return;
    }
    try {
      const decoration = {
        name: typeName,
        minRange: parseInt(minNumber),
        maxRange: parseInt(maxNumber),
      };

      const { data } = await axiosInstance.post(
        '/decorations/post-affordabilities',
        decoration,
      );

      //   console.log(decoration);

      // onAddDecoration(decoration);

      setTypeName('');
      setMinNumber('');
      setMaxNumber('');
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
      <TextInput
        style={styles.input}
        placeholder="Min Number"
        keyboardType="numeric"
        value={minNumber}
        onChangeText={setMinNumber}
      />
      <TextInput
        style={styles.input}
        placeholder="Max Number"
        keyboardType="numeric"
        value={maxNumber}
        onChangeText={setMaxNumber}
      />
      <Button title="Add Decoration" onPress={handleAddDecoration} />
    </View>
  );
};

export default Affordability;

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
