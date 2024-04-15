import {
  ActivityIndicator,
  FlatList,
  Platform,
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
import * as Print from 'expo-print';

import * as Sharing from 'expo-sharing';

import ArchivedBiddingSkeletn from '../../components/Skeletns/ArchivedBiddingSkeletn';
import NoDataIndicater from '../NoDataIndicater';

const ArchivedBidding = () => {
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
  // const gigalogo =
  //   'https://thegigamall.com/wp-content/uploads/2021/06/Giga-Mall-World-Trade-Center-Islamabad.png';

  const handleDownload = async (item) => {
    try {
      // Construct HTML content dynamically based on item data
      const htmlContent = `
   <html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Bid Data</title>
   <style>
 body {
    font-family: Arial, sans-serif;
    padding: 0;
    margin: 0;
}

.header {
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    padding-left: 20px;
    padding-right: 30px;
    background-color: rgba(238, 238, 238, 1);

}

.header_logo {
    justify-content: space-between;
    align-items: center;
    display: flex;
}

.company-name {
    font-size: 24px;
    font-weight: bold;
    padding-left: 20px;
    margin: 0; /* Remove default margin */
}

.itemContainer {
    align-items: center;
    margin-bottom: 10px; /* Adjust margin to reduce spacing */
    display: flex;

    width: 600px;
        gap: 10px;
}
.itemContainer > div {
    text-align: center; /* Center text horizontally */
    flex: 1; /* Allow items to grow and shrink as needed */
    display: flex; /* Enable flexbox for the child div */
    flex-direction: row; /* Display items in a row */
    justify-content: center; /* Center items horizontally */
    align-items: center; /* Center items vertically */
}

.itemContainer > div {
    margin-right: 10px; /* Add space between items */
    gap: 10px;
}

.itemContainer h5 {
    margin: 0; /* Remove default margin */
}
table {
    width: 100%;
    border-collapse: collapse;
    margin-bottom: 20px;
     margin-left: 20PX;
margin-right: 20px;
}

th,
td {
    border-bottom: 1px solid #dddddd; /* Only bottom border */
    padding: 8px;
    text-align: left;
}

th {
    background-color: #f2f2f2;
}

    </style>
</head>

<body>
    <div class="header">
        <div class="header_logo">
            <div class="company-name">    <h4>${item?.ProjectName}</h4> </div>
             <h4>GIGA GROUP</h4> 
        </div>

        <div class="itemContainer">
            <div class="">
                <h5>${item?.PropertyType}</h5>
            </div>
            <div>
                <h5>${item?.unit}</h5>
                <h5>Unit</h5>
            </div>
            <div class="">
                <h5>${item?.bedrooms}</h5>
                <h5>Bedroom</h5>
            </div>
        </div>
        <div class="">
            <p>${item?.description}</p>
        </div>

        <div class="header_logo">
            <h4>Starting Bidding Price</h4>
            <h4>${item?.price}PKR</h4>
        </div>
    </div>
    <table>
        <thead>
            <tr>
                <th>Users</th>
                <th>Bidding Call</th>
                <th>Status</th>
            </tr>
        </thead>
        <tbody>
              <tr>
                    <td>${item?.winner?.bidBy[0]?.fullName}</td>
                    <td>${item?.winner?.bidPrice}PKR</td>
                    <td>Winner</td>
                </tr>
          ${item?.bids
            .filter((bid) => bid._id !== item?.winner?._id) // Filter out the winner from the bids
            .map(
              (bid) => `
                    <tr>
                        <td>${bid.bidBy[0].fullName}</td>
                        <td>${bid.bidPrice}PKR</td>
                        <td>N/A</td>
                    </tr>
                `,
            )
            .join('')}
        </tbody>
    </table>
</body>
</html>

            `;

      // Generate PDF file
      const { uri } = await Print.printToFileAsync({
        html: htmlContent,
        width: 612, // 8.5 inch
        height: 792, // 11 inch
      });

      const pdfUri = Platform.OS === 'ios' ? uri : 'file://' + uri; // Adjust URI for Android
      // console.log('PDF URI:', pdfUri);

      // Share PDF file
      await Sharing.shareAsync(pdfUri, {
        mimeType: 'application/pdf',
        dialogTitle: 'Share PDF',
        UTI: 'com.adobe.pdf',
      });
    } catch {
      // console.error('Error generating PDF:', error);
    }
  };

  return (
    <View style={styles.container}>
      <HeaderNormal title="Archived Biddings" />
      <View style={styles.contentContainer}>
        {!isLoading && data?.pages.flatMap((page) => page.data.length) < 1 && (
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
                      style={{
                        ...buttonContainer,
                        width: '48%',
                        marginTop: 0,
                        paddingVertical: screenHeight * 0.012,
                      }}
                      onPress={() => handleDownload(item)}
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
                        paddingVertical: screenHeight * 0.011,
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
    gap: 10,
    alignItems: 'center',
    marginVertical: screenHeight * 0.0062,
  },
  winningTitle: {
    fontFamily: 'Poppins_700Bold',
    fontSize: screenHeight * 0.015,
  },
});
