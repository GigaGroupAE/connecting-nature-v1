import { axiosInstance } from '../../axiosInstance';
import Constants from 'expo-constants';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

const LIMIT = '30';

export const fetchPosts = async ({ pageParam = 1 }) => {
  const response = await axiosInstance.get(
    `/posts/posts-pagination?page=${pageParam}&limit=${LIMIT}`,
  );
  return response.data;
};
export const fetchStories = async ({ pageParam = 1 }) => {
  const response = await axiosInstance.get(
    `/story/getstories?page=${pageParam}&limit=${LIMIT}`,
  );
  return response.data;
};

export const fetchRecentCampaigns = async () => {
  const response = await axiosInstance.get('/campaigns/mostrecentcampaign');
  return response.data?.campaigns;
};

export const fetchPostsByCampaign = async ({ pageParam = 1, campaignId }) => {
  const response = await axiosInstance.get(
    `/posts/getPostByCampaign/${campaignId}?page=${pageParam}&limit=${LIMIT}`,
  );
  return response.data;
};

export const fetchUserPosts = async ({ userPhoneNumber, pageParam = 1 }) => {
  const response = await axiosInstance.get(
    `/posts/get-user-posts/${userPhoneNumber}?page=${pageParam}`,
  );
  return response.data;
};

export async function registerForPushNotificationsAsync() {
  let token;

  if (Platform.OS === 'android') {
    Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  if (Device.isDevice) {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      alert('Failed to get push token for push notification!');
      return;
    }
    token = await Notifications.getExpoPushTokenAsync({
      projectId: Constants.expoConfig.extra.eas.projectId,
    });
  } else {
    alert('Must use physical device for Push Notifications');
  }

  return token.data;
}

export const fetchUser = async (phoneNumber) => {
  const response = await axiosInstance.get(`/user/get-user/${phoneNumber}`);
  return response.data.user;
};

export const fetchUsersPostCount = async (phoneNumber) => {
  const response = await axiosInstance.get(
    `/posts/getPostCount/${phoneNumber}`,
  );
  return response.data.totalItems;
};

export const getMyChat = async () => {
  const response = await axiosInstance.get('/chat/get-my-chats');
  return response.data.myChats;
};

export const getGroups = async () => {
  const response = await axiosInstance.get('/groups/getgroups');
  return response.data;
};
