import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useState } from 'react';
import Color from '../../../assets/colors/Color';
import HeaderNormal from '../../components/HeaderNormal';
import { useNavigation, useRoute } from '@react-navigation/native';
import VideoPlayer from 'expo-video-player';
import { BASE_URL } from '../../../CONSTANTS';
import { screenHeight, screenWidth } from '../../utils/ScreenDimensions';
import { ResizeMode } from 'expo-av';
import ProjectDetails from '../../components/ProjectDetails';
import { descriptionTextStyle, titleStyle } from '../Decorations/ModalStyle';
import { Image } from 'expo-image';

const BiddingPropertyDetails = () => {
  const { navigate } = useNavigation();
  const { params } = useRoute();
  const video = React.useRef(null);
  const propertyData = params?.item;
  const [firstImage, setfirstImage] = useState(propertyData?.image[0]);

  const formattedPrice = Number(propertyData?.price).toLocaleString();
  return (
    <View style={styles.container}>
      <HeaderNormal title="Property Detail" />
      {/* property images  */}

      <View>
        {firstImage.mimetype === 'image/jpeg' ? (
          <TouchableOpacity
            onPress={() =>
              navigate('ViewImage', {
                url: `${firstImage.filename}`,
              })
            }
          >
            <Image
              source={{ uri: `${firstImage.filename}` }}
              style={styles.image}
              contentFit="cover"
            />
          </TouchableOpacity>
        ) : (
          <VideoPlayer
            // style={styles.image}
            style={{
              width: screenWidth,
              height: screenHeight * 0.35,
            }}
            fullscreen={{
              enterFullscreen: () => {
                video.current.setStatusAsync({
                  shouldPlay: false,
                });
                navigate('PostView', {
                  url: `${firstImage.filename}`,
                  message: '',
                  mediatype: 'video',
                  description: '',
                  //video: props.video,
                  screen: 'message',
                });
              },
              exitFullscreen: (e) => console.log(e),
            }}
            defaultControlsVisible
            videoProps={{
              isLooping: false,
              ref: video,
              source: {
                uri: `${firstImage.filename}`,
              },
              shouldPlay: false,
              resizeMode: ResizeMode.COVER,
            }}
          />
        )}
        <FlatList
          data={propertyData?.image}
          animationEnabled={false}
          renderItem={({ item, index }) => {
            // Skip rendering the first item
            if (firstImage?._id === item?._id) {
              return null;
            }
            return (
              <Pressable onPress={() => setfirstImage(item)}>
                {item?.mimetype === 'image/jpeg' ? (
                  <Image
                    source={{ uri: `${item?.filename}` }}
                    style={{
                      width: screenWidth * 0.25,
                      height: screenHeight * 0.07,
                      resizeMode: 'cover',
                      borderRadius: 4,
                    }}
                    contentFit="cover"
                  />
                ) : (
                  <View
                    style={{
                      width: screenWidth * 0.25,
                      height: screenHeight * 0.07,
                      borderRadius: screenHeight * 0.01,
                    }}
                  >
                    <VideoPlayer
                      // style={styles.image}
                      style={{
                        width: screenWidth * 0.24,
                        height: screenHeight * 0.068,

                        borderRadius: screenHeight * 0.01,
                      }}
                      // fullscreen={{
                      //   enterFullscreen: () => {
                      //     video.current.setStatusAsync({
                      //       shouldPlay: false,
                      //     });
                      //     navigation.navigate('PostView', {
                      //       url: `${BASE_URL}/images/${postVideo}`,
                      //       message: '',
                      //       mediatype: 'video',
                      //       description: videoDescription,
                      //       //video: props.video,
                      //       autherName: videoAuther,
                      //       screen: 'home',
                      //     });
                      //   },
                      //   exitFullscreen: (e) => console.log(e),
                      // }}
                      // defaultControlsVisible
                      videoProps={{
                        isLooping: false,
                        ref: video,
                        source: {
                          uri: `${item.filename}`,
                        },
                        shouldPlay: false,
                        resizeMode: ResizeMode.COVER,
                      }}
                    />
                  </View>
                )}
              </Pressable>
            );
          }}
          horizontal
          contentContainerStyle={{ gap: 10, marginVertical: '2%' }}
          showsHorizontalScrollIndicator={false}
        />
        <View style={styles.headerContainer}>
          <View style={styles.titleContainer}>
            <Text style={{ ...titleStyle, fontSize: screenHeight * 0.017 }}>
              {propertyData?.ProjectName}
            </Text>
            <TouchableOpacity style={styles.soonButton}>
              <Text style={styles.subTitle}>{propertyData?.status}</Text>
            </TouchableOpacity>
          </View>
          <ProjectDetails
            item={propertyData}
            containerStyle={styles.detailsContainer}
          />
          <View style={styles.contentContainer}>
            <Text style={descriptionTextStyle}>
              {propertyData?.description}
            </Text>
          </View>
          <View style={styles.priceContainer}>
            <Text style={{ ...titleStyle, fontSize: screenHeight * 0.015 }}>
              Starting Bidding Price
            </Text>
            <Text style={{ ...titleStyle, fontSize: screenHeight * 0.017 }}>
              {formattedPrice} PKR
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};

export default BiddingPropertyDetails;

const styles = StyleSheet.create({
  container: {
    backgroundColor: Color.White,
    flex: 1,
  },
  image: {
    width: screenWidth,
    height: screenHeight * 0.35,
    resizeMode: 'cover',
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: screenHeight * 0.009,
  },
  soonButton: {
    // borderColor: 1,
    borderWidth: 1,
    paddingHorizontal: screenWidth * 0.026,
    borderRadius: screenHeight * 0.01,
    justifyContent: 'center',
  },
  subTitle: {
    fontFamily: 'Roboto_500Medium',
    fontSize: screenHeight * 0.013,
    textAlign: 'center',
    width: '100%',
  },
  contentContainer: {
    flexDirection: 'row',
    // alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerContainer: {
    width: screenWidth * 0.95,
    alignSelf: 'center',
  },
  detailsContainer: {
    flexDirection: 'row',
    gap: 30,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});
