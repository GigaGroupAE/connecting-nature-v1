import { Image, StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { BASE_URL } from '../../CONSTANTS';
import { scale } from 'react-native-size-matters';
import { screenHeight } from '../utils/ScreenDimensions';

const LivePointsTeamMember = ({ teamAuser, teamBuser, campaign }) => {
  return (
    <View style={styles.member}>
      <View style={styles.memberCard}>
        <View style={styles.memberimages}>
          <View style={styles.userContainer}>
            {teamAuser?.[0] && (
              <Image
                style={styles.userAvatar}
                source={
                  teamAuser?.[0]
                    ? {
                        uri: `${teamAuser?.[0]?.profile}`,
                      }
                    : null
                }
              />
            )}

            {teamAuser?.[1] && (
              <Image
                style={styles.userAvatar}
                source={
                  teamAuser?.[1]
                    ? {
                        uri: `${teamAuser?.[1]?.profile}`,
                      }
                    : null
                }
              />
            )}

            {teamAuser?.[2] && (
              <Image
                style={styles.userAvatar}
                source={
                  teamAuser?.[2]
                    ? {
                        uri: `${teamAuser?.[2]?.profile}`,
                      }
                    : null
                }
              />
            )}
          </View>

          <View style={styles.memberCount}>
            <Text style={styles.memberLength}>
              {campaign?.teamA?.members?.length} more
            </Text>
          </View>
        </View>
        <View style={styles.memberimages}>
          <View style={styles.userContainer}>
            {teamBuser?.[0] && (
              <Image
                style={styles.userAvatar}
                source={
                  teamBuser?.[0]
                    ? {
                        uri: `${teamBuser?.[0]?.profile}`,
                      }
                    : null
                }
              />
            )}
            {teamBuser?.[1] && (
              <Image
                style={styles.userAvatar}
                source={
                  teamBuser?.[1]
                    ? {
                        uri: `${teamBuser?.[1]?.profile}`,
                      }
                    : null
                }
              />
            )}
            {teamBuser?.[2] && (
              <Image
                style={styles.userAvatar}
                source={
                  teamBuser?.[2]
                    ? {
                        uri: `${teamBuser?.[2]?.profile}`,
                      }
                    : null
                }
              />
            )}
          </View>

          <View style={styles.memberCount}>
            <Text style={styles.memberLength}>
              {' '}
              {campaign?.teamB?.members?.length} more
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};

export default LivePointsTeamMember;

const styles = StyleSheet.create({
  member: {
    paddingHorizontal: scale(16),
    flexDirection: 'row',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  memberCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    paddingVertical: scale(8),
  },
  userContainer: {
    flexDirection: 'row',
    // marginLeft: scale(4),
  },
  userAvatar: {
    width: scale(26),
    height: scale(26),
    borderRadius: scale(13),
    resizeMode: 'contain',
  },
  memberimages: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  memberCount: {
    paddingHorizontal: scale(4),
  },
  memberLength: {
    // fontSize: scale(12),
    fontFamily: 'Roboto_500Medium',
    fontSize: screenHeight * 0.0164,
  },
});
