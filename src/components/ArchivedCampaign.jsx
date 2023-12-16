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
import React, { useEffect, useState } from "react";
import { useNavigation, useRoute } from "@react-navigation/native";

import { scale } from "react-native-size-matters";

import axios from "axios";
import { useUserState } from "../slices/userSlice";
import { BASE_URL } from "../../CONSTANTS";
import CampaignHeader from "./CampaignHeader";
import CampaignTimeLeft from "./CampaignTimeLeft";
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

const Height = Dimensions.get("screen").height;
const Width = Dimensions.get("screen").width;

const ArchivedCampaign = () => {
  const navigation = useNavigation();

  const route = useRoute();
  const userState = useUserState();
  const [teamAuser, setteamAuser] = useState("");
  const [teamBuser, setteamBuser] = useState("");
  const [leadingTeam, setleadingTeam] = useState("");
  const [equalpoints, setequalpoints] = useState("");
  // console.log(campaign?.messages);
  const [campaignTimeLeftVisible, setCampaignTimeLeftVisible] = useState(true);
  const [newImageVisible, setNewImageVisible] = useState(false);
  const [posts, setposts] = useState("");
  const [loading, setloading] = useState(false);
  const campaign = route?.params;

  console.log(campaign);

  useEffect(() => {
    if (campaign?.teamA?.members?.length > 0) {
      const teamAuser = Object.values(campaign?.teamA?.members);
      setteamAuser(teamAuser);
    }
    if (campaign?.teamB?.members?.length > 0) {
      const teamAuser = Object.values(campaign?.teamB?.members);
      setteamBuser(teamAuser);
    }
  }, []);

  //   useEffect(() => {
  //     if (campaign?.teamA?.points > campaign?.teamB?.points) {
  //       setleadingTeam("Team A");
  //     } else if (campaign?.teamA?.points < campaign?.teamB?.points) {
  //       setleadingTeam("Team B");
  //     } else {
  //       setequalpoints("both");
  //     }
  //   }, []);

  const fetchData = async () => {
    setloading(true);
    try {
      const res = await axios.get(
        `${BASE_URL}/posts/getPostByCampaign/${campaign?._id}`,
        {
          headers: {
            "auth-token": userState.token,
          },
        }
      );

      res?.data?.posts?.sort(
        (a, b) => new Date(b.createdAT) - new Date(a.createdAT)
      );
      setposts(res?.data?.posts);
      setloading(false);
    } catch (error) {
      console.log(error);
      setloading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [campaign?._id]);

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

  return (
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
            <DoDayPointsLIveShot doday={campaign} loading={loading} />
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
        <LivePointsAction campaign={campaign} onpress={handleShareNavigaton} />
      </View>
      <View style={styles.postContainer}>
        {loading && (
          <View
            style={{
              flex: 1,
              alignSelf: "center",
              justifyContent: "center",
            }}
          >
            <ActivityIndicator size={"large"} color={Color.Blue} />
          </View>
        )}

        {!loading && (
          <View>
            {posts?.length === 0 ? (
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
                  At present, there are no posts that have been shared. As soon
                  as new posts are shared, they will appear here.
                </Text>

                <TouchableOpacity
                  style={styles.button}
                  onPress={() => navigation.navigate("Home")}
                >
                  <Text style={styles.buttonTitle}>Back to Home</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <FlatList
                data={posts}
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
                        reload={fetchData}
                      />
                    </View>
                  );
                }}
                onScroll={(event) => handleScroll(event)}
                scrollEventThrottle={16}
              />
            )}
          </View>
        )}
      </View>
    </View>
  );
};

export default ArchivedCampaign;

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
