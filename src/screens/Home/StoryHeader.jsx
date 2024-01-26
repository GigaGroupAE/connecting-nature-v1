import React, { useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  Dimensions,
} from "react-native";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import { useInfiniteQuery } from "react-query";
import Color from "../../../assets/colors/Color";
import StoryCard from "../../components/StoryCard";
import { fetchStories } from "../../Api/GetPost";

const StoryHeader = () => {
  const navigation = useNavigation();
  const isFocused = useIsFocused();

  const {
    data: storiesData,

    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
  } = useInfiniteQuery("stories", fetchStories, {
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
  });
  const refetchStories = () => {
    refetch();
  };
  useEffect(() => {
    if (isFocused) {
      refetchStories();
    }
  }, [isFocused]);

  const handleStoryNavigation = () => {
    navigation.navigate("StoriesPosts");
  };

  const renderStoryCard = ({ item }) => {
    return <StoryCard story={item} />;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>Spotlight</Text>
      <TouchableOpacity
        style={styles.seeAllButton}
        onPress={handleStoryNavigation}
      >
        <Text style={styles.seeAllText}>see all</Text>
      </TouchableOpacity>
      <FlatList
        data={storiesData?.pages.flatMap((page) => page?.stories) || []}
        keyExtractor={(item) => item._id}
        horizontal
        initialNumToRender={10}
        renderItem={renderStoryCard}
        showsHorizontalScrollIndicator={false}
        onEndReachedThreshold={0.5}
        onEndReached={() => {
          if (!isFetchingNextPage && hasNextPage) {
            fetchNextPage();
          }
        }}
        ListFooterComponent={isFetchingNextPage && <ActivityIndicator />}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Color.White,
  },
  headerText: {
    color: Color.Black,
    fontSize: 16,
    fontFamily: "Roboto_600SemiBold",
    marginHorizontal: Dimensions.get("screen").width * 0.05,
    paddingVertical: Dimensions.get("screen").height * 0.009,
  },
  seeAllButton: {
    position: "absolute",
    right: 15,
    top: 10,
  },
  seeAllText: {
    color: Color.Blue,
    fontSize: 12,
    fontFamily: "Roboto_400Regular",
  },
});

export default StoryHeader;
