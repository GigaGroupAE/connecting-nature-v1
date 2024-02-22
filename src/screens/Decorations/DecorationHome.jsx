import { useNavigation } from '@react-navigation/native';
import React from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import HeaderNormal from '../../components/HeaderNormal';
import Color from '../../../assets/colors/Color';
import { screenHeight, screenWidth } from '../../utils/ScreenDimensions';
import DollarSign from '../../components/SVG/DollarSign';
import CategorieSvg from '../../components/SVG/CategorieSvg';
import DesignTypeSvg from '../../components/SVG/DesignTypeSvg';
import ProductSvg from '../../components/SVG/ProductSvg';
import ArrowSvg from '../../components/SVG/Arrow';

const DECORATION_DATA = [
  {
    id: 1,
    title: 'Affordability',
    navigationScreen: 'Afordability',
    icon: <DollarSign />,
  },
  {
    id: 2,
    title: 'Design Type ',
    navigationScreen: 'DesignType',
    icon: <DesignTypeSvg />,
  },
  {
    id: 3,
    title: 'Products',
    navigationScreen: 'AddDecorProduct',
    icon: <ProductSvg />,
  },
  {
    id: 4,
    title: 'Design Category',
    navigationScreen: 'DesignCategory',
    icon: <CategorieSvg />,
  },
];

const DecorationHome = () => {
  const navigation = useNavigation();
  return (
    <View style={styles.container}>
      <HeaderNormal title="Decorate" />
      <FlatList
        data={DECORATION_DATA}
        renderItem={({ item }) => {
          return (
            <TouchableOpacity
              style={styles.item}
              onPress={() => navigation.navigate(item?.navigationScreen)}
            >
              <View style={styles.mainContainer}>
                <View style={styles.leftContainer}>
                  {item?.icon}
                  <Text style={styles.title}>{item?.title}</Text>
                </View>
                <View style={styles.rigtContainer}>
                  <ArrowSvg />
                </View>
              </View>
            </TouchableOpacity>
          );
        }}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
};

export default DecorationHome;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Color.White,
  },
  mainContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: screenHeight * 0.038,
    width: screenWidth * 0.9,
    alignSelf: 'center',
  },
  leftContainer: {
    flexDirection: 'row',
    gap: 22,
  },
  title: {
    fontFamily: 'Roboto_600SemiBold',
    fontSize: screenHeight * 0.018,
  },
});
