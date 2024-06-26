import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import { scale } from 'react-native-size-matters';
import { FontAwesome, MaterialIcons, Entypo } from 'react-native-vector-icons';
import Color from '../../assets/colors/Color';
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';
import { Portal, Modal } from 'react-native-paper';
import { useStateContext } from '../contexts/ContextProvider';
import { BASE_URL } from '../../CONSTANTS';
import { screenHeight } from '../utils/ScreenDimensions';

import ReportPostModal from './ReportPostModal';

const PostShareModal = ({ modalVisible, setModalVisible, media, id }) => {
  const name = media?.name;
  const url = `${BASE_URL}/images/${media?.name}`;
  const { showSnackbar } = useStateContext();
  const [isReportPost, setisReportPost] = useState(false);
  const handleShare = async () => {
    const remoteImageUri = `${url}`;
    const localFileName = `${name}`;
    const localUri = FileSystem.cacheDirectory + localFileName;

    try {
      await FileSystem.downloadAsync(remoteImageUri, localUri);
      const result = await Sharing.shareAsync(localUri);
    } catch (error) {
      console.error('Error sharing image:', error);
    }
  };
  const handleDownloadFile = async () => {
    const localFileName = `${name}`;
    const localUri = FileSystem.documentDirectory + localFileName;

    FileSystem.downloadAsync(`${url}`, localUri)
      .then(({ uri }) => {
        setModalVisible(false);
        showSnackbar('Image successfully downloaded');
        const asset = MediaLibrary.createAssetAsync(uri);
        const album = MediaLibrary.getAlbumAsync('Download');
        if (album == null) {
          MediaLibrary.createAlbumAsync('Download', uri, false);
          console.log('donwloaded ');
        } else {
          MediaLibrary.addAssetsToAlbumAsync([uri], album, false);
        }
      })
      .catch((error) => {
        console.error('Error downloading file:', error);
      });
  };

  const showModal = () => setModalVisible(true);
  const hideModal = () => setModalVisible(false);

  return (
    <Portal>
      <Modal
        visible={modalVisible}
        onDismiss={hideModal}
        animationType="slide"
        style={styles.modal}
        transparent
      >
        <View style={styles.modalContainer}>
          {media && (
            <TouchableOpacity
              style={styles.contentContainer}
              onPress={handleDownloadFile}
            >
              <MaterialIcons name="save-alt" style={styles.icon} />
              <Text style={styles.title}>Save to phone</Text>
            </TouchableOpacity>
          )}
          {media && (
            <TouchableOpacity
              style={styles.contentContainer}
              onPress={handleShare}
            >
              <FontAwesome name="share" style={styles.icon} />
              <Text style={styles.title}>Share external</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            style={styles.contentContainer}
            onPress={() => setisReportPost(true)}
          >
            <MaterialIcons name="report" style={styles.icon} />
            <Text style={styles.title}>Report Post</Text>
          </TouchableOpacity>

          {isReportPost && (
            <ReportPostModal
              modalVisible={isReportPost}
              setModalVisible={setisReportPost}
              id={id}
              showSnackbar={showSnackbar}
              setmainModal={setModalVisible}
            />
          )}
        </View>
      </Modal>
    </Portal>
  );
};

export default PostShareModal;

const styles = StyleSheet.create({
  modal: {
    justifyContent: 'center',
    alignItems: 'center',
  },

  module: {
    alignItems: 'flex-end',
    height: '30%',
  },
  modalContainer: {
    maxHeight: scale(170),
    width: scale(300),
    backgroundColor: Color.White,
    justifyContent: 'center',
    borderRadius: scale(8),
    paddingVertical: screenHeight * 0.015,
  },
  contentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: scale(20),
    paddingVertical: scale(12),
  },
  title: {
    fontFamily: 'Roboto_400Regular',
    fontSize: screenHeight * 0.02,
    paddingHorizontal: scale(12),
  },
  icon: {
    fontSize: screenHeight * 0.02,
  },
  crossIcon: {
    alignItems: 'center',
    paddingVertical: scale(10),
    width: scale(60),
    alignSelf: 'flex-end',
  },
  cross: {
    fontSize: scale(20),
  },
});
