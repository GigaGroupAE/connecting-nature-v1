import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React from 'react';
import Color from '../../../assets/colors/Color';
import HeaderNormal from '../../components/HeaderNormal';
import { useInfiniteQuery } from 'react-query';
import { fetchArchiveProjects } from '../../utils/BiddingChannel';
import { screenHeight, screenWidth } from '../../utils/ScreenDimensions';
import { titleStyle } from '../Decorations/ModalStyle';

import ArchivedBiddingSkeletn from '../../components/Skeletns/ArchivedBiddingSkeletn';
import NoDataIndicater from '../NoDataIndicater';
import DownloadBidding from '../../components/DownloadBidding';
import { useRoute } from '@react-navigation/native';

const ArchivedBidding = () => {
  const { params } = useRoute();

  const {
    data,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
  } = useInfiniteQuery(
    'archivedProject',
    ({ pageParam = 1 }) => fetchArchiveProjects({ pageParam }),
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

  const handleRefresh = () => {
    refetch();
  };

  const handleEndReached = () => {
    if (!isFetchingNextPage && hasNextPage) {
      fetchNextPage();
    }
  };

  return (
    <View style={styles.container}>
      <HeaderNormal title="Archived Biddings" />
      <View style={styles.contentContainer}>
        {!isLoading &&
          data?.pages?.flatMap((page) => page?.data?.length) < 1 && (
            <View style={{ width: '90%', alignSelf: 'center' }}>
              <NoDataIndicater
                title="No Archived Properties"
                subTitle="There are no archived properties available at the moment. Please check back later for archived property listings."
              />
            </View>
          )}
        {isLoading ? (
          <View>
            <ArchivedBiddingSkeletn />
          </View>
        ) : (
          <FlatList
            data={(data?.pages?.flatMap((page) => page.data) || []).reverse()}
            keyExtractor={(item) => item?._id}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                colors={[Color.Blue]}
                refreshing={isLoading}
                onRefresh={handleRefresh}
              />
            }
            renderItem={({ item }) => {
              // const formattedPrice = Number(
              //   item?.winner?.bidPrice,
              // ).toLocaleString();

              return (
                <View style={styles.itemCard}>
                  <View style={styles.rowContainer}>
                    <Text style={titleStyle}>{item?.projectName}</Text>
                    {/* <View style={styles.memberContainer}>
                      <Text style={styles.regularText}>Archived</Text>
                    </View> */}
                  </View>

                  {/* <ProjectDetails
                    item={item}
                    containerStyle={styles.detailsContainer}
                  /> */}

                  <View style={styles.rowContainer}>
                    {/* <View style={styles.detailsContainer}>
                      <WinerSvg />
                      <Text style={styles.winningTitle}>Bidding Winner</Text>
                    </View> */}
                    {/* <View>
                      <Text
                        style={{
                          ...styles.winningTitle,
                          fontSize: screenHeight * 0.016,
                        }}
                      >
                        {formattedPrice}PKR
                      </Text>
                    </View> */}
                  </View>

                  <View style={styles.detailsContainer}>
                    <DownloadBidding
                      item={item}
                      currentUser={params?.user}
                      title="Download CSV"
                    />
                  </View>
                </View>
              );
            }}
            onEndReachedThreshold={0.8}
            onEndReached={handleEndReached}
            ListFooterComponent={isFetchingNextPage && <ActivityIndicator />}
            contentContainerStyle={{
              gap: 5,
              flex: 1,
            }}
          />
        )}
      </View>
    </View>
  );
};

export default ArchivedBidding;

const styles = StyleSheet.create({
  container: {
    backgroundColor: Color.White,
    flex: 1,
  },
  contentContainer: {
    flex: 1,
    width: '95%',
    alignSelf: 'center',
  },
  itemCard: {
    borderRadius: 8,
    width: '98%',
    marginTop: 16,
    backgroundColor: Color.White,
    shadowColor: Color.Grey,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
    elevation: 3,
    zIndex: 1000,
    position: 'relative',
    paddingHorizontal: screenWidth * 0.04,
    paddingVertical: screenHeight * 0.009,
    alignSelf: 'center',
  },
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  memberContainer: {
    backgroundColor: Color.Disable,
    paddingVertical: screenHeight * 0.005,
    paddingHorizontal: screenWidth * 0.04,
    borderRadius: screenHeight * 0.01,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    justifyContent: 'space-between',
  },

  regularText: {
    fontFamily: 'Poppins_400Regular',
    fontSize: screenHeight * 0.014,
  },
  detailsContainer: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
    marginVertical: screenHeight * 0.0062,
    marginTop: screenHeight * 0.015,
  },
  winningTitle: {
    fontFamily: 'Poppins_700Bold',
    fontSize: screenHeight * 0.015,
  },
});
