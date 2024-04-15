import {
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  FlatList,
} from 'react-native';
import React, { useState } from 'react';
import Color from '../../../assets/colors/Color';
import HeaderNormal from '../../components/HeaderNormal';
import { axiosInstance } from '../../../axiosInstance';
import { useQuery } from 'react-query';

import { screenHeight, screenWidth } from '../../utils/ScreenDimensions';
import { Portal, Modal } from 'react-native-paper';
import {
  buttonContainer,
  buttonTitle,
  container,
  descriptionTextStyle,
  titleStyle,
} from '../Decorations/ModalStyle';

const fetchNotifications = async () => {
  try {
    const { data } = await axiosInstance.get(
      '/bidChannel/get-crm-notifications',
    );
    return data;
  } catch (error) {
    throw error;
  }
};

const BidddingNotifications = () => {
  const [deniedNotify, setdeniedNotify] = useState(null);
  const [isDeniedOpen, setisDeniedOpen] = useState(false);
  const [title, settitle] = useState('');
  const { data } = useQuery('crm-notify', fetchNotifications);

  return (
    <View style={styles.container}>
      <HeaderNormal title="Notification" />
      <View
        style={{
          flex: 1,
          marginTop: screenHeight * 0.01,
        }}
      >
        <FlatList
          data={data}
          renderItem={({ item }) => {
            return (
              <View style={styles.contentContainer}>
                {item?.data?.title === 'req-denied' && (
                  <Pressable
                    onPress={() => {
                      setisDeniedOpen(true);
                      setdeniedNotify(item);
                      settitle('Subscription Request Denied');
                    }}
                  >
                    <Text style={styles.title}>
                      Your channel subscription has been denied by the Admin
                    </Text>
                  </Pressable>
                )}
                {item?.data?.title === 'property-Rejected' && (
                  <Pressable
                    onPress={() => {
                      setisDeniedOpen(true);
                      setdeniedNotify(item);
                      settitle('Add Property Request Denied');
                    }}
                  >
                    <Text style={styles.title}>
                      Your property has been rejected. Please review the reason
                      provided for the rejection.
                    </Text>
                  </Pressable>
                )}

                {item?.data?.title === 'req-approve' && (
                  <View>
                    <Text style={styles.title}>
                      {item?.body?.content?.description}
                    </Text>
                  </View>
                )}

                {item?.data?.title === 'property-Approved' && (
                  <View>
                    <Text style={styles.title}>
                      {item?.body?.content?.description}
                    </Text>
                  </View>
                )}

                {item?.data?.title === 'New Bid Placed' && (
                  <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                    <Text style={styles.name}>{item?.body?.userCode}</Text>
                    <Text style={{ ...styles.title, paddingHorizontal: 6 }}>
                      has placed bid on
                    </Text>
                    <Text style={styles.name}>{item?.body?.projectTitle}</Text>
                  </View>
                )}
              </View>
            );
          }}
          contentContainerStyle={{
            gap: 10,
          }}
        />
      </View>

      <Portal>
        <Modal visible={isDeniedOpen} onDismiss={() => setisDeniedOpen(false)}>
          <View style={container}>
            <Text style={titleStyle}>{title}</Text>
            <View style={{ width: '90%', alignSelf: 'center' }}>
              <Text style={descriptionTextStyle}>
                {deniedNotify?.body?.content?.description}
              </Text>
            </View>

            <TouchableOpacity
              style={buttonContainer}
              onPress={() => setisDeniedOpen(false)}
            >
              <Text style={buttonTitle}>Okay!</Text>
            </TouchableOpacity>
          </View>
        </Modal>
      </Portal>
    </View>
  );
};

export default BidddingNotifications;

const styles = StyleSheet.create({
  container: {
    backgroundColor: Color.White,
    flex: 1,
  },
  contentContainer: {
    width: screenWidth * 0.92,
    backgroundColor: Color.Disable,
    alignSelf: 'center',
    paddingHorizontal: screenWidth * 0.02,
    paddingVertical: screenHeight * 0.01,
  },
  title: {
    fontFamily: 'Roboto_500Medium',
    fontSize: screenHeight * 0.015,
  },
  name: {
    fontFamily: 'Roboto_700Bold',
    fontSize: screenHeight * 0.015,
  },
});
