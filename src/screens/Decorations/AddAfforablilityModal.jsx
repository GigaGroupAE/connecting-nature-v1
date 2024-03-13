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
import { screenWidth } from '../../utils/ScreenDimensions';
import { axiosInstance } from '../../../axiosInstance';
import { useStateContext } from '../../contexts/ContextProvider';
import {
  buttonContainer,
  buttonTitle,
  container,
  inputstyle,
  titleStyle,
} from './ModalStyle';

const AddAfforablilityModal = ({
  ismodalVisible,
  setismodalVisible,
  refetch,
  item,
  setisEdit,
  isEdit,
}) => {
  const [typeName, setTypeName] = useState(item?.name || '');
  const [minNumber, setMinNumber] = useState(item?.minRange?.toString() || '');
  const [maxNumber, setMaxNumber] = useState(item?.maxRange?.toString() || '');
  const [id, setid] = useState(item?._id);
  const hideModal = () => setismodalVisible(false);
  const { showSnackbar } = useStateContext();
  const [isEditt, setisEditt] = useState(isEdit);

  console.log(isEditt, 'isedit');

  const handleAddAfforadbility = async () => {
    try {
      if (!typeName || !minNumber || !maxNumber) {
        Alert.alert('Please fill all fields.');
        return;
      }
      if (parseInt(maxNumber) <= parseInt(minNumber)) {
        Alert.alert('Max Range must be greater than Min Range.');
        return;
      }

      const decoration = {
        name: typeName,
        minRange: parseInt(minNumber),
        maxRange: parseInt(maxNumber),
      };

      let response;
      if (isEditt) {
        response = await axiosInstance.put(
          `/decorations/update-affordabilities/${id}`,
          decoration,
        );
      } else {
        response = await axiosInstance.post(
          `/decorations/post-affordabilities`,
          decoration,
        );
      }

      showSnackbar(response.data?.message);
      clearInputFields();
      setismodalVisible(false);
      refetch();
    } catch (error) {
      console.log(error);
      Alert.alert('An error occurred. Please try again later.');
    }
  };

  const clearInputFields = () => {
    setTypeName('');
    setMinNumber('');
    setMaxNumber('');
  };

  return (
    <Portal>
      <Modal visible={ismodalVisible} onDismiss={hideModal}>
        <View style={container}>
          <Text style={titleStyle}>Add Affordability</Text>

          <View>
            <TextInput
              placeholder="Type Name"
              value={typeName}
              onChangeText={setTypeName}
              style={inputstyle}
            />
          </View>

          <View style={styles.priceRangeContainer}>
            <TextInput
              style={{ ...inputstyle, width: screenWidth * 0.36 }}
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
              style={{ ...inputstyle, width: screenWidth * 0.36 }}
            />
          </View>

          <TouchableOpacity
            style={buttonContainer}
            onPress={handleAddAfforadbility}
          >
            {isEditt ? (
              <Text style={buttonTitle}>Update</Text>
            ) : (
              <Text style={buttonTitle}>Add</Text>
            )}
          </TouchableOpacity>
        </View>
      </Modal>
    </Portal>
  );
};

export default AddAfforablilityModal;

const styles = StyleSheet.create({
  priceRangeContainer: {
    flexDirection: 'row',
    width: '90%',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
});
