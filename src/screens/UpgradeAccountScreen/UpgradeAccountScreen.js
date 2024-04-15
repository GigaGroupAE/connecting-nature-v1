import React, { useState } from 'react';
import {
  Dimensions,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';

//state import

//network imports

import Color from '../../../assets/colors/Color';

import SelectList from 'react-native-dropdown-select-list';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

import HeaderNormal from '../../components/HeaderNormal';
import { screenWidth } from '../../utils/ScreenDimensions';
import CelebrityForm from '../../components/CelebrityForm';
import SpecialVolunteerForm from '../../components/SpecialVolunteerForm';
import VendorForm from '../../components/VendorForm';

const width = Dimensions.get('screen').width;

const UpgradeAccountScreen = () => {
  const [selected, setSelected] = useState(null);

  const groupType = [
    { key: '1', value: 'Celebrity' },
    { key: '2', value: 'Special Volunteer' },
    { key: '3', value: 'Vendor' },
  ];

  // const submitRequest = async () => {
  //   let requestedRole = selected === '1' ? 'celebrity' : 'volunteer';
  //   let body = {
  //     facebookProfile,
  //     instagramProfile,
  //     twitterProfile,
  //     requestedRole,
  //   };

  //   if (
  //     requestedRole === 'celebrity' &&
  //     (instagramProfile.length <= 0 ||
  //       facebookProfile.length <= 0 ||
  //       twitterProfile.length <= 0)
  //   ) {
  //     Alert.alert('All social links are required');
  //     return;
  //   }

  //   try {
  //     setLoading(true);
  //     const { data } = await addRequest({
  //       token: userState.token,
  //       body,
  //     });
  //     if (data.success) {
  //       showSnackbar('Request submitted successfully');
  //       navigation.goBack();
  //     }
  //   } catch (error) {
  //     console.log('error is ', error);
  //     Alert.alert(error.message);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  return (
    <SafeAreaView style={styles.container}>
      <HeaderNormal title="Account Upgradation" />
      <ScrollView showsVerticalScrollIndicator={false}>
        <View
          style={{
            backgroundColor: Color.White,
            flex: 1,
          }}
        >
          {/* <View
            style={{
              height: height * 0.27,
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: Color.Blue,
            }}
          >
            <Text
              style={{
                fontSize: 25,
                color: Color.White,
                fontWeight: '500',
              }}
            >
              Account Upgradation
            </Text>
          </View> */}
          <View
            style={{
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
              // marginTop: -20,
              backgroundColor: Color.White,
            }}
          >
            <View
              style={{
                // marginLeft: 40,
                width: width * 0.9,
                alignSelf: 'center',
              }}
            >
              <SelectList
                onSelect={() => selected}
                placeholder="Account preference"
                setSelected={(val) => {
                  setSelected(val);
                }}
                save="value"
                data={groupType}
                arrowicon={
                  <FontAwesome name="chevron-down" size={14} color="#707070" />
                }
                searchicon={
                  <FontAwesome name="search" size={14} color="#707070" />
                }
                search={false}
                boxStyles={{
                  marginTop: 15,
                  borderRadius: 8,
                  backgroundColor: 'white',
                  borderWidth: 0,
                  elevation: 8,
                  shadowColor: '#707070',
                  paddingVertical: 15,
                  color: '#707070',
                  width: width * 0.9,
                }} //override default styles
                inputStyles={{
                  fontSize: 16,
                  fontFamily: 'Roboto_500Medium',
                  color: Color.LightGrey,
                }}
                dropdownStyles={{
                  borderWidth: 0,
                  backgroundColor: Color.White,
                  width: width * 0.9,
                  shadowColor: '#433',
                  elevation: 8,
                  fontSize: 16,
                  fontFamily: 'Roboto_500Medium',
                  color: Color.LightGrey,
                  // flex: 1,
                  // height: 100,
                }}
                defaultOption={
                  {
                    // key: "1",
                    // value: "Group Type",
                  }
                } //default selected option
              />
            </View>
            {/* {selected === '1' ? (
              <View style={{ alignItems: 'center' }}>
                <View style={{ width: width * 0.8 }}>
                  <InputTextLink
                    title="Paste your facebook link"
                    onchange={setFacebookProfile}
                    value={facebookProfile}
                  />
                </View>
                <View style={{ width: width * 0.8 }}>
                  <InputTextLink
                    title="Paste your Instagram link"
                    onchange={setInstaProfile}
                    value={instagramProfile}
                  />
                </View>
                <View style={{ width: width * 0.8 }}>
                  <InputTextLink
                    title="Paste your Twitter link"
                    onchange={setTwitterProfile}
                    value={twitterProfile}
                  />
                </View>
              </View>
            ) : (
              ''
            )} */}

            {selected === '1' && (
              <View style={styles.contentContainer}>
                <CelebrityForm />
              </View>
            )}

            {selected === '2' && (
              <View style={styles.contentContainer}>
                <SpecialVolunteerForm />
              </View>
            )}

            {selected === '3' && (
              <View style={styles.contentContainer}>
                <VendorForm />
              </View>
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Color.White,
  },
  contentContainer: {
    width: screenWidth * 0.9,
    alignSelf: 'center',
    flex: 1,
  },
});

export default UpgradeAccountScreen;
