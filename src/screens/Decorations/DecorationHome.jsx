import { useNavigation } from '@react-navigation/native';
import React from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

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
      <FlatList
        data={DECORATION_DATA}
        renderItem={({ item }) => {
          return (
            <TouchableOpacity
              style={styles.item}
              onPress={() => navigation.navigate(item?.navigationScreen)}
            >
              <Text style={styles.title}>{item.title}</Text>
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
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  item: {
    backgroundColor: '#f9c2ff',
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});
