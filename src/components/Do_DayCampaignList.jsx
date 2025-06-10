import {
  Dimensions,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import HeaderNormal from './HeaderNormal';
import Color from '../../assets/colors/Color';
import { scale } from 'react-native-size-matters';
import { FontAwesome, MaterialIcons } from 'react-native-vector-icons';
import { axiosInstance } from '../../axiosInstance';
import { useStateContext } from '../contexts/ContextProvider';

const Height = Dimensions.get('screen').height;
const Width = Dimensions.get('screen').width;

const Do_DayCampaignList = () => {
  const route = useRoute();
  const campaigns = route?.params;
  const navigation = useNavigation();
  const { setActiveCampaign, showSnackbar } = useStateContext();

  const handleNavigation = async (item) => {
    try {
      const { data } = await axiosInstance.get(
        `/campaigns/get-by-query?group=${item._id}`,
      );
      if (data.success) {
        if (data?.campaign?.status === 'executed') {
          setActiveCampaign(data?.campaign);
          navigation.navigate('DoDayPortal');
        }
        if (data?.campagin?.status === 'archived') {
          showSnackbar('The campaign was ended ');
        } else {
          showSnackbar('The camaign is not exucte ');
        }
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <View style={styles.container}>
      <HeaderNormal title="Do-Day Portal" />
      <FlatList
        data={campaigns}
        renderItem={({ item }) => {
          return (
            <TouchableOpacity
              style={styles.containerMain}
              onPress={() => handleNavigation(item)}
            >
              <View style={styles.leftSide}>
                <FontAwesome name="hashtag" style={styles.hashicon} />
                <View style={styles.campaginName}>
                  <Text style={styles.campaginTitle}>{item.title}</Text>
                </View>
              </View>
              <View style={styles.rightSide}>
                <MaterialIcons
                  name="keyboard-arrow-right"
                  style={styles.icon}
                />
              </View>
            </TouchableOpacity>
          );
        }}
        keyExtractor={(item) => item?._id}
      />
    </View>
  );
};

export default Do_DayCampaignList;
const styles = StyleSheet.create({
  container: {
    backgroundColor: Color.White,
    flex: 1,
  },
  containerMain: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: scale(0.8),
    borderBottomColor: Color.LightGrey,
    paddingHorizontal: scale(16),
    paddingVertical: scale(12),
  },
  leftSide: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  campaginName: {
    flexDirection: 'column',
    paddingHorizontal: scale(9),
  },
  campaignPostsCount: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  campaginTitle: {
    fontFamily: 'Roboto_700Bold',
    fontSize: scale(16),
  },
  hashicon: {
    fontSize: scale(21),
  },
  posts: {
    fontFamily: 'Roboto_400Regular',
    fontSize: scale(12),
    paddingLeft: scale(12),
  },
  icon: {
    fontSize: scale(22),
  },
  days: {
    fontFamily: 'Roboto_400Regular',
    fontSize: scale(12),
  },
  heading: {
    fontFamily: 'Roboto_700Bold',
    color: Color.Black,
    fontSize: Height * 0.019,
    paddingVertical: Height * 0.01,
  },
  subHeading: {
    fontFamily: 'Roboto_500Medium',
    color: Color.Grey,
    fontSize: Height * 0.016,
    width: scale(270),
    lineHeight: scale(17),
    textAlign: 'center',
  },
  bellIcon: {
    width: Width * 0.3,
    height: Height * 0.13,
    resizeMode: 'contain',
    marginBottom: Height * 0.01,
  },
  button: {
    backgroundColor: Color.Blue,
    marginTop: Height * 0.05,
    paddingHorizontal: Width * 0.06,
    paddingVertical: Height * 0.013,
    borderRadius: Height * 0.01,
  },
  buttonTitle: {
    fontFamily: 'Roboto_600SemiBold',
    color: Color.White,
    fontSize: Height * 0.02,
  },
});
