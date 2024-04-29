import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useState } from 'react';

import { Modal, Portal } from 'react-native-paper';
import {
  buttonTitle,
  container,
  editButtonTitle,
  inputstyle,
  buttonContainer,
  modalTitle,
} from '../screens/Decorations/ModalStyle';
import CameraSvg from './SVG/CameraSvg';
import { screenHeight, screenWidth } from '../utils/ScreenDimensions';
import { MaterialIcons } from 'react-native-vector-icons';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { scale } from 'react-native-size-matters';
import Color from '../../assets/colors/Color';
import * as ImagePicker from 'expo-image-picker';
import { createBiddingProject } from '../utils/BiddingChannel';
import { useUserState } from '../slices/userSlice';
import { useStateContext } from '../contexts/ContextProvider';

const propertyType = [
  {
    id: 1,
    title: 'Residential',
  },
  {
    id: 2,
    title: 'Commercial',
  },
  {
    id: 3,
    title: 'Other',
  },
];

const initialState = {
  ProjectName: '',
  PropertyType: 'Select Property Type',
  unit: '',
  bedrooms: '',
  description: '',
  price: '',
};

const inputErrors = {
  ProjectName: '',
  price: '',
  bedrooms: '',
  description: '',
};

const AddPropertyModal = ({
  isVisible,
  item,
  setisVisible,
  screen,
  currentMember,
}) => {
  const userState = useUserState();
  const [propertyImage, setpropertyImage] = useState(null);
  const [error, seterror] = useState(inputErrors);
  const [isType, setisType] = useState(false);
  const [inputs, setinputs] = useState(initialState);
  const { showSnackbar } = useStateContext();

  const [isLoading, setisLoading] = useState(false);
  const hideModal = () => {
    setisVisible(false);
    setinputs(initialState);
  };

  const handleOnchange = (text, input) => {
    setinputs((prevState) => ({ ...prevState, [input]: text }));
    seterror((prevErrors) => ({ ...prevErrors, [input]: '' }));
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      quality: 1,
      allowsMultipleSelection: true,
      selectionLimit: 5,
      mediaTypes: 'All',
    });

    if (!result.canceled && result.assets.length > 0) {
      const imagesData = result.assets.map((item) => item);
      setpropertyImage(imagesData);
    } else {
      // Display an alert or toast to inform the user
      Alert.alert('Error', 'Please select at least one image.');
    }
  };

  const handleSubmit = async () => {
    if (!propertyImage) {
      Alert.alert(
        'Images Required',
        'Oops! It looks like you forgot to add images of the property. Providing at least one image will help showcase your property to potential buyers.',
        [{ text: 'OK' }],
      );
      return;
    }

    const updatedErrors = { ...inputErrors };
    let hasError = false;

    for (const field in inputErrors) {
      if (!inputs[field]) {
        updatedErrors[field] = 'This field is required.';
        hasError = true;
      } else {
        updatedErrors[field] = '';
      }
    }

    seterror(updatedErrors);

    if (hasError) {
      return;
    }
    setisLoading(true);
    const from = userState?.id;
    let channel;
    if (screen === 'setting') {
      channel = item[0]?._id;
    } else {
      channel = item?._id;
    }

    let status = 'Starting Soon';

    if (screen === 'setting' && currentMember[0]?.privilege === 'member') {
      status = 'Under Review';
    }
    try {
      await createBiddingProject(inputs, from, channel, propertyImage, status);
      if (screen === 'setting' && currentMember[0]?.privilege === 'member') {
        showSnackbar(
          'Property Added Successfully! Your listing is under review. Thank you!',
        );
      } else {
        showSnackbar('Property Added successfully');
      }
      setinputs(initialState);
      setpropertyImage(null);
      setisLoading(false);
      setisVisible(false);
    } catch {
      setisLoading(false);
    }
  };

  return (
    <Portal>
      <Modal visible={isVisible} onDismiss={hideModal}>
        <ScrollView>
          <View style={container}>
            <Text style={modalTitle}>Add Property</Text>

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
            <TextInput
              style={{
                ...inputstyle,
                width: '90%',
              }}
              onChangeText={(e) => handleOnchange(e, 'ProjectName')}
              value={inputs.ProjectName}
              placeholder="Property/Project Name"
            />
            {error?.ProjectName !== '' && (
              <Text style={styles.inputError}>{error?.ProjectName}</Text>
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
                keyboardType="number-pad"
              />
              <TextInput
                placeholder="Bedrooms"
                style={{ ...inputstyle, width: screenWidth * 0.39 }}
                value={inputs.bedrooms}
                onChangeText={(e) => handleOnchange(e, 'bedrooms')}
                keyboardType="number-pad"
              />
            </View>
            {error?.bedrooms !== '' && (
              <Text style={styles.inputError}>{error?.bedrooms}</Text>
            )}
            <TextInput
              style={{
                ...inputstyle,
                width: '90%',
              }}
              value={inputs.description}
              onChangeText={(e) => handleOnchange(e, 'description')}
              placeholder="Description/Notes"
              // multiline
            />
            {error?.description !== '' && (
              <Text style={styles.inputError}>{error?.description}</Text>
            )}
            <TextInput
              style={{
                ...inputstyle,
                width: '90%',
              }}
              value={inputs.price}
              onChangeText={(e) => handleOnchange(e, 'price')}
              placeholder="Set Property Price"
              keyboardType="number-pad"
            />
            {error?.price !== '' && (
              <Text style={styles.inputError}>{error?.price}</Text>
            )}

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
                  animationEnabled={false}
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
                            width: screenWidth * 0.18,
                            height: screenHeight * 0.05,
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
                {isLoading ? (
                  <ActivityIndicator color={Color.White} />
                ) : (
                  <Text style={buttonTitle}>Save</Text>
                )}
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  ...buttonContainer,
                  width: screenWidth * 0.39,
                  backgroundColor: Color.White,
                  borderWidth: 1,
                }}
                onPress={() => setisVisible(false)}
              >
                <Text
                  style={{ ...editButtonTitle, fontFamily: 'Roboto_700Bold' }}
                >
                  Discard
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </Modal>
    </Portal>
  );
};

export default AddPropertyModal;

const styles = StyleSheet.create({
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
  inputError: {
    fontFamily: 'Roboto_400Regular',
    fontSize: screenHeight * 0.014,
    color: Color.Red,
    paddingVertical: screenHeight * 0.005,
    paddingHorizontal: screenWidth * 0.004,
    width: '90%',
  },
});
