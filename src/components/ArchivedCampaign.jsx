import {
  FlatList,
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  Image,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import React, { useMemo, useState } from "react";
import { useNavigation, useRoute } from "@react-navigation/native";
import { scale } from "react-native-size-matters";
import CampaignHeader from "./CampaignHeader";
import LivePointsTeamPoints from "./LivePointsTeamPoints";
import LivePointsTeamMember from "./LivePointsTeamMember";
import LivePointsAction from "./LivePointsAction";
import Color from "../../assets/colors/Color";
import CampaignPosts from "../screens/CampaignsScreen/CampaignPosts";
import ArchivedTeams from "./ArchivedTeams";
import Animated, {
  useSharedValue,
  withTiming,
  useAnimatedStyle,
  Easing,
} from "react-native-reanimated";
import DoDayPointsLIveShot from "../DoDayPointsLIveShot";
import { useInfiniteQuery } from "react-query";
import { fetchPostsByCampaign } from "../Api/GetPost";
import PostSkeleton from "./PostSkeleton";
import { SafeAreaProvider } from "react-native-safe-area-context";
import CustomStatsBar from "./CustomStatsBar";

const Height = Dimensions.get("screen").height;
const Width = Dimensions.get("screen").width;

const EmptyState = ({ navigation }) => (
  <View
    style={{
      alignItems: "center",
      backgroundColor: Color.White,
      height: "100%",
      justifyContent: "center",
    }}
  >
    <Image
      source={require("../../assets/newPost.png")}
      style={styles.bellIcon}
    />
    <Text style={styles.heading}>Currently No Post Shared</Text>
    <Text style={styles.subHeading}>
      At present, there are no posts that have been shared. As soon as new posts
      are shared, they will appear here.
    </Text>

    <TouchableOpacity
      style={styles.button}
      onPress={() => navigation.navigate("Home")}
    >
      <Text style={styles.buttonTitle}>Back to Home</Text>
    </TouchableOpacity>
  </View>
);

const ArchivedCampaign = () => {
  const navigation = useNavigation();

  const route = useRoute();
  const [teamAuser, setteamAuser] = useState("");
  const [teamBuser, setteamBuser] = useState("");
  const [campaignTimeLeftVisible, setCampaignTimeLeftVisible] = useState(true);
  const [newImageVisible, setNewImageVisible] = useState(false);
  const campaign = route?.params;

  useMemo(() => {
    if (campaign?.teamA?.members.length > 0) {
      const teamA = Object.values(campaign.teamA.members);
      setteamAuser(teamA);
    }
  }, [campaign?.teamA?.members]);

  useMemo(() => {
    if (campaign?.teamB?.members.length > 0) {
      const teamB = Object.values(campaign.teamB.members);
      setteamBuser(teamB);
    }
  }, [campaign?.teamB?.members]);

  const {
    data: campaignPosts,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
  } = useInfiniteQuery(
    ["campaignPosts", campaign?._id],
    ({ pageParam = 1 }) =>
      fetchPostsByCampaign({ pageParam, campaignId: campaign?._id }),
    {
      getNextPageParam: (lastPage, allPages) => {
        if (lastPage?.currentPage && lastPage?.totalPages) {
          return lastPage.currentPage < lastPage.totalPages
            ? lastPage.currentPage + 1
            : null;
        }
        return null;
      },
      refetchOnWindowFocus: false,
      cacheTime: 1000 * 60 * 5,
    }
  );

  const handleShareNavigaton = () => {
    navigation.navigate("LivePoll", { campaign });
  };
  const scrollY = useSharedValue(0);

  const handleScroll = (event) => {
    scrollY.value = event.nativeEvent.contentOffset.y;

    if (event.nativeEvent.contentOffset.y > 40) {
      setCampaignTimeLeftVisible(false);
      setNewImageVisible(true);
    } else {
      setCampaignTimeLeftVisible(true);
      setNewImageVisible(false);
    }
  };

  const animatedTimeLeftStyle = useAnimatedStyle(() => ({
    opacity: withTiming(campaignTimeLeftVisible ? 5 : -10, {
      duration: 200,
      easing: Easing.out,
    }),
    transform: [
      {
        translateY: withTiming(campaignTimeLeftVisible ? 0 : -10, {
          duration: 200,
          easing: Easing.linear,
        }),
      },
    ],
  }));

  const animatedLeftStyle = useAnimatedStyle(() => ({
    opacity: withTiming(campaignTimeLeftVisible ? 0 : 1, {
      duration: 100,
      easing: Easing.out,
    }),
    transform: [
      {
        translateY: withTiming(campaignTimeLeftVisible ? 0 : -5, {
          duration: 100,
          easing: Easing.in,
        }),
      },
    ],
  }));
  const handleEndReached = () => {
    if (!isFetchingNextPage && hasNextPage) {
      fetchNextPage();
    }
  };

  return (
    <SafeAreaProvider style={styles.container}>
      <CustomStatsBar backgroundColor={Color.White} />
      <View style={styles.container}>
        <CampaignHeader title={campaign?.campaignName} />
        {/* Score bored  */}
        <View style={styles.scoreCard}>
          {/* container time left  */}
          <ArchivedTeams campaign={campaign} />
          {/* container points  */}
          {/* <LivePointsTeamPoints campaign={campaign} /> */}
          {newImageVisible && (
            <Animated.View style={[{ width: "100%" }, animatedLeftStyle]}>
              <LivePointsTeamPoints campaign={campaign} />
            </Animated.View>
          )}
          {!newImageVisible && (
            <Animated.View style={[{ width: "100%" }, animatedTimeLeftStyle]}>
              <DoDayPointsLIveShot doday={campaign} loading={isLoading} />
            </Animated.View>
          )}
          {/* members teams */}
          <LivePointsTeamMember
            teamAuser={teamAuser}
            teamBuser={teamBuser}
            campaign={campaign}
          />
        </View>

        {/* Campaign Action Container */}
        <View>
          <LivePointsAction
            campaign={campaign}
            onpress={handleShareNavigaton}
          />
        </View>
        <View style={styles.postContainer}>
          {isLoading && (
            <View>
              <PostSkeleton />
            </View>
          )}
          {!isLoading &&
            campaignPosts?.pages.flatMap((item) => item?.posts.length) < 1 && (
              <EmptyState navigation={() => navigation.navigate("Home")} />
            )}
          {!isLoading && (
            <View style={{ marginTop: 10 }}>
              <FlatList
                data={campaignPosts?.pages.flatMap((page) => page.posts) || []}
                renderItem={({ item }) => {
                  return (
                    <View
                      style={{
                        marginBottom: 10,
                      }}
                    >
                      <CampaignPosts
                        post={item}
                        campaignId={campaign?._id}
                        reload={refetch}
                      />
                    </View>
                  );
                }}
                onScroll={(event) => handleScroll(event)}
                scrollEventThrottle={16}
                keyExtractor={(item) => `${item?._id}`}
                onEndReachedThreshold={0.5}
                onEndReached={handleEndReached}
                ListFooterComponent={
                  isFetchingNextPage && <ActivityIndicator />
                }
              />
            </View>
          )}
        </View>
      </View>
    </SafeAreaProvider>
  );
};

export default ArchivedCampaign;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scoreCard: {
    backgroundColor: Color.LightBg,
    alignItems: "center",
    overflow: "hidden",
  },
  pointsContainer: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignSelf: "center",
    paddingVertical: scale(10),
    paddingHorizontal: scale(16),
  },
  countDown: {
    flexDirection: "row",
    alignItems: "center",
  },
  time: {
    fontFamily: "Roboto_700Bold",
    fontSize: scale(12),
    paddingHorizontal: scale(4),
  },
  lead: {
    flexDirection: "row",
    alignItems: "center",
  },
  subTitle: {
    fontSize: scale(12),
    fontFamily: "Roboto_500Medium",
  },
  postContainer: {
    flex: 1,
  },
  heading: {
    fontFamily: "Roboto_700Bold",
    color: Color.Black,
    fontSize: Height * 0.019,
    paddingVertical: Height * 0.01,
  },
  subHeading: {
    fontFamily: "Roboto_500Medium",
    color: Color.Black,
    fontSize: Height * 0.016,
    width: Width * 0.7,
    textAlign: "center",
  },
  bellIcon: {
    width: Width * 0.26,
    height: Height * 0.1,
    resizeMode: "contain",
  },
  button: {
    backgroundColor: Color.Blue,
    marginTop: Height * 0.02,
    paddingHorizontal: Width * 0.06,
    paddingVertical: Height * 0.013,
    borderRadius: Height * 0.01,
  },
  buttonTitle: {
    fontFamily: "Roboto_600SemiBold",
    color: Color.White,
    fontSize: Height * 0.019,
  },
});
