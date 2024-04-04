import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import React, { useState } from 'react';
import { inputstyle } from '../screens/Decorations/ModalStyle';
import { screenHeight, screenWidth } from '../utils/ScreenDimensions';
import Color from '../../assets/colors/Color';
import { MaterialIcons } from 'react-native-vector-icons';
import Animated, { FadeInUp } from 'react-native-reanimated';
import ButtonMain from './ButtonMain';
import { addRequest } from '../utils/AccountUpgradation';
import { useUserState } from '../slices/userSlice';
import { useStateContext } from '../contexts/ContextProvider';

const OrgData = [
  {
    id: 1,
    title: 'AGG',
  },
  {
    id: 2,
    title: 'IFM ',
  },
  {
    id: 3,
    title: 'Non-Organizational',
  },
];
const DepartmentData = [
  {
    id: 1,
    title: 'HR',
  },
  {
    id: 2,
    title: 'Accounts',
  },
  {
    id: 3,
    title: 'Billing',
  },
  {
    id: 4,
    title: 'Electric',
  },
  {
    id: 5,
    title: 'Maintenance',
  },
  {
    id: 6,
    title: 'Security',
  },
];

const initialState = {
  fullName: '',
  phoneNumber: '',
  email: '',
  orgType: 'Organization Type',
  department: 'Department',
  designation: 'Designation',
  employid: '',
};

const inputErrors = {
  fullName: '',
  phoneNumber: '',
  email: '',
  orgType: 'Organization Type',
  department: 'Department',
  designation: 'Designation',
  employid: '',
};
const SpecialVolunteerForm = () => {
  const userState = useUserState();
  const [isOrgModal, setisOrgModal] = useState(false);
  const [isDepartment, setisDepartment] = useState(false);
  const [isDesignation, setisDesignation] = useState(false);
  const [inputs, setInputs] = useState(initialState);
  const [error, seterror] = useState(inputErrors);
  const [isLoading, setisLoading] = useState(false);
  const { showSnackbar } = useStateContext();

  const submitHandler = async () => {
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
    const role = 'Special Volunteer';
    const cnicFront = null;
    const cnicBack = null;
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

      setisLoading(false);
    } catch (error) {
      setisLoading(false);
    }
  };

  const handleOnchange = (text, input) => {
    setInputs((prevState) => ({ ...prevState, [input]: text }));
    seterror((prevErrors) => ({ ...prevErrors, [input]: '' }));
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

      <Text style={styles.title}>Employment Details</Text>

      <TouchableOpacity
        style={{
          ...inputstyle,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          width: screenWidth * 0.9,
        }}
        onPress={() => setisOrgModal(!isOrgModal)}
      >
        <Text style={styles.subTitle}>{inputs?.orgType}</Text>
        <MaterialIcons name="keyboard-arrow-down" style={styles.arowIcon} />
      </TouchableOpacity>
      {error?.orgType !== '' && (
        <Text style={styles.inputError}>{error?.orgType}</Text>
      )}

      {isOrgModal && (
        <Animated.View entering={FadeInUp} style={styles.dropDownContainer}>
          <FlatList
            data={OrgData}
            renderItem={({ item }) => {
              return (
                <TouchableOpacity
                  onPress={() => {
                    handleOnchange(item?.title, 'orgType');
                    setisOrgModal(false);
                  }}
                  style={styles.container}
                >
                  <Text style={styles.dropdownTitle}>{item?.title}</Text>
                </TouchableOpacity>
              );
            }}
            keyExtractor={(item) => item?.id}
          />
        </Animated.View>
      )}

      <TouchableOpacity
        style={{
          ...inputstyle,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          width: screenWidth * 0.9,
        }}
        onPress={() => setisDepartment(!isDepartment)}
      >
        <Text style={styles.subTitle}>{inputs?.department}</Text>
        <MaterialIcons name="keyboard-arrow-down" style={styles.arowIcon} />
      </TouchableOpacity>

      {error?.department !== '' && (
        <Text style={styles.inputError}>{error?.department}</Text>
      )}

      {isDepartment && (
        <Animated.View entering={FadeInUp} style={styles.dropDownContainer}>
          <FlatList
            data={DepartmentData}
            renderItem={({ item }) => {
              return (
                <TouchableOpacity
                  onPress={() => {
                    handleOnchange(item?.title, 'department');
                    setisDepartment(false);
                  }}
                  style={styles.container}
                >
                  <Text style={styles.dropdownTitle}>{item?.title}</Text>
                </TouchableOpacity>
              );
            }}
            keyExtractor={(item) => item?.id}
          />
        </Animated.View>
      )}

      <TouchableOpacity
        style={{
          ...inputstyle,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          width: screenWidth * 0.9,
        }}
        onPress={() => setisDesignation(!isDesignation)}
      >
        <Text style={styles.subTitle}>{inputs?.designation}</Text>
        <MaterialIcons name="keyboard-arrow-down" style={styles.arowIcon} />
      </TouchableOpacity>

      {error?.designation !== '' && (
        <Text style={styles.inputError}>{error?.designation}</Text>
      )}

      {isDesignation && (
        <Animated.View entering={FadeInUp} style={styles.dropDownContainer}>
          <FlatList
            data={DepartmentData}
            renderItem={({ item }) => {
              return (
                <TouchableOpacity
                  style={styles.container}
                  onPress={() => {
                    handleOnchange(item?.title, 'designation');
                    setisDesignation(false);
                  }}
                >
                  <Text style={styles.dropdownTitle}>{item?.title}</Text>
                </TouchableOpacity>
              );
            }}
            keyExtractor={(item) => item?.id}
          />
        </Animated.View>
      )}

      <TextInput
        style={{
          ...inputstyle,
          width: '100%',
        }}
        onChangeText={(e) => handleOnchange(e, 'employid')}
        value={inputs.employid}
        placeholder="Employee ID No."
      />

      {error?.employid !== '' && (
        <Text style={styles.inputError}>{error?.employid}</Text>
      )}

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

export default SpecialVolunteerForm;

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
  inputError: {
    fontFamily: 'Roboto_400Regular',
    fontSize: screenHeight * 0.014,
    color: Color.Red,
    paddingVertical: screenHeight * 0.005,
    paddingHorizontal: screenWidth * 0.004,
  },
});
