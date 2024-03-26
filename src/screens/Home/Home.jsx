import React, { useEffect, useMemo, useRef } from 'react';
import {
  View,
  RefreshControl,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  Text,
} from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { useInfiniteQuery, useQuery } from 'react-query';
import Color from '../../../assets/colors/Color';
import BottomTab from '../../components/BottomTab';
import Post from '../../components/Post';
import {
  fetchPosts,
  fetchRecentCampaigns,
  registerForPushNotificationsAsync,
} from '../../Api/GetPost';
import PostSkeleton from '../../components/PostSkeleton';

import HomeHeader from './HomeHeader';

import { useStateContext } from '../../contexts/ContextProvider';
import MiniVideoPlayer from '../../components/MiniVideoPlayer';
import StoryHeader from './StoryHeader';
import HeaderForCampaign from './HeaderForCampaign';
import * as Notifications from 'expo-notifications';
import { useUserState, useUserStateActions } from '../../slices/userSlice';
import { BASE_URL } from '../../../CONSTANTS';
import axios from 'axios';

import { SafeAreaProvider } from 'react-native-safe-area-context';
import { screenHeight } from '../../utils/ScreenDimensions';
import { itemTitle } from '../Decorations/ModalStyle';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

const Home = () => {
  const isFocused = useIsFocused();
  const userstate = useUserState();
  const userActions = useUserStateActions();
  const notificationListener = useRef();
  const responseListener = useRef();
  const navigation = useNavigation();

  const { showMiniWindow, videoURI, videoAutherName, Stories } =
    useStateContext();
  const {
    data: postsData,
    isLoading: postsLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
  } = useInfiniteQuery(
    'posts',
    ({ pageParam = 1 }) => fetchPosts({ pageParam }),
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

  const { data: campaign } = useQuery(
    'mostRecentCampaigns',
    fetchRecentCampaigns,
  );
  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {
        if (isMounted && isFocused) {
          await refetch();
        }
      } catch (error) {
        // Handle errors
      }
    };

    fetchData();

    return () => {
      // Cleanup function to cancel ongoing operations
      isMounted = false;
    };
  }, [isFocused, refetch]);

  const handleRefresh = () => {
    refetch();
  };

  const handleEndReached = () => {
    if (!isFetchingNextPage && hasNextPage) {
      fetchNextPage();
    }
  };

  const renderItem = useMemo(() => {
    return ({ item }) => {
      if (!postsData || postsLoading) {
        return <PostSkeleton />;
      } else {
        return <Post post={item} key={item._id} reload={refetch} />;
      }
    };
  }, [postsData, postsLoading]);

  useEffect(() => {
    if (isFocused) {
      if (!userstate.expoPushToken)
        registerForPushNotificationsAsync().then((token) => {
          // setExpoPushToken(token);
          //make api call to save the token
          const config = {
            headers: {
              'auth-token': userstate.token,
            },
          };
          if (!userstate.expoPushToken) {
            axios
              .put(
                `${BASE_URL}/user/updateUserExpoToken`,
                { expoPushToken: `${token}` },
                config,
              )
              .then((res) => {
                userActions.setExpoPushToken(res.data.expoPushToken);
              })
              .catch((err) => {});
          }
        });

      notificationListener.current =
        Notifications.addNotificationReceivedListener((notification) => {
          // setNotification(notification);
        });

      responseListener.current =
        Notifications.addNotificationResponseReceivedListener((response) => {});

      return () => {
        Notifications.removeNotificationSubscription(
          notificationListener.current,
        );
        Notifications.removeNotificationSubscription(responseListener.current);
      };
    }
  }, [isFocused]);

  const HeaderComponent = useMemo(() => <HomeHeader />, []);
  const VideoMiniPlayer = useMemo(
    () =>
      (<MiniVideoPlayer uri={videoURI} videoAutherName={videoAutherName} />)[
        videoURI
      ],
  );

  const storyHeaderComponent = useMemo(() => <StoryHeader />, [Stories]);
  const ActivCampaignHeader = useMemo(
    () => <HeaderForCampaign campaign={campaign} />,
    [campaign],
  );

  const scrollToTop = () => {};

  return (
    <SafeAreaProvider style={styles.container}>
      <View style={styles.pageContainer}>
        {HeaderComponent}
        {campaign && <View>{ActivCampaignHeader}</View>}
        {postsLoading ? (
          <PostSkeleton screen="home" />
        ) : (
          <FlashList
            data={postsData?.pages.flatMap((page) => page.newPosts) || []}
            keyExtractor={(item) => item._id}
            ListHeaderComponent={storyHeaderComponent}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                colors={[Color.Blue]}
                refreshing={postsLoading}
                onRefresh={handleRefresh}
              />
            }
            renderItem={renderItem}
            onEndReachedThreshold={0.5}
            onEndReached={handleEndReached}
            ListFooterComponent={isFetchingNextPage && <ActivityIndicator />}
            estimatedItemSize={200}
          />
        )}
      </View>
      {showMiniWindow && (
        <View style={styles.showMiniVideo}>
          <MiniVideoPlayer uri={videoURI} videoAutherName={videoAutherName} />
        </View>
      )}
      <TouchableOpacity
        style={styles.decorateButton}
        onPress={() => navigation.navigate('DecorationClient')}
      >
        <Text style={{ ...itemTitle, color: Color.White }}>Decorate</Text>
      </TouchableOpacity>

      <BottomTab activeMenu="Home" scrollToTop={scrollToTop} reload={refetch} />
    </SafeAreaProvider>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    // backgroundColor: Color.White,
    height: '100%',
  },
  pageContainer: {
    alignContent: 'flex-start',
    backgroundColor: Color.VeryLightGrey,
    height: '100%',
    paddingBottom: 10,
  },
  showMiniVideo: {
    position: 'absolute',
    zIndex: 200,
    width: '100%',
    height: '9%',
    bottom: 10,
    backgroundColor: 'red',
  },
  decorateButton: {
    backgroundColor: Color.Purple,
    position: 'absolute',
    bottom: screenHeight * 0.1,
    right: '6%',
    width: '26%',
    alignItems: 'center',
    paddingVertical: '9%',
    borderRadius: screenHeight * 0.01,
  },
});
