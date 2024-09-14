import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator,
} from 'react-native';
import React, { useState } from 'react';
import { inputstyle } from '../screens/Decorations/ModalStyle';
import InputTextLarge from './InputTextLarge';
import { screenHeight, screenWidth } from '../utils/ScreenDimensions';
import Color from '../../assets/colors/Color';
import ButtonMain from './ButtonMain';
import * as ImagePicker from 'expo-image-picker';
import { addRequest } from '../utils/AccountUpgradation';
import { useUserState } from '../slices/userSlice';
import { useStateContext } from '../contexts/ContextProvider';

const initialState = {
  fullName: '',
  phoneNumber: '',
  email: '',
  about: '',
  website: '',
  social: '',
  socialtwo: '',
  skype: '',
  address: '',
  addresstwo: '',
  postal: '',
  country: '',
};

const inputErrors = {
  fullName: '',
  phoneNumber: '',
  email: '',
  address: '',
};

const CelebrityForm = () => {
  const userState = useUserState();
  const [inputs, setInputs] = useState(initialState);
  const [error, seterror] = useState(inputErrors);
  const [cnicFront, setcnicFront] = useState(null);
  const [cnicBack, setcnicBack] = useState(null);
  const [utilityBill, setutilityBill] = useState(null);
  const [isLoading, setisLoading] = useState(false);

  const { showSnackbar } = useStateContext();

  const handleOnchange = (text, input) => {
    setInputs((prevState) => ({ ...prevState, [input]: text }));
    seterror((prevErrors) => ({ ...prevErrors, [input]: '' }));
  };

  const submitHandler = async () => {
    if (!cnicBack || !cnicFront || !utilityBill) {
      Alert.alert(
        'Images Required',
        'Please provide all required images (CNIC Front, CNIC Back, Utility Bill) to proceed.',
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
    const role = 'celebrity';
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
      setutilityBill(null);
      setisLoading(false);
    } catch {
      setisLoading(false);
    }
  };

  const pickImage = async (type) => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0.5,
      });

      if (!result.canceled) {
        if (type === 'front') {
          setcnicFront(result.assets[0]);
        } else if (type === 'back') {
          setcnicBack(result.assets[0]);
        } else {
          setutilityBill(result.assets[0]);
        }
      }
    } catch {}
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
      <InputTextLarge
        title="Tell us about yourself..."
        onchange={(e) => handleOnchange(e, 'about')}
        value={inputs.about}
      />
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

      <TextInput
        style={{
          ...inputstyle,
          width: '100%',
        }}
        onChangeText={(e) => handleOnchange(e, 'website')}
        value={inputs.website}
        placeholder="Website"
      />
      <Text style={styles.subTitle}>
        A website should reflects your ownerships i.e. your official phone,
        email address etc.
      </Text>

      <TextInput
        style={{
          ...inputstyle,
          width: '100%',
        }}
        onChangeText={(e) => handleOnchange(e, 'social')}
        value={inputs.social}
        placeholder="Social Page Link 1"
      />

      <TextInput
        style={{
          ...inputstyle,
          width: '100%',
        }}
        onChangeText={(e) => handleOnchange(e, 'socialtwo')}
        value={inputs.socialtwo}
        placeholder="Social Page Link 2"
      />

      <TextInput
        style={{
          ...inputstyle,
          width: '100%',
        }}
        onChangeText={(e) => handleOnchange(e, 'skype')}
        value={inputs.skype}
        placeholder="Skype (Optional)"
      />

      <TextInput
        style={{
          ...inputstyle,
          width: '100%',
        }}
        onChangeText={(e) => handleOnchange(e, 'address')}
        value={inputs.address}
        placeholder="Address 1"
      />
      {error?.address !== '' && (
        <Text style={styles.inputError}>{error?.address}</Text>
      )}
      <TextInput
        style={{
          ...inputstyle,
          width: '100%',
        }}
        onChangeText={(e) => handleOnchange(e, 'addresstwo')}
        value={inputs.addresstwo}
        placeholder="Address 2"
      />

      <View style={{ marginTop: 10 }}>
        <View style={styles.idCardContainer}>
          <Text style={styles.cardTitle}>
            Utility Bill to confirm your address
          </Text>
          <TouchableOpacity
            style={styles.buttonContainer}
            onPress={() => pickImage('utility')}
          >
            <Text style={styles.buttonTitle}>Upload</Text>
          </TouchableOpacity>
        </View>
      </View>
      {utilityBill && (
        <Image source={{ uri: utilityBill?.uri }} style={styles.image} />
      )}
      <TextInput
        style={{
          ...inputstyle,
          width: '100%',
        }}
        onChangeText={(e) => handleOnchange(e, 'postal')}
        value={inputs.postal}
        placeholder="Postal Code"
      />

      <TextInput
        style={{
          ...inputstyle,
          width: '100%',
        }}
        onChangeText={(e) => handleOnchange(e, 'country')}
        value={inputs.country}
        placeholder="Country"
      />

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

export default CelebrityForm;

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
    marginTop: screenHeight * 0.01,
  },
  inputError: {
    fontFamily: 'Roboto_400Regular',
    fontSize: screenHeight * 0.014,
    color: Color.Red,
    paddingVertical: screenHeight * 0.005,
    paddingHorizontal: screenWidth * 0.004,
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
});
