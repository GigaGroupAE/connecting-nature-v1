import {
  StyleSheet,
  Text,
  View,
  Pressable,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import { AntDesign, Entypo } from 'react-native-vector-icons';

import { useNavigation } from '@react-navigation/native';
import Color from '../../assets/colors/Color';
// import { useCartState } from '../slices/cartSlice';
// import { useState, useEffect } from 'react';
// import { BASE_URL } from '../../CONSTANTS';
// import { useUserState } from '../slices/userSlice';
// import axios from 'axios';
import { useStateContext } from '../contexts/ContextProvider';
import { screenHeight } from '../utils/ScreenDimensions';
import FilterSvg from './SVG/FilterSvg';
import ThreeDotsVerticalSvg from './SVG/dotsThreeVertical';
import SavedSvg from './SVG/SavedSvg';
import SavedProductSvg from './SVG/SaveProductSvg';
import { axiosInstance } from '../../axiosInstance';

const width = Dimensions.get('screen').width;

export default function HeaderNormal(props) {
  // const userState = useUserState();
  const title = props?.title;
  // const cartSlice = useCartState();
  // const [Messages, setMessages] = useState([]);
  const { setgroup } = useStateContext();
  // useEffect(() => {
  //   axios
  //     .get(`${BASE_URL}/chat/get-my-chats`, {
  //       headers: {
  //         'auth-token': userState.token,
  //       },
  //     })
  //     .then((res) => {
  //       setMessages([...res.data.myChats]);
  //     })
  //     .catch((e) => {});
  // }, []);
  // const selectcontact = (props) => {
  //   console.log(props, 'props');
  //   let first = false;
  //   let second = false;
  //   let foundGroup = {};
  //   const individualGroups = Messages;
  //   individualGroups.map((group) => {
  //     if (
  //       group.members[0].phoneNumber === userState.phoneNumber ||
  //       group.members[0].phoneNumber === props.phoneNumber
  //     ) {
  //       first = true;
  //       if (
  //         group.members[1].phoneNumber === userState.phoneNumber ||
  //         group.members[1].phoneNumber === props.phoneNumber
  //       ) {
  //         second = true;
  //         foundGroup = group;
  //       }
  //     }
  //   });
  //   if (first === true && second === true) {
  //     setgroup(foundGroup);
  //     navigation.navigate('ChatCN', { group: foundGroup });
  //   } else {
  //     const members = [userState.id, props._id];

  //     let data;

  //     data = {
  //       members: members,
  //       messages: [],
  //     };
  //     axios
  //       .post(`${BASE_URL}/chat/createchat`, data, {
  //         headers: {
  //           'auth-token': userState.token,
  //         },
  //       })
  //       .then((response) => {
  //         axios
  //           .get(`${BASE_URL}/chat/get-my-chats`, {
  //             headers: {
  //               'auth-token': userState.token,
  //             },
  //           })
  //           .then((res) => {
  //             const newgroup = res.data.myChats.filter((singlegroup) => {
  //               return singlegroup._id === response.data._id;
  //             });
  //             setgroup(newgroup[0]);
  //             navigation.navigate('ChatCN', { group: newgroup[0] });
  //           })
  //           .catch((e) => {});
  //       })
  //       .catch((e) => {});
  //   }
  // };

  const selectcontact = async (props) => {
    try {
      const { data } = await axiosInstance.post(
        `/chat/getOrCreate/${props?._id}`,
      );
      // console.log(data?.chat, 'data');
      setgroup(data?.chat);
      navigation.navigate('ChatCN', { group: data?.chat });
    } catch (error) {
      console.log(error);
    }
  };
  const navigation = useNavigation();

  return (
    <View>
      <View style={styles.container}>
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            flex: 2,
            alignItems: 'center',
          }}
        >
          <Pressable
            android_ripple={{ color: Color.VeryLightGrey, borderless: true }}
            onPress={() => navigation.goBack()}
          >
            <AntDesign
              name="arrowleft"
              // size={24}
              color={Color.Black}
              style={{
                alignSelf: 'center',
                alignItems: 'center',
                fontSize: screenHeight * 0.026,
              }}
            />
          </Pressable>

          <Text style={styles.title}>{title}</Text>
        </View>
        <View
          style={{
            alignSelf: 'center',
            position: 'relative',
            width: width * 0.12,
          }}
        >
          {title === 'Chats' && (
            <Pressable
              onPress={() => {
                navigation.navigate('SelectContact', {
                  selectedContact: selectcontact,
                });
              }}
            >
              <Entypo name="new-message" size={25} color={Color.Blue} />
            </Pressable>
          )}
        </View>
        {title === 'Affordability' ||
        title === 'Design Type' ||
        title === 'Design Category' ||
        title === 'Products' ? (
          <TouchableOpacity
            style={styles.affordabContainer}
            onPress={() => props.setismodalVisible(true)}
          >
            <AntDesign name="plus" style={styles.affordableTitle} />
            <Text style={styles.affordableTitle}>Add</Text>
          </TouchableOpacity>
        ) : null}
        {props?.screen === 'Decoration' && (
          <View style={styles.decorContainer}>
            <Pressable onPress={props?.openFilterModal}>
              <FilterSvg />
            </Pressable>
            <Pressable onPress={props?.openSavedProducts}>
              <ThreeDotsVerticalSvg />
            </Pressable>
          </View>
        )}

        {props?.screen === 'DecorationProduct' && (
          <View style={styles.decorContainer}>
            <TouchableOpacity onPress={props?.isSaved}>
              {props?.save ? (
                <View style={{ marginRight: 7 }}>
                  <SavedProductSvg />
                </View>
              ) : (
                <SavedSvg />
              )}
            </TouchableOpacity>
            {/* <Pressable onPress={props?.openSavedProducts}>
              <ThreeDotsVerticalSvg />
            </Pressable> */}
          </View>
        )}

        {title === 'Current Activity Stats' && (
          <View
            style={{
              flexDirection: 'row',
              // flex: 0.5,
              justifyContent: 'space-around',
              // backgroundColor: 'red',
              gap: 14,
            }}
          >
            <TouchableOpacity onPress={props?.inviteAll}>
              <Text style={styles.invite}>Invite All</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('Home')}>
              <Text style={{ marginLeft: width * 0.012, ...styles.invite }}>
                Done
              </Text>
            </TouchableOpacity>
          </View>
        )}
        {/* {title === 'ShowCase' ? (
          <Pressable
            onPress={() => {
              navigation.navigate('Checkout');
            }}
          >
            <MaterialIcons
              name="add-shopping-cart"
              size={35}
              color={Color.Blue}
            />
            <Text
              style={{
                top: -7,
                right: -6,
                position: 'absolute',
                backgroundColor: '#DCDCDC',
                borderRadius: 20,
                paddingHorizontal: 5,
                color: '#4582C3',
              }}
            >
              {cartSlice.cart.length}
            </Text>
          </Pressable>
        ) : (
          <View></View>
        )} */}
      </View>
    </View>
  );
}

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
    // fontSize: 17,
    fontFamily: 'Roboto_600SemiBold',
    marginLeft: 10,
    marginTop: 2,
    lineHeight: 30,
    textAlignVertical: 'center',
    fontSize: screenHeight * 0.019,
  },
  affordabContainer: {
    backgroundColor: Color.Blue,
    width: width * 0.22,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: '1.7%',
    borderRadius: screenHeight * 0.01,
    gap: 4,
  },
  affordableTitle: {
    color: Color.White,
    fontFamily: 'Roboto_700Bold',
    fontSize: screenHeight * 0.016,
  },
  decorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: '3%',
  },
  invite: {
    alignSelf: 'center',
    fontFamily: 'Roboto_500Medium',
    color: Color.Blue,
    fontWeight: '600',
    fontSize: 12,
  },
});
