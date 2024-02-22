import { useNavigation } from '@react-navigation/native';
import React from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { AntDesign } from 'react-native-vector-icons';
import HeaderNormal from '../../components/HeaderNormal';
import Color from '../../../assets/colors/Color';

const DECORATION_DATA = [
  {
    id: 1,
    title: 'Affordability',
    navigationScreen: 'Afordability',
  },
  {
    id: 2,
    title: 'Design Type ',
    navigationScreen: 'DesignType',
  },
  {
    id: 3,
    title: 'Add Decor Product',
    navigationScreen: 'AddDecorProduct',
  },
  {
    id: 4,
    title: 'Design Category',
    navigationScreen: 'DesignCategory',
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
                  <AntDesign name="right" style={styles.icons} />
                  <Text style={styles.title}>{item?.title}</Text>
                </View>
                <View style={styles.rigtContainer}>
                  <AntDesign name="right" style={styles.icons} />
                </View>
              </View>
            </TouchableOpacity>
          );
        }}
        keyExtractor={(item) => item.id.toString()}
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
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  leftContainer: {
    flexDirection: 'row',
    gap: 10,
  },
  rigtContainer: {},
  icons: {
    fontSize: 20,
  },
  title: {
    fontFamily: 'Roboto_600SemiBold',
    fontSize: 14,
  },
});
