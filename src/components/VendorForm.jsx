import {
  StyleSheet,
  Text,
  View,
  TextInput,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
  Image,
} from 'react-native';
import React, { useState } from 'react';
import { inputstyle } from '../screens/Decorations/ModalStyle';
import { screenHeight, screenWidth } from '../utils/ScreenDimensions';
import Color from '../../assets/colors/Color';

import ButtonMain from './ButtonMain';
import { useUserState } from '../slices/userSlice';
import { addRequest } from '../utils/AccountUpgradation';
import * as ImagePicker from 'expo-image-picker';
import { useStateContext } from '../contexts/ContextProvider';

const initialState = {
  fullName: '',
  phoneNumber: '',
  email: '',
  companyName: '',
  companyType: '',
  companyAddress: '',
  companyCity: '',
};

const inputErrors = {
  fullName: '',
  phoneNumber: '',
  email: '',
  companyName: '',
  companyType: '',
  companyAddress: '',
  companyCity: '',
};

const VendorForm = () => {
  const userState = useUserState();
  const [inputs, setInputs] = useState(initialState);
  const [error, seterror] = useState(inputErrors);
  const [cnicFront, setcnicFront] = useState(null);
  const [cnicBack, setcnicBack] = useState(null);
  const [isLoading, setisLoading] = useState(false);
  const { showSnackbar } = useStateContext();
  const handleOnchange = (text, input) => {
    setInputs((prevState) => ({ ...prevState, [input]: text }));
    seterror((prevErrors) => ({ ...prevErrors, [input]: '' }));
  };

  const submitHandler = async () => {
    if (!cnicBack || !cnicFront) {
      Alert.alert(
        'Images Required',
        'Please provide all required images (CNIC Front, CNIC Back,) to proceed.',
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
    const role = 'Vendor';
    const utilityBill = null;
    try {
      const { data } = await addRequest(
        inputs,
        cnicFront,
        cnicBack,
        utilityBill,
        userState?.phoneNumber,
        role,
      );
      showSnackbar(data?.message);
      setInputs(initialState);
      setcnicFront(null);
      setcnicBack(null);

      setisLoading(false);
    } catch (error) {
      setisLoading(false);
    }
  };

  const pickImage = async (type) => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0.7,
      });

      if (!result.canceled) {
        if (type === 'front') {
          setcnicFront(result.assets[0]);
        } else {
          setcnicBack(result.assets[0]);
        }
      }
    } catch (error) {}
  };

  return (
    <View style={{ flex: 1 }}>
      <TextInput
        style={{
          ...inputstyle,
          width: '100%',
        }}
        onChangeText={(e) => handleOnchange(e, 'fullName')}
        value={inputs.fullName}
        placeholder="Full Name"
      />
      {error?.fullName !== '' && (
        <Text style={styles.inputError}>{error?.fullName}</Text>
      )}

      <TextInput
        style={{
          ...inputstyle,
          width: '100%',
        }}
        onChangeText={(e) => handleOnchange(e, 'phoneNumber')}
        value={inputs.phoneNumber}
        placeholder="Phone Number"
        keyboardType="number-pad"
      />
      {error?.phoneNumber !== '' && (
        <Text style={styles.inputError}>{error?.phoneNumber}</Text>
      )}
      <TextInput
        style={{
          ...inputstyle,
          width: '100%',
        }}
        onChangeText={(e) => handleOnchange(e, 'email')}
        value={inputs.email}
        placeholder="Email Address"
      />
      {error?.email !== '' && (
        <Text style={styles.inputError}>{error?.email}</Text>
      )}

      <Text style={styles.title}>Company Details</Text>

      <TextInput
        style={{
          ...inputstyle,
          width: '100%',
        }}
        onChangeText={(e) => handleOnchange(e, 'companyName')}
        value={inputs.companyName}
        placeholder="Company Name"
      />

      {error?.companyName !== '' && (
        <Text style={styles.inputError}>{error?.companyName}</Text>
      )}

      <TextInput
        style={{
          ...inputstyle,
          width: '100%',
        }}
        onChangeText={(e) => handleOnchange(e, 'companyType')}
        value={inputs.companyType}
        placeholder="Company Type"
      />
      {error?.companyType !== '' && (
        <Text style={styles.inputError}>{error?.companyType}</Text>
      )}
      <TextInput
        style={{
          ...inputstyle,
          width: '100%',
        }}
        onChangeText={(e) => handleOnchange(e, 'companyAddress')}
        value={inputs.companyAddress}
        placeholder="Company Complete Address"
      />
      {error?.companyAddress !== '' && (
        <Text style={styles.inputError}>{error?.companyAddress}</Text>
      )}
      <TextInput
        style={{
          ...inputstyle,
          width: '100%',
        }}
        onChangeText={(e) => handleOnchange(e, 'companyCity')}
        value={inputs.companyCity}
        placeholder="City"
      />
      {error?.companyCity !== '' && (
        <Text style={styles.inputError}>{error?.companyCity}</Text>
      )}
      <View style={{ marginTop: 10 }}>
        <View style={styles.idCardContainer}>
          <Text style={styles.cardTitle}>
            Front Side of your National ID Card
          </Text>
          <TouchableOpacity
            style={styles.buttonContainer}
            onPress={() => pickImage('front')}
          >
            <Text style={styles.buttonTitle}>Upload</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.cnicCotainer}>
          {cnicFront && (
            <Image source={{ uri: cnicFront?.uri }} style={styles.image} />
          )}

          {cnicBack && (
            <Image source={{ uri: cnicBack?.uri }} style={styles.image} />
          )}
        </View>

        <View style={styles.idCardContainer}>
          <Text style={styles.cardTitle}>
            Back Side of your National ID Card
          </Text>
          <TouchableOpacity
            style={styles.buttonContainer}
            onPress={() => pickImage('back')}
          >
            <Text style={styles.buttonTitle}>Upload</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={{ alignItems: 'center', marginBottom: 20 }}>
        <ButtonMain
          title={isLoading ? <ActivityIndicator /> : 'Submit Request'}
          callback={submitHandler}
          disabled={isLoading}
        />
      </View>
    </View>
  );
};

export default VendorForm;

const styles = StyleSheet.create({
  idCardContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: screenHeight * 0.01,
    alignItems: 'center',
  },
  cardTitle: {
    fontFamily: 'Roboto_400Regular',
    fontSize: screenHeight * 0.016,
    color: 'rgba(0, 0, 0, 1)',
  },
  buttonContainer: {
    backgroundColor: Color.Blue,
    paddingHorizontal: screenWidth * 0.052,
    paddingVertical: screenHeight * 0.007,
    borderRadius: screenHeight * 0.01,
  },
  buttonTitle: {
    fontFamily: 'Roboto_600SemiBold',
    color: Color.White,
    fontSize: screenHeight * 0.018,
  },
  subTitle: {
    fontFamily: 'Roboto_400Regular',
    color: Color.Grey,
    fontSize: screenHeight * 0.015,
  },
  title: {
    fontFamily: 'Roboto_700Bold',
    fontSize: screenHeight * 0.018,
    marginTop: screenHeight * 0.03,
    paddingHorizontal: screenWidth * 0.02,
  },
  arowIcon: {
    color: Color.Black,
    fontSize: screenHeight * 0.03,
  },
  dropDownContainer: {
    borderWidth: 0.9,
    borderColor: Color.VeryLightGrey,
    marginVertical: screenHeight * 0.009,
    borderRadius: screenHeight * 0.01,
  },
  container: {
    paddingHorizontal: screenWidth * 0.03,
    paddingVertical: screenHeight * 0.004,
    borderBottomWidth: 1,
    borderColor: Color.VeryLightGrey,
  },
  dropdownTitle: {
    fontFamily: 'Roboto_400Regular',
    paddingVertical: 3,
  },
  image: {
    width: screenWidth * 0.43,
    resizeMode: 'cover',
    height: screenHeight * 0.1,
    borderRadius: screenHeight * 0.01,
  },
  cnicCotainer: {
    flexDirection: 'row',
    gap: 15,
  },
  inputError: {
    fontFamily: 'Roboto_400Regular',
    fontSize: screenHeight * 0.014,
    color: Color.Red,
    paddingVertical: screenHeight * 0.005,
    paddingHorizontal: screenWidth * 0.004,
  },
});
