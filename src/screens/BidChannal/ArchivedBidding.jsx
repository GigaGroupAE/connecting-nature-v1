import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React from 'react';
import Color from '../../../assets/colors/Color';
import HeaderNormal from '../../components/HeaderNormal';
import { useInfiniteQuery } from 'react-query';
import { fetchArchiveProjects } from '../../utils/BiddingChannel';
import { screenHeight, screenWidth } from '../../utils/ScreenDimensions';
import {
  buttonContainer,
  buttonTitle,
  titleStyle,
} from '../Decorations/ModalStyle';
import ProjectDetails from '../../components/ProjectDetails';
import WinerSvg from '../../components/SVG/Winner';

const ArchivedBidding = () => {
  const {
    data,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
  } = useInfiniteQuery(
    'bidprojects',
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
              const formattedPrice = Number(
                item?.winner?.bidPrice,
              ).toLocaleString();
              return (
                <View style={styles.itemCard}>
                  <View style={styles.rowContainer}>
                    <Text style={titleStyle}>{item?.ProjectName}</Text>
                    <View style={styles.memberContainer}>
                      <Text style={styles.regularText}>Archived</Text>
                    </View>
                  </View>

                  <ProjectDetails
                    item={item}
                    containerStyle={styles.detailsContainer}
                  />

                  <View style={styles.rowContainer}>
                    <View style={styles.detailsContainer}>
                      <WinerSvg />
                      <Text style={styles.winningTitle}>Bidding Winner</Text>
                    </View>
                    <View>
                      <Text
                        style={{
                          ...styles.winningTitle,
                          fontSize: screenHeight * 0.016,
                        }}
                      >
                        {formattedPrice}PKR
                      </Text>
                    </View>
                  </View>

                  <View style={styles.detailsContainer}>
                    <TouchableOpacity
                      style={{ ...buttonContainer, width: '48%', marginTop: 0 }}
                    >
                      <Text style={buttonTitle}>Download CSV</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={{
                        ...buttonContainer,
                        width: '48%',
                        marginTop: 0,
                        backgroundColor: Color.White,
                        borderWidth: 1,
                      }}
                    >
                      <Text style={{ ...buttonTitle, color: Color.Black }}>
                        Share
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              );
            }}
            onEndReachedThreshold={0.5}
            onEndReached={handleEndReached}
            ListFooterComponent={isFetchingNextPage && <ActivityIndicator />}
            contentContainerStyle={{ gap: 5 }}
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
    gap: 15,
    alignItems: 'center',
    marginVertical: screenHeight * 0.009,
  },
  winningTitle: {
    fontFamily: 'Poppins_700Bold',
    fontSize: screenHeight * 0.015,
  },
});
