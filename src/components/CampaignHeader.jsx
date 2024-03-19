import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React from 'react';
import { AntDesign, Entypo } from 'react-native-vector-icons';
import Color from '../../assets/colors/Color';
import { scale } from 'react-native-size-matters';
import { useNavigation } from '@react-navigation/native';

const CampaignHeader = ({ title, screen, id }) => {
  const campaignName = title?.length > 32 ? title.slice(0, 31) + '...' : title;

  const navigation = useNavigation();
  const handleGoback = () => {
    navigation.goBack();
  };
  return (
    <View style={styles.container}>
      <View style={styles.containerLeft}>
        <TouchableOpacity onPress={handleGoback}>
          <AntDesign
            name="arrowleft"
            size={24}
            color={Color.Black}
            style={{ alignSelf: 'center', alignItems: 'center' }}
          />
        </TouchableOpacity>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>{campaignName}</Text>
          <Text style={styles.subTitle}>Live points updates</Text>
        </View>
      </View>
      {screen === 'active' && (
        <TouchableOpacity
          onPress={() =>
            navigation.navigate('CreateCampaignPost', { id, title })
          }
        >
          <Text style={styles.createPost}>Create Post</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default CampaignHeader;

const styles = StyleSheet.create({
  container: {
    backgroundColor: Color.White,
    alignContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: scale(17),
    paddingVertical: scale(9),
    borderBottomWidth: 2,
    borderColor: Color.VeryLightGrey,
    justifyContent: 'space-between',
  },
  titleContainer: {
    paddingHorizontal: scale(10),
  },
  containerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontFamily: 'Roboto_500Medium',
    fontSize: scale(17),
  },
  subTitle: {
    fontFamily: 'Roboto_400Regular',
    color: Color.DarkGrey,
  },
  icon: {
    fontSize: scale(18),
  },
  createPost: {
    fontFamily: 'Roboto_400Regular',
    color: Color.Blue,
    fontSize: scale(11),
  },
});
