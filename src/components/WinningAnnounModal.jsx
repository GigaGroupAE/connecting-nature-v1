import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Pressable,
  FlatList,
  Image,
  TextInput,
} from 'react-native';
import React, { useState } from 'react';
import { Modal, Portal } from 'react-native-paper';
import {
  buttonTitle,
  buttonContainer,
  titleStyle,
  container,
  inputstyle,
} from '../screens/Decorations/ModalStyle';
import { screenHeight } from '../utils/ScreenDimensions';
import ProjectDetails from './ProjectDetails';
import { MaterialIcons } from 'react-native-vector-icons';
import { scale } from 'react-native-size-matters';

import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import Color from '../../assets/colors/Color';
import { BASE_URL } from '../../CONSTANTS';
import WinerSvg from './SVG/Winner';
import { announceWinner } from '../utils/BiddingChannel';

const WinningAnnounModal = ({
  modalVisible,
  setModalVisible,
  item,
  refetch,
  handleGroupNotification,
}) => {
  const [isUserModalOpen, setisUserModalOpen] = useState(false);
  const [selectedUser, setselectedUser] = useState(null);
  const [winningTitle, setwinningTitle] = useState(
    'Congratulation on winning Bid  🎉',
  );
  const hideModal = () => {
    setModalVisible(false);
  };

  const handleSubmit = async () => {
    if (!selectedUser) {
    } else {
      try {
        await announceWinner(item?._id, 'Archive', selectedUser?._id);
        refetch();
      } catch {}
    }
  };

  return (
    <Portal>
      <Modal visible={modalVisible} onDismiss={hideModal}>
        <View style={container}>
          <Text style={{ ...titleStyle, fontSize: screenHeight * 0.02 }}>
            Winner Announcement
          </Text>
          <View style={{ width: '90%' }}>
            <View>
              <Text style={{ ...titleStyle, fontSize: screenHeight * 0.017 }}>
                {item?.ProjectName}
              </Text>
              <Text
                style={{ ...styles.descriptionTitle, marginVertical: '2%' }}
              >
                {item?.description}
              </Text>
            </View>
            <ProjectDetails item={item} containerStyle={styles.projectFea} />

            <View
              style={{
                ...inputstyle,
                width: '100%',
              }}
            >
              <TouchableOpacity>
                <Pressable
                  onPress={() => setisUserModalOpen(!isUserModalOpen)}
                  style={styles.groupContainer}
                >
                  {selectedUser ? (
                    <Text>{selectedUser?.bidBy[0]?.fullName}</Text>
                  ) : (
                    <Text style={styles.groupTitle}>Select Winner</Text>
                  )}
                  <MaterialIcons
                    name={
                      isUserModalOpen
                        ? 'keyboard-arrow-up'
                        : 'keyboard-arrow-down'
                    }
                    style={{ fontSize: scale(20) }}
                  />
                </Pressable>
              </TouchableOpacity>
            </View>

            {isUserModalOpen && (
              <Animated.View entering={FadeIn} exiting={FadeOut}>
                <View style={styles.designModalContainer}>
                  <FlatList
                    data={item?.bids.sort(
                      (a, b) => parseInt(b.bidPrice) - parseInt(a.bidPrice),
                    )}
                    renderItem={({ item, index }) => {
                      return (
                        <Pressable
                          style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            gap: 4,
                            borderBottomWidth: 1,
                            borderBottomColor: Color.VeryLightGrey,
                            paddingVertical: screenHeight * 0.01,
                          }}
                          onPress={() => {
                            setselectedUser(item);
                            setisUserModalOpen(false);
                          }}
                        >
                          <Image
                            source={{
                              uri: `${item?.bidBy[0]?.profile}`,
                            }}
                            style={styles.image}
                          />
                          <View>
                            <View
                              style={styles.desingContainer}
                              //   onPress={() => {
                              //     handleOnchange(item?.title, 'PropertyType');
                              //     setisType(false);
                              //   }}
                            >
                              <View style={styles.projectFea}>
                                <Text style={styles.title}>
                                  {item?.bidBy[0]?.fullName}
                                </Text>
                                {index === 0 && <WinerSvg />}
                              </View>

                              <View style={styles.projectFea}>
                                <Text style={styles.title}>
                                  {item?.bidBy[0]?.code}
                                </Text>
                                <Text
                                  style={{
                                    ...styles.title,
                                    fontFamily: 'Roboto_700Bold',
                                  }}
                                >
                                  {item?.bidPrice}PKR
                                </Text>
                              </View>
                            </View>
                          </View>
                        </Pressable>
                      );
                    }}
                    keyExtractor={(item) => item._id}
                    showsVerticalScrollIndicator={false}
                  />
                </View>
              </Animated.View>
            )}

            <TextInput
              style={{
                ...inputstyle,
                width: '100%',
              }}
              value={winningTitle}
              onChangeText={(e) => setwinningTitle(e)}
              placeholder="Congratulation on winning Bid  🎉"
            />

            <TouchableOpacity
              style={{ ...buttonContainer, width: '100%' }}
              onPress={handleSubmit}
            >
              <Text style={buttonTitle}>Announce Winner</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </Portal>
  );
};

export default WinningAnnounModal;

const styles = StyleSheet.create({
  descriptionTitle: {
    fontFamily: 'Roboto_400Regular',
    fontSize: screenHeight * 0.0133,
    lineHeight: 16,
  },
  projectFea: {
    gap: 12,
    flexDirection: 'row',
  },
  groupContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  designModalContainer: {
    backgroundColor: Color.White,
    width: '100%',
    maxHeight: screenHeight * 0.4,
    marginTop: '3%',
    borderColor: Color.LightGrey,
    borderWidth: 1,
    borderRadius: screenHeight * 0.01,
    paddingHorizontal: '3%',
    paddingVertical: '2%',
  },
  desingContainer: {
    paddingVertical: '1%',
  },
  image: {
    width: 40,
    height: 40,
    resizeMode: 'cover',
    borderRadius: 20,
  },
  title: {
    fontFamily: 'Roboto_500Medium',
    fontSize: screenHeight * 0.015,
  },
});
