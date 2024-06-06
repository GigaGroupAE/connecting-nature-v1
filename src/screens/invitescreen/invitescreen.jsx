import * as React from 'react';
import {
  Dimensions,
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  TextInput,
  Pressable,
} from 'react-native';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import MapView, { Circle, Marker } from 'react-native-maps';
import { useUserState } from './../../slices/userSlice';
import { useEffect, useState } from 'react';
import axios from 'axios';
import ButtonMain from '../../components/ButtonMain';
import { useNavigation } from '@react-navigation/native';
import { useStateContext } from '../../contexts/ContextProvider.js';
//BASE_URL
import { BASE_URL } from '../../../CONSTANTS';
import { SafeAreaView } from 'react-native-safe-area-context';
import Color from '../../../assets/colors/Color';

//axios instance
import { axiosInstance } from '../../../axiosInstance';
//haversines import
const haversine = require('haversine');

//this function will return either true or false
const withinRadius = (origin, destination, radius) => {
  return haversine(origin, destination, { unit: 'km' }) < radius; // sill return true if distance is less
};

//Responsive Width and Height
const Width = Dimensions.get('screen').width;
const Height = Dimensions.get('screen').height;

//ORIGIN OF EVENT WILL BE THE PIN LOCATION THAT IS DRAGGABLE

export default function Invitescreen({ route }) {
  //radius selected by user that is passed as params
  // NOTE : radius is coming as a string and it's a number representing kilometers
  // to convert it into meters multiply it with 1000 when using inside the mapview circle

  const userState = useUserState();
  const userstate = useUserState();

  const { dodayJson, action, campaign } = route.params;
  const doday = JSON.parse(dodayJson);

  const [radius, setRadius] = useState(doday?.radius);
  const [loading, setLoading] = useState(false);

  //REF FOR MAPS
  const mapRef = React.useRef();
  // initial point of circle
  // this circleOriin variable will hold the location of the event
  const [circleOrigin, setCircleOrigin] = React.useState({
    latitude: userState?.location?.latitude,
    longitude: userState?.location?.longitude,
  });
  //initial region

  const [region, setRegion] = React.useState({
    latitude: userState?.location?.latitude,
    longitude: userState?.location?.longitude,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

  const { showSnackbar } = useStateContext();

  const [users, setusers] = useState([]);
  const navigation = useNavigation();

  //creating the campaign

  useEffect(() => {
    axios
      .get(`${BASE_URL}/user/getusers`, {
        headers: {
          'auth-token': userstate.token,
        },
      })
      .then((res) => {
        //removing current user from the state

        let filterd = res.data?.filter(
          (f) => f.phoneNumber !== route?.params?.userState?.phoneNumber,
        );

        // setusers(res.data);
        if (action === 'update') {
          //removing previous volunteers
          filterd = filterd.filter((v) => {
            return !campaign?.volunteersIds.includes(v._id);
          });
        }
        setusers(filterd);
      })
      .catch((err) => {});
  }, []);
  //GETTING USERS WITHIN RADIUS

  const withinRadiusUsers = React.useMemo(() => {
    //skipping usres who dont' have location

    return users.filter((user) => {
      if (!user.location) return false;
      return withinRadius(
        circleOrigin,
        user?.location,
        Number(radius), //this is the radius in kms
      );
    });
  }, [circleOrigin, users]);

  const handleUpdate = async () => {
    setLoading(true);
    const updateObj = {};
    const newVols = withinRadiusUsers.map((user) => ({
      user: user._id,
      status: 'invite', // invite, sent ,accepted
    }));
    updateObj.volunteers = newVols;
    updateObj.location = circleOrigin;
    updateObj.radius = radius;
    try {
      const { data } = await axiosInstance.patch(
        `/campaigns/update-campaign/${campaign?.campaignId}`,
        { updateObj },
      );
      setLoading(false);
      if (data.success) {
        showSnackbar('Updated Successfully');
        navigation.navigate('Home');
      }
    } catch (error) {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setLoading(true);
    //location of the event
    doday.location = circleOrigin;
    //saving the users within the radius to the volunteers list
    doday.volunteers = withinRadiusUsers.map((user) => ({
      user: user._id,
      status: 'invite', // invite, sent ,accepted
    }));

    doday.radius = radius;

    //random color for doday
    const items = [
      '#841CA9',
      '#FF3C3C',
      '#27B83E',
      '#0ADDC4',
      '#DA8506',
      '#ECA130',
      '#00BFA8',
      '#60D272',
      '#FF7D7D',
      '#AF66C9',
    ];
    doday.color = items[Math.floor(Math.random() * items.length)];

    axiosInstance
      .post('/campaigns/create', doday)
      .then((res) => {
        axiosInstance
          .post('/posts/addpost', {
            description:
              res.data.campaign.description + res.data.campaign.searchTag,
            postedby: JSON.stringify(userState.id),
          })
          .then((res) => {
            setLoading(false);
          })
          .catch((err) => {});

        navigation.navigate('VolunteersScreen', {
          volunteers: res.data.campaign.volunteers,
          campaignId: res.data.campaign._id,
        });
      })
      .catch((err) => {});
  };
  return (
    <SafeAreaView style={{ backgroundColor: Color.LightBlue, height: '100%' }}>
      <View style={{ height: '100%' }}>
        <GooglePlacesAutocomplete
          placeholder="Enter your location"
          fetchDetails
          GooglePlacesSearchQuery={{
            rankby: 'distance',
          }}
          onPress={(data, details = null) => {
            setRegion({
              latitude: details?.geometry?.location?.lat,
              longitude: details?.geometry?.location?.lng,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            });

            //changing region
            mapRef.current.animateToRegion({
              latitude: details?.geometry?.location?.lat,
              longitude: details?.geometry?.location?.lng,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            });

            //changing circle
            setCircleOrigin({
              latitude: details?.geometry?.location?.lat,
              longitude: details?.geometry?.location?.lng,
            });
          }}
          query={{
            key: 'AIzaSyA_Z2qOzhi_6VaN1QClYYMXvE3MUnk02IY',
            language: 'en',
            components: 'country:pk',
            types: 'establishment',
            radius: 30000,
            location: `${region?.latitude}, ${region?.longitude}`,
          }}
          styles={{
            container: {
              flex: 0,
              position: 'absolute',
              width: '90%',
              zIndex: 1,
              marginTop: Height * 0.03,
              alignSelf: 'center',
            },
            listView: { backgroundColor: 'white' },
          }}
          // renderRightButton={() => (
          //   <AntDesign
          //     name="search1"
          //     size={18}
          //     color={Color.Grey}
          //     style={{
          //       position: "absolute",
          //       right: Width * 0.036,
          //       top: Height * 0.015,
          //     }}
          //   />
          // )}
          listViewDisplayed
        />
        <Pressable style={styles.radiusContainer}>
          <TextInput
            style={styles.radiusText}
            onChangeText={setRadius}
            value={radius}
            placeholder="Change radius"
            keyboardType="numeric"
          />
        </Pressable>
        <MapView
          ref={mapRef}
          style={styles.map}
          initialRegion={region}
          provider="google"
        >
          <Circle
            center={circleOrigin}
            radius={Number(radius) * 1000}
            strokeWidth={2}
            strokeColor="#023020"
            fillColor="#E2E2E2"
          />

          {/* //ORIGIN MARKER */}
          <Marker
            coordinate={region}
            title="event origin"
            draggable
            onDragEnd={(e) => {
              setCircleOrigin(e.nativeEvent.coordinate);
            }}
            pinColor={Color.Blue}
          />

          {/* //USER MARKERS  */}
          {/* //MARKERS */}
          {users.map((user, idx) => {
            if (!user.location) return null;
            return (
              <Marker
                coordinate={user.location}
                key={idx}
                title={user.fullName}
                pinColor="#00FF00"
              >
                <Image
                  source={{ uri: `${BASE_URL}/images/${user.profile}` }}
                  style={{ height: 30, width: 30, borderRadius: 30 / 2 }}
                />
              </Marker>
            );
          })}
        </MapView>
        <View
          style={{
            position: 'absolute',
            bottom: 20,
            alignSelf: 'center',
            // backgroundColor: Color.White,
          }}
        >
          <ButtonMain
            title={action === 'update' ? 'Update' : 'Create & Invite All'}
            callback={action === 'update' ? handleUpdate : handleCreate}
            disabled={loading}
          />
        </View>
        <ScrollView>
          {/* //only the users that are located inside the radius shall be displayed in the list  */}

          {withinRadiusUsers &&
            withinRadiusUsers?.map((user) => (
              <View style={styles.mainListItems} key={user._id}>
                <View style={styles.listItem}>
                  <Image
                    style={styles.icons}
                    source={require('../../../assets/news.png')}
                  />
                  <Text style={styles.itemText}>{user.fullName}</Text>
                </View>
              </View>
            ))}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },

  map: {
    width: Dimensions.get('window').width,
    height: (Dimensions.get('window').height = '100%'),
  },
  mainListItems: {
    marginTop: 15,
    paddingHorizontal: 33,
  },
  listItem: {
    flexDirection: 'row',
    paddingVertical: 15,
  },
  itemText: {
    fontFamily: 'Roboto',
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 21,
    color: '#707070',
    marginLeft: 15,
  },
  radiusContainer: {
    flex: 0,
    position: 'absolute',
    width: '90%',
    zIndex: 1,
    marginTop: Height * 0.1,
    alignSelf: 'center',
    backgroundColor: Color.White,
    borderRadius: Height * 0.01,
  },
  radiusText: {
    paddingHorizontal: Width * 0.028,
    paddingVertical: Height * 0.011,
    color: Color.Grey,
    fontWeight: '600',
  },
});
