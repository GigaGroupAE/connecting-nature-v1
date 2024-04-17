import React from 'react';
import { View, StyleSheet, Dimensions, FlatList } from 'react-native';

import Color from '../../../assets/colors/Color';
import HeaderNormal from '../../components/HeaderNormal';

import verification from '../../../assets/verification.png';

import NoItemIndicater from '../../components/NoItemIndicater';
import { axiosInstance } from '../../../axiosInstance';
import { useQuery } from 'react-query';
import ArchivedCampaignSkelentan from '../../components/Skeletns/ArchivedCampaignSkelentan';
import VerificationUsersDetials from '../../components/VerificationUsersDetials';

const height = Dimensions.get('screen').height;
const width = Dimensions.get('screen').width;

const fetchRequests = async () => {
  try {
    const { data } = await axiosInstance.get('/upgradeRequests/getAllRequests');
    return data;
  } catch (error) {
    throw error;
  }
};

const UserList = () => {
  const { data, isLoading, refetch } = useQuery(
    'verificationRequest',
    fetchRequests,
  );

  return (
    <View style={styles.container}>
      <HeaderNormal title="Verification Request" />
      {isLoading && <ArchivedCampaignSkelentan />}
      {!isLoading && data?.requests?.length === 0 ? (
        <NoItemIndicater
          title="No Verification Request Received Yet!"
          description="There are no verification request received yet. Once you received the requests it will be listed in this section."
          image={verification}
        />
      ) : (
        <View>
          <FlatList
            data={data?.requests}
            renderItem={({ item }) => {
              return <VerificationUsersDetials item={item} refetch={refetch} />;
            }}
            keyExtractor={(item) => item._id}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Color.White,
  },
  userContainer: {
    // marginVertical: 16,
    backgroundColor: Color.White,
    borderRadius: 8,
    // shadowColor: Color.DarkGrey,
    // shadowOffset: {
    //   width: 0,
    //   height: 4,
    // },
    // shadowOpacity: 1,
    // shadowRadius: 2.65,
    // elevation: 2,
    height: height * 0.09,
    zIndex: 100,
    // marginVertical: height * 0.005,
    marginHorizontal: width * 0.003,
    borderBottomWidth: 0.7,
    borderColor: Color.LightGrey,
    // paddingVertical: 16,
    // marginVertical: 10,
  },
  user: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    // backgroundColor: "red",
    // paddingVertical: 10,
  },
  userImage: {
    width: 45,
    height: 45,
    borderRadius: 23,
    marginRight: 10,
    position: 'absolute',
    top: 10,
    left: 10,
  },
  userName: {
    fontWeight: 'bold',
    fontSize: 15,
    color: Color.DarkGrey,
    flexWrap: 'wrap',
    fontFamily: 'Roboto_700Bold',
  },
  UserRole: {
    fontWeight: 'bold',
    fontSize: 12,
    left: 15,
    color: Color.Blue,
    fontFamily: 'Roboto_400Regular',
  },
  request: {
    fontSize: 12,
    position: 'absolute',
    left: 65,
    top: 35,
    color: Color.Grey,
    fontFamily: 'Roboto_400Regular',
  },

  productsContainer: {
    marginTop: 6,
    backgroundColor: Color.White,
    shadowColor: Color.DarkGrey,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2.65,
    elevation: 4,
    height: height * 0.18,
    borderRadius: 8,
    marginBottom: 10,
  },
  expandArrow: {
    position: 'absolute',
    right: 10,
    top: 25,
    borderRadius: 8,
  },
  sectionTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 10,
  },
  UserAccounts: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  AccountLink: {
    fontSize: 13,
    color: Color.Blue,
    fontWeight: '500',
    width: '83%',
    paddingHorizontal: width * 0.02,
    fontFamily: 'Roboto_500Medium',
  },
  VisitBtn: {
    position: 'absolute',
    right: 10,
    top: 10,
    color: Color.Grey,
    fontSize: 12,
    fontWeight: '500',
    fontFamily: 'Roboto_500Medium',
  },
  btn: {
    fontSize: 13,
    fontFamily: 'Roboto_500Medium',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    borderRadius: 8,
    alignItems: 'center',
    backgroundColor: Color.White,
    shadowColor: Color.DarkGrey,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.6,
    shadowRadius: 2.65,
    elevation: 4,
    width: width * 0.9,
    height: height * 0.37,
  },
  noRequestContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  noRequestTitle: {
    fontSize: height * 0.022,
    fontFamily: 'Roboto_400Regular',
  },
  heading: {
    fontFamily: 'Roboto_700Bold',
    color: Color.DarkGrey,
    fontSize: height * 0.019,
    paddingVertical: height * 0.01,
  },
  subHeading: {
    fontFamily: 'Roboto_500Medium',
    color: Color.DarkGrey,
    fontSize: height * 0.016,
  },
  bellIcon: {
    width: width * 0.4,
    height: height * 0.18,
    resizeMode: 'contain',
  },
  button: {
    backgroundColor: Color.Blue,
    marginTop: height * 0.05,
    paddingHorizontal: width * 0.06,
    paddingVertical: height * 0.013,
    borderRadius: height * 0.01,
  },
  buttonTitle: {
    fontFamily: 'Roboto_600SemiBold',
    color: Color.White,
    fontSize: height * 0.02,
  },
  approveBtnContainer: {
    width: '33%',
    alignItems: 'center',
    paddingVertical: height * 0.01,
    borderRadius: height * 0.01,
  },
  adminIcon: {
    marginLeft: 5,
    alignSelf: 'center',
    fontSize: height * 0.018,
    color: Color.Blue,
  },
});
export default UserList;
