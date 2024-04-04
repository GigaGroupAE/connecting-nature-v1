import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  TextInput,
  FlatList,
  Pressable,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import GroupMembersList from './GroupMembersList';
import { useUserState } from '../slices/userSlice';
import { scale } from 'react-native-size-matters';
import Color from '../../assets/colors/Color';
import { screenHeight, screenWidth } from '../utils/ScreenDimensions';
import { Modal, Portal } from 'react-native-paper';
import {
  container,
  titleStyle,
  inputstyle,
  buttonContainer,
  buttonTitle,
  editButtonTitle,
  descriptionTextStyle,
} from '../screens/Decorations/ModalStyle';
import CameraSvg from './SVG/CameraSvg';
import * as ImagePicker from 'expo-image-picker';
import { MaterialIcons } from 'react-native-vector-icons';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import {
  checkAlreadySubReq,
  createBiddingProject,
} from '../utils/BiddingChannel';
import { useNavigation } from '@react-navigation/native';
import { useStateContext } from '../contexts/ContextProvider';
import ChannelSubscriptionModal from './ChannelSubscriptionModal';

const propertyType = [
  {
    id: 1,
    title: 'Residential Apartment',
  },
  {
    id: 1,
    title: 'Commercial',
  },
  {
    id: 1,
    title: 'Studio',
  },
  {
    id: 1,
    title: 'Kiosk Place',
  },
];

const initialState = {
  ProjectName: '',
  PropertyType: 'Select Property Type',
  unit: '',
  bedrooms: '',
  description: '',
  // biddingTime: Date.now(),
  price: '',
};

const approvedRoles = ['Owner', 'Lead'];

const BiddingGroup = ({ item }) => {
  const { navigate } = useNavigation();
  const userState = useUserState();
  const [isAddProperty, setisAddProperty] = useState(false);
  const [propertyImage, setpropertyImage] = useState(null);
  const [isType, setisType] = useState(false);
  const [inputs, setinputs] = useState(initialState);
  const [currentMember, setcurrentMember] = useState(false);
  const [isSubscriptionModal, setisSubscriptionModal] = useState(false);
  const { setbiddingChannel, showSnackbar } = useStateContext();
  const [showPendingModal, setshowPendingModal] = useState(false);

  const hideModal = () => {
    setisAddProperty(false);
  };

  useEffect(() => {
    const currentUser = item.members.find(
      (member) => member.member.phoneNumber === userState.phoneNumber,
    );
    if (currentUser) {
      const role = approvedRoles.includes(currentUser?.privilege);
      setcurrentMember(role);
    }
  }, [currentMember]);

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    const result = await ImagePicker.launchImageLibraryAsync({
      quality: 1,
      allowsMultipleSelection: true,
      selectionLimit: 5,
    });

    if (!result.canceled) {
      const imagesData = result.assets.map((item) => item);
      setpropertyImage(imagesData);
    }
  };

  const handleOnchange = (text, input) => {
    setinputs((prevState) => ({ ...prevState, [input]: text }));
  };

  const handleSubmit = async () => {
    const from = userState?.id;
    const channel = item?._id;
    // const
    try {
      await createBiddingProject(inputs, from, channel, propertyImage);

      showSnackbar('Property Added successfully');
      setisAddProperty(false);
      setinputs(initialState);
      setpropertyImage(null);
    } catch {}
  };

  const handleNavigation = async (item) => {
    if (currentMember) {
      navigate('BidChannal', { item: item });
      setbiddingChannel(item);
    } else {
      try {
        const data = await checkAlreadySubReq();

        if (data?.message === 'Pending') {
          setshowPendingModal(true);
        } else if (data?.message === 'NotExists.') {
          setisSubscriptionModal(true);
        }
      } catch {}
    }
  };

  return (
    <View
      style={{
        width: '95%',
        alignSelf: 'center',
      }}
    >
      <TouchableOpacity
        style={styles.enterChat}
        // onPress={() => {
        //   navigate('BidChannal', { item: item });
        //   setbiddingChannel(item);
        // }}

        onPress={() => handleNavigation(item)}
      >
        <Text style={styles.buttonTitle}>Enter to Channel</Text>
      </TouchableOpacity>

      {currentMember && (
        <View>
          <View
            style={{
              marginVertical: scale(10),
            }}
          >
            <GroupMembersList group={item} />
          </View>

          <TouchableOpacity
            style={styles.enterChat}
            onPress={() => setisAddProperty(true)}
          >
            <Text style={styles.buttonTitle}>Add Property</Text>
          </TouchableOpacity>
        </View>
      )}

      <Portal>
        <Modal visible={isAddProperty} onDismiss={hideModal}>
          <View style={container}>
            <Text style={titleStyle}>Add Property</Text>
            <TouchableOpacity style={styles.imageContainer} onPress={pickImage}>
              {propertyImage ? (
                <Image
                  source={{ uri: propertyImage[0]?.uri }}
                  style={styles.image}
                />
              ) : (
                <CameraSvg />
              )}
            </TouchableOpacity>

            {propertyImage && (
              <View
                style={{
                  maxHeight: screenHeight * 0.09,
                  width: '100%',
                  paddingHorizontal: screenWidth * 0.04,
                }}
              >
                <FlatList
                  data={propertyImage}
                  renderItem={({ item, index }) => {
                    // Skip rendering the first item
                    if (index === 0) {
                      return null;
                    }
                    return (
                      <View>
                        <Image
                          source={{ uri: item?.uri }}
                          style={{
                            width: 100,
                            height: 69,
                            resizeMode: 'cover',
                            borderRadius: 4,
                          }}
                        />
                      </View>
                    );
                  }}
                  horizontal
                  contentContainerStyle={{ gap: 10, marginVertical: '2%' }}
                  showsHorizontalScrollIndicator={false}
                />
              </View>
            )}

            <TextInput
              style={{
                ...inputstyle,
                width: '90%',
              }}
              onChangeText={(e) => handleOnchange(e, 'ProjectName')}
              value={inputs.ProjectName}
              placeholder="Property/Project Name"
            />

            <View
              style={{
                ...inputstyle,
                width: '90%',
              }}
            >
              <TouchableOpacity>
                <Pressable
                  onPress={() => setisType(!isType)}
                  style={styles.groupContainer}
                >
                  <Text style={styles.groupTitle}>{inputs.PropertyType}</Text>
                  <MaterialIcons
                    name={isType ? 'keyboard-arrow-up' : 'keyboard-arrow-down'}
                    style={{ fontSize: scale(20) }}
                  />
                </Pressable>
              </TouchableOpacity>
            </View>

            {isType && (
              <Animated.View entering={FadeIn} exiting={FadeOut}>
                <View style={styles.designModalContainer}>
                  <FlatList
                    data={propertyType}
                    renderItem={({ item }) => {
                      return (
                        <TouchableOpacity
                          style={styles.desingContainer}
                          onPress={() => {
                            handleOnchange(item?.title, 'PropertyType');
                            setisType(false);
                          }}
                        >
                          <Text style={styles.title}>{item?.title}</Text>
                        </TouchableOpacity>
                      );
                    }}
                    keyExtractor={(item) => item._id}
                    showsVerticalScrollIndicator={false}
                  />
                </View>
              </Animated.View>
            )}

            <View style={styles.priceRangeContainer}>
              <TextInput
                style={{
                  ...inputstyle,
                  width: screenWidth * 0.39,
                }}
                value={inputs.unit}
                onChangeText={(e) => handleOnchange(e, 'unit')}
                placeholder="Unit"
              />
              <TextInput
                placeholder="Bedrooms"
                style={{ ...inputstyle, width: screenWidth * 0.39 }}
                value={inputs.bedrooms}
                onChangeText={(e) => handleOnchange(e, 'bedrooms')}
              />
            </View>

            <TextInput
              style={{
                ...inputstyle,
                width: '90%',
              }}
              value={inputs.description}
              onChangeText={(e) => handleOnchange(e, 'description')}
              placeholder="Description/Notes"
              multiline
            />

            <TextInput
              style={{
                ...inputstyle,
                width: '90%',
              }}
              // value={inputs.biddingTime}
              // onChangeText={(e) => handleOnchange(e, 'description')}
              placeholder="Bidding Time"
            />
            <TextInput
              style={{
                ...inputstyle,
                width: '90%',
              }}
              value={inputs.price}
              onChangeText={(e) => handleOnchange(e, 'price')}
              placeholder="Set Property Price"
            />

            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                width: screenWidth * 0.8,
                justifyContent: 'center',
                gap: 10,
              }}
            >
              <TouchableOpacity
                style={{ ...buttonContainer, width: screenWidth * 0.39 }}
                onPress={handleSubmit}
              >
                <Text style={buttonTitle}>Save</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  ...buttonContainer,
                  width: screenWidth * 0.39,
                  backgroundColor: Color.White,
                  borderWidth: 1,
                }}
                onPress={() => setisAddProperty(false)}
              >
                <Text
                  style={{ ...editButtonTitle, fontFamily: 'Roboto_700Bold' }}
                >
                  Discard
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </Portal>

      <ChannelSubscriptionModal
        isVisible={isSubscriptionModal}
        setisVisible={setisSubscriptionModal}
      />

      <Portal>
        <Modal
          visible={showPendingModal}
          onDismiss={() => setshowPendingModal(false)}
        >
          <View style={container}>
            <Text style={titleStyle}>Subscription Request</Text>
            <View style={{ width: '92%' }}>
              <Text style={descriptionTextStyle}>
                Thank you for your interest! Your subscription request for this
                channel has already been submitted and is currently under review
                by our team. We appreciate your patience and will notify you
                once your request has been processed.
              </Text>

              <TouchableOpacity
                style={{ ...buttonContainer, width: '100%' }}
                onPress={() => setshowPendingModal(false)}
              >
                <Text style={buttonTitle}>Okay!</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </Portal>
    </View>
  );
};

export default BiddingGroup;

const styles = StyleSheet.create({
  enterChat: {
    backgroundColor: 'rgba(0, 123, 255, 0.1)',
    alignItems: 'center',
    width: '100%',
    alignSelf: 'center',
    height: scale(40),
    justifyContent: 'center',
    borderRadius: scale(8),
    borderWidth: 1,
    borderColor: 'rgba(0, 123, 255, 1)',
  },
  buttonTitle: {
    color: Color.Blue,
    fontSize: screenHeight * 0.018,
    fontFamily: 'Roboto_700Bold',
  },
  titleStyle: {
    color: 'black',
    fontFamily: 'Roboto_700Bold',
    fontSize: screenHeight * 0.018,
  },
  imageContainer: {
    backgroundColor: Color.LightBg,
    width: '90%',
    height: screenHeight * 0.2,
    borderRadius: screenHeight * 0.01,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
    marginTop: screenHeight * 0.016,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
    resizeMode: 'cover',
  },
  groupContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  designModalContainer: {
    backgroundColor: Color.White,
    width: screenWidth * 0.75,
    maxHeight: screenHeight * 0.2,
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
  title: {
    fontFamily: 'Roboto_500Medium',
    fontSize: screenHeight * 0.015,
    borderBottomWidth: 1,
    borderBottomColor: Color.VeryLightGrey,
    paddingVertical: '2%',
  },
  priceRangeContainer: {
    flexDirection: 'row',
    width: '90%',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
});
