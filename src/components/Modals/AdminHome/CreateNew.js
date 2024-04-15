import * as React from 'react';
import { View, Text, StyleSheet, Pressable, Dimensions } from 'react-native';
import { Modal, Portal, Provider } from 'react-native-paper';
import { Entypo } from 'react-native-vector-icons';
import Color from '../../../../assets/colors/Color';
import { useNavigation } from '@react-navigation/native';
import { useUserState } from '../../../slices/userSlice';

const Height = Dimensions.get('screen').height;
const Width = Dimensions.get('screen').width;

const CreateNew = (props) => {
  const navigation = useNavigation();
  const userState = useUserState();

  const handleGroupNavigation = () => {
    navigation.navigate('CreateGroup');
    props.hideModal();
  };

  const handleCampaignNavigation = () => {
    navigation.navigate('CreateDoDay');
    props.hideModal();
  };

  return (
    <Provider>
      <Portal>
        <Modal
          visible={props.visible}
          onDismiss={props.hideModal}
          contentContainerStyle={props.containerStyle}
          animationType="slide"
        >
          {/* <Text>Example Modal. Click outside this area to dismiss.</Text> */}
          <View>{/* <Text>New Chat</Text> */}</View>

          <Pressable
            android_ripple={{ color: Color.LightGrey }}
            style={[styles.buttonWrapper]}
            onPress={() => handleGroupNavigation()}
          >
            <View>
              <Text style={styles.title}>Create New Group</Text>
              <Text style={styles.subTitle}>Create Group and invite users</Text>
            </View>
            <Entypo name="chevron-right" style={styles.icon} />
          </Pressable>
          {userState.type === 'Admin' && (
            <Pressable
              android_ripple={{ color: Color.LightGrey }}
              style={[styles.buttonWrapper]}
              onPress={() => handleCampaignNavigation()}
            >
              <View>
                <Text style={styles.title}>Create New Campaign</Text>
                <Text style={styles.subTitle}>
                  Create Do-Day and invite volunteers
                </Text>
              </View>
              <Entypo name="chevron-right" style={styles.icon} />
            </Pressable>
          )}

          {/* temporary comment  till  next update  */}

          {/* <Pressable
            android_ripple={{ color: Color.LightGrey }}
            style={[styles.buttonWrapper]}
          >
            <View>
              <Text style={styles.title}>New Chat</Text>
              <Text style={styles.subTitle}>
                Select user from the contact list
              </Text>
            </View>
            <Entypo name="chevron-right" style={styles.icon} />
          </Pressable> */}
        </Modal>
      </Portal>
    </Provider>
  );
};

const styles = StyleSheet.create({
  subTitle: {
    color: Color.Grey,
    fontFamily: 'Roboto_400Regular',
    fontSize: Height * 0.017,
  },
  title: {
    color: Color.Black,
    fontFamily: 'Roboto_600SemiBold',
    width: '100%',
    fontWeight: '600',
    fontSize: Height * 0.02,
  },
  buttonWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Width * 0.06,
    paddingVertical: Height * 0.015,
  },
  icon: {
    position: 'absolute',
    right: Width * 0.045,
    color: Color.Black,
    fontSize: Height * 0.028,
  },
});

export default CreateNew;
