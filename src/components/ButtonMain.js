import {
  StyleSheet,
  TouchableOpacity,
  Text,
  ActivityIndicator,
} from 'react-native';
import Color from '../../assets/colors/Color';
import { screenHeight } from '../utils/ScreenDimensions';

export default function ButtonMain(props) {
  console.log(props);
  return (
    <TouchableOpacity
      disabled={props.disabled}
      style={styles.container}
      onPress={() => props.callback(true)}
    >
      {props?.disabled ? (
        <ActivityIndicator
          color={Color.White}
          style={{
            alignSelf: 'center',
            justifyContent: 'center',
            marginTop: screenHeight * 0.015,
          }}
        />
      ) : (
        <Text style={styles.title}>{props.title}</Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Color.Blue,
    marginTop: 25,
    width: 180,
    height: 48,
    borderRadius: 8,
  },
  title: {
    padding: 11,
    alignSelf: 'center',
    color: Color.White,
    fontFamily: 'Roboto_600SemiBold',
    fontSize: 18,
  },
});
