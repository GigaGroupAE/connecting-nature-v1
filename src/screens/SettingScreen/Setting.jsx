import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useState } from 'react';
import HeaderNormal from '../../components/HeaderNormal';
import {
  MaterialCommunityIcons,
  AntDesign,
  Ionicons,
  MaterialIcons,
  EvilIcons,
  Octicons,
} from 'react-native-vector-icons';

import BucketModel from './BucketModel';
import Color from '../../../assets/colors/Color';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import CustomStatsBar from '../../components/CustomStatsBar';

const Height = Dimensions.get('screen').height;
const Width = Dimensions.get('screen').width;

const Setting = () => {
  const [busketModel, setbusketModel] = useState(false);
  const [Isannouncement, setIsannouncement] = useState(false);

  const showModal = () => setIsannouncement(true);

  const Showbusket = () => setbusketModel(true);
  const hidebusket = () => setbusketModel(false);

  const containerStyle = {
    backgroundColor: 'white',
    borderRadius: Height * 0.01,
    paddingVertical: Height * 0.015,
    marginHorizontal: Width * 0.04,
  };

  return (
    <SafeAreaProvider style={styles.container}>
      <CustomStatsBar backgroundColor={Color.White} />
      <View style={{ height: '100%', backgroundColor: Color.White }}>
        <HeaderNormal title="Settings" />
        <View style={styles.mainContainer}>
          <TouchableOpacity onPress={Showbusket} style={styles.listSeaction}>
            <MaterialCommunityIcons name="flower-tulip" style={styles.icon} />
            <Text style={styles.title}>Add New Bucket</Text>
          </TouchableOpacity>
          <View>
            <AntDesign name="right" style={styles.icon} />
          </View>
        </View>
        <View style={styles.mainContainer}>
          <View style={styles.listSeaction}>
            <Ionicons name="newspaper" style={styles.icon} />
            <Text style={styles.title}>Government Signed NOC</Text>
          </View>
          <View>
            <AntDesign name="right" style={styles.icon} />
          </View>
        </View>
        <View style={styles.mainContainer}>
          <TouchableOpacity style={styles.listSeaction} onPress={showModal}>
            <MaterialIcons name="announcement" style={styles.icon} />
            <Text style={styles.title}>Announcement </Text>
          </TouchableOpacity>
          <View>
            <AntDesign name="right" style={styles.icon} />
          </View>
        </View>
        <View style={styles.mainContainer}>
          <View style={styles.listSeaction}>
            <MaterialCommunityIcons name="flower-tulip" style={styles.icon} />
            <Text style={styles.title}>Leaderboard Winners</Text>
          </View>
          <View>
            <AntDesign name="right" style={styles.icon} />
          </View>
        </View>
        <View style={styles.mainContainer}>
          <View style={styles.listSeaction}>
            <MaterialIcons name="campaign" style={styles.icon} />
            <Text style={styles.title}>Campaigns History</Text>
          </View>
          <View>
            <AntDesign name="right" style={styles.icon} />
          </View>
        </View>
        <View style={styles.mainContainer}>
          <View style={styles.listSeaction}>
            <EvilIcons name="user" style={styles.icon} />
            <Text style={styles.title}>Invite Asst. Manager</Text>
          </View>
          <View>
            <AntDesign name="right" style={styles.icon} />
          </View>
        </View>
        <View style={styles.mainContainer}>
          <View style={styles.listSeaction}>
            <Octicons name="feed-repo" style={styles.icon} />
            <Text style={styles.title}>Report </Text>
          </View>
          <View>
            <AntDesign name="right" style={styles.icon} />
          </View>
        </View>

        <BucketModel
          visible={busketModel}
          containerStyle={containerStyle}
          hideModal={hidebusket}
        />
        {/* 
      <AnnouncementModel
        modalVisible={Isannouncement}
        setModalVisible={setIsannouncement}
      /> */}
      </View>
    </SafeAreaProvider>
  );
};

export default Setting;

const styles = StyleSheet.create({
  mainContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: Width * 0.05,
    paddingVertical: Height * 0.02,
  },
  listSeaction: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontSize: Height * 0.021,
    marginLeft: Width * 0.036,
    fontFamily: 'Roboto_500Medium',
  },
  icon: { fontSize: Height * 0.028 },
});
