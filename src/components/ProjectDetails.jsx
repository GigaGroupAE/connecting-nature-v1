import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import HomeSvg from './SVG/HomeSvg';
import BedRoomSvg from './SVG/BedRoomSvg';
import UnitSvg from './SVG/UnitSvg';
import { screenHeight, screenWidth } from '../utils/ScreenDimensions';

const ProjectDetails = ({ item, containerStyle }) => {
  return (
    <View style={styles.contentContainer}>
      <View style={containerStyle}>
        <View style={styles.details}>
          <HomeSvg />
          <Text style={styles.descriptionTitle}>{item?.PropertyType}</Text>
        </View>
        <View style={styles.details}>
          <BedRoomSvg />
          <Text style={styles.descriptionTitle}>{item?.bedrooms} Bedrooms</Text>
        </View>
        <View style={styles.details}>
          <UnitSvg />
          <Text style={styles.descriptionTitle}>Unit {item?.unit}</Text>
        </View>
      </View>
    </View>
  );
};

export default ProjectDetails;

const styles = StyleSheet.create({
  contentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  descriptionContainer: {
    width: screenWidth * 0.6,
  },
  detailsContainer: {
    // flex: 1,
    gap: 12,
    // flexDirection: 'row',
  },
  details: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  descriptionTitle: {
    fontFamily: 'Poppins_400Regular',
    fontSize: screenHeight * 0.0133,
    lineHeight: 16,
  },
});
