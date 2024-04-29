import React, { useState } from 'react';
import { StyleSheet, View, Pressable, Dimensions } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import Color from '../../assets/colors/Color';
import AddButton from './AddButton';
import { CreatePost } from '../screens';
import { useUserState } from '../slices/userSlice';
import { authorized } from '../utils/authorized';
import { Image } from 'expo-image';
import { BASE_URL } from '../../CONSTANTS';
import HomeSvg from './SVG/HomeSvg';
import { SearchSvg } from './SVG/SearchSvg';
import Campaign from './SVG/CampaignSvg';
import ActiveHomeSvg from './SVG/ActiveSvg';
import ActiveCampaigns from './SVG/ActiveCampaigns';
import { screenWidth } from '../utils/ScreenDimensions';

export default function BottomTab(props) {
  const navigation = useNavigation();
  const userstate = useUserState();

  const [createPostVisible, setCreatePostVisible] = useState(false);
  const onAddPost = () => {
    navigation.navigate('AddPost', {
      origin: 'post',
    });
    setCreatePostVisible(false);
  };
  const closeModal = () => {
    setCreatePostVisible(false);
  };

  function showCreatePost() {
    setCreatePostVisible(true);
  }
  function hideCreatePost() {
    setCreatePostVisible(false);
  }

  // INCLUDE user AS AN ARGUMENT IN BELOW 2 LINES IF YOU WANT TO ACCESS ADMIN AND CAMPAIGN CREATION.S
  const canSeeCampaign = authorized(
    userstate.type,
    'Manager',
    'celebrity',
    'user',
  );

  const handleHome = () => {
    navigation.navigate('Home');
    props?.scrollToTop();
  };
  return (
    <View style={styles.mainContainer}>
      <View>
        <Pressable
          style={styles.tabStyle}
          onFocus
          onPress={() => handleHome()}
          android_ripple={{ color: Color.LightGrey, borderless: true }}
        >
          {/* <FontAwesome
            name="home"
            size={30}
            color={props?.activeMenu === 'Home' ? Color.Blue : Color.Black}
          /> */}
          {props?.activeMenu === 'Home' ? <ActiveHomeSvg /> : <HomeSvg />}
        </Pressable>
      </View>
      <View>
        <Pressable
          style={styles.tabStyle}
          android_ripple={{ color: Color.LightGrey, borderless: true }}
          onPress={() => {
            navigation.navigate('SearchScreen');
          }}
        >
          {/* <Ionicons
            name="search"
            size={30}
            color={props?.activeMenu === 'Search' ? Color.Blue : Color.Black}
          /> */}
          <SearchSvg />
        </Pressable>
      </View>
      <View>
        <AddButton
          clicktrigger={() => showCreatePost()}
          activeScreen="bottomTab"
        />
        {createPostVisible && (
          <CreatePost
            onCancel={hideCreatePost}
            onAddPost={onAddPost}
            closeModal={closeModal}
            canSeeCampaign={canSeeCampaign}
            storyReload={props.storyReload}
          />
        )}
      </View>
      <Pressable
        style={styles.tabStyle}
        android_ripple={{ color: Color.LightGrey, borderless: true }}
        onPress={() => {
          navigation.navigate('Campaign');
          props?.scrollToTop();
        }}
      >
        {/* <MaterialIcons
          name="campaign"
          size={35}
          color={props?.activeMenu === 'Campaign' ? Color.Blue : Color.Black}
        /> */}

        {props?.activeMenu === 'Campaign' ? <ActiveCampaigns /> : Campaign}
        {/* <Campaign /> */}
      </Pressable>
      <Pressable
        style={styles.tabStyle}
        android_ripple={{ color: Color.LightGrey, borderless: true }}
        onPress={() => {
          navigation.navigate('UserProfile', { type: 'current' });

          props?.scrollToTop();
        }}
      >
        {/* <Ionicons
          name={
            props?.activeMenu === 'Chat'
              ? 'chatbox-ellipses'
              : 'md-chatbox-ellipses-outline'
          }
          size={30}
          color={props?.activeMenu === 'Chat' ? Color.Blue : Color.Black}
        /> */}
        <Image
          style={styles.headerAvatar}
          source={{ uri: `${BASE_URL}/images/${userstate.profile}` }}
          contentFit="cover"
        />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    position: 'absolute',
    bottom: 0,
    paddingHorizontal: screenWidth * 0.09,
    alignContent: 'center',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
    backgroundColor: Color.White,
    width: '100%',
    height: '7%',
    borderTopWidth: 1.5,
    borderColor: Color.VeryLightGrey,
  },
  tabStyle: {
    // alignContent: 'center',
    // alignItems: 'center',
  },
  tabCart: {
    alignContent: 'center',
    alignItems: 'center',
    borderRadius: Dimensions.get('screen').height * 0.1,
    padding: 17,
    marginTop: 0,
  },
  tabText: {
    fontFamily: 'Roboto_600SemiBold',
    fontSize: 13,
    color: Color.Grey,
  },
  activeTabText: {
    fontFamily: 'Roboto_600SemiBold',
    marginTop: 2,
    fontSize: 13,
    color: Color.Blue,
  },
  headerAvatar: {
    // marginRight: 155,
    borderRadius: 16,
    width: 30,
    height: 30,
    backgroundColor: '#eee',
  },
});
