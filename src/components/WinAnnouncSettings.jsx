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
  modalTitle,
} from '../screens/Decorations/ModalStyle';
import { screenHeight } from '../utils/ScreenDimensions';
import ProjectDetails from './ProjectDetails';
import { MaterialIcons } from 'react-native-vector-icons';
import { scale } from 'react-native-size-matters';
import { useStateContext } from '../contexts/ContextProvider';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import Color from '../../assets/colors/Color';
import { BASE_URL } from '../../CONSTANTS';
import WinerSvg from './SVG/Winner';
import { useQuery } from 'react-query';
import {
  announceWinner,
  fetchClosedBidApartments,
} from '../utils/BiddingChannel';

const WinAnnouncSettings = ({ modalVisible, setModalVisible }) => {
  const { biddingChannel } = useStateContext();
  const [isUserModalOpen, setisUserModalOpen] = useState(false);
  const [selectedUser, setselectedUser] = useState(null);
  const [item, setitem] = useState([]);
  const [selectedProject, setselectedProject] = useState(null);
  const [isProjectModal, setisProjectModal] = useState(false);
  const [winningTitle, setwinningTitle] = useState(
    'Congratulation on winning Bid  🎉',
  );
  const hideModal = () => {
    setModalVisible(false);
    setselectedProject(null);
    setselectedUser(null);
  };

  const handleSubmit = async () => {
    if (!selectedUser) {
    } else {
      try {
        await announceWinner(
          selectedProject?._id,
          'Archive',
          selectedUser?._id,
        );
        refetch();
        setselectedProject(null);
        setModalVisible(false);
      } catch {}
    }
  };

  const { data, refetch } = useQuery('close-project', fetchClosedBidApartments);

  return (
    <Portal>
      <Modal visible={modalVisible} onDismiss={hideModal}>
        <View style={container}>
          <Text style={modalTitle}>Winner Announcement</Text>

          <View style={{ width: '90%', paddingTop: screenHeight * 0.009 }}>
            {selectedProject && (
              <View>
                <Text
                  style={{
                    ...titleStyle,
                    fontSize: screenHeight * 0.017,
                  }}
                >
                  {selectedProject?.ProjectName}
                </Text>
                <Text
                  style={{ ...styles.descriptionTitle, marginVertical: '2%' }}
                >
                  {selectedProject?.description}
                </Text>

                <ProjectDetails
                  item={selectedProject}
                  containerStyle={styles.projectFea}
                />
              </View>
            )}

            <View
              style={{
                ...inputstyle,
                width: '100%',
              }}
            >
              <TouchableOpacity>
                <Pressable
                  onPress={() => setisProjectModal(!isProjectModal)}
                  style={styles.groupContainer}
                >
                  {selectedProject ? (
                    <Text>{selectedProject?.ProjectName}</Text>
                  ) : (
                    <Text style={styles.groupTitle}>Property/Project Name</Text>
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

            {isProjectModal && (
              <Animated.View entering={FadeIn} exiting={FadeOut}>
                <View style={styles.designModalContainer}>
                  <FlatList
                    data={data}
                    renderItem={({ item, index }) => {
                      console.log(item);
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
                            setselectedProject(item);
                            setisProjectModal(false);
                          }}
                        >
                          <View>
                            <View
                              style={styles.desingContainer}
                              // onPress={() => {
                              //   setselectedProject(item);
                              //   setisProjectModal(false);
                              // }}
                            >
                              <View style={styles.projectFea}>
                                <Text style={styles.title}>
                                  {item?.ProjectName}
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
                  disabled={selectedProject === null}
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
                    data={selectedProject?.bids.sort(
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
                              uri: `${BASE_URL}/images/${item?.bidBy[0]?.profile}`,
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

export default WinAnnouncSettings;

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
