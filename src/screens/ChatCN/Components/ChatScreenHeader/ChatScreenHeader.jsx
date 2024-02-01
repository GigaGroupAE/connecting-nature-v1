/* eslint-disable semi */
import React, { useState, useEffect } from 'react';
import { Platform, TouchableOpacity } from 'react-native';
import { Appbar, Avatar } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { useUserState } from '../../../../slices/userSlice';

import { BASE_URL } from '../../../../../CONSTANTS';
import Color from '../../../../../assets/colors/Color';
import { useStateContext } from '../../../../contexts/ContextProvider';

const ChatScreenHeader = (props) => {
  const userState = useUserState();
  const navigation = useNavigation();
  const [subtitle, setsubtitle] = useState();
  const [photo, setPhoto] = useState();
  const [title, settitle] = useState();
  const { setgroup } = useStateContext();

  useEffect(() => {
    const member = props.groupState.members.filter((member) => {
      return member.phoneNumber !== userState.phoneNumber;
    });
    // console.log(member[0]);
    const memb = member[0];
    setPhoto(`${BASE_URL}/images/${memb.profile}`);
    settitle(memb.fullName);
    setsubtitle(memb.type);
  }, [props]);

  const handleClick = () => {
    props?.handleShowInput(true);
  };

  return (
    <Appbar.Header
      style={{
        marginTop: 0,
        marginBottom: 2.5,
        width: '100%',
        backgroundColor: Color.White,
        borderBottomWidth: 1,
        borderColor: Color.VeryLightGrey,
      }}
    >
      <Appbar.BackAction
        color={Color.Black}
        onPress={() => {
          setgroup(null);
          navigation.goBack();
        }}
      />
      <TouchableOpacity
        onPress={() =>
          navigation.navigate('ChatSettingsCN', {
            groupState: {
              title: title,
              groupPic: photo,
              members: props.groupState.members,
              type: props.groupState.type,
            },
          })
        }
      >
        <Avatar.Image
          size={40}
          source={
            photo
              ? { uri: photo }
              : {
                  uri: 'https://firebasestorage.googleapis.com/v0/b/giga-intranet.appspot.com/o/default%2Fgroup.png?alt=media&token=e26513b2-3ac3-4f77-8ab6-be92e2d45c79',
                }
          }
          style={{ marginRight: -12 }}
        />
      </TouchableOpacity>
      <Appbar.Content
        onPress={() =>
          navigation.navigate('ChatSettingsCN', {
            groupState: {
              title: title,
              groupPic: photo,
              members: props.groupState.members,
              type: props.groupState.type,
            },
          })
        }
        title={title ? title : 'Loading...'}
        titleStyle={{
          fontFamily: 'Roboto_500Medium',
          fontSize: 18,
          color: Color.Black,
        }}
        subtitle={subtitle ? subtitle : 'Loading...'}
        subtitleStyle={{ fontSize: 12, marginTop: -5, color: Color.Black }}
        color={Color.Black}
        style={{
          ...Platform.select({
            ios: {
              marginTop: 0,
            },
            android: {
              marginTop: 4,
            },
          }),
        }}
      />
      <Appbar.Action
        style={{ marginRight: 5, zIndex: 1 }}
        color={Color.Black}
        size={25}
        icon="magnify"
        onPress={() => handleClick()}
      />
    </Appbar.Header>
  );
};

export default ChatScreenHeader;
