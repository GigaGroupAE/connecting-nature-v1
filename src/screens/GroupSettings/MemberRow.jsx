import {
  View,
  Text,
  TouchableWithoutFeedback,
  StyleSheet,
  Pressable,
} from 'react-native';
import React, { useState } from 'react';
import { Avatar, Portal, Button, Modal } from 'react-native-paper';
import { BASE_URL } from '../../../CONSTANTS';
import { useUserState } from './../../slices/userSlice';
import axios from 'axios';
import { axiosInstance } from '../../../axiosInstance';
import { useStateContext } from '../../contexts/ContextProvider';
export default function MemberRow(props) {
  const member = props.member;
  const groupState = props.groupState;
  const { showSnackbar } = useStateContext();
  const [privmodal, setprivmodal] = useState(false);
  const [memberToChangePrivilege, setmemberToChangePrivilege] = useState('');
  const styles = StyleSheet.create({
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
    },
  });
  const containerStyle = {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 5,
    width: '90%',
    marginLeft: '5%',
  };
  const [memberModal, setMemberModal] = useState(false);
  const handlechangeprivilige = async (props) => {
    const apiData = {
      role: props,
      groupId: groupState?.groupId,
      userId: memberToChangePrivilege?._id,
    };
    try {
      const { data } = await axiosInstance.patch(
        '/groups/update-userPrivilege',
        apiData,
      );
      console.log(data);
      showSnackbar(data?.message);
      setprivmodal(false);
      setMemberModal(false);
    } catch (error) {
      showSnackbar(error?.response?.data?.message);
    }
  };

  return (
    <View>
      <TouchableWithoutFeedback
        onPress={() => {
          setMemberModal(true);
          setmemberToChangePrivilege(props?.member);
          console.log(props?.member);
        }}
      >
        <View style={[styles.row]}>
          <Avatar.Image
            size={50}
            style={{ backgroundColor: '#707070' }}
            source={
              member.member.profile
                ? {
                    uri: `${BASE_URL}/images/${member.member.profile}`,
                  }
                : require('../../../assets/no-profile-picture-placeholder.png')
            }
          />
          <View
            style={{
              marginLeft: 12,
              flexDirection: 'column',
            }}
          >
            <Text
              style={{
                // fontFamily: 'Roboto_600SemiBold',
                fontSize: 14,
                color: '#4582C3',
              }}
            >
              {member.member.fullName} &#8226;{' '}
            </Text>
            <Text
              style={{
                //  fontFamily: "Roboto_400Regular",
                fontSize: 12,
                color: '#4582C3',
              }}
            >
              {member.type}
            </Text>
            <Text
              style={{
                fontFamily: 'Roboto_400Regular',
                fontSize: 13,
                color: '#4582C3',
              }}
            >
              {props?.member?.privilege}
            </Text>
          </View>
        </View>
      </TouchableWithoutFeedback>
      <Portal>
        <Modal
          visible={memberModal}
          onDismiss={() => {
            setMemberModal(false);
          }}
          contentContainerStyle={containerStyle}
        >
          {privmodal === false ? (
            <View
              style={[
                styles.row,
                {
                  width: '100%',
                },
              ]}
            >
              <Text
                style={{
                  //   fontFamily: "Roboto_400Regular",
                  fontSize: 16,
                  color: '#4582C3',
                  textAlign: 'center',
                }}
              >
                Change {member.name}'s privilege
              </Text>
            </View>
          ) : (
            <View>
              <Pressable
                onPress={() => {
                  handlechangeprivilige('Lead');
                  setprivmodal(false);
                }}
              >
                <View
                  style={[
                    styles.row,
                    {
                      width: '100%',
                      marginBottom: 5,
                    },
                  ]}
                >
                  <Text
                    style={{
                      //   fontFamily: "Roboto_400Regular",
                      fontSize: 20,
                      color: '#4582C3',
                      textAlign: 'center',
                    }}
                  >
                    Make {member.name} Lead
                  </Text>
                </View>
              </Pressable>
              <Pressable
                onPress={() => {
                  handlechangeprivilige('Co-Lead');
                  setprivmodal(false);
                }}
              >
                <View
                  style={[
                    styles.row,
                    {
                      width: '100%',
                    },
                  ]}
                >
                  <Text
                    style={{
                      //   fontFamily: "Roboto_400Regular",
                      fontSize: 20,
                      color: '#4582C3',
                      textAlign: 'center',
                    }}
                  >
                    Make {member.name} Co-Lead
                  </Text>
                </View>
              </Pressable>
            </View>
          )}
          <View
            style={[
              styles.row,
              {
                width: '100%',
                justifyContent: 'center',
                alignItems: 'center',
                marginVertical: 20,
              },
            ]}
          >
            <Button
              uppercase={false}
              onPress={() => setprivmodal(true)}
              style={{
                width: '35%',
                backgroundColor: '#E70000',
                marginRight: 12,
              }}
              labelStyle={{
                // fontFamily: "Roboto_400Regular",
                fontSize: 16,
                color: 'white',
                letterSpacing: 0.1,
              }}
              contentStyle={{
                justifyContent: 'center',
              }}
            >
              Confirm
            </Button>
            <Button
              uppercase={false}
              style={{
                marginLeft: 12,
                width: '35%',
                backgroundColor: '#4582C3',
              }}
              labelStyle={{
                // fontFamily: "Roboto_400Regular",
                fontSize: 16,
                color: 'white',
                letterSpacing: 0.1,
              }}
              contentStyle={{
                justifyContent: 'center',
              }}
              onPress={() => {
                setMemberModal(false);
              }}
            >
              Cancel
            </Button>
          </View>
        </Modal>
      </Portal>
    </View>
  );
}
