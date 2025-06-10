import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Dimensions,
  Pressable,
} from 'react-native';
import { calculateTimeDifference } from '../utils/timeDifference';
import { AntDesign } from 'react-native-vector-icons';
import { BASE_URL } from '../../CONSTANTS';
import Color from '../../assets/colors/Color';
import { useNavigation } from '@react-navigation/native';
import DeleteCommentModal from './DeleteCommentModal';
import { useUserState } from '../slices/userSlice';
import { axiosInstance } from '../../axiosInstance';
import AdminIcon from './AdminIcon';
import { screenHeight, screenWidth } from '../utils/ScreenDimensions';
export default function Comment({
  comment,
  handleDelete,
  index,
  updatereactions,
  postid,
}) {
  const timePassed = calculateTimeDifference(comment?.date);
  const userState = useUserState();

  const [modalVisible, setmodalVisible] = useState(false);
  const navigation = useNavigation();
  const [commentsLikes, setcommentsLikes] = useState(comment?.likes);
  const [isLike, setisLike] = useState(false);

  useEffect(() => {
    setcommentsLikes(comment?.likes);
    setisLike(
      commentsLikes?.some((user) => {
        return user === userState.id;
      }),
    );
  }, [comment]);

  const handleLikee = async (liked, item) => {
    try {
      const response = await axiosInstance.patch(
        `/posts/update-Comment/${postid}`,
        {
          likes: liked,
          commentId: item?._id,
          type: 'like',
        },
      );

      setcommentsLikes(response?.data?.likes);
    } catch (error) {}
  };

  const commented_by = comment?.commented_by;

  const getindex = (item, aindex) => {
    updatereactions(item, aindex);
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

  return (
    <View>
      {/* Comment Section */}

      <View>
        <View style={styles.commentMainContainer}>
          <Image
            style={styles.avatar}
            source={{ uri: `${BASE_URL}/images/${commented_by?.profile}` }}
          />
          <TouchableOpacity
            style={styles.commentTextContainer}
            onLongPress={() => setmodalVisible(true)}
          >
            <View style={styles.nameFollow}>
              <Pressable
                onPress={() => {
                  navigation.navigate('UserProfile', {
                    userPhoneNumber: commented_by?.phoneNumber,
                  });
                }}
                style={{ flexDirection: 'row' }}
              >
                <Text style={styles.userName}>{commented_by?.fullName}</Text>
                <AdminIcon userType={commented_by?.type} />
              </Pressable>
            </View>

            <View>
              <Text style={styles.commentText}>{comment?.description}</Text>
            </View>
          </TouchableOpacity>
        </View>
        <View style={styles.action}>
          <Text style={styles.time}>{timePassed}</Text>
          <TouchableOpacity
            style={styles.likeButton}
            onPress={() => handleLike(comment)}
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
        comment={comment}
        handleDelete={handleDelete}
        index={index}
        updatereactions={getindex}
        screen="home"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  main: {
    paddingHorizontal: 15,
    borderRadius: 20,
    height: '100%',
    width: '100%',
  },
  commentMainContainer: {
    marginTop: 10,
    flexDirection: 'row',
    alignContent: 'center',
    alignItems: 'center',
  },
  commentTextContainer: {
    marginLeft: 15,
    alignItems: 'baseline',
    alignSelf: 'flex-start',
    backgroundColor: '#F5F6FA',
    padding: 7,
    borderRadius: 15,
    marginRight: '15%',
  },
  avatar: {
    alignSelf: 'flex-start',
    borderRadius: Dimensions.get('screen').height * 0.1,
    width: Dimensions.get('screen').height * 0.06,
    height: Dimensions.get('screen').height * 0.06,
  },
  nameFollow: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  userName: {
    fontWeight: 'bold',
    color: Color.Black,
    // paddingRight: screenWidth * 0.0,
    fontSize: screenHeight * 0.016,
    marginBottom: screenHeight * 0.002,
  },
  follow: {
    color: Color.Blue,
    marginLeft: 5,
  },
  commentText: {
    color: Color.Black,
    lineHeight: 20,
  },
  action: {
    flexDirection: 'row',
    marginLeft: 65,
    marginTop: 5,
  },
  time: {
    fontSize: 13,
    fontWeight: '500',
    color: Color.Black,
    lineHeight: 21,
    marginRight: 15,
    fontFamily: 'Roboto_400Regular',
  },
  like: {
    fontSize: 13,
    color: Color.Black,
    fontWeight: '500',
    lineHeight: 21,
  },
  liked: {
    fontSize: 13,
    color: Color.Blue,
    fontWeight: '500',
    lineHeight: 21,
  },
  likeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
});
