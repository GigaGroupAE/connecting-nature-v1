import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';
import React, { useState } from 'react';
import { Modal, Portal } from 'react-native-paper';
import Color from '../../../assets/colors/Color';
import { screenHeight, screenWidth } from '../../utils/ScreenDimensions';
import { axiosInstance } from '../../../axiosInstance';
import { useStateContext } from '../../contexts/ContextProvider';

const AddAfforablilityModal = ({
  ismodalVisible,
  setismodalVisible,
  refetch,
}) => {
  const [typeName, setTypeName] = useState('');
  const [minNumber, setMinNumber] = useState('');
  const [maxNumber, setMaxNumber] = useState('');
  const hideModal = () => setismodalVisible(false);
  const { showSnackbar } = useStateContext();

  const handleAddAfforadbility = async () => {
    if (!typeName || !minNumber || !maxNumber) {
      Alert.alert('Please fill all fields.');
      return;
    }
    if (parseInt(maxNumber) <= parseInt(minNumber)) {
      Alert.alert('Max Range must be greater than Min Range.');
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
      showSnackbar(data?.message);
      setTypeName('');
      setMinNumber('');
      setMaxNumber('');
      setismodalVisible(false);
      refetch();
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <Portal>
      <Modal visible={ismodalVisible} onDismiss={hideModal}>
        <View style={styles.container}>
          <Text style={styles.title}>Add Affordability</Text>

          <View>
            <TextInput
              placeholder="Type Name"
              value={typeName}
              onChangeText={setTypeName}
              style={{ ...styles.input, width: screenWidth * 0.75 }}
            />
          </View>

          <View style={styles.priceRangeContainer}>
            <TextInput
              style={styles.input}
              onChangeText={setMinNumber}
              value={minNumber}
              placeholder="Min."
              keyboardType="numeric"
            />
            <TextInput
              placeholder="Max."
              value={maxNumber}
              onChangeText={setMaxNumber}
              keyboardType="numeric"
              style={styles.input}
            />
          </View>

          <TouchableOpacity
            style={styles.buttonContainer}
            onPress={handleAddAfforadbility}
          >
            <Text style={styles.buttonTitle}>Add</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </Portal>
  );
};

export default AddAfforablilityModal;

const styles = StyleSheet.create({
  container: {
    backgroundColor: Color.White,
    width: screenWidth * 0.9,
    alignSelf: 'center',
    paddingVertical: screenHeight * 0.03,
    alignItems: 'center',
    borderRadius: screenHeight * 0.01,
  },
  priceRangeContainer: {
    flexDirection: 'row',
    width: '90%',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  input: {
    padding: screenHeight * 0.015,
    borderRadius: 8,
    width: screenWidth * 0.36,
    fontSize: 14,
    fontFamily: 'Roboto_500Medium',
    marginTop: 16,
    backgroundColor: Color.White,
    shadowColor: Color.Grey,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
    elevation: 3,
    zIndex: 100,
    position: 'relative',
  },
  buttonContainer: {
    backgroundColor: Color.Blue,
    alignItems: 'center',
    paddingVertical: screenHeight * 0.014,
    width: screenWidth * 0.75,
    borderRadius: screenHeight * 0.01,
    marginTop: screenHeight * 0.027,
  },
  buttonTitle: {
    color: Color.White,
    fontSize: screenHeight * 0.021,
    fontFamily: 'Roboto_700Bold',
  },
  title: {
    fontSize: screenHeight * 0.021,
    fontFamily: 'Roboto_700Bold',
  },
});
