//react/native imports
import {
  View,
  Text,
  Image,
  StyleSheet,
  Dimensions,
  StatusBar,
} from 'react-native';
import Btn from '../Btn';
import logo from '../../../assets/cn-icon.png';
import { theme } from '../../../theme';

import { useMutation, useQueryClient } from 'react-query';
import { axiosInstance } from '../../../axiosInstance';
import { screenHeight } from '../../utils/ScreenDimensions';

const mutation = async (params) => {
  let url = `/campaigns/invite-response/${params.campaignId}`;
  const { data } = await axiosInstance.patch(url, {
    status: params.newStatus,
    notificationId: params.notificationId,
    title: params.title,
  });
  return data;
};
const CampaignNotification = ({ data, startAnimation }) => {
  const queryClient = useQueryClient();

  // this function will first make api call to update the volunteer status to either "accepted" or "rejected"
  // then it will make request to change the notification to "campaign-invite-accepted" or "campaign-invite-rejected"
  //the updateNotifications  will force a refetch of notifications
  const inviteHandler = async (newStatus, title) => {
    const r = await InviteHandlerMutation.mutateAsync({
      newStatus,
      title,
      campaignId: data?.data?.content?._id,
      notificationId: data?._id,
    });

    if (r.success) {
      //TODO: REMOVE THE COMMENT FOR THE ANIMATIONS.
      //startAnimation()
    }
  };

  const InviteHandlerMutation = useMutation({
    mutationFn: mutation,
    onSuccess: (data) => {
      queryClient.invalidateQueries(['notifications']);
    },
  });

  return (
    <View style={[styles.notificationCardWrapper]}>
      <View style={styles.cardContentContainer}>
        <Image source={logo} style={styles.avatar} />

        <View style={{ flex: 1, paddingLeft: '5%' }}>
          <Text style={styles.title}>Giga Management</Text>
          <Text
            style={styles.bodyText}
          >{`Invited you to participate  in  ${data.data.content.campaignName}`}</Text>
          {/* //BUTTONS HERE  */}
          <View style={{ flexDirection: 'row' }}>
            <Btn
              backgroundColor={'#DEDEDE'}
              text="Deny"
              textColor="black"
              marginLeft={0}
              marginRight={3}
              onPress={() => {
                inviteHandler('rejected', 'campaign-invite-rejected');
              }}
            />
            <Btn
              backgroundColor={'#4582C3'}
              text="Accept"
              textColor="white"
              marginRight={0}
              marginLeft={3}
              onPress={() => {
                inviteHandler('accepted', 'campaign-invite-accepted');
              }}
            />
          </View>
        </View>
      </View>
    </View>
  );
};

export default CampaignNotification;
const styles = StyleSheet.create({
  notificationCardWrapper: {
    //height: HEIGHT * 0.15,
    paddingBottom: 10,
    borderRadius: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(154, 154, 154, 0.5)',
  },
  cardContentContainer: {
    flex: 1,
    marginTop: '5%',
    flexDirection: 'row',
  },
  title: {
    fontFamily: theme.fonts.family.medium,
    color: '#4582C3',
  },
  bodyText: {
    fontFamily: theme.fonts.family.regular,
    color: 'rgba(112, 112, 112, 0.7)',
    fontSize: screenHeight * 0.0156,
  },
  avatar: {
    height: 60,
    width: 60,
    borderRadius: 60 / 2,
  },
});
