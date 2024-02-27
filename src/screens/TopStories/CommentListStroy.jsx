import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Pressable,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { calculateTimeDifference } from '../../utils/timeDifference';
import { screenHeight, screenWidth } from '../../utils/ScreenDimensions';
import { BASE_URL } from '../../../CONSTANTS';
import { MaterialCommunityIcons, AntDesign } from 'react-native-vector-icons';
import Color from '../../../assets/colors/Color';
import { useUserState } from '../../slices/userSlice';
import DeleteCommentModal from '../../components/DeleteCommentModal';
import { axiosInstance } from '../../../axiosInstance';
import { useStateContext } from '../../contexts/ContextProvider';

const CommentListStroy = ({ item, setcomments }) => {
  const timePassed = calculateTimeDifference(item.date);
  const userState = useUserState();
  const [modalVisible, setmodalVisible] = useState(false);
  const [commentsLikes, setcommentsLikes] = useState(item?.likes);
  const [isLike, setisLike] = useState(false);
  const { selectedStory, showSnackbar } = useStateContext();

  useEffect(() => {
    setcommentsLikes(item?.likes);
    setisLike(
      commentsLikes?.some((user) => {
        return user === userState.id;
      }),
    );
  }, []);

  const userType = [
    'Operations',
    'Admin',
    'Manager',
    'Assistant Manager',
    'Super Admin',
    'celebrity',
  ];

  const handleDelete = async (commenendId) => {
    try {
      const { data } = await axiosInstance.patch(
        '/story/delete-story-comment',
        {
          comment: `${commenendId}`,
          StoryId: `${selectedStory?._id}`,
        },
      );

      setcomments(data?.comments);
      // props?.route?.params?.setcomment(res?.data?.comments);
    } catch (error) {
      const errorMessage =
        error?.response?.data?.error || 'An unexpected error occurred.';
      showSnackbar(errorMessage);
    }
  };

  const handleLike = (item) => {
    if (!isLike) {
      const templike = [...commentsLikes];
      const newLikes = {
        phoneNumber: userState.phoneNumber,
        fullName: userState.fullName,
        type: userState.type,
        profile: userState.profile,
        _id: userState.id,
      };
      templike.push(newLikes);
      handleLikee(templike, item);
      setisLike(true);
    } else {
      const newlikes = commentsLikes.filter((reaction) => {
        return reaction !== userState.id;
      });
      handleLikee(newlikes, item);
      setisLike(false);
    }
  };
  const handleLikee = async (liked, item) => {
    try {
      const response = await axiosInstance.patch(
        `/story/update-story-Comment/${selectedStory?._id}`,
        {
          likes: liked,
          commentId: item?._id,
          type: 'like',
        },
      );
      setcommentsLikes(response?.data?.likes);
    } catch (error) {}
  };

  return (
    <Pressable
      style={styles.commentMainContainer}
      onLongPress={() => setmodalVisible(true)}
    >
      <View style={{ paddingVertical: screenHeight * 0.01 }}>
        <Image
          style={styles.userImg}
          source={{
            uri: `${BASE_URL}/images/${item.commented_by.profile}`,
          }}
        />
      </View>
      <View>
        <View style={styles.commentTextContainer}>
          <View style={styles.nameFollow}>
            <Text style={styles.userName}>{item.commented_by.fullName}</Text>
            {userType?.includes(item.commented_by.type) && (
              <MaterialCommunityIcons
                name="check-decagram"
                style={styles.adminIcon}
              />
            )}
          </View>
          <View>
            <Text style={styles.commentText}>{item.description}</Text>
          </View>
        </View>
        <View style={styles.actionComment}>
          <Text style={styles.time}>{timePassed}</Text>
          <TouchableOpacity
            style={styles.likeButton}
            onPress={() => handleLike(item)}
          >
            <AntDesign
              name={isLike ? 'like1' : 'like2'}
              size={16}
              color={isLike ? Color.Blue : Color.Black}
            />
            {commentsLikes?.length !== 0 && (
              <Text style={styles.time}>{commentsLikes?.length}</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>

      <DeleteCommentModal
        modalVisible={modalVisible}
        setModalVisible={setmodalVisible}
        comment={item}
        handleDelete={handleDelete}
        screen="story"
      />
    </Pressable>
  );
};

export default CommentListStroy;

const styles = StyleSheet.create({
  commentTextContainer: {
    marginLeft: screenWidth * 0.04,
    alignItems: 'baseline',
    alignSelf: 'flex-start',
    backgroundColor: '#F5F6FA',
    paddingHorizontal: screenWidth * 0.04,
    paddingVertical: screenHeight * 0.013,
    borderRadius: 15,
    marginRight: '15%',
    marginTop: '2.5%',
  },

  commentMainContainer: {
    flexDirection: 'row',
    paddingHorizontal: screenHeight * 0.02,
    marginBottom: screenHeight * 0.01,
  },

  nameFollow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userName: {
    fontWeight: 'bold',
    color: Color.Black,
    paddingRight: screenWidth * 0.01,
  },
  follow: {
    color: Color.Blue,
    marginLeft: screenWidth * 0.013,
  },
  commentText: {
    color: Color.Black,
    lineHeight: 21,
  },
  action: {
    flexDirection: 'row',
    marginLeft: screenWidth * 0.19,
    marginTop: screenHeight * 0.006,
  },
  time: {
    fontSize: 13,
    fontWeight: '500',
    color: '#585858',
    lineHeight: 21,
    marginRight: screenWidth * 0.04,
  },

  userImg: {
    width: 40,
    height: 40,
    resizeMode: 'contain',
    borderRadius: screenHeight * 0.1,
  },
  userContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 2,
  },
  userNameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    overflow: 'hidden',
  },
  postDuration: {
    fontSize: 14,
    fontWeight: '400',
    fontFamily: 'Roboto_400Regular',
    color: Color.DarkGrey,
  },
  postDescr: {
    fontSize: 13,
    fontFamily: 'Roboto_400Regular',
    lineHeight: 20,
    paddingHorizontal: screenWidth * 0.04,
    paddingVertical: screenHeight * 0.015,
  },
  adminIcon: {
    // marginLeft: 5,
    alignSelf: 'center',
    fontSize: screenHeight * 0.015,
    color: Color.Blue,
  },
  actionComment: {
    flexDirection: 'row',
    marginLeft: screenWidth * 0.052,
    marginTop: 5,
  },
  likeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
});
