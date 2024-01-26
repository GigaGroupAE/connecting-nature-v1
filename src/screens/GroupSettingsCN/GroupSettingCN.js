/* eslint-disable @typescript-eslint/indent */
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Pressable,
} from 'react-native';
import React, { useState } from 'react';
import { IconButton, Button, Avatar, Portal, Modal } from 'react-native-paper';
import { useUserState } from '../../slices/userSlice';
import { BASE_URL } from './../../../CONSTANTS';
import { useNavigation } from '@react-navigation/native';
import HeaderNormal from '../../components/HeaderNormal';
function GroupSettingsCN(props) {
  const [groupState, setgroup] = useState({
    level: props.route.params.groupState.type,
    name: props.route.params.groupState.title,
    members: props.route.params.groupState.members,
    groupPic: props.route.params.groupState.groupPic,
  });
  const userState = useUserState();

  const [profile, setProfile] = useState(
    `${BASE_URL}/images/${groupState.groupPic}`,
  );
  const navigation = useNavigation();

  const styles = StyleSheet.create({
    body: {
      flex: 1,
      flexDirection: 'column',
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'flex-start',
    },
    // use this attribute with View to create a new row
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
    },
    btnNormal: {
      backgroundColor: '#4582C3',
    },
    btnPress: {
      backgroundColor: 'grey',
    },
  });
  const containerStyle = {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 5,
    width: '90%',
    marginLeft: '5%',
  };

  // disband group modal

  // block user modal
  const [blockModal, setBlockModal] = React.useState(false);
  const onDismissBlockModal = () => setBlockModal(false);

  return (
    // Using ScrollView to dismiss keyboard when user clicks anywhere on the screen.
    <View style={[styles.body]}>
      <View style={{ width: '100%' }}>
        <HeaderNormal title="Group Setting" />
      </View>
      <ScrollView
        style={{
          flex: 1,
          width: '100%',
        }}
        contentContainerStyle={{
          alignItems: 'center',
        }}
      >
        <View
          style={[
            {
              width: '100%',
              backgroundColor: 'white',
              alignItems: 'center',
            },
          ]}
        >
          <Pressable
            style={[
              styles.row,
              {
                marginTop: 25,
                paddingBottom: 25,
                width: '90%',
                justifyContent: 'flex-start',
              },
            ]}
            onPress={() => {
              groupState.members.map((user) => {
                if (userState.phoneNumber !== user.phoneNumber) {
                  navigation.navigate('UserProfile', {
                    userPhoneNumber: user.phoneNumber,
                  });
                }
              });
            }}
          >
            <Pressable>
              <Avatar.Image
                size={60}
                style={{ backgroundColor: '#707070' }}
                source={
                  profile
                    ? {
                        uri: groupState.groupPic,
                      }
                    : {
                        uri: 'https://firebasestorage.googleapis.com/v0/b/giga-intranet.appspot.com/o/default%2Fgroup.png?alt=media&token=e26513b2-3ac3-4f77-8ab6-be92e2d45c79',
                      }
                }
              />
            </Pressable>
            <View
              style={{
                marginLeft: 16,
                // flexDirection: "column",
              }}
            >
              <View
                style={{
                  flexDirection: 'row',
                  width: '80%',
                }}
              >
                <Text
                  numberOfLines={1}
                  ellipsizeMode="tail"
                  style={{
                    //  fontFamily: "Roboto_500Medium",
                    fontSize: 15,
                    color: '#4582C3',
                    width: '100%',
                  }}
                >
                  {groupState.level === 'individual' ||
                  groupState.level === 'Admin'
                    ? groupState.name
                    : groupState.name}
                </Text>
                {/* <IconButton
                  icon="pencil"
                  color={colors.gray}
                  size={20}
                  // onPress={showModal3}
                  style={{
                    backgroundColor: "transparent",
                  }}
                /> */}
              </View>

              <Pressable>
                <Text
                  style={{
                    //  fontFamily: "Roboto_400Regular",
                    fontSize: 12,
                    color: '#4582C3',
                  }}
                >
                  {groupState.level !== 'individual' &&
                  groupState.level !== 'Admin'
                    ? groupState.members.map((user) => {
                        if (user.type === 'Lead') {
                          return user.name;
                        }
                      })
                    : groupState.members.map((user) => {
                        if (userState.phoneNumber !== user.phoneNumber) {
                          return user.phoneNumber;
                        }
                      })}{' '}
                  &#8226;{' '}
                  <Text
                    style={
                      {
                        // fontFamily: "Roboto_500Medium"
                      }
                    }
                  >
                    {groupState.members.map((user) => {
                      if (userState.phoneNumber !== user.phoneNumber) {
                        if (groupState.level === 'Admin') {
                          return 'CEO';
                        } else {
                          return user.type;
                        }
                      }
                    })}
                  </Text>
                </Text>
              </Pressable>
            </View>
          </Pressable>
        </View>
        {/* <TouchableOpacity
          onPress={() => {}}
          style={[
            {
              width: "100%",
              alignItems: "center",
            },
          ]}
        >
          <View
            style={[
              styles.row,
              {
                marginTop: 15,
                marginBottom: 4,
                // padding: 10,
                // paddingTop: 5,
                // paddingBottom: 5,
                borderRadius: 5,
                width: "90%",
                justifyContent: "flex-start",
                backgroundColor: "white",
              },
            ]}
          >
            <IconButton
              icon="file-document"
              color="#E70000"
              size={20}
              style={{
                backgroundColor: "#FFE1E1",
                borderWidth: 0,
                borderColor: "white",
              }}
            />
            <View
              style={{
                marginLeft: 12,
                flexDirection: "column",
              }}
            >
              <Text
                style={{
                  // fontFamily: "Roboto_500Medium",
                  fontSize: 15,
                  color: "#4582C3",
                }}
              >
                Media, Docs, Links
              </Text>
            </View>
            <IconButton
              icon="chevron-right"
              color="#C8C8C8"
              size={25}
              style={{
                marginLeft: "auto",
                margin: 0,
                marginRight: -10,
                padding: 0,
              }}
            />
          </View>
        </TouchableOpacity> */}

        {/* <View
          style={[
            {
              width: "100%",
              alignItems: "center",
            },
          ]}
        >
          <TouchableOpacity
            onPress={() => onToggleComingSoon()}
            style={[
              styles.row,
              {
                marginTop: 0,
                marginBottom: 4,

                // padding: 10,
                // paddingTop: 5,
                // paddingBottom: 5,
                borderRadius: 5,
                width: "90%",
                justifyContent: "flex-start",
                backgroundColor: "white",
              },
            ]}
          >
            <IconButton
              icon="star"
              color="#FFD15B"
              size={20}
              style={{
                backgroundColor: "#FFF4D6",
                borderWidth: 0,
                borderColor: "white",
              }}
            />
            <View
              style={{
                marginLeft: 12,
                flexDirection: "column",
              }}
            >
              <Text
                style={{
                  //  fontFamily: "Roboto_500Medium",
                  fontSize: 15,
                  color: "#4582C3",
                }}
              >
                Starred Messages
              </Text>
            </View>
            <IconButton
              icon="chevron-right"
              color="#C8C8C8"
              size={25}
              style={{
                marginLeft: "auto",
                margin: 0,
                marginRight: -10,
                padding: 0,
              }}
            />
          </TouchableOpacity>
        </View> */}
        {/* <View
          style={[
            {
              width: "100%",
              alignItems: "center",
            },
          ]}
        >
          <TouchableOpacity
            onPress={() => onToggleComingSoon()}
            style={[
              {
                width: "100%",
                alignItems: "center",
              },
            ]}
          >
            <View
              style={[
                styles.row,
                {
                  marginTop: 0,
                  marginBottom: 10,
                  // padding: 10,
                  // paddingTop: 5,
                  // paddingBottom: 5,
                  borderRadius: 5,
                  width: "90%",
                  justifyContent: "flex-start",
                  backgroundColor: "white",
                },
              ]}
            >
              <IconButton
                icon="share"
                color="#4582C3"
                size={20}
                onPress={() => console.log("Pressed")}
                style={{
                  backgroundColor: "#E4F1FF",
                  borderWidth: 0,
                  borderColor: "white",
                }}
              />
              <View
                style={{
                  marginLeft: 12,
                  flexDirection: "column",
                }}
              >
                <Text
                  style={{
                    //fontFamily: "Roboto_500Medium",
                    fontSize: 15,
                    color: "#4582C3",
                  }}
                >
                  Share Profile
                </Text>
              </View>
              <IconButton
                icon="chevron-right"
                color="#C8C8C8"
                size={25}
                onPress={() => console.log("Pressed")}
                style={{
                  marginLeft: "auto",
                  margin: 0,
                  marginRight: -10,
                  padding: 0,
                }}
              />
            </View>
          </TouchableOpacity>
        </View> */}

        <TouchableOpacity
          onPress={() => {
            setBlockModal(true);
          }}
          style={[
            styles.row,
            {
              // marginTop: 10,
              marginBottom: 30,
              width: '85%',
              justifyContent: 'flex-start',
              alignSelf: 'center',
            },
          ]}
        >
          <IconButton
            icon="close"
            color="#E70000"
            size={20}
            style={{
              backgroundColor: '#FFE1E1',
              margin: 0,
              marginRight: 10,
            }}
          />
          <Button
            mode="text"
            uppercase={false}
            compact={true}
            // style={{ marginLeft: -5 }}
            color="#E70000"
            labelStyle={{
              // fontFamily: "Roboto_500Medium",
              fontSize: 16,
              color: '#E70000',

              letterSpacing: 0.1,
            }}
          >
            Block User
          </Button>
        </TouchableOpacity>

        {/* block user modal */}
        <Portal>
          <Modal
            visible={blockModal}
            onDismiss={onDismissBlockModal}
            contentContainerStyle={containerStyle}
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
                  fontSize: 16,
                  color: '#4582C3',
                  textAlign: 'center',
                }}
              >
                Are you sure you want to Block This User?
              </Text>
            </View>
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
                Block
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
                  onDismissBlockModal();
                }}
              >
                Cancel
              </Button>
            </View>
          </Modal>
        </Portal>
      </ScrollView>
    </View>
  );
}
export default GroupSettingsCN;
