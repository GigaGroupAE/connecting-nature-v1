//

import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  SafeAreaView,
  Dimensions,
  Alert,
} from 'react-native';
import HeaderNormal from '../../components/HeaderNormal';
import Color from '../../../assets/colors/Color';
import { useUserState } from '../../slices/userSlice';

import { BASE_URL } from '../../../CONSTANTS';
import { useStateContext } from '../../contexts/ContextProvider';
import Icon from '../../../assets/BlockedUserIcon.png';

const height = Dimensions.get('screen').height;
const width = Dimensions.get('screen').width;

//axios instance
import { axiosInstance } from '../../../axiosInstance';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import CustomStatsBar from '../../components/CustomStatsBar';
//react query

// TODO : ADD SOME UI IF THERE IS NO BLOCKED USER

const fetchBlockedUsers = async () => {
  const { data } = await axiosInstance.get('/user/get-blockedUsers');
  return data;
};
const unblockMutationFn = async (id) => {
  const { data } = await axiosInstance.patch(`/user/unblock-user/${id}`);
  return data;
};
const BlockedUsers = () => {
  const queryClient = useQueryClient();
  const {
    data: rqData,
    isLoading: rqIsLoading,
    error: rqError,
  } = useQuery({
    queryKey: ['BlockedUsers'],
    queryFn: fetchBlockedUsers,
    staleTime: 1000 * 10, //data will go stale after 10 secs
  });
  const unblockUserMutation = useMutation({
    mutationFn: unblockMutationFn,
    onSuccess: (data) => {
      queryClient.invalidateQueries(['BlockedUsers']);
    },
  });
  const navigation = useNavigation();

  const { setLoading } = useStateContext();

  if (rqIsLoading)
    return (
      <ActivityIndicator
        style={{ position: 'absolute', bottom: '20%', left: '48%' }}
        size={'large'}
        color={Color.Blue}
      />
    );

  if (rqError) {
    console.log('error is ', rqError);
    Alert.alert('error', rqError.data);
    return;
  }

  const handlePress = async (id) => {
    console.log('unblock pressed');
    try {
      setLoading(true);
      await unblockUserMutation.mutateAsync(id);
      setLoading(false);
    } catch (error) {
      console.log('error while pressing unblock button is  ', error);
      setLoading(false);
    }
  };

  const renderItem = ({ item }) => {
    return (
      <View style={styles.container}>
        <Image
          source={{ uri: `${item.profile}` }}
          style={styles.profilePicture}
        />
        <View style={styles.userInfo}>
          <Text style={styles.name}>{item.fullName}</Text>
          {/* <Text style={styles.location}>{item.location}</Text> */}
        </View>
        <TouchableOpacity
          style={styles.addButton}
          disabled={unblockUserMutation.isLoading}
          onPress={() => handlePress(item._id)}
        >
          <Text style={styles.buttonText}>Unblock</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <SafeAreaProvider>
      <CustomStatsBar backgroundColor={Color.White} />
      <View style={{ flex: 1 }}>
        <HeaderNormal title="Blocked Users" />
        <View style={{ backgroundColor: Color.White, height: '100%' }}>
          {rqData?.user?.blockedUsers?.length === 0 ? (
            <View
              style={{
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <View
                style={{
                  alignItems: 'center',
                  marginBottom: height * 0.18,
                  // flex: 1,
                }}
              >
                <Image source={Icon} style={styles.bellIcon} />
                <Text style={styles.heading}>No Blocked Users Currently</Text>
                <Text style={styles.subHeading}>
                  There are no users on your blocked list
                </Text>
                <Text style={styles.subHeading}>at the moment .</Text>
                <TouchableOpacity
                  style={styles.button}
                  onPress={() => navigation.navigate('SearchScreen')}
                >
                  <Text style={styles.buttonTitle}>Find Friends</Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <FlatList
              data={rqData?.user?.blockedUsers}
              renderItem={renderItem}
              keyExtractor={(item) => item._id}
            />
          )}
        </View>
      </View>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 13,
    paddingHorizontal: 20,
    // backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    backgroundColor: Color.White,
  },
  profilePicture: {
    width: width * 0.15,
    height: height * 0.07,
    borderRadius: 30,
    marginRight: 18,
    resizeMode: 'cover',
  },
  userInfo: {
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#707070',
  },
  location: {
    fontSize: 14,
    color: '#666',
  },
  addButton: {
    // backgroundColor: "#3b5998",
    backgroundColor: Color.Blue,
    paddingHorizontal: 15,
    paddingVertical: 7,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  emptyContanier: {
    alignItems: 'center',
    justifyContent: 'center',
    height: height * 0.9,
    backgroundColor: Color.White,
  },
  emptyTitle: {
    fontFamily: 'Roboto_500Medium',
    fontSize: height * 0.022,
  },
  heading: {
    fontFamily: 'Roboto_700Bold',
    color: Color.Black,
    fontSize: height * 0.019,
    paddingVertical: height * 0.01,
  },
  subHeading: {
    fontFamily: 'Roboto_500Medium',
    color: Color.Black,
    fontSize: height * 0.016,
  },
  bellIcon: {
    width: width * 0.25,
    height: height * 0.15,
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
});

export default BlockedUsers;
