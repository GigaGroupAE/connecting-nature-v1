import Color from '../../../assets/colors/Color';
import { screenHeight, screenWidth } from '../../utils/ScreenDimensions';

export const container = {
  backgroundColor: Color.White,
  width: screenWidth * 0.9,
  alignSelf: 'center',
  paddingVertical: screenHeight * 0.03,
  alignItems: 'center',
  borderRadius: screenHeight * 0.01,
};
export const inputstyle = {
  padding: screenHeight * 0.015,
  borderRadius: 8,
  width: screenWidth * 0.75,
  fontSize: 14,
  fontFamily: 'Roboto_500Medium',
  marginTop: 16,
  backgroundColor: Color.White,
  shadowColor: Color.Grey,
  shadowOffset: {
    width: 0,
    height: 4,
  },
  shadowOpacity: 0.27,
  shadowRadius: 4.65,
  elevation: 3,
  zIndex: 100,
  position: 'relative',
};

export const titleStyle = {
  fontSize: screenHeight * 0.021,
  fontFamily: 'Roboto_700Bold',
};

export const buttonContainer = {
  backgroundColor: Color.Blue,
  alignItems: 'center',
  paddingVertical: screenHeight * 0.014,
  width: screenWidth * 0.75,
  borderRadius: screenHeight * 0.01,
  marginTop: screenHeight * 0.027,
};
export const buttonTitle = {
  color: Color.White,
  fontSize: screenHeight * 0.021,
  fontFamily: 'Roboto_700Bold',
};

export const mainContainer = {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignSelf: 'center',
  overflow: 'hidden',
  borderBottomWidth: 0.9,
  borderBottomColor: Color.VeryLightGrey,
  paddingHorizontal: screenWidth * 0.04,
  paddingVertical: screenHeight * 0.015,
};

export const itemTitle = {
  fontFamily: 'Roboto_500Medium',
  fontSize: screenHeight * 0.0185,
  fontWeight: '600',
};

export const editButton = {
  width: '75%',
  alignItems: 'center',
  // marginTop: screenHeight * 0.016,
  paddingVertical: screenHeight * 0.006,
  borderRadius: screenHeight * 0.01,
  borderWidth: 0.9,
  borderColor: Color.Black,
};
export const editButtonTitle = {
  fontFamily: 'Roboto_500Medium',
  fontSize: screenHeight * 0.017,
};
