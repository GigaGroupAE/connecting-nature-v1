import { StyleSheet, Text, View, Image, Dimensions } from 'react-native';
import { useEffect } from 'react';
import Color from '../../../assets/colors/Color';
import { useNavigation } from '@react-navigation/native';
export default function Welcome() {
  const navigation = useNavigation();
  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.navigate('AdminHome');
    }, 1000);
    return () => clearTimeout(timer);
  }, [navigation]);

  const Width = Dimensions.get('screen').width;
  const Height = Dimensions.get('screen').height;
  return (
    <View style={[styles.container, { width: Width, height: Height }]}>
      <Image
        source={require('../../../assets/crmlogo.png')}
        style={styles.logo}
      />
      <Text style={styles.top_title}>Giga Group Management</Text>

      <Image
        source={require('../../../assets/slide-1.png')}
        style={[styles.image, { width: Width, resizeMode: 'cover' }]}
      />
      <View style={styles.content}>
        <Text style={[styles.title, { width: Width }]}>
          Welcome to Intranet
        </Text>
        <Text style={[styles.description, { width: Width }]}>
          Explore Intranet's Power - Manage Departments, Organize Files, Run
          Campaigns, Nurture Customers, Share Ideas, and Build Teams!
        </Text>
      </View>
    </View>
  );
}
const Width = Dimensions.get('screen').width;
const Height = Dimensions.get('screen').height;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    marginBottom: Height * 0.01,
    width: '70%',
    height: 50,
    resizeMode: 'contain',
  },
  top_title: {
    marginBottom: Height * 0.05,
    color: Color.Black,
  },
  image: {
    marginBottom: Height * 0.045,
    height: Height * 0.3,
  },
  title: {
    fontFamily: 'Roboto_600SemiBold',
    fontSize: Height * 0.025,
    fontWeight: 'bold',
    color: Color.Black,
    textAlign: 'center',
  },
  description: {
    fontFamily: 'Roboto_400Regular',
    fontSize: Height * 0.015,
    marginVertical: Height * 0.02,
    marginBottom: Height * 0.15,
    color: '#707070',
    textAlign: 'center',
    lineHeight: 18,
    paddingHorizontal: Width * 0.015,
  },
  content: {},
});
