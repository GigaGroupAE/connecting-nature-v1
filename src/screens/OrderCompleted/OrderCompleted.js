import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  Image,
  View,
  Text,
  Dimensions,
  StatusBar,
  StyleSheet,
  ScrollView,
} from 'react-native';
import HeaderNormal from '../../components/HeaderNormal';

import thankYouPic from '../../../assets/thanksForOrder.png';

import { theme } from '../../../theme';
import Btn from '../../components/Btn';
import { useNavigation } from '@react-navigation/native';
import OrderDetailsCard from '../../components/ShopComponents/OrderDetailsCard';

// const DUMMY_DATA = Array.apply(null, Array(3)).map((x) => {
//   return {
//     name: 'Morinaga Plant',
//     quantity: 1,
//     price: '8800',
//   };
// });

const OrderCompleted = (props) => {
  const [screenWidth, setScreenWidth] = useState(
    Dimensions.get('screen').width,
  );
  const [screenHeight, setScreenHeight] = useState(
    Dimensions.get('screen').height - StatusBar.currentHeight,
  );

  const navigation = useNavigation();

  useEffect(() => {
    const handleResize = () => {
      setScreenWidth(Dimensions.get('screen').width);
      setScreenHeight(
        Dimensions.get('screen').height - StatusBar.currentHeight,
      );
    };

    const subscription = Dimensions.addEventListener('change', handleResize);

    return () => {
      subscription?.remove();
    };
  }, []);
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
      <HeaderNormal title="My Order List" />
      <View
        style={{ ...styles.upperContainer, marginTop: screenHeight * 0.05 }}
      >
        <Image source={thankYouPic} />
        <Text
          style={{
            ...styles.thankYouText,
            marginTop: screenHeight * 0.05,
            fontSize: screenWidth * 0.05,
          }}
        >
          Thank you for Purchasing
        </Text>
        <Text
          style={{
            ...styles.yourOrderText,
            marginVertical: screenHeight * 0.02,
            fontSize: screenWidth * 0.03,
          }}
        >
          Your Order will be deliverd in 2 working days.
        </Text>
      </View>
      <View style={{ maxHeight: screenHeight * 0.4 }}>
        {/* SCROLL VIEW WILL INHERIT THE HEIGHT OF PARENT VIEW */}
        <ScrollView>
          {props.route.params.item.cart.map((data, idx) => {
            return (
              <OrderDetailsCard
                screenWidth={screenWidth}
                data={data}
                key={idx}
              />
            );
          })}
        </ScrollView>
        <View
          style={{
            height: screenHeight * 0.06,
            marginHorizontal: screenWidth * 0.02,
            marginTop: 20,
          }}
        >
          <Btn
            text="Back to Home"
            backgroundColor={'#4582C3'}
            textColor={'white'}
            onPress={() => {
              navigation.reset({
                index: 0,
                routes: [{ name: 'Home' }],
              });
            }}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default OrderCompleted;

const styles = StyleSheet.create({
  upperContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  thankYouText: {
    fontFamily: theme.fonts.family.semiBold,

    color: '#707070',
  },
  yourOrderText: {
    fontFamily: theme.fonts.family.regular,
    color: '#707070',
  },
});
