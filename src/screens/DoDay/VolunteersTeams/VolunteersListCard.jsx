import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  View,
  Pressable,
  TouchableOpacity,
} from 'react-native';

import React, { useEffect, useState } from 'react';
import Color from '../../../../assets/colors/Color';
import { Entypo } from 'react-native-vector-icons';
import { BASE_URL } from '../../../../CONSTANTS';
import { axiosInstance } from '../../../../axiosInstance';
import { useStateContext } from '../../../contexts/ContextProvider';
import { Portal, Modal } from 'react-native-paper';
import { scale } from 'react-native-size-matters';

const Height = Dimensions.get('screen').height;
const Width = Dimensions.get('screen').width;

const VolunteersListCard = ({ data }) => {
  const [userData, setUserData] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);

  const { activeCampaign, setActiveCampaign, setLoading } = useStateContext();

  const moveToTeam = async (teamName, volunteer) => {
    try {
      setLoading(true);
      const { data } = await axiosInstance.patch(
        `/campaigns/add-volunteer/${activeCampaign._id}`,
        { teamName, volunteer },
      );
      setActiveCampaign(data?.updatedCampaign);
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  useEffect(() => {
    setUserData(data);
  }, []);

  const handleHideModal = () => {
    setModalVisible(false);
  };

  return (
    <View>
      <View style={styles.container}>
        <View style={styles.contentContainer}>
          <View
            style={{
              width: Width * 0.16,
              paddingVertical: Height * 0.005,
            }}
          >
            <Image
              source={{ uri: `${BASE_URL}/images/${data?.user?.profile}` }}
              style={styles.userImg}
            />
          </View>
          <View
            style={{
              width: Width * 0.56,
            }}
          >
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
              }}
            >
              <Text style={styles.userName}>{data?.user?.fullName}</Text>
              <Text style={styles.userRole}>{data?.user?.type}</Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
              }}
            >
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  width: Width * 0.2,
                  justifyContent: 'space-between',
                }}
              >
                <Text style={styles.pts}>pts</Text>
                <Text style={styles.points}>{data?.user?.points}</Text>
                <Text style={{ marginBottom: Height * 0.01 }}>.</Text>
              </View>
              <Text style={styles.invitation}>Accepted Invitation</Text>
            </View>
          </View>
          <View style={{ marginLeft: Width * 0.13 }}>
            <Pressable onPress={() => setModalVisible(!modalVisible)}>
              <Entypo name="dots-three-vertical" size={18} />
            </Pressable>
          </View>
        </View>

        <Portal>
          <Modal
            animationType="slide"
            transparent
            visible={modalVisible}
            onDismiss={handleHideModal}
            onRequestClose={() => {
              setModalVisible(!modalVisible);
            }}
          >
            <View style={styles.model}>
              <View>
                <TouchableOpacity
                  onPress={() => moveToTeam('teamA', data?.user?._id)}
                >
                  <Text style={styles.moveTeam}>Move to Team A</Text>
                </TouchableOpacity>
              </View>
              <View>
                <TouchableOpacity
                  onPress={() => moveToTeam('teamB', data?.user?._id)}
                  style={{ paddingVertical: Height * 0.01 }}
                >
                  <Text style={styles.moveTeam}>Move to Team B</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        </Portal>
      </View>
    </View>
  );
};

export default VolunteersListCard;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginVertical: Height * 0.009,

    backgroundColor: Color.White,
    borderRadius: 8,
    shadowColor: Color.Grey,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
    elevation: 2,
    justifyContent: 'space-between',
    width: '95%',
    alignSelf: 'center',
    // zIndex: 0,
  },
  contentContainer: {
    flexDirection: 'row',
    paddingVertical: Height * 0.007,
    alignContent: 'center',
    marginLeft: Width * 0.03,
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  userImg: {
    borderRadius: Height * 0.1,
    resizeMode: 'contain',
    width: 50,
    height: 50,
  },
  userName: {
    fontFamily: 'Roboto',
    fontSize: 14,
    fontWeight: '600',
  },
  userRole: {
    marginLeft: Width * 0.02,
    fontFamily: 'Roboto_500Medium',
    color: Color.Blue,
    // marginTop: "-1.5%",
    fontSize: 10,
    alignSelf: 'center',
  },
  userPoints: {
    position: 'absolute',
    left: Width * 0.43,
    alignSelf: 'center',

    fontFamily: 'Roboto',
    fontSize: 10,
  },
  pts: {
    color: Color.Black,
    fontFamily: 'Roboto',
    fontWeight: '500',
  },
  points: {
    color: Color.Black,
    fontFamily: 'Roboto',
    fontWeight: '900',
    fontSize: 14,
  },
  btnContainer: {
    alignSelf: 'center',
    marginRight: Width * 0.03,
  },
  btn: {
    textAlign: 'center',
    color: Color.White,
    fontFamily: 'Roboto_600SemiBold',
    paddingHorizontal: Width * 0.07,
    paddingVertical: Height * 0.0055,
    backgroundColor: Color.Blue,
    borderRadius: 8,
  },
  invitation: {
    fontFamily: 'Roboto',
    fontSize: 12,
    fontWeight: '500',
    marginLeft: Width * 0.02,
    color: Color.DarkGrey,
  },
  modelTitle: {
    fontSize: Height * 0.018,
    fontFamily: 'Roboto_500Medium',
    color: Color.DarkGrey,
  },
  model: {
    backgroundColor: 'white',
    borderRadius: Height * 0.01,
    paddingVertical: scale(15),
    paddingHorizontal: scale(15),
    zIndex: 1,
    width: Width * 0.8,
    alignSelf: 'center',
    backgroundColor: Color.White,
    borderRadius: 8,
    shadowColor: Color.Grey,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
    elevation: 2,
    paddingHorizontal: Width * 0.02,
    justifyContent: 'space-evenly',
  },
  moveTeam: {
    fontFamily: 'Roboto_500Medium',
    fontSize: scale(14),
    paddingVertical: scale(5),
    paddingHorizontal: scale(10),
  },
});
