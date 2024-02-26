import React, { useState } from 'react';
import {
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
  Text,
  FlatList,
} from 'react-native';
import HeaderNormal from '../../components/HeaderNormal';
import Color from '../../../assets/colors/Color';
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
import { AddDesignType, getDesignType } from '../../utils/Decorate';
import { useQuery } from 'react-query';
import AffordableSkeletonLoad from './AffordableSkeletonLoad';

const DesignType = () => {
  const [name, setname] = useState('');
  const [ismodalVisible, setismodalVisible] = useState(false);

  const handleAddDecoration = async () => {
    if (!name) {
      alert('Please fill all fields.');
      return;
    }
    try {
      const data = await AddDesignType(name, refetch);
      setname('');
      setismodalVisible(false);
      zzzmmm;
    } catch (error) {
      console.log(error);
    }
  };

  const { data, isLoading, refetch } = useQuery('designData', getDesignType, {
    staleTime: 300000,
    cacheTime: 600000,
    refetchOnWindowFocus: false,
  });
  const hideModal = () => {
    setismodalVisible(false);
  };

  return (
    <View style={styles.container}>
      <HeaderNormal title="Design Type" setismodalVisible={setismodalVisible} />

      <View>
        {isLoading ? (
          <AffordableSkeletonLoad />
        ) : (
          <FlatList
            data={data}
            renderItem={({ item }) => {
              return (
                <View style={mainContainer}>
                  <View style={styles.leftContainer}>
                    <Text style={itemTitle}>{item?.name}</Text>
                  </View>
                  <View style={styles.rightContainer}>
                    <TouchableOpacity
                      style={editButton}
                      // onPress={() => handleEdit(item)}
                    >
                      <Text style={editButtonTitle}>Edit</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              );
            }}
            keyExtractor={(item) => item?._id}
          />
        )}
      </View>

      <Portal>
        <Modal visible={ismodalVisible} onDismiss={hideModal}>
          <View style={container}>
            <Text style={titleStyle}>Add Design Type</Text>

            <View>
              <TextInput
                placeholder="Type Name"
                value={name}
                onChangeText={setname}
                style={inputstyle}
              />
            </View>
            <TouchableOpacity
              style={buttonContainer}
              onPress={handleAddDecoration}
            >
              <Text style={buttonTitle}>Add</Text>
            </TouchableOpacity>
          </View>
        </Modal>
      </Portal>
    </View>
  );
};

export default DesignType;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Color.White,
  },
  leftContainer: {
    flex: 2,
    justifyContent: 'center',
  },
  rightContainer: {
    flex: 1,
    alignItems: 'flex-end',
  },
});
