import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import GroupMembersList from './GroupMembersList';
import { useUserState } from '../slices/userSlice';
import { scale } from 'react-native-size-matters';
import Color from '../../assets/colors/Color';
import { screenHeight } from '../utils/ScreenDimensions';
import { Modal, Portal } from 'react-native-paper';
import {
  container,
  titleStyle,
  buttonContainer,
  buttonTitle,
  descriptionTextStyle,
} from '../screens/Decorations/ModalStyle';

import { checkAlreadySubReq } from '../utils/BiddingChannel';
import { useNavigation } from '@react-navigation/native';
import { useStateContext } from '../contexts/ContextProvider';
import ChannelSubscriptionModal from './ChannelSubscriptionModal';
import AddPropertyModal from './AddPropertyModal';

const approvedRoles = ['Owner', 'Lead'];

const BiddingGroup = ({ item }) => {
  const { navigate } = useNavigation();
  const userState = useUserState();
  const [isAddProperty, setisAddProperty] = useState(false);
  const [currentMember, setcurrentMember] = useState(false);
  const [isSubscriptionModal, setisSubscriptionModal] = useState(false);
  const { setbiddingChannel } = useStateContext();
  const [showPendingModal, setshowPendingModal] = useState(false);
  const [isUserMember, setisUserMember] = useState(null);

  useEffect(() => {
    const currentUser = item.members.find(
      (member) => member.member.phoneNumber === userState.phoneNumber,
    );
    if (currentUser) {
      setisUserMember(currentUser);
      const role = approvedRoles.includes(currentUser?.privilege);
      setcurrentMember(role);
    }
  }, [currentMember]);

  const handleNavigation = async (item) => {
    if (isUserMember) {
      navigate('BidChannal', { item: item });
      setbiddingChannel(item);
    } else {
      try {
        const data = await checkAlreadySubReq();

        if (data?.message === 'Pending') {
          setshowPendingModal(true);
        } else if (data?.message === 'NotExists.') {
          setisSubscriptionModal(true);
        }
      } catch {}
    }
  };

  return (
    <View
      style={{
        width: '95%',
        alignSelf: 'center',
      }}
    >
      <TouchableOpacity
        style={styles.enterChat}
        // onPress={() => {
        //   navigate('BidChannal', { item: item });
        //   setbiddingChannel(item);
        // }}

        onPress={() => handleNavigation(item)}
      >
        <Text style={styles.buttonTitle}>Enter to Channel</Text>
      </TouchableOpacity>

      {currentMember && (
        <View>
          <View
            style={{
              marginVertical: scale(10),
            }}
          >
            <GroupMembersList group={item} />
          </View>

          <TouchableOpacity
            style={styles.enterChat}
            onPress={() => setisAddProperty(true)}
          >
            <Text style={styles.buttonTitle}>Add Property</Text>
          </TouchableOpacity>
        </View>
      )}

      <AddPropertyModal
        item={item}
        isVisible={isAddProperty}
        setisVisible={setisAddProperty}
      />

      <ChannelSubscriptionModal
        isVisible={isSubscriptionModal}
        setisVisible={setisSubscriptionModal}
      />

      <Portal>
        <Modal
          visible={showPendingModal}
          onDismiss={() => setshowPendingModal(false)}
        >
          <View style={container}>
            <Text style={titleStyle}>Subscription Request</Text>
            <View style={{ width: '92%' }}>
              <Text style={descriptionTextStyle}>
                Thank you for your interest! Your subscription request for this
                channel has already been submitted and is currently under review
                by our team. We appreciate your patience and will notify you
                once your request has been processed.
              </Text>

              <TouchableOpacity
                style={{ ...buttonContainer, width: '100%' }}
                onPress={() => setshowPendingModal(false)}
              >
                <Text style={buttonTitle}>Okay!</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </Portal>
    </View>
  );
};

export default BiddingGroup;

const styles = StyleSheet.create({
  enterChat: {
    backgroundColor: 'rgba(0, 123, 255, 0.1)',
    alignItems: 'center',
    width: '100%',
    alignSelf: 'center',
    height: scale(40),
    justifyContent: 'center',
    borderRadius: scale(8),
    borderWidth: 1,
    borderColor: 'rgba(0, 123, 255, 1)',
  },
  buttonTitle: {
    color: Color.Blue,
    fontSize: screenHeight * 0.018,
    fontFamily: 'Roboto_700Bold',
  },
  titleStyle: {
    color: 'black',
    fontFamily: 'Roboto_700Bold',
    fontSize: screenHeight * 0.018,
  },
  title: {
    fontFamily: 'Roboto_500Medium',
    fontSize: screenHeight * 0.015,
    borderBottomWidth: 1,
    borderBottomColor: Color.VeryLightGrey,
    paddingVertical: '2%',
  },
});
