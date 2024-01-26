import { FlatList, StyleSheet, View } from 'react-native';
import React from 'react';
import HeaderList from './HeaderList';

import VolunteersListCard from './VolunteersListCard';
import { useStateContext } from '../../../contexts/ContextProvider';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import CustomStatsBar from '../../../components/CustomStatsBar';
import Color from '../../../../assets/colors/Color';

const VolunteersList = () => {
  const { activeCampaign } = useStateContext();

  const renderItem = ({ item }) => {
    if (item.team) return null;

    if (item.status !== 'accepted') return null;
    return (
      <View>
        <VolunteersListCard data={item} />
      </View>
    );
  };
  return (
    <SafeAreaProvider style={styles.container}>
      <CustomStatsBar backgroundColor={Color.White} />
      <View style={{ flex: 1 }}>
        <HeaderList title="Volunteers" />
        <FlatList
          data={activeCampaign?.volunteers}
          renderItem={renderItem}
          keyExtractor={(item) => item._id}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
        />
      </View>
    </SafeAreaProvider>
  );
};

export default VolunteersList;
const styles = StyleSheet.create({});
