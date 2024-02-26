import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { Modal, Portal } from 'react-native-paper';
import {
  buttonContainer,
  buttonTitle,
  container,
  inputstyle,
  titleStyle,
} from './ModalStyle';
import { screenWidth } from '../../utils/ScreenDimensions';
import { useQuery } from 'react-query';
import { getDesignType } from '../../utils/Decorate';

const DesignCategoryModal = ({ ismodalVisible, setisModalVisible }) => {
  const hideModal = () => {
    setisModalVisible(false);
  };

  const { data, isLoading, refetch } = useQuery('designData', getDesignType, {
    staleTime: 300000,
    cacheTime: 600000,
    refetchOnWindowFocus: false,
  });
  return (
    <Portal>
      <Modal visible={ismodalVisible} onDismiss={hideModal}>
        <View style={container}>
          <Text style={titleStyle}>Add Design Type</Text>

          <View></View>
        </View>
      </Modal>
    </Portal>
  );
};

export default DesignCategoryModal;

const styles = StyleSheet.create({});
