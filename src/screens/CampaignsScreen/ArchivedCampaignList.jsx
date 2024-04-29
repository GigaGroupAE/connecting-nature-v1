import {
  FlatList,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import React, { memo, useCallback } from 'react';
import HeaderNormal from '../../components/HeaderNormal';
import { useNavigation } from '@react-navigation/native';
import Color from '../../../assets/colors/Color';
import { FontAwesome, MaterialIcons } from 'react-native-vector-icons';
import { scale } from 'react-native-size-matters';
import { calculateTimeDifference } from '../../utils/timeDifference';
import { useStateContext } from '../../contexts/ContextProvider';
import { fetchArchivedCampaigns } from '../../utils/CampaignsHelper';
import { useQuery } from 'react-query';
import ArchivedCampaignSkelentan from '../../components/Skeletns/ArchivedCampaignSkelentan';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import CustomStatsBar from '../../components/CustomStatsBar';
const Height = Dimensions.get('screen').height;
const Width = Dimensions.get('screen').width;
const EmptyArchivedCampaigns = () => (
  <View style={styles.emptyContainer}>
    <View style={{ alignItems: 'center' }}>
      <Image
        source={require('../../../assets/campaignICon.png')}
        style={styles.bellIcon}
      />
      <Text style={styles.heading}>Currently No Archived Campaigns </Text>
      <Text style={styles.subHeading}>
        Your Archived Campaigns List is currently empty. As you archive
        campaigns, they will appear here for easy reference and review.
      </Text>
    </View>
  </View>
);
const ArchivedCampaignItem = memo(({ item, handleNavigation }) => {
  const endTime = calculateTimeDifference(item?.endTime);

  return (
    <TouchableOpacity
      style={styles.containerMain}
      onPress={() => handleNavigation(item)}
    >
      <View style={styles.leftSide}>
        <FontAwesome name="hashtag" style={styles.hashicon} />
        <View style={styles.campaginName}>
          <Text style={styles.campaginTitle}>{item.campaignName}</Text>
          <View style={styles.campaignPostsCount}>
            <Text style={styles.days}>{endTime}</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={styles.posts}>{item?.count}</Text>
              <Text style={styles.postTitle}>post</Text>
            </View>
          </View>
        </View>
      </View>
      <View style={styles.rightSide}>
        <MaterialIcons name="keyboard-arrow-right" style={styles.icon} />
      </View>
    </TouchableOpacity>
  );
});

const ArchivedCampaign = () => {
  const { data: archivedCampaigns, isLoading } = useQuery(
    'archived',
    fetchArchivedCampaigns,
  );
  const navigation = useNavigation();
  const { setreactions, setcomment } = useStateContext();

  const handleNavigation = useCallback(
    (item) => {
      setreactions(item?.reactions);
      setcomment(item?.messages);
      navigation.navigate('ArchivedCampaign', item);
    },
    [navigation, setreactions, setcomment],
  );
  if (isLoading) {
    return (
      <View style={styles.container}>
        <HeaderNormal title="Archived Campaigns" />
        <ArchivedCampaignSkelentan />
      </View>
    );
  }
  return (
    <SafeAreaProvider style={styles.container}>
      <CustomStatsBar backgroundColor={Color.White} />
      <View style={styles.container}>
        <HeaderNormal title="Archived Campaigns" />
        <View>
          {archivedCampaigns?.length === 0 ? (
            <EmptyArchivedCampaigns />
          ) : (
            <FlatList
              data={archivedCampaigns}
              showsVerticalScrollIndicator={false}
              renderItem={({ item }) => (
                <ArchivedCampaignItem
                  item={item}
                  handleNavigation={handleNavigation}
                />
              )}
            />
          )}
        </View>
      </View>
    </SafeAreaProvider>
  );
};

export default ArchivedCampaign;

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
  postTitle: {
    fontFamily: 'Roboto_400Regular',
    fontSize: scale(12),
    paddingLeft: scale(4),
  },
  emptyContainer: {
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Height * 0.2,
  },
});
