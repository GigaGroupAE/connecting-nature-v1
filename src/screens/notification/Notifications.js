import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Image,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import Header from '../../components/Header';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useUserState } from './../../slices/userSlice';
import { BASE_URL } from '../../../CONSTANTS';
import DummyData from '../../components/DummyData';
import Color from '../../../assets/colors/Color';
import { MaterialCommunityIcons, Entypo } from 'react-native-vector-icons';
import ButtonSmall from '../../components/ButtonSmall';

export default function NotificationScreen() {
  const [notifications, setnotifications] = useState([]);
  const userState = useUserState();
  useEffect(() => {
    axios
      .get(`${BASE_URL}/notify/getnoties`, {
        headers: {
          'auth-token': userState.token,
        },
      })
      .then((res) => {
        setnotifications(res.data);
      })
      .catch((err) => {});
  }, []);

  return (
    <>
      <Header
        title="Notifications"
        icon={<Entypo name="cross" color={'#707070'} size={30} />}
      />
      <View style={styles.mainContainer}>
        <FlatList
          // data={notifications}
          data={DummyData}
          keyExtractor={(item, index) => {
            return index.toString();
          }}
          renderItem={({ item }) => {
            return (
              <View>
                {/* <Image source={item.avatar} /> */}
                <TouchableOpacity>
                  <View style={styles.singleNotification}>
                    <Image
                      style={styles.avatar}
                      source={require('../../../assets/avatar-placeholder.png')}
                    />
                    <View>
                      <View style={styles.notificationHead}>
                        <Text style={styles.userName}>{item.name}</Text>
                        <Text style={styles.categoryText}>{item.category}</Text>
                      </View>
                      <View>
                        <Text style={styles.notificationText}>
                          {item.notification}
                        </Text>
                        <View style={{ flexDirection: 'row' }}>
                          <Text style={styles.timeText}>{item.date}</Text>
                          {/* <Text style={styles.timeText}>{item.time}</Text> */}
                        </View>
                        <View
                          style={{
                            flexDirection: 'row',
                            marginLeft: 11,
                            justifyContent: 'space-around',
                          }}
                        >
                          <ButtonSmall title={item.deny} />
                          <ButtonSmall title={item.accept} />
                        </View>
                      </View>
                    </View>
                  </View>
                  <TouchableOpacity
                    style={styles.threeDots}
                    // onPress={showModal}
                  >
                    <MaterialCommunityIcons
                      name="dots-horizontal"
                      size={25}
                      color={Color.Grey}
                    />
                  </TouchableOpacity>
                </TouchableOpacity>
              </View>
            );
          }}
        />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    // height: "100%",
    // width: "100%",
    width: Dimensions.get('screen').width,
    backgroundColor: Color.White,
  },
  singleNotification: {
    marginHorizontal: 19,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    alignContent: 'center',
    backgroundColor: Color.White,
    borderBottomWidth: 2,
    borderBottomColor: Color.LightBg,
  },
  avatar: {
    width: Dimensions.get('screen').height * 0.07,
    height: Dimensions.get('screen').height * 0.07,
    borderRadius: Dimensions.get('screen').height * 0.1,
  },
  notificationHead: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  userName: {
    fontFamily: 'Roboto_600SemiBold',
    fontSize: 14,
    color: Color.Black,
    marginLeft: 11,
  },
  categoryText: {
    fontFamily: 'Roboto_400Regular',
    fontSize: 12,
    color: Color.Blue,
    marginLeft: 8,
  },

  timeText: {
    fontFamily: 'Roboto_400Regular',
    fontSize: 12,
    color: Color.LightGrey,
    marginLeft: 11,
  },
  notification: {
    marginLeft: 11,
  },
  notificationText: {
    fontFamily: 'Roboto_400Regular',
    fontSize: 14,
    marginLeft: 11,
    color: Color.Grey,
  },
  threeDots: {
    position: 'absolute',
    right: 19,
    marginTop: 6,
  },
});
