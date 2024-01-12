import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  StatusBar,
  Dimensions,
  Alert,
  FlatList,
  Image,
  ActivityIndicator,
  Pressable,
} from "react-native";
import { useRef, useState } from "react";

import AnimatedLottieView from "lottie-react-native";

//componenets import
import HeaderNormal from "../../components/HeaderNormal";

//images import
import CampaignNotification from "../../components/Notifications/CampaignNotification";
import LikeCommentNotification from "../../components/Notifications/LikeCommentNotification";
import AcceptedRejectedNotification from "../../components/Notifications/AcceptedRejectedNotification";
import { useInfiniteQuery } from "react-query";
import { axiosInstance } from "../../../axiosInstance";
import Color from "../../../assets/colors/Color";
import bellIcon from "../../../assets/Union.png";
import { TouchableOpacity } from "react-native-gesture-handler";
import { useNavigation } from "@react-navigation/native";
import NotificationsSkeleton from "../../components/NotificationsSkeleton";

const HEIGHT = Dimensions.get("screen").height - StatusBar.currentHeight;
const WIDTH = Dimensions.get("screen").width;
const ITEMS_PER_PAGE = 25;

const NotificationsScreen = () => {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
    error,
    isLoading,
  } = useInfiniteQuery({
    queryKey: ["notifications"],

    queryFn: async ({ pageParam = 1 }) => {
      const { data } = await axiosInstance.get(`/notify/getnoties`);

      return data;
    },

    getNextPageParam: (lastPage) =>
      lastPage.totalPages > lastPage.page ? lastPage.page + 1 : null,
  });
  const animation = useRef(null);
  const [animationVisible, setAnimationVisible] = useState(null);
  const navigation = useNavigation();

  if (status === "error") {
    Alert.alert("error", error);
    return;
  }

  const startAnimation = () => {
    setAnimationVisible(true);
    animation.current.play();
  };

  const handleLoadMore = () => {
    if (!isFetchingNextPage && hasNextPage) {
      fetchNextPage();
    }
  };

  //footer for flat list
  const renderFooter = () => {
    if (!isFetchingNextPage) return null;
    return (
      <View style={{ paddingVertical: 20 }}>
        <ActivityIndicator size="large" />
      </View>
    );
  };
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      {
        <AnimatedLottieView
          ref={animation}
          loop={false}
          onAnimationFinish={() => {
            console.log("animation is finished");
            //animation.current.reset();
            setAnimationVisible(false);
          }}
          source={require("../../../assets/thankyou.json")}
          speed={2}
          style={[
            animationVisible
              ? {
                  height: 100,
                  width: 100,
                  borderRadius: 100 / 2,
                  position: "absolute",
                  zIndex: 1,
                  bottom: "5%",
                  left: "30%",
                }
              : { display: "none" },
          ]}
        />
      }
      <View style={styles.container}>
        {/* //HEADER */}
        <View style={{ height: HEIGHT * 0.07 }}>
          <HeaderNormal
            title={"Notifications"}
            onback={() => navigation.goBack()}
          />
        </View>
        {/* LIST OF NOTIFICATIONS */}
        {isLoading && (
          <View style={styles.loading}>
            <NotificationsSkeleton />
          </View>
        )}
        {!isLoading && (
          <View
            style={{
              marginHorizontal: WIDTH * 0.05,
              flex: 1,
            }}
          >
            <FlatList
              data={data?.pages
                ?.flatMap((data) => data.notifications)
                ?.reverse()} // Reverse the data array
              keyExtractor={(item) => item._id}
              onEndReached={handleLoadMore}
              showsVerticalScrollIndicator={false}
              onEndReachedThreshold={0.3}
              ListFooterComponent={renderFooter}
              renderItem={({ item }) => {
                if (item?.data?.title === "campaign-invite") {
                  return (
                    <CampaignNotification
                      data={item}
                      startAnimation={startAnimation}
                    />
                  );
                } else if (
                  item?.data?.title === "post-comment" ||
                  item?.data?.title === "post-like" ||
                  item?.data?.title === "post-share"
                ) {
                  return <LikeCommentNotification data={item} />;
                } else if (item?.data?.title === "campaign-invite-accepted") {
                  return (
                    <AcceptedRejectedNotification data={item} type="accepted" />
                  );
                } else if (item?.data?.title === "campaign-invite-rejected") {
                  return (
                    <AcceptedRejectedNotification data={item} type="rejected" />
                  );
                }

                return null;
              }}
            />

            {data?.pages.flatMap((item) => item.notifications.length) < 1 ? (
              <>
                {!isLoading && (
                  <View
                    style={{
                      alignItems: "center",
                      marginBottom: HEIGHT * 0.34,
                    }}
                  >
                    <Image source={bellIcon} style={styles.bellIcon} />
                    <Text style={styles.heading}>No Notifications Found</Text>
                    <Text style={styles.subHeading}>
                      You have currently no notifications. We'll notify
                    </Text>
                    <Text style={styles.subHeading}>
                      you when something new arrives!
                    </Text>
                    <TouchableOpacity
                      style={styles.button}
                      onPress={() => navigation.goBack()}
                    >
                      <Text style={styles.buttonTitle}>Back to Home</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </>
            ) : null}
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

export default NotificationsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  visible: {
    display: "flex",
  },
  hide: {
    display: "none",
  },
  heading: {
    fontFamily: "Roboto_700Bold",
    color: Color.Black,
    fontSize: HEIGHT * 0.019,
    paddingVertical: HEIGHT * 0.01,
  },
  subHeading: {
    fontFamily: "Roboto_500Medium",
    color: Color.Black,
    fontSize: HEIGHT * 0.016,
  },
  bellIcon: {
    width: WIDTH * 0.25,
    height: HEIGHT * 0.15,
  },
  button: {
    backgroundColor: Color.Blue,
    marginTop: HEIGHT * 0.05,
    paddingHorizontal: WIDTH * 0.06,
    paddingVertical: HEIGHT * 0.013,
    borderRadius: HEIGHT * 0.01,
  },
  buttonTitle: {
    fontFamily: "Roboto_600SemiBold",
    color: Color.White,
    fontSize: HEIGHT * 0.02,
  },
  loading: {
    flex: 1,
  },
});
