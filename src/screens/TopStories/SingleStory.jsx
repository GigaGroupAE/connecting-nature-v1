import React, { useCallback, useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { Entypo, AntDesign, Octicons } from 'react-native-vector-icons';
import Color from '../../../assets/colors/Color';
import { useNavigation } from '@react-navigation/native';
import { BASE_URL } from '../../../CONSTANTS';
import { calculateTimeDifference } from '../../utils/timeDifference';
import { useUserState } from '../../slices/userSlice';

import { useStateContext } from '../../contexts/ContextProvider';
import axios from 'axios';
import VideoPlayer from 'expo-video-player';
import StoryDeleteModal from './StoryDeleteModal';
import AdminIcon from '../../components/AdminIcon';
import { Image } from 'expo-image';
import { screenHeight, screenWidth } from '../../utils/ScreenDimensions';

const Height = Dimensions.get('screen').height;
const Width = Dimensions.get('screen').width;

const SingleStory = ({ post, refetch }) => {
  const { setSelectedStory, showSnackbar } = useStateContext();

  const navigation = useNavigation();

  // const [post, setpost] = useState([route.params.Stories]);

  const selectedStory = post;
  const video = React.useRef(null);
  const [textShown, setTextShown] = useState(false); //To show ur remaining Text
  const [lengthMore, setLengthMore] = useState(false); //to show the "Read more & Less Line"
  const userstate = useUserState();
  const [reactions, setreactions] = useState([...selectedStory.reactions]);
  // const [comments, setcomments] = useState([...selectedStory.comments]);
  const [modalVisible, setmodalVisible] = useState(false);

  const [shares, setshares] = useState([...selectedStory.shares]);
  const [liked, setliked] = useState(
    reactions.some((user) => {
      return user._id === userstate.id;
    }),
  );
  // calculate time
  const timePassed = calculateTimeDifference(post?.createdAT);

  const updatereactions = async (likes, notify = false) => {
    axios
      .patch(
        `${BASE_URL}/story/updatestory/${selectedStory._id}`,
        { reactions: likes },
        {
          headers: {
            'auth-token': userstate.token,
          },
        },
      )
      .then((res) => {
        setreactions(res.data.reactions);
      })
      .catch((e) => console.log(e));
  };
  const handleLike = () => {
    if (!liked) {
      const templike = [...reactions];
      const newLikes = {
        phoneNumber: userstate.phoneNumber,
        fullName: userstate.fullName,
        type: userstate.type,
        profile: userstate.profile,
        _id: userstate.id,
      };
      templike.push(newLikes);
      updatereactions(templike, true);

      setliked(true);
    } else {
      const newlikes = reactions.filter((reaction) => {
        return reaction._id !== userstate.id;
      });
      updatereactions(newlikes, false);

      setliked(false);
    }
  };
  // handle share

  const handleonshare = async () => {
    try {
      const tempshares = [...shares];
      tempshares.push(userstate.id);

      const formData = new FormData();
      ['shares', 'comments', 'reactions'].forEach((e) =>
        formData.append(e, JSON.stringify([])),
      );
      formData.append('description', selectedStory.description);
      formData.append('postedby', JSON.stringify(userstate.id));

      if (selectedStory.media) {
        formData.append('media', {
          name: selectedStory.media.name,
          uri: `${BASE_URL}/images/${selectedStory.media.name}`,
          type: selectedStory.media.type,
        });
      } else {
        formData.append('media', null);
      }

      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
          Accept: 'application/json',
          'auth-token': userstate.token,
        },
      };

      // Create the new story
      await axios.post(`${BASE_URL}/story/addstory/`, formData, config);
      showSnackbar('The story has been shared');
      refetch();

      // Update the shares count for the selected story
      const res = await axios.patch(
        `${BASE_URL}/story/updatestory/${selectedStory._id}`,
        { shares: tempshares },
        {
          headers: {
            'auth-token': userstate.token,
          },
        },
      );
      setshares([...res.data.shares]);
    } catch {
      showSnackbar(
        "Sorry, we couldn't share the story at the moment. Please try again later.",
      );
    }
  };

  const handleNavigation = async (selectedStory) => {
    try {
      const res = await axios.post(
        `${BASE_URL}/story/getstory`,
        { id: selectedStory._id },
        {
          headers: {
            'auth-token': userstate.token,
          },
        },
      );
      setSelectedStory(res.data);
      navigation.navigate('StoryComment');
    } catch {}
  };
  const toggleNumberOfLines = () => {
    //To toggle the show text or hide it
    setTextShown(!textShown);
  };
  const onTextLayout = useCallback((e) => {
    setLengthMore(e.nativeEvent.lines.length >= 4); //to check the text is more than 4 lines or not
    // console.log(e.nativeEvent);
  }, []);

  const modalComponent = useMemo(
    () => (
      <StoryDeleteModal
        post={post}
        refetch={refetch}
        setmodalVisible={setmodalVisible}
      />
    ),
    [modalVisible, post],
  );

  return (
    <View>
      {modalVisible && modalComponent}
      <View style={styles.container}>
        <Image
          style={styles.profilePicture}
          source={{ uri: `${BASE_URL}/images/${post?.postedby?.profile}` }}
          // source={user}
          contentFit="cover"
        />
        <View style={styles.contentContainer}>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('UserProfile', {
                userPhoneNumber: post.postedby.phoneNumber,
              });
            }}
            style={{ flexDirection: 'row' }}
          >
            <Text style={styles.username}>{post?.postedby?.fullName}</Text>
            {/* {(post.postedby.type === 'Operations' ||
              post.postedby.type === 'Admin' ||
              post.postedby.type === 'Manager' ||
              post.postedby.type === 'Assistant Manager' ||
              post.postedby.type === 'Super Admin' ||
              post.postedby.type === 'celebrity') && (
              <MaterialCommunityIcons
                name="check-decagram"
                style={styles.adminIcon}
              />
            )} */}
            <View
              style={{
                // backgroundColor: 'red',
                position: 'relative',
                right: Width * 0.02,
              }}
            >
              <AdminIcon userType={post.postedby.type} />
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={{ position: 'absolute', right: 16, alignSelf: 'center' }}
            onPress={() => setmodalVisible(true)}
          >
            <Entypo
              name="dots-three-horizontal"
              size={15}
              color={Color.Black}
            />
          </TouchableOpacity>
          <Text style={styles.timestamp}>{timePassed}</Text>
          <TouchableOpacity onPress={() => handleNavigation(post)}>
            <Text
              style={styles.content}
              onTextLayout={onTextLayout}
              numberOfLines={textShown ? undefined : 4}
            >
              {post.description}
            </Text>
            {lengthMore ? (
              <Text
                onPress={toggleNumberOfLines}
                style={{
                  ...styles.content,
                  color: Color.Blue,
                  paddingVertical: Height * 0.00012,
                  // paddingVertical: 2,
                  paddingBottom: 4,
                }}
              >
                {textShown ? 'Read less...' : 'Read more...'}
              </Text>
            ) : null}
          </TouchableOpacity>
          {post.media?.type === 'image/jpeg' ||
          post.media?.type === 'image/png' ||
          post.media?.type === 'image/jpg' ? (
            <TouchableOpacity
              onPress={() =>
                navigation.navigate('PostView', {
                  url: `${BASE_URL}/images/${post.media.name}`,
                  message: post.description,
                })
              }
            >
              <Image
                style={styles.postImage}
                source={{ uri: `${BASE_URL}/images/${post?.media?.name}` }}
                contentFit="cover"
              />
            </TouchableOpacity>
          ) : null}
          {post.media?.type === 'video/mp4' ? (
            <View
              style={{
                height: Height * 0.27,
                borderRadius: Height * 0.02,
                overflow: 'hidden',
              }}
            >
              <VideoPlayer
                style={{ height: 200 }}
                fullscreen={{
                  enterFullscreen: () => {
                    video.current.setStatusAsync({
                      shouldPlay: false,
                    });
                    navigation.navigate('PostView', {
                      url: `${BASE_URL}/images/${post.media.name}`,
                      message: '',
                      mediatype: 'video',
                      description: post.description,
                      autherName: post.postedby.fullName,
                      screen: 'home',
                    });
                  },
                }}
                defaultControlsVisible
                videoProps={{
                  isLooping: false,
                  ref: video,
                  source: {
                    uri: `${BASE_URL}/images/${post.media.name}`,
                  },
                  shouldPlay: false,
                  resizeMode: 'contain',
                }}
              />
            </View>
          ) : null}

          <View style={styles.actionsContainer}>
            <TouchableOpacity style={styles.postLikes} onPress={handleLike}>
              {liked ? (
                <AntDesign
                  name="heart"
                  style={{ ...styles.icons, color: Color.Red }}
                />
              ) : (
                <AntDesign name="hearto" style={styles.icons} />
              )}
              <Text style={styles.actionText}>{reactions.length}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleNavigation(post)}>
              <View style={{ flexDirection: 'row' }}>
                <Octicons
                  name="comment"
                  // size={20}
                  color="#000"
                  style={{ fontSize: screenHeight * 0.023 }}
                />
                <View style={{ marginLeft: 7, alignSelf: 'center' }}>
                  <Text style={styles.actionText}>
                    {post?.comments?.length}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleonshare}>
              <View style={{ flexDirection: 'row' }}>
                <AntDesign
                  name="sharealt"
                  size={20}
                  color="#000"
                  style={{
                    fontSize: screenHeight * 0.023,
                  }}
                />
                <View style={{ marginLeft: 7, alignSelf: 'center' }}>
                  <Text style={styles.actionText}>{post?.shares?.length}</Text>
                </View>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 10,
    borderBottomWidth: 0.3,
    borderBottomColor: Color.DarkGrey,
  },
  profilePicture: {
    width: 50,
    height: 50,
    borderRadius: 25,
    // paddingHorizontal: Width * 0.04,
    // resizeMode: 'cover',
  },
  contentContainer: {
    flex: 1,
  },
  username: {
    fontWeight: 'bold',
    fontSize: screenHeight * 0.0166,
    fontFamily: 'Roboto_500Medium',
    paddingHorizontal: Width * 0.02,
  },
  content: {
    fontSize: screenHeight * 0.016,
    fontFamily: 'Roboto_400Regular',
    paddingHorizontal: Width * 0.006,
    paddingVertical: Height * 0.012,
  },
  readMore: {
    marginTop: 5,
    color: '#1c95e0',
    fontSize: 14,
  },
  postImage: {
    width: '100%',

    borderRadius: Height * 0.02,
    height: Height * 0.27,
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: Height * 0.02,
    width: Width * 0.5,
  },
  timestamp: {
    // color: '#999',
    // fontSize: Height * 0.017,
    paddingHorizontal: Width * 0.018,
    paddingVertical: Height * 0.002,
    fontFamily: 'Roboto_400Regular',
    color: Color.Black,
    fontSize: screenHeight * 0.0135,
  },
  postLikes: {
    fontSize: 21,
    flexDirection: 'row',
    alignItems: 'center',
  },
  comment: {
    fontSize: 14,
    fontFamily: 'Roboto_500Medium',
    fontWeight: '400',
    color: Color.Grey,
  },
  icons: {
    fontSize: screenHeight * 0.023,
    color: Color.Black,
    paddingHorizontal: Width * 0.02,
  },
  adminIcon: {
    marginLeft: -5,
    alignSelf: 'center',
    fontSize: Height * 0.018,
    color: Color.Blue,
  },
  actionText: {
    fontSize: screenHeight * 0.0148,
    alignSelf: 'center',
    fontFamily: 'Roboto_400Regular',
    color: Color.Black,
    marginLeft: 3,
  },
});

export default SingleStory;
