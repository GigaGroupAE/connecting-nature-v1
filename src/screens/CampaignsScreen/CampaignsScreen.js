import React, { useCallback, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  FlatList,
} from 'react-native';
import HeaderBack from '../../components/HeaderBack';
import CampaignCard from './CampaignCard';
import BottomTab from '../../components/BottomTab';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import Color from '../../../assets/colors/Color';
import { useStateContext } from '../../contexts/ContextProvider';
import { scale } from 'react-native-size-matters';
import NoCampaignIndicater from '../../components/NoCampaignIndicater';
import { fetchCampaigns } from '../../utils/CampaignsHelper';
import { useQuery } from 'react-query';
import CampaignsSkeletn from '../../components/Skeletns/CampaignsSkeletn';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import CustomStatsBar from '../../components/CustomStatsBar';
const Height = Dimensions.get('screen').height;
const Width = Dimensions.get('screen').width;

export default function CampaignsScreen() {
  const {
    data: campaigns,
    isLoading: campaignsLoading,
    refetch,
  } = useQuery('campaigns', fetchCampaigns);
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const { setreactions, setcomment } = useStateContext();
  const scrollToTop = useCallback(() => {}, []);
  useEffect(() => {
    if (isFocused) {
      refetch();
    }
  }, [isFocused]);

  const handleNavigation = (campaign) => {
    setreactions(campaign?.reactions);
    setcomment(campaign?.comments);
    navigation.navigate('CampaignWithPosts', { campaign });
  };
  const renderItem = useCallback(
    ({ item }) => (
      <TouchableOpacity onPress={() => handleNavigation(item)}>
        <CampaignCard
          title={item?.campaignName}
          leaderA={item?.teamA?.leader?.fullName}
          leaderB={item?.teamB?.leader?.fullName}
          location={item?.venue || 'Coming Soon...'}
          date={item?.date}
          mainBg={styles.cardBg}
          countA={item?.teamA?.members?.length}
          countB={item?.teamB?.members?.length}
          locked={item?.locked}
          color={item?.color}
          teamAuser={item?.teamA?.members}
          teamBuser={item?.teamB?.members}
        />
      </TouchableOpacity>
    ),
    [],
  );

  const renderCampaigns = () => {
    if (campaignsLoading) {
      return <CampaignsSkeletn />;
    } else if (!campaigns?.length) {
      return (
        <View
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            paddingVertical: Height * 0.2,
          }}
        >
          <NoCampaignIndicater />
        </View>
      );
    } else {
      return (
        <FlatList
          data={campaigns}
          keyExtractor={(item) => item._id}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
        />
      );
    }
  };

  return (
    <SafeAreaProvider style={styles.container}>
      <CustomStatsBar backgroundColor={Color.White} />
      <HeaderBack title="Campaigns" />
      <View style={styles.main}>
        <Text style={styles.screenTitle}>Live & Upcoming Events</Text>
        <Text style={styles.description}>Are you ready for it?</Text>
        {renderCampaigns()}
      </View>
      <BottomTab activeMenu="Campaign" scrollToTop={scrollToTop} />
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  main: {
    backgroundColor: Color.White,
    flex: 1,
    paddingTop: Height * 0.014,
    paddingHorizontal: Width * 0.045,
  },
  cardBg: {
    paddingVertical: 15,
    backgroundColor: 'red',
    marginTop: Height * 0.022,
    borderRadius: Height * 0.01,
    paddingHorizontal: Width * 0.045,
  },
  scrollView: {
    marginBottom: '24%',
  },
  screenTitle: {
    fontFamily: 'Roboto_600SemiBold',
    fontSize: Height * 0.032,
    color: Color.Black,
    fontWeight: '600',
  },
  description: {
    fontFamily: 'Roboto_500Medium',
    fontSize: Height * 0.019,
    color: Color.Black,
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
  archivebutton: {
    marginTop: scale(25),
    fontSize: scale(20),
  },
  archiveText: {
    fontSize: scale(18),
    fontFamily: 'Roboto_400Regular',
    color: Color.Blue,
  },
});
