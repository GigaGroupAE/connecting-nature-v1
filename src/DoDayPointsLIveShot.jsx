import {
  Dimensions,
  Image,
  ImageBackground,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, { useEffect, useMemo, useRef } from 'react';
import ViewShot from 'react-native-view-shot';
import { BASE_URL } from '../CONSTANTS';
import Color from '../assets/colors/Color';
import { useStateContext } from './contexts/ContextProvider';
import { axiosInstance } from '../axiosInstance';
import { getRemainingTime } from './utils/CampaignsHelper';
import { useNavigation } from '@react-navigation/native';
const Height = Dimensions.get('screen').height;
const Width = Dimensions.get('screen').width;
const DoDayPointsLIveShot = ({ doday, loading }) => {
  const remainingTime = useMemo(() => getRemainingTime(doday?.endTime), []);

  const navigation = useNavigation();

  const { campaignViewShortImage, setcampaignViewShortImage } =
    useStateContext();
  const viewShotRef = useRef();
  const width = 300;
  const height = 300;
  const captureImage = async () => {
    const imageUri = await viewShotRef.current.capture({
      width,
      height,
    });
    setcampaignViewShortImage(imageUri);
  };
  useEffect(() => {
    if (campaignViewShortImage === null) {
      captureImage();
    }
  }, [campaignViewShortImage, setcampaignViewShortImage]);
  useEffect(() => {
    if (
      remainingTime === 'Campaign ended' &&
      campaignViewShortImage !== null &&
      doday?.status !== 'archived'
    ) {
      handleEndCampaign();
      navigation.navigate('Home');
    }
  }, [remainingTime, campaignViewShortImage]);

  const handleEndCampaign = async () => {
    try {
      const res = await axiosInstance.patch(
        `/archives/addArchiveCampaign/${doday._id}`,
      );

      if (res.data) {
      }
    } catch (error) {
      console.log(error, 'error while campaign archive');
    }
  };
  // const handleCampaignCompletion = async () => {
  //   const teamAPoints = doday?.teamA?.points || 0;
  //   const teamBPoints = doday?.teamB?.points || 0;

  //   let description;
  //   let leadingTeam;
  //   let lossingTeam;

  //   // if (teamAPoints > teamBPoints) {
  //   //   leadingTeam = 'Team A';
  //   //   lossingTeam = 'Team B';
  //   // } else if (teamAPoints < teamBPoints) {
  //   //   leadingTeam = 'Team B';
  //   //   lossingTeam = 'Team A';
  //   // } else {
  //   //   description =
  //   //     'In a thrilling showdown, Team A and Team B have battled to a spectacular tie! 🏆 Both teams showcased incredible talent and resilience, and the result reflects the true spirit of competition. 🌟🙌 #TieGame #Sportsmanship #Unstoppable 🥇🥈';
  //   // }

  //   // if (!description) {
  //   //   description = `And the winner is... ${leadingTeam}! 🏆 Their determination and teamwork shone brightly. 🌟 Kudos to ${lossingTeam} for an outstanding effort! 🙌 #Champions #Teamwork`;
  //   // }

  //   try {
  //     // const formData = new FormData();
  //     // formData.append('description', description);
  //     // formData.append('postedby', JSON.stringify('654fece4d4690e92e1609c6e'));
  //     // formData.append('media', {
  //     //   name: 'image/jpeg',
  //     //   uri: campaignViewShortImage,
  //     //   type: 'image/jpeg',
  //     // });

  //     // const config = {
  //     //   headers: {
  //     //     'Content-Type': 'multipart/form-data',
  //     //     Accept: 'application/json',
  //     //     'auth-token': userState.token,
  //     //   },
  //     // };

  //     // Uncomment when ready to make the API call
  //     // const { data } = await axios.post(
  //     //   `${BASE_URL}/story/addstory/`,
  //     //   formData,
  //     //   config,
  //     // );

  //     showSnackbar(
  //       'The campaign time is over. Thank you for your participation',
  //     );
  //     handleEndCampaign();
  //     navigation.navigate('Home');
  //   } catch (error) {
  //     console.log(error, 'Error occurred');
  //   }
  // };
  return (
    <View style={{ width: '100%' }}>
      <ViewShot
        ref={viewShotRef}
        options={{
          format: 'jpg',
          // quality: 1,
          width: 250,
          // height: 200,
        }}
        // captureMode="update"
        onCapture={captureImage}
      >
        <View style={styles.teamsContainer}>
          <ImageBackground
            source={require('../assets/vs-bg.png')}
            resizeMode="cover"
          >
            <View style={styles.blendMode}>
              <View style={styles.teams}>
                <Image
                  style={styles.avatar}
                  source={
                    doday?.teamA?.leader?.profile
                      ? {
                          uri: `${BASE_URL}/images/${doday?.teamA?.leader?.profile}`,
                        }
                      : require('../assets/avatar-placeholder.png')
                  }
                />

                <Text style={styles.leaderUserName}>
                  {doday.teamA?.leader?.fullName || 'No Leader'}
                </Text>
                <Text style={styles.teamText}>Team A</Text>

                <Text style={styles.points}>{doday.teamA.points}</Text>
              </View>
              <View style={styles.teams}>
                <Image
                  style={styles.avatar}
                  source={
                    doday?.teamA?.leader?.profile
                      ? {
                          uri: `${BASE_URL}/images/${doday?.teamB?.leader?.profile}`,
                        }
                      : require('../assets/avatar-placeholder.png')
                  }
                />

                <Text style={styles.leaderUserName}>
                  {doday?.teamB?.leader?.fullName || 'No Leader'}
                </Text>
                <Text style={styles.teamText}>Team B</Text>

                <Text style={styles.points}>{doday.teamB?.points}</Text>
              </View>
            </View>
          </ImageBackground>
        </View>
      </ViewShot>
    </View>
  );
};

export default DoDayPointsLIveShot;

const styles = StyleSheet.create({
  pollHeading: {
    alignItems: 'center',
  },
  headingText: {
    fontFamily: 'Roboto_600SemiBold',
    color: Color.Black,
    fontSize: Height * 0.032,
    width: '100%',
  },
  pollDesc: {
    fontFamily: 'Roboto_400Regular',
    color: Color.Grey,
    fontSize: Height * 0.02,
  },
  teamsContainer: {
    width: '100%',
    backgroundColor: Color.DarkBlue,
  },
  blendMode: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    alignContent: 'center',
    paddingHorizontal: Width * 0.08,
    paddingVertical: Height * 0.015,
  },
  teams: {
    alignItems: 'center',
    marginTop: Height * 0.012,
  },
  teamText: {
    fontFamily: 'Roboto_600SemiBold',
    color: Color.White,
    fontSize: Height * 0.017,
    width: '100%',
    textAlign: 'center',
  },
  points: {
    fontFamily: 'Roboto_600SemiBold',
    color: Color.White,
    fontSize: Height * 0.045,
    textAlign: 'center',
    marginTop: Height * 0.012,
  },
  avatar: {
    marginTop: 10,
    width: 70,
    height: 70,
    borderRadius: 35,
    resizeMode: 'contain',
  },
  leaderUserName: {
    fontFamily: 'Roboto_600SemiBold',
    color: Color.White,
    fontSize: Height * 0.023,
    textAlign: 'center',
    marginTop: Height * 0.012,
  },
});
