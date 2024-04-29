import {
  ActivityIndicator,
  RefreshControl,
  StyleSheet,
  View,
  FlatList,
} from 'react-native';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import Color from '../../../assets/colors/Color';
import { useInfiniteQuery } from 'react-query';
import { fetchBiddingProjects } from '../../utils/BiddingChannel';
import { useUserState } from '../../slices/userSlice';
import { useRoute, useFocusEffect } from '@react-navigation/native';
import BidChannelHeader from '../../components/BidChannelHeader';
import ProjectCard from './ProjectCard';
import { screenWidth } from '../../utils/ScreenDimensions';
import NoDataIndicater from '../NoDataIndicater';
import BiddingChannelHome from '../../components/Skeletns/BiddingChannelHome';

const BiddingChannel = () => {
  const userState = useUserState();
  const { params } = useRoute();
  const groupData = params?.item;
  const firstTimeRef = useRef(true);

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

  useFocusEffect(
    useCallback(() => {
      if (firstTimeRef.current) {
        firstTimeRef.current = false;
        return;
      }

      refetch();
    }, [refetch]),
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
        {!isLoading && data?.pages.flatMap((page) => page.data.length) < 1 && (
          <View style={{ width: '90%', alignSelf: 'center' }}>
            <NoDataIndicater
              title="No Properties Available"
              subTitle="Oh no! It seems there are no properties available for bidding at the moment. Stay tuned for updates or check your notifications for the latest property listings. "
            />
          </View>
        )}

        {isLoading ? (
          <BiddingChannelHome />
        ) : (
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
                  groupData={groupData}
                />
              );
            }}
            onEndReachedThreshold={0.7}
            onEndReached={handleEndReached}
            ListFooterComponent={isFetchingNextPage && <ActivityIndicator />}
            snapToInterval={screenWidth}
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
