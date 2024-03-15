import React, { useEffect, useState } from 'react';
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
  icon,
  iconsContainer,
  inputstyle,
  itemTitle,
  mainContainer,
  titleStyle,
} from './ModalStyle';
import {
  AddDesignType,
  deleteDesignType,
  getDesignType,
} from '../../utils/Decorate';
import { useQuery } from 'react-query';
import AffordableSkeletonLoad from './AffordableSkeletonLoad';
import NoDataIndicater from '../NoDataIndicater';
import { FontAwesome, AntDesign } from 'react-native-vector-icons';
import { useStateContext } from '../../contexts/ContextProvider';

const DesignType = () => {
  const [ismodalVisible, setismodalVisible] = useState(false);
  const [product, setproduct] = useState(null);
  const [isEdit, setisEdit] = useState(false);
  const [name, setname] = useState(product?.name || '');
  const { showSnackbar } = useStateContext();

  const handleAddDecoration = async () => {
    if (!name) {
      alert('Please fill all fields.');
      return;
    }
    try {
      const data = await AddDesignType(name, refetch, isEdit, product);
      setname('');
      setismodalVisible(false);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (product) {
      setname(product?.name);
    }
    if (!ismodalVisible) {
      setname('');
      setproduct(null);
      setisEdit(false);
    }
  }, [product, ismodalVisible]);

  const { data, isLoading, refetch } = useQuery('designData', getDesignType, {
    staleTime: 300000,
    cacheTime: 600000,
    refetchOnWindowFocus: false,
  });
  const hideModal = () => {
    setismodalVisible(false);
  };

  const handleEdit = (item) => {
    setproduct(item);
    setismodalVisible(true);
    setisEdit(true);
  };

  const handleDelete = async (item) => {
    try {
      const { data } = await deleteDesignType(item?._id);
      showSnackbar(data?.message);
      refetch();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <View style={styles.container}>
      <HeaderNormal title="Design Type" setismodalVisible={setismodalVisible} />

      <View>
        {isLoading ? (
          <AffordableSkeletonLoad />
        ) : (
          <View>
            {data?.length === 0 ? (
              <NoDataIndicater
                title="Currently No Data Available"
                subTitle="When you add Design types, 
it will be list here"
              />
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
                        {/* <TouchableOpacity
                          style={editButton}
                          onPress={() => handleEdit(item)}
                        >
                          <Text style={editButtonTitle}>Edit</Text>
                        </TouchableOpacity> */}
                        <View
                          style={{
                            flexDirection: 'row',
                            // gap: 8,
                            alignItems: 'center',
                          }}
                        >
                          <TouchableOpacity
                            style={{ ...iconsContainer, paddingVertical: '2%' }}
                            onPress={() => handleEdit(item)}
                          >
                            <FontAwesome name="edit" style={icon} />
                          </TouchableOpacity>
                          <TouchableOpacity
                            style={{ ...iconsContainer, paddingVertical: '2%' }}
                            onPress={() => handleDelete(item)}
                          >
                            <AntDesign name="delete" style={icon} />
                          </TouchableOpacity>
                        </View>
                      </View>
                    </View>
                  );
                }}
                keyExtractor={(item) => item?._id}
              />
            )}
          </View>
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
