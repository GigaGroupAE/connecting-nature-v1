import React, { useEffect, useMemo } from "react"
import {
  View,
  FlatList,
  RefreshControl,
  ActivityIndicator,
  StyleSheet,
} from "react-native"
import { useIsFocused } from "@react-navigation/native"
import { useInfiniteQuery, useQuery } from "react-query"
import Color from "../../../assets/colors/Color"
import BottomTab from "../../components/BottomTab"
import Post from "../../components/Post"
import { fetchPosts, fetchRecentCampaigns } from "../../Api/GetPost"
import PostSkeleton from "../../components/PostSkeleton"
import { SafeAreaView } from "react-native"
import HomeHeader from "./HomeHeader"
import { StatusBar } from "react-native"
import { useStateContext } from "../../contexts/ContextProvider"
import MiniVideoPlayer from "../../components/MiniVideoPlayer"
import StoryHeader from "./StoryHeader"
import HeaderForCampaign from "./HeaderForCampaign"

const Home = () => {
  const isFocused = useIsFocused()
  const { showMiniWindow, videoURI, videoAutherName, Stories } =
    useStateContext()

  const {
    data: postsData,
    isLoading: postsLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
  } = useInfiniteQuery(
    "posts",
    ({ pageParam = 1 }) => fetchPosts({ pageParam }),
    {
      getNextPageParam: (lastPage, allPages) => {
        if (lastPage?.currentPage && lastPage?.totalPages) {
          return lastPage.currentPage < lastPage.totalPages
            ? lastPage.currentPage + 1
            : null
        }
        return null
      },
      refetchOnWindowFocus: false,
      cacheTime: 1000 * 60 * 5,
    }
  )

  const {
    data: campaign,
    isLoading,
    isError,
  } = useQuery("mostRecentCampaigns", fetchRecentCampaigns)
  useEffect(() => {
    if (isFocused) {
      refetch()
    }
  }, [isFocused, refetch])

  const handleRefresh = () => {
    refetch()
  }

  const handleEndReached = () => {
    if (!isFetchingNextPage && hasNextPage) {
      fetchNextPage()
    }
  }

  const renderItem = useMemo(() => {
    return ({ item }) => {
      if (!postsData || postsLoading) {
        return <PostSkeleton />
      } else {
        return <Post post={item} key={item._id} reload={refetch} />
      }
    }
  }, [postsData, postsLoading])

  const HeaderComponent = useMemo(() => <HomeHeader />, [])
  const VideoMiniPlayer = useMemo(
    () => (
      (<MiniVideoPlayer uri={videoURI} videoAutherName={videoAutherName} />),
      [videoURI]
    )
  )

  const storyHeaderComponent = useMemo(() => <StoryHeader />, [Stories])
  const ActivCampaignHeader = useMemo(
    () => <HeaderForCampaign campaign={campaign} />,
    [campaign]
  )

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.pageContainer}>
        {HeaderComponent}
        {campaign?.length !== 0 && <View>{ActivCampaignHeader}</View>}
        {postsLoading ? (
          <PostSkeleton />
        ) : (
          <FlatList
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
          />
        )}
      </View>

      {showMiniWindow && (
        <View style={styles.showMiniVideo}>{VideoMiniPlayer}</View>
      )}

      <BottomTab
        activeMenu={"Home"}
        scrollToTop={() => console.log()}
        reload={() => console.log()}
        storyReload={() => console.log()}
      />
      <StatusBar backgroundColor={Color.Blue} />
    </SafeAreaView>
  )
}

export default Home

const styles = StyleSheet.create({
  container: {
    // backgroundColor: Color.White,
    height: "100%",
  },
  pageContainer: {
    alignContent: "flex-start",
    backgroundColor: Color.VeryLightGrey,
    height: "100%",
    paddingBottom: 10,
  },
  showMiniVideo: {
    position: "absolute",
    zIndex: 200,
    width: "100%",
    height: "9%",
    bottom: 10,
  },
})
