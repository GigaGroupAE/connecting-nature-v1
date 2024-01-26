import {
  FlatList,
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  Dimensions,
  Image,
  TouchableOpacity,
} from "react-native";
import React, { useMemo, useRef, useState } from "react";
import { useNavigation, useRoute } from "@react-navigation/native";
import CampaignHeader from "../../components/CampaignHeader";
import { scale } from "react-native-size-matters";
import Color from "../../../assets/colors/Color";

import LivePointsTeamMember from "../../components/LivePointsTeamMember";
import LivePointsTeamPoints from "../../components/LivePointsTeamPoints";
import CampaignPosts from "./CampaignPosts";

import LivePointsAction from "../../components/LivePointsAction";
import CampaignTimeLeft from "../../components/CampaignTimeLeft";
import * as Sharing from "expo-sharing";
import LottieView from "lottie-react-native";
import Animated, {
  useSharedValue,
  withTiming,
  useAnimatedStyle,
  Easing,
  FadeInUp,
  FadeOutUp,
  BounceIn,
  BounceOut,
} from "react-native-reanimated";
import DoDayPointsLIveShot from "../../DoDayPointsLIveShot";
import LivepollComments from "../../LivepollComments";
import CampaignShare from "../../components/CampaignShare";
import { useStateContext } from "../../contexts/ContextProvider";
import { fetchPostsByCampaign } from "../../Api/GetPost";
import { useInfiniteQuery } from "react-query";
import PostSkeleton from "../../components/PostSkeleton";

const Height = Dimensions.get("screen").height;
const Width = Dimensions.get("screen").width;

const EmptyState = ({ navigation }) => (
  <View
    style={{
      height: "100%",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: Color.White,
    }}
  >
    <View
      style={{
        alignItems: "center",
      }}
    >
      <Image
        source={require("../../../assets/newPost.png")}
        style={styles.bellIcon}
      />
      <Text style={styles.heading}>Currently No Post Shared</Text>
      <Text style={styles.subHeading}>
        At present, there are no posts that have been shared. As soon as new
        posts are shared, they will appear here.
      </Text>

      <TouchableOpacity style={styles.button} onPress={navigation}>
        <Text style={styles.buttonTitle}>Back to Home</Text>
      </TouchableOpacity>
    </View>
  </View>
);

const CampaignsWithPost = () => {
  const navigation = useNavigation();
  const animation = useRef(null);
  const route = useRoute();
  const { campaignViewShortImage } = useStateContext();
  const [teamAuser, setteamAuser] = useState("");
  const [teamBuser, setteamBuser] = useState("");
  const [likeAnimation, setlikeAnimation] = useState(false);
  const [showShareModal, setshowShareModal] = useState(false);
  const campaign = route?.params?.campaign;
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
    },
  );

  const handleShareNavigaton = () => {
    setshowShareModal(!showShareModal);
  };

  const handleComment = () => {
    navigation.navigate("CampaignComments", {
      campaign: campaign,
      screen: "",
    });
  };
  const [campaignTimeLeftVisible, setCampaignTimeLeftVisible] = useState(true);
  const [newImageVisible, setNewImageVisible] = useState(false);

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

  const handleShareExternal = async () => {
    // Share the captured image
    await Sharing.shareAsync(campaignViewShortImage, {
      mimeType: "image/jpeg",
      dialogTitle: "Share this image",
      UTI: "public.jpeg",
    });
  };
  const handlePointsShareFeed = async () => {
    navigation.navigate("PointsSharePost", campaignViewShortImage);
  };

  const handleEndReached = () => {
    if (!isFetchingNextPage && hasNextPage) {
      fetchNextPage();
    }
  };

  return (
    <View style={styles.container}>
      <CampaignHeader
        title={campaign?.campaignName}
        screen="active"
        id={campaign?._id}
      />
      {/* Score bored  */}
      <View style={styles.scoreCard}>
        <CampaignTimeLeft campaign={campaign} />
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
        {likeAnimation && (
          <Animated.View
            entering={BounceIn}
            exiting={BounceOut.delay(100)}
            style={{ position: "absolute", top: Height * 0.09 }}
          >
            <LottieView
              autoPlay
              ref={animation}
              style={{
                width: 100,
                height: 100,
              }}
              source={require("../../../assets/Animation/Animation - 1700745291097.json")}
            />
          </Animated.View>
        )}
      </View>

      {/* Campaign Action Container */}
      <View style={{ backgroundColor: Color.White }}>
        <LivepollComments id={campaign?._id} />
      </View>
      <View>
        <LivePointsAction
          campaign={campaign}
          onpress={handleShareNavigaton}
          handleComment={handleComment}
          setlikeAnimation={setlikeAnimation}
        />
        {showShareModal && (
          <Animated.View entering={FadeInUp} exiting={FadeOutUp}>
            <View>
              <CampaignShare
                handleShareExternal={handleShareExternal}
                handlePointsShareFeed={handlePointsShareFeed}
              />
            </View>
          </Animated.View>
        )}
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
              ListFooterComponent={isFetchingNextPage && <ActivityIndicator />}
            />
          </View>
        )}
      </View>
    </View>
  );
};

export default CampaignsWithPost;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: Color.Black,
  },
  scoreCard: {
    backgroundColor: Color.LightBg,
    // height: scale(155),
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
