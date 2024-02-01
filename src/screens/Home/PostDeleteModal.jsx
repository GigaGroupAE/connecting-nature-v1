import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { useCallback } from 'react';
import { useUserState } from '../../slices/userSlice';
import { BASE_URL } from '../../../CONSTANTS';
import Color from '../../../assets/colors/Color';
import axios from 'axios';
import { useStateContext } from '../../contexts/ContextProvider';
import { scale } from 'react-native-size-matters';
import {
  Ionicons,
  MaterialIcons,
  MaterialCommunityIcons,
} from 'react-native-vector-icons';
import { axiosInstance } from '../../../axiosInstance';

const PostDeleteModal = ({ post, reload, setmodalVisible }) => {
  const userState = useUserState();
  const { showSnackbar } = useStateContext();

  const deletePostNotifications = async () => {
    try {
      await axiosInstance.delete(`/notify/delete-notification/${post._id}`);
    } catch (error) {}
  };

  const archivePost = useCallback(
    async (post) => {
      try {
        const response = await axios.post(
          `${BASE_URL}/archives/addPostArchive/${post._id}`,
          {},
          {
            headers: {
              'auth-token': userState.token,
            },
          },
        );

        if (response.data.success) {
          showSnackbar('Post deleted successfully');
          reload();
          deletePostNotifications();
        } else {
          handleApiError('Failed to archive the post. Please try again.');
        }
      } catch (error) {
        handleApiError('Failed to archive the post. Please try again.');
      } finally {
        // setmodalVisible(false);
      }
    },
    [handleApiError],
  );

  const blockUser = useCallback(
    async (post) => {
      const config = {
        headers: {
          'auth-token': userState.token,
        },
      };
      try {
        const { data } = await axios.patch(
          `${BASE_URL}/user/block-user/${post.postedby._id}`,
          {},
          config,
        );

        if (data.success) {
          showSnackbar('User blocked successfully');
          reload();
        } else {
          handleApiError('Failed to block the user. Please try again.');
        }
      } catch (error) {
        handleApiError('Failed to block the user. Please try again.');
      } finally {
        // setmodalVisible(false);
      }
    },
    [handleApiError],
  );

  // const handleCancel = useCallback(() => {
  //   setmodalVisible(false);
  // }, [setmodalVisible]);

  const handleApiError = useCallback(
    (errorMessage) => {
      showSnackbar(errorMessage);
    },
    [showSnackbar],
  );

  return (
    <View style={styles.container}>
      <View style={styles.hiddenContainer}>
        <Ionicons name="eye-off" style={styles.eyeOff} />
        <Text style={styles.hiddenTitle}>Hidden</Text>
      </View>
      <View style={styles.conforContainer}>
        <View style={styles.titleContainer}>
          {userState.phoneNumber === post.postedby.phoneNumber ? (
            <Text style={styles.title}>
              By Deleting this Post you agree that you can’t access this post
              anymore.
            </Text>
          ) : (
            <Text style={styles.title}>
              Hiding posts helps Connecting Nature Personalize your Feed.
            </Text>
          )}
        </View>
        <TouchableOpacity
          style={styles.undoContainer}
          onPress={() => setmodalVisible(false)}
        >
          <Text style={styles.undo}>Undo</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.deleteMain}>
        {userState.phoneNumber === post.postedby.phoneNumber ? (
          <TouchableOpacity
            onPress={() => archivePost(post)}
            style={styles.deleteContainer}
          >
            <MaterialIcons name="delete" style={styles.deleteIcon} />
            <Text style={styles.deleteTitle}>Delete Post</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={styles.deleteContainer}
            onPress={() => blockUser(post)}
          >
            <MaterialCommunityIcons
              name="alert-octagon"
              style={styles.deleteIcon}
            />
            <Text style={styles.deleteTitle}>
              Block [ {post.postedby?.fullName}]
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default PostDeleteModal;

const styles = StyleSheet.create({
  container: {
    backgroundColor: Color.White,
    marginBottom: scale(10),
    paddingHorizontal: scale(16),
    paddingVertical: scale(14),
  },
  hiddenContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  eyeOff: {
    fontSize: scale(16),
    color: Color.Blue,
  },
  hiddenTitle: {
    paddingHorizontal: scale(10),
    fontSize: scale(11),
    fontFamily: 'Roboto_400Regular',
    color: Color.DarkGrey,
  },
  conforContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    overflow: 'hidden',
    paddingVertical: scale(8),
    borderBottomWidth: scale(2),
    borderColor: Color.VeryLightGrey,
  },
  title: {
    width: scale(240),
    fontFamily: 'Roboto_500Medium',
    fontSize: scale(13),
  },
  undoContainer: {
    backgroundColor: '#CBCED5',
    position: 'relative',
    height: scale(30),
    width: scale(55),
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: scale(8),
    top: scale(-7),
  },
  deleteMain: {},
  deleteContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: scale(9),
  },
  deleteIcon: {
    fontSize: scale(18),
  },
  deleteTitle: {
    fontFamily: 'Roboto_600SemiBold',
    paddingHorizontal: scale(7),
    fontSize: scale(13),
  },
});
