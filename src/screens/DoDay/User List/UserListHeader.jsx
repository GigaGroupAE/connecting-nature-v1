import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useState } from 'react';
import Color from '../../../../assets/colors/Color';
import { AntDesign, Entypo } from 'react-native-vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useUserState } from '../../../slices/userSlice';
import { Portal, Modal } from 'react-native-paper';
import { scale } from 'react-native-size-matters';

const Height = Dimensions.get('screen').height;
const Width = Dimensions.get('screen').width;

const UserListHeader = (props) => {
  const [modalVisible, setModalVisible] = useState(false);
  const navigation = useNavigation();
  const userState = useUserState();

  const handleOrgUser = () => {};
  const hanldeCnUser = () => {
    const doday = { radius: props.campaign.radius };
    const dodayJson = JSON.stringify(doday);
    const volunteersIds = props.campaign.volunteers.map((v) => v.user?._id);
    const campaign = { volunteersIds, campaignId: props.campaign._id };
    const action = 'update';
    navigation.navigate('Invite', { dodayJson, userState, campaign, action });
    setModalVisible(false);
  };

  const hideModal = () => {
    setModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <View
        style={{
          display: 'flex',
          flexDirection: 'row',
          flex: 2,
          alignItems: 'center',
        }}
      >
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <AntDesign
            name="arrowleft"
            size={22}
            color={Color.Black}
            // style={{ alignSelf: "center", alignItems: "center" }}
          />
        </TouchableOpacity>

        <Text style={styles.title}>User List</Text>
      </View>
      <View
        style={{
          flexDirection: 'row',
          flex: 1,
          justifyContent: 'space-between',
        }}
      >
        <Text
          style={{ color: Color.Blue, fontWeight: '600', fontFamily: 'Roboto' }}
        >
          Invite Users
        </Text>
        <Entypo
          name="dots-three-vertical"
          size={18}
          color={Color.Black}
          onPress={() => setModalVisible(true)}
        />
      </View>
      <Portal>
        <Modal
          animationType="fade"
          transparent
          visible={modalVisible}
          onDismiss={hideModal}
          onRequestClose={() => {
            setModalVisible(!modalVisible);
          }}
        >
          <View
            style={{
              backgroundColor: Color.White,
              width: Width * 0.55,
              paddingVertical: Height * 0.02,
              paddingHorizontal: Width * 0.042,
              borderRadius: Height * 0.01,
              elevation: 4,
              position: 'relative',
              top: scale(-270),
              right: scale(-130),
            }}
          >
            <TouchableOpacity onPress={() => hanldeCnUser()}>
              <Text style={styles.ModelTitile}>Invite CN Users</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleOrgUser()}>
              <Text style={styles.ModelTitile}>Invite Organization Users</Text>
            </TouchableOpacity>
          </View>
        </Modal>
      </Portal>
    </View>
  );
};

export default UserListHeader;

const styles = StyleSheet.create({
  container: {
    backgroundColor: Color.White,
    alignContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: 17,
    paddingVertical: 10,
    borderBottomWidth: 2,
    borderColor: Color.VeryLightGrey,
    justifyContent: 'space-between',
  },
  title: {
    color: Color.Black,
    fontSize: 18,
    fontFamily: 'Roboto_600SemiBold',
    marginLeft: 10,
    // marginTop: 2,
    lineHeight: 30,
    textAlignVertical: 'center',
  },
  ModelTitile: {
    fontSize: Height * 0.018,
    fontFamily: 'Roboto_500Medium',
    fontWeight: '500',
    marginVertical: Height * 0.01,
  },
});
