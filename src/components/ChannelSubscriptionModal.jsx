import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Image,
  ActivityIndicator,
  Alert,
} from 'react-native';
import React, { useState } from 'react';
import { Modal, Portal } from 'react-native-paper';
import {
  container,
  descriptionTextStyle,
  titleStyle,
  inputstyle,
  buttonContainer,
  buttonTitle,
} from '../screens/Decorations/ModalStyle';
import { screenHeight, screenWidth } from '../utils/ScreenDimensions';
import Color from '../../assets/colors/Color';
import * as ImagePicker from 'expo-image-picker';
import { subscriptionRequest } from '../utils/BiddingChannel';
import { useUserState } from '../slices/userSlice';
import { useStateContext } from '../contexts/ContextProvider';
import { useNavigation } from '@react-navigation/native';

const initialState = {
  fullName: '',
  phoneNumber: '',
};

const inputErrors = {
  fullName: '',
  phoneNumber: '',
};

const ChannelSubscriptionModal = ({ isVisible, setisVisible, screen }) => {
  const userState = useUserState();
  const navigation = useNavigation();

  const initialState = {
    fullName: userState?.fullName || '',
    phoneNumber: userState?.phoneNumber || '',
  };
  const [inputs, setinputs] = useState(initialState);
  const [error, seterror] = useState(inputErrors);
  const [image, setImage] = useState(null);
  const [loading, setloading] = useState(false);
  const { showSnackbar } = useStateContext();
  const hideModal = () => {
    setisVisible(false);
    setImage(null);
    setinputs(initialState);
  };

  const handleOnchange = (text, input) => {
    setinputs((prevState) => ({ ...prevState, [input]: text }));
    seterror((prevErrors) => ({ ...prevErrors, [input]: '' }));
  };

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0]);
    }
  };
  const handleSubmit = async () => {
    if (!image) {
      Alert.alert(
        'Image Required',
        'Oops! It seems you forgot to attach an image of the bank receipt or transaction receipt. Please provide an image to proceed with the submission.',
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
    setloading(true);
    try {
      const data = await subscriptionRequest(inputs, userState?.id, image);
      if (data?.data) {
        setisVisible(false);
        showSnackbar(
          "Your subscription request is in! We'll review and notify you shortly.",
        );
      } else {
        showSnackbar(
          'Failed to submit subscription request. Please try again later.',
        );
      }
      if (screen === 'otp') {
        navigation.reset({
          index: 0,
          routes: [{ name: 'Home' }],
        });
      }
    } catch (error) {
      showSnackbar(
        'An error occurred while submitting your request. Please try again later.',
      );
      if (screen === 'otp') {
        navigation.reset({
          index: 0,
          routes: [{ name: 'Home' }],
        });
      }
    } finally {
      setloading(false);
      if (screen === 'otp') {
        navigation.reset({
          index: 0,
          routes: [{ name: 'Home' }],
        });
      }
    }
  };

  return (
    <Portal>
      <Modal visible={isVisible} onDismiss={hideModal}>
        <View style={container}>
          <Text style={{ ...titleStyle, fontSize: screenHeight * 0.02 }}>
            Channel Subscription
          </Text>
          <View style={{ width: '91%' }}>
            <Text style={descriptionTextStyle}>
              The Channel is locked. To unlock the channel you have to pay
              subscription fee which is one time in the following Bank Account.
              If you already paid upload the receipt and Submit request.
            </Text>
          </View>

          <View style={styles.priceContainer}>
            <Text style={titleStyle}>Subscription Fees</Text>
            <Text style={titleStyle}>100,000 PKR</Text>
          </View>

          <View style={styles.bankDetails}>
            <View style={styles.itemContainer}>
              <Text style={{ ...titleStyle, fontSize: screenHeight * 0.017 }}>
                Bank Name:
              </Text>
              <Text style={styles.title}>United Bank Limited Pakistan</Text>
            </View>
            <View style={styles.itemContainer}>
              <Text style={{ ...titleStyle, fontSize: screenHeight * 0.017 }}>
                Account Name:
              </Text>
              <Text style={styles.title}>Giga Group</Text>
            </View>
            <View style={styles.itemContainer}>
              <Text style={{ ...titleStyle, fontSize: screenHeight * 0.017 }}>
                Pakistan Account Number:{' '}
              </Text>
              <Text style={styles.title}>123456789101112</Text>
            </View>
          </View>

          <TextInput
            style={{
              ...inputstyle,
              width: '92%',
            }}
            value={inputs.fullName}
            onChangeText={(e) => handleOnchange(e, 'fullName')}
            placeholder="Full Name"
          />

          {error?.fullName !== '' && (
            <Text style={styles.inputError}>{error?.fullName}</Text>
          )}

          <TextInput
            style={{
              ...inputstyle,
              width: '92%',
            }}
            value={inputs.phoneNumber}
            onChangeText={(e) => handleOnchange(e, 'phoneNumber')}
            placeholder="Phone Number"
            keyboardType="numeric"
          />
          {error?.phoneNumber !== '' && (
            <Text style={styles.inputError}>{error?.phoneNumber}</Text>
          )}

          {image && (
            <View>
              <Image source={{ uri: image.uri }} style={styles.image} />
            </View>
          )}

          <TouchableOpacity style={styles.uploadButton} onPress={pickImage}>
            <Text style={titleStyle}>
              {image ? 'Upload and Replace' : 'Upload Bank Receipt'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={{ ...buttonContainer, marginTop: 0, width: '92%' }}
            onPress={handleSubmit}
          >
            {loading ? (
              <ActivityIndicator />
            ) : (
              <Text style={buttonTitle}>Submit Request</Text>
            )}
          </TouchableOpacity>
        </View>
      </Modal>
    </Portal>
  );
};

export default ChannelSubscriptionModal;

const styles = StyleSheet.create({
  priceContainer: {
    width: '92%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: '2%',
  },
  bankDetails: {
    width: '92%',
    backgroundColor: Color.Disable,
    borderRadius: screenHeight * 0.01,
    paddingHorizontal: screenWidth * 0.03,
    paddingVertical: screenHeight * 0.006,
    gap: 4,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  title: {
    fontFamily: 'Roboto_500Medium',
    fontSize: screenHeight * 0.016,
  },
  uploadButton: {
    width: '92%',
    borderWidth: 1,
    alignItems: 'center',
    paddingVertical: screenHeight * 0.009,
    borderRadius: screenHeight * 0.01,
    marginVertical: screenHeight * 0.017,
  },
  image: {
    width: screenWidth * 0.8,
    height: screenHeight * 0.22,
    resizeMode: 'cover',
    marginTop: '2%',
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
