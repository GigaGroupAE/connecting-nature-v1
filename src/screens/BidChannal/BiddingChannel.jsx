import {
  ActivityIndicator,
  RefreshControl,
  StyleSheet,
  View,
  FlatList,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import Color from '../../../assets/colors/Color';
import { useInfiniteQuery } from 'react-query';
import { fetchBiddingProjects } from '../../utils/BiddingChannel';
import { useUserState } from '../../slices/userSlice';
import { useRoute } from '@react-navigation/native';
import BidChannelHeader from '../../components/BidChannelHeader';
import ProjectCard from './ProjectCard';
import { screenWidth } from '../../utils/ScreenDimensions';

const BiddingChannel = () => {
  const userState = useUserState();
  const { params } = useRoute();
  const groupData = params?.item;

  const [currentuser, setcurrentuser] = useState(null);

  const {
    data,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
  } = useInfiniteQuery(
    'bidprojects',
    ({ pageParam = 1 }) => fetchBiddingProjects({ pageParam }),
    {
      getNextPageParam: (lastPage, allPages) => {
        if (lastPage?.currentPage && lastPage?.totalPages) {
          return lastPage.currentPage < lastPage.totalPages
            ? lastPage.currentPage + 1
            : null;
        }
        return null;
      },
    },
  );

  const handleEndReached = () => {
    if (!isFetchingNextPage && hasNextPage) {
      fetchNextPage();
    }
  };

  useEffect(() => {
    const currentUser = groupData?.members.find(
      (member) => member.member.phoneNumber === userState.phoneNumber,
    );
    setcurrentuser(currentUser);
  }, [currentuser]);

  const handleRefresh = () => {
    refetch();
  };

  return (
    <View style={styles.container}>
      <BidChannelHeader item={groupData} />
      <View style={{ flex: 1 }}>
        {!isLoading && (
          <FlatList
            data={data?.pages.flatMap((page) => page.data) || []}
            keyExtractor={(item) => item._id}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                colors={[Color.Blue]}
                refreshing={isLoading}
                onRefresh={handleRefresh}
              />
            }
            renderItem={({ item }) => {
              return (
                <ProjectCard
                  item={item}
                  currentuser={currentuser}
                  refetch={refetch}
                />
              );
            }}
            onEndReachedThreshold={0.5}
            onEndReached={handleEndReached}
            ListFooterComponent={isFetchingNextPage && <ActivityIndicator />}
            snapToInterval={screenWidth} // Snap to the width of the screen
            horizontal
            decelerationRate="fast"
            // contentContainerStyle={{
            //   paddingHorizontal: (screenWidth - screenWidth) / 2,
            // }}
            // initialScrollIndex={currentIndex}
            // onScroll={({ nativeEvent }) => {
            //   const index = Math.ceil(
            //     nativeEvent.contentOffset.x / screenWidth,
            //   );
            //   setCurrentIndex(index);
            // }}
            showsHorizontalScrollIndicator={false}
          />
        )}
      </View>
    </View>
  );
};

export default BiddingChannel;

const styles = StyleSheet.create({
  container: {
    backgroundColor: Color.White,
    flex: 1,
  },
});
