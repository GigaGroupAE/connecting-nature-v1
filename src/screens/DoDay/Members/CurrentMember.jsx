import {
  Dimensions,
  Image,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useState } from 'react';
import Color from '../../../../assets/colors/Color';
import { RadioButton } from 'react-native-paper';
import { BASE_URL } from '../../../../CONSTANTS';
import { useUserState } from '../../../slices/userSlice';
import { axiosInstance } from '../../../../axiosInstance';
import { useStateContext } from '../../../contexts/ContextProvider';

const Height = Dimensions.get('screen').height;
const Width = Dimensions.get('screen').width;
const ALLOWED_ROLES = ['Owner']; // only owner can add or remove members

const CurrentMember = (props) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [addModal, setaddModal] = useState(false);
  const [checked, setChecked] = useState('Member');
  const userState = useUserState();

  const { group, setgroup, setLoading, currentUserprivilege, loading } =
    useStateContext();

  const isCurrentUserAllowed = ALLOWED_ROLES.includes(currentUserprivilege);

  const handleDelete = async () => {
    try {
      setLoading(true);
      const { data } = await axiosInstance.patch(
        `/groups/remove-member/${group._id}`,
        { memberId: props.data._id },
      );
      setgroup(data.group);
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };
  const handleCancel = () => {
    setModalVisible(false);
  };

  const handleAddUser = async () => {
    try {
      setLoading(true);
      const newUser = { member: props.data._id, privilege: checked };
      const { data } = await axiosInstance.patch(
        `/groups/add-member/${group._id}`,
        { newMember: newUser },
      );
      setgroup(data.group);
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  const username =
    props?.data?.fullName.length > 10
      ? props?.data?.fullName.slice(0, 13) + '...'
      : props?.data?.fullName;

  return (
    <View style={styles.container}>
      <View style={styles.contentContainer}>
        <Image
          source={{ uri: `${props.data?.profile}` }}
          style={styles.userImg}
        />
        <View
          style={{
            marginTop: Height * 0.008,
            flex: 0,
            alignSelf: 'center',
          }}
        >
          <Text style={styles.userName}>
            {userState.id === props.data?._id ? 'You' : username}
          </Text>
          <Text style={styles.userRole}>Volunteer</Text>
        </View>
      </View>

      <View style={styles.btnContainer}>
        {props?.CurrentPage === 'Team B' && !loading ? (
          <TouchableOpacity
            //   disabled={props.data.status !== "invite" || loading}
            onPress={() => setaddModal(!addModal)}
          >
            {isCurrentUserAllowed && <Text style={styles.pressed}>Add</Text>}
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            //   disabled={props.data.status !== "invite" || loading}
            onPress={() => {
              setModalVisible(!modalVisible);
            }}
          >
            {/* {} */}
            {userState.id !== props.data?._id &&
              isCurrentUserAllowed &&
              !loading && <Text style={styles.pressed}>Remove</Text>}
          </TouchableOpacity>
        )}
      </View>
      <Modal
        animationType="slide"
        transparent
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.ConfrmModel}>
          <View>
            <Text
              style={{
                fontFamily: 'Roboto_400Regular',
                fontWeight: '400',
                fontSize: Height * 0.0175,
              }}
            >
              Do you really want to Remove the User
            </Text>
          </View>
          <View style={styles.model}>
            <TouchableOpacity onPress={() => handleDelete()}>
              <Text style={styles.btn}>Yes Remove</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleCancel()}>
              <Text
                style={{
                  ...styles.btn,
                  backgroundColor: Color.White,
                  color: Color.Black,
                  borderWidth: 1,
                }}
              >
                No, Cancel
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <Modal
        animationType="slide"
        transparent
        visible={addModal}
        onRequestClose={() => {
          setaddModal(!addModal);
        }}
      >
        <View style={{ ...styles.ConfrmModel, flex: 0.5 }}>
          <View>
            <Text style={styles.points}>Add For the role of</Text>
          </View>
          <View
            style={{
              flexDirection: 'row',
              width: Width * 0.9,
              alignSelf: 'center',
              justifyContent: 'space-around',
              marginVertical: Height * 0.014,
            }}
          >
            <View style={{ ...styles.bodyContainer, width: '45%' }}>
              <View style={styles.upgradReq}>
                <Text style={styles.reqText}>co-lead</Text>
                <TouchableOpacity>
                  <RadioButton
                    value="teamA"
                    status={checked === 'Co-Lead' ? 'checked' : 'unchecked'}
                    onPress={() => setChecked('Co-Lead')}
                    color="#3970AA"
                  />
                </TouchableOpacity>
              </View>
            </View>
            <View style={{ ...styles.bodyContainer, width: '45%' }}>
              <View style={styles.upgradReq}>
                <Text style={styles.reqText}>member</Text>
                <TouchableOpacity>
                  <RadioButton
                    value="second"
                    status={checked === 'Member' ? 'checked' : 'unchecked'}
                    onPress={() => setChecked('Member')}
                    color="#3970AA"
                  />
                </TouchableOpacity>
              </View>
            </View>
          </View>
          <View style={{ ...styles.model, marginTop: Height * 0.01 }}>
            <TouchableOpacity onPress={() => handleAddUser()}>
              <Text
                style={{
                  ...styles.btn,
                }}
              >
                Add User
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setaddModal(!addModal)}>
              <Text
                style={{
                  ...styles.btn,
                  backgroundColor: Color.White,
                  color: Color.Black,
                  borderWidth: 1,
                }}
              >
                Cancel
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default CurrentMember;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginVertical: Height * 0.007,

    backgroundColor: Color.White,
    borderRadius: 8,
    // shadowColor: Color.Grey,
    // shadowOffset: {
    //   width: 0,
    //   height: 4,
    // },
    // shadowOpacity: 0.27,
    // shadowRadius: 4.65,
    // elevation: 3,
    justifyContent: 'space-between',
    width: '95%',
    alignSelf: 'center',
    borderBottomWidth: 0.7,
    borderColor: Color.LightGrey,
  },
  contentContainer: {
    flexDirection: 'row',
    paddingVertical: Height * 0.008,
    alignContent: 'center',
    marginLeft: Width * 0.03,
  },
  userImg: {
    borderRadius: Height * 0.1,
    resizeMode: 'contain',
    height: 50,
    width: 50,
  },
  userName: {
    fontFamily: 'Roboto_500Medium',
    marginLeft: Width * 0.02,
  },
  userRole: {
    marginLeft: Width * 0.02,
    fontFamily: 'Roboto_500Medium',
    color: Color.Blue,
    marginTop: '-1.5%',
  },

  points: {
    color: Color.Black,
    fontFamily: 'Roboto',
    fontWeight: '900',
    fontSize: 16,
  },
  btnContainer: {
    alignSelf: 'center',
    marginRight: Width * 0.03,
    width: Width * 0.35,
  },

  pressed: {
    textAlign: 'center',
    color: Color.White,
    fontFamily: 'Roboto_500Medium',
    paddingHorizontal: Width * 0.07,
    paddingVertical: Height * 0.006,
    backgroundColor: Color.Blue,
    borderRadius: 8,
    fontSize: Height * 0.017,
  },

  btn: {
    paddingVertical: Height * 0.012,
    backgroundColor: Color.Blue,
    paddingHorizontal: Width * 0.07,
    color: Color.White,
    fontFamily: 'Roboto_500Medium',
    fontWeight: '600',
    borderRadius: Height * 0.01,
    fontSize: Height * 0.018,
  },
  ConfrmModel: {
    alignSelf: 'center',

    flex: 0.3,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: Height * 0.4,

    backgroundColor: Color.White,
    shadowColor: Color.Grey,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
    elevation: 8,
    alignSelf: 'center',
    paddingVertical: Height * 0.019,
    // marginTop: 10,
    borderRadius: 6,
  },
  model: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: Height * 0.03,
    width: Width * 0.9,
  },
  bodyContainer: {
    flexDirection: 'row',
    backgroundColor: Color.White,
    borderRadius: 8,
    shadowColor: Color.Grey,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
    elevation: 4,
    justifyContent: 'space-between',
    width: '88%',
    alignSelf: 'center',
  },
  upgradReq: {
    flexDirection: 'row',
    alignSelf: 'center',
    width: '100%',
    paddingHorizontal: Width * 0.025,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  reqText: {
    paddingVertical: Height * 0.02,
    marginLeft: Width * 0.025,
    fontSize: Height * 0.02,
    fontWeight: '400',
    fontFamily: 'Roboto_500Medium',
    flex: 1,
    alignSelf: 'center',
    color: Color.Grey,
  },
});
