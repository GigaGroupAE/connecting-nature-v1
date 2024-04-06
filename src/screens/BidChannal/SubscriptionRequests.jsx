import { Pressable, StyleSheet, Text, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import Color from '../../../assets/colors/Color';
import HeaderNormal from '../../components/HeaderNormal';
import { useQuery } from 'react-query';
import { getscriptonReq } from '../../utils/BiddingChannel';
import { screenHeight, screenWidth } from '../../utils/ScreenDimensions';
import PendingSubscriptions from '../../components/PendingSubscriptions';
import ApprovedSubscriptions from '../../components/ApprovedSubscriptions';

const SubscriptionRequests = () => {
  const [activeTab, setactiveTab] = useState('Pending');
  const { data, refetch, isLoading } = useQuery('subreq', getscriptonReq);
  const [requests, setrequests] = useState([]);

  const handleApprove = () => {
    setactiveTab('Approved');
    const reqdata = data?.requests?.filter(
      (item) => item?.status === 'approve',
    );

    setrequests(reqdata);
  };

  const handlePending = () => {
    setactiveTab('Pending');
    const reqdata = data?.requests?.filter(
      (item) => item?.status === 'Pending',
    );
    setrequests(reqdata);
  };

  useEffect(() => {
    if (!isLoading && data) {
      const reqdata = data?.requests?.filter(
        (item) => item?.status === 'Pending',
      );
      setrequests(reqdata);
    }
  }, [data]);

  return (
    <View style={styles.container}>
      <HeaderNormal title="Subscription Requests" />
      <View style={styles.header}>
        <Pressable
          onPress={handlePending}
          style={
            activeTab === 'Pending' ? styles.ativeTab : styles.leftContainer
          }
        >
          <Text style={styles.title}>Pending</Text>
        </Pressable>
        <Pressable
          style={
            activeTab === 'Approved' ? styles.ativeTab : styles.leftContainer
          }
          onPress={handleApprove}
        >
          <Text style={styles.title}>Approved</Text>
        </Pressable>
      </View>
      {activeTab === 'Pending' && (
        <PendingSubscriptions item={requests} refetch={refetch} />
      )}
      {activeTab == 'Approved' && (
        <ApprovedSubscriptions item={requests} refetch={refetch} />
      )}
    </View>
  );
};

export default SubscriptionRequests;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Color.White,
  },
  header: {
    flexDirection: 'row',
  },
  leftContainer: {
    flex: 1,
    paddingVertical: screenHeight * 0.015,
    paddingHorizontal: screenWidth * 0.02,
  },
  RightContainer: {
    // backgroundColor: 'yellow',
    flex: 1,
    paddingVertical: screenHeight * 0.015,
    paddingHorizontal: screenWidth * 0.02,
  },
  title: {
    fontFamily: 'Roboto_700Bold',
    fontSize: screenHeight * 0.016,
  },
  ativeTab: {
    flex: 1,
    paddingVertical: screenHeight * 0.015,
    borderBottomWidth: 1,
    // paddingHorizontal: screenWidth * 0.02,
    alignItems: 'center',
  },
});
