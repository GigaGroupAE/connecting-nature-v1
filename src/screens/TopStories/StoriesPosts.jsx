import React, { useEffect } from "react"
import { ScrollView, View, StyleSheet, ActivityIndicator } from "react-native"
import SingleStory from "./SingleStory"
import HeaderNormal from "../../components/HeaderNormal"
import { useIsFocused, useRoute } from "@react-navigation/native"
import { useStateContext } from "../../contexts/ContextProvider"
import MiniVideoPlayer from "../../components/MiniVideoPlayer"
import { FlatList } from "react-native"
import { useInfiniteQuery } from "react-query"
import { fetchStories } from "../../Api/GetPost"
import PostSkeleton from "../../components/PostSkeleton"

const renderPost = ({ item }) => <SingleStory key={item._id} post={item} />

const StoriesPosts = (props) => {
  const isFocused = useIsFocused()

  const {
    data: storiesData,
    isLoading: storyLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
  } = useInfiniteQuery("stories", fetchStories, {
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
  })
  const refetchStories = () => {
    refetch()
  }

  useEffect(() => {
    if (isFocused) {
      refetchStories()
    }
  }, [isFocused])

  const { showMiniWindow, videoURI, videoAutherName } = useStateContext()

  return (
    <View style={styles.container}>
      <HeaderNormal title="Spotlight" />
      <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1 }}>
        {storyLoading ? (
          <PostSkeleton />
        ) : (
          <FlatList
            data={storiesData?.pages.flatMap((page) => page?.stories) || []}
            keyExtractor={(item) => item._id}
            initialNumToRender={5}
            renderItem={renderPost}
            showsHorizontalScrollIndicator={false}
            onEndReachedThreshold={0.5}
            onEndReached={() => {
              if (!isFetchingNextPage && hasNextPage) {
                fetchNextPage()
              }
            }}
            ListFooterComponent={isFetchingNextPage && <ActivityIndicator />}
          />
        )}
      </ScrollView>
      {showMiniWindow && (
        <View
          style={{
            backgroundColor: "red",
            position: "relative",
            zIndex: 200,
            width: "100%",
            height: "9%",
            bottom: 0,
          }}
        >
          <MiniVideoPlayer uri={videoURI} videoAutherName={videoAutherName} />
        </View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    height: "100%",
    flex: 1,
  },
})

export default StoriesPosts
