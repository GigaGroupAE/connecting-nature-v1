import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Color from '../../assets/colors/Color';
import { Ionicons } from 'react-native-vector-icons';
import { scale } from 'react-native-size-matters';
import { useNavigation } from '@react-navigation/native';
import { screenHeight } from '../utils/ScreenDimensions';

export default function Header(props) {
  const navigation = useNavigation();
  return (
    <View style={styles.container}>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <AntDesign name="arrowleft" size={25} color={Color.Black} />
        </TouchableOpacity>
        <Text style={styles.title}>{props.title}</Text>
      </View>
      <TouchableOpacity
        style={styles.archiveContainer}
        onPress={() => navigation.navigate('ArchivedScreen')}
      >
        <Ionicons name="archive-outline" style={styles.icon} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Color.White,
    alignContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: 19,
    paddingVertical: 10,
    borderBottomWidth: 2,
    borderColor: Color.VeryLightGrey,
    justifyContent: 'space-between',
  },
  title: {
    color: Color.Black,
    fontSize: screenHeight * 0.019,
    lineHeight: 30,
    marginTop: 2,
    marginLeft: 10,
    fontFamily: 'Roboto_600SemiBold',
  },
  archiveContainer: {
    paddingHorizontal: scale(10),
  },
  icon: {
    fontSize: screenHeight * 0.024,
    color: Color.Black,
  },
});
