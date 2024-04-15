import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import AddButton from '../AddButton';
import { MaterialIcons, Entypo } from 'react-native-vector-icons';
import { useNavigation } from '@react-navigation/native';
import Color from '../../../assets/colors/Color';
import { useUserState } from '../../slices/userSlice';
import { Image } from 'react-native';
import { scale } from 'react-native-size-matters';
import { screenHeight, screenWidth } from '../../utils/ScreenDimensions';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AddPostSvg from '../SVG/AddPostSvg';
import StoryIcon from '../SVG/StoryIcon';

const CreatePost = (props) => {
  const navigation = useNavigation();
  const userstate = useUserState();

  return (
    <Modal animationType="slide">
      <View style={styles.mainContainer}>
        <TouchableOpacity
          onPress={() => props.onCancel()}
          style={styles.cancelIcon}
        >
          <Entypo name="cross" color={Color.Black} size={30} />
        </TouchableOpacity>
        {userstate.type !== 'user' && (
          <View style={styles.spotLight}>
            <Text style={styles.text}>New Spotlight Story</Text>
          </View>
        )}
        {userstate.type !== 'user' && (
          <View style={styles.post}>
            <TouchableOpacity
              style={styles.addPost}
              onPress={() => {
                navigation.navigate('AddPost', {
                  origin: 'story',
                });
                props.closeModal();
              }}
            >
              <StoryIcon />
              {/* <Image
                source={require('../../../assets/story.png')}
                style={styles.imageStyle}
              /> */}
            </TouchableOpacity>
          </View>
        )}

        <View style={styles.createPost}>
          <Text style={styles.text}>Create New Post</Text>
          <TouchableOpacity
            style={styles.addPostContainer}
            onPress={() => props.onAddPost()}
          >
            <AddPostSvg />
          </TouchableOpacity>
        </View>
        {/* <AddButton
          clicktrigger={() => props.onAddPost()}
          activeScreen={'CreatePost'}
        /> */}
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    height: '100%',
    width: '100%',
    paddingHorizontal: 17,
    flex: 1,
  },
  spotLight: {
    position: 'absolute',
    bottom: '28%',
    right: '38%',
    alignSelf: 'flex-end',
  },
  post: {
    position: 'absolute',
    bottom: '25%',
    paddingHorizontal: 17,
    marginLeft: '75%',
  },
  createPost: {
    position: 'absolute',
    right: screenWidth * 0.13,
    bottom: screenHeight * 0.15,
    width: screenWidth * 0.52,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 17,
    justifyContent: 'space-between',
  },
  cancelIcon: {
    alignSelf: 'flex-end',
    paddingHorizontal: 15,
    marginTop: screenHeight * 0.03,
  },
  addPost: {
    alignContent: 'center',
    alignItems: 'center',
    // backgroundColor: Color.LightGrey,
    borderRadius: 50,
    padding: 17,
    width: 58,
    height: 58,
    justifyContent: 'center',
  },
  text: {
    fontFamily: 'Roboto_400Regular',
    color: Color.Black,
    fontSize: 14,
  },
  imageStyle: {
    width: scale(28),
    height: scale(28),
  },
  addPostContainer: {
    // backgroundColor: 'red',
    // position: 'absolute',
    // right: screenWidth * 0.1,
    // bottom: screenHeight * 0.12,
  },
});

export default CreatePost;
