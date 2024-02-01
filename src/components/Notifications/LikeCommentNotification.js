import {
  View,
  Text,
  Image,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import { BASE_URL } from '../../../CONSTANTS';
import { theme } from '../../../theme';
import { calculateTimeDifference } from '../../utils/timeDifference';
import { useNavigation } from '@react-navigation/native';
import AdminIcon from '../AdminIcon';

const Height = Dimensions.get('screen').height;

const LikeCommentNotification = ({ data }) => {
  const navigation = useNavigation();
  const sendData = {
    userName: data?.body?.user?.fullName,
    postId: data?.data?.content,
  };
  const handleNavigation = () => {
    navigation.navigate('PostViewNotify', sendData);
  };

  return (
    <TouchableOpacity style={styles.outerDiv} onPress={handleNavigation}>
      <Image
        source={{ uri: `${BASE_URL}/images/${data?.body?.user?.profile}` }}
        style={styles.avatar}
      />
      <View style={{ marginLeft: '5%' }}>
        <View
          style={{
            alignItems: 'center',
            flexDirection: 'row',
          }}
        >
          <Text style={styles.name}>{data?.body?.user?.fullName}</Text>
          <AdminIcon userType={data?.body?.user?.type} />
        </View>
        {data.data.title === 'post-comment' && (
          <Text style={styles.description}>Commented on your post </Text>
        )}
        {data.data.title === 'post-like' && (
          <Text style={styles.description}>Liked your post </Text>
        )}
        {data.data.title === 'post-share' && (
          <Text style={styles.description}>Shared your post </Text>
        )}
        <Text style={styles.time}>
          {' '}
          {calculateTimeDifference(data?.body?.date)}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default LikeCommentNotification;

const styles = StyleSheet.create({
  outerDiv: {
    flex: 1,
    flexDirection: 'row',

    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(154, 154, 154, 0.5)',
    paddingBottom: 10,
    marginTop: '5%',
  },
  name: {
    fontFamily: theme.fonts.family.medium,
    color: '#515151',
  },
  time: {
    color: '#707070',
    fontFamily: theme.fonts.family.regular,
    fontSize: Height * 0.017,
  },
  type: {
    color: '#4582C3',
    fontFamily: 'Roboto_500Medium',
  },
  avatar: {
    height: 60,
    width: 60,
    borderRadius: 60 / 2,
  },
  description: {
    fontFamily: theme.fonts.family.regular,
    color: 'rgba(112, 112, 112, 0.7)',
  },
});
