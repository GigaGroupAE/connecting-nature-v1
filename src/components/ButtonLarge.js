import {
  StyleSheet,
  TouchableOpacity,
  Text,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import Color from '../../assets/colors/Color';

export default function ButtonLarge(props) {
  return (
    <TouchableOpacity
      style={styles.touchableOpacity}
      onPress={() => props.click()}
      disabled={props.disabled}
    >
      {props?.disabled ? (
        <ActivityIndicator style={styles.titleText} color={Color.White} />
      ) : (
        <Text style={styles.titleText}>{props.title}</Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  titleText: {
    paddingVertical: Dimensions.get('screen').height * 0.015,
    alignSelf: 'center',
    color: Color.White,
    fontFamily: 'Roboto_600SemiBold',
    fontSize: Dimensions.get('screen').height * 0.02,
  },
  touchableOpacity: {
    backgroundColor: Color.Blue,
    marginTop: 42,
    alignSelf: 'center',
    width: '80%',
    borderRadius: 8,
  },
});
