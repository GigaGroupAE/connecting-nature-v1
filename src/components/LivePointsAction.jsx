import {
  Pressable,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import {
  FontAwesome,
  AntDesign,
  MaterialCommunityIcons,
} from 'react-native-vector-icons';
import Color from '../../assets/colors/Color';

import { useStateContext } from '../contexts/ContextProvider';
import { useNavigation } from '@react-navigation/native';
import { useUserState } from '../slices/userSlice';
import { BASE_URL } from '../../CONSTANTS';
import { scale } from 'react-native-size-matters';
import axios from 'axios';
import LikedSvg from './SVG/LikedSvg';
import { screenHeight } from '../utils/ScreenDimensions';

const LivePointsAction = ({
  campaign,
  screen,
  onpress,
  handleComment,
  setlikeAnimation,
}) => {
  const { reactions, setreactions, comment } = useStateContext();
  // const [visible, setVisible] = useState(false);
  // const [modalVisible, setmodalVisible] = useState(false);
  // const [shares, setshares] = useState([]);

  const navigation = useNavigation();
  const userState = useUserState();

  const route = `${BASE_URL}/campaigns/update/${campaign?._id}`;

  const [liked, setliked] = useState(false);

  useEffect(() => {
    setliked(
      reactions?.some((user) => {
        return user._id === userState.id;
      }),
    );
  }, [reactions]);

  const updatereactions = async (likes, notify = false) => {
    axios
      .patch(
        route,
        { reactions: likes },
        {
          headers: {
            'auth-token': userState.token,
          },
        },
      )
      .then((res) => {
        setreactions(res.data.reactions);
      })
      .catch((e) => {});
  };

  const handleLike = () => {
    if (!liked) {
      const templike = [...reactions];
      const newLikes = {
        phoneNumber: userState.phoneNumber,
        fullName: userState.fullName,
        type: userState.type,
        profile: userState.profile,
        _id: userState.id,
      };
      templike.push(newLikes);
      updatereactions(templike, true);
      setliked(true);
      setlikeAnimation(true);
      setTimeout(() => {
        setlikeAnimation(false);
      }, 40);
    } else {
      const newlikes = reactions.filter((reaction) => {
        return reaction._id !== userState.id;
      });
      updatereactions(newlikes, false);

      setliked(false);
    }
  };

  const handleCommentnavigation = () => {
    const screen = campaign?.status === 'archived' ? 'arch' : '';
    navigation.navigate('CampaignComments', { campaign, screen });
  };

  const handleonshare = () => {
    onpress();
  };

  return (
    <View>
      {(reactions?.length !== 0 || comment?.length !== 0) && (
        <View style={styles.statsContainer}>
          <TouchableOpacity
            style={{
              flexDirection: 'row',
            }}
            //   onPress={() => handlePostsLike(reactions)}
          >
            {reactions?.length !== 0 ? <LikedSvg /> : null}
            <Text style={styles.statsLikes}>
              {liked !== false || reactions.length > 0
                ? reactions?.length + ' Liked'
                : null}
            </Text>
          </TouchableOpacity>
          <View style={styles.rightStats}>
            <TouchableOpacity onPress={handleCommentnavigation}>
              <Text style={styles.statsComments}>
                {comment?.length !== 0
                  ? comment?.length === 1
                    ? comment?.length + ' comment'
                    : comment?.length + ' comments'
                  : null}
              </Text>
            </TouchableOpacity>
            {campaign?.shares?.length !== 0 && (
              <Text style={styles.statsShare}>
                {campaign?.shares.length !== 0
                  ? campaign?.shares.length === 1
                    ? campaign?.shares.length + ' share'
                    : campaign?.shares.length + ' shares'
                  : null}
              </Text>
            )}
          </View>
        </View>
      )}
      {campaign?.status !== 'archived' && (
        <View style={styles.actionMainContainer}>
          <View>
            <Pressable
              android_ripple={{ color: Color.LightGrey }}
              style={styles.mainAction}
              onPress={handleLike}
            >
              {liked ? (
                <FontAwesome
                  name="thumbs-up"
                  style={{ ...styles.shareIcon, color: Color.Blue }}
                />
              ) : (
                <AntDesign name="like2" style={styles.shareIcon} />
              )}

              <Text style={liked ? styles.actionedText : styles.actionText}>
                Like
              </Text>
            </Pressable>
          </View>
          <View>
            <Pressable
              android_ripple={{ color: Color.LightGrey }}
              style={styles.mainAction}
              onPress={handleComment}
            >
              <MaterialCommunityIcons
                name="comment-outline"
                style={styles.shareIcon}
              />
              <Text style={styles.actionText}>Comment</Text>
            </Pressable>
          </View>
          <View>
            <Pressable
              android_ripple={{ color: Color.LightGrey }}
              style={styles.mainAction}
              onPress={() => handleonshare()}
            >
              <AntDesign name="sharealt" style={styles.shareIcon} />
              <Text style={styles.actionText}>Share</Text>
            </Pressable>
          </View>
        </View>
      )}
    </View>
  );
};

export default LivePointsAction;

const styles = StyleSheet.create({
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    alignContent: 'center',
    paddingHorizontal: scale(17),
    paddingVertical: scale(6),
    borderTopWidth: scale(0.9),
    borderBottomWidth: scale(0.9),
    borderColor: Color.VeryLightGrey,
    // marginTop: scale(5),
    backgroundColor: Color.White,
  },

  statsLikes: {
    marginLeft: 5,
    // fontSize: scale(11),
    fontFamily: 'Roboto_400Regular',
    color: Color.Grey,
    marginTop: '4%',
    fontSize: screenHeight * 0.015,
  },
  rightStats: {
    flexDirection: 'row',
    alignItems: 'center',
    alignContent: 'center',
    justifyContent: 'space-between',
  },
  statsComments: {
    fontSize: scale(11),
    fontFamily: 'Roboto_400Regular',
    color: Color.Grey,
  },
  statsShare: {
    marginLeft: '5%',
    fontSize: scale(11),
    fontFamily: 'Roboto_400Regular',
    color: Color.Grey,
  },
  actionMainContainer: {
    borderTopWidth: 1,
    width: '100%',
    alignSelf: 'center',
    borderColor: Color.VeryLightGrey,
    flexDirection: 'row',
    alignContent: 'center',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Color.White,
    borderBottomWidth: 0.5,
    borderBottomColor: Color.LightGrey,
    // marginBottom: scale(10),
  },
  mainAction: {
    flexDirection: 'row',
    alignContent: 'center',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  postAction: {
    flexDirection: 'row',
    alignContent: 'center',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  actionIcon: {
    width: 22,
    height: 23,
  },
  actionText: {
    fontSize: screenHeight * 0.015,
    alignSelf: 'center',
    fontFamily: 'Roboto_400Regular',
    color: Color.Black,
    marginLeft: 8,
    // fontSize: screenHeight * 0.016,
  },
  actionedText: {
    // fontSize: scale(11),
    alignSelf: 'center',
    fontFamily: 'Roboto_400Regular',
    color: Color.Blue,
    marginLeft: 8,
    fontSize: screenHeight * 0.015,
  },
  pressedIcon: {
    color: Color.Blue,
  },
  unpressedIcon: {
    color: Color.Black,
  },
  shareIcon: {
    paddingVertical: 12,
    color: Color.Grey,
    fontSize: scale(20),
  },
});
