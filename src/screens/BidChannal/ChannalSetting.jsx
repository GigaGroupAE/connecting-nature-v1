import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React from 'react';
import Color from '../../../assets/colors/Color';
import HeaderNormal from '../../components/HeaderNormal';
import { useNavigation, useRoute } from '@react-navigation/native';
import { BASE_URL } from '../../../CONSTANTS';
import { screenHeight, screenWidth } from '../../utils/ScreenDimensions';
import { buttonTitle, titleStyle } from '../Decorations/ModalStyle';
import { MaterialIcons, Entypo } from 'react-native-vector-icons';
import FileSvg from '../../components/SVG/FIleSvg';
import StarSvg from '../../components/SVG/Star';
import PropertySvg from '../../components/SVG/Property';
import WinerSvg from '../../components/SVG/Winner';
import AddparticipantsSvg from '../../components/SVG/AddParticipant';
import ArrowLeft from '../../components/SVG/ArrowLeft';
import { useUserState } from '../../slices/userSlice';

const settingData = [
  {
    id: 1,
    title: 'Archived Biddings',
    icon: <FileSvg />,
    navigationScreen: 'ArchivedBidding',
  },
  {
    id: 2,
    title: 'Starred Messages',
    icon: <StarSvg />,
    navigationScreen: '',
  },
  {
    id: 3,
    title: 'Add Property',
    icon: <PropertySvg />,
    navigationScreen: '',
  },
  {
    id: 4,
    title: 'Announce Winner',
    icon: <WinerSvg />,
    navigationScreen: '',
  },
  {
    id: 5,
    title: 'Add Participant',
    icon: <AddparticipantsSvg />,
    navigationScreen: '',
  },
];

const approvedRoles = ['Owner', 'Lead'];

const ChannalSetting = () => {
  const { navigate } = useNavigation();
  const { params } = useRoute();
  const userState = useUserState();
  const groupData = params?.groupData;
  const admin = params?.groupData?.members.filter(
    (item) => item?.privilege === 'Owner',
  );
  return (
    <View style={styles.container}>
      <HeaderNormal title="Channel Settings" />
      {/* Header  */}
      <View style={styles.header}>
        <Image
          source={{ uri: `${BASE_URL}/images/${groupData?.groupPic}` }}
          style={styles.profileImage}
        />
        <View style={{ gap: 4 }}>
          <View style={styles.rowContainer}>
            <Text style={buttonTitle}>{groupData?.title}</Text>
            <MaterialIcons name="edit" style={styles.icon} />
          </View>
          <View style={styles.rowContainer}>
            <Text style={styles.title}>{admin[0]?.member?.fullName}</Text>
            <Text style={styles.title}>. Admin</Text>
          </View>
        </View>
      </View>
      <View
        style={{
          flex: 1,
          width: '92%',
          alignSelf: 'center',
        }}
      >
        {/* Navigation Screens  */}

        <View>
          <FlatList
            data={settingData}
            renderItem={({ item }) => {
              return (
                <TouchableOpacity
                  style={styles.menuContainer}
                  onPress={() => navigate(item?.navigationScreen)}
                >
                  <View style={{ ...styles.rowContainer, gap: 13 }}>
                    {item?.icon}
                    <Text style={styles.itemname}>{item?.title}</Text>
                  </View>
                  <View>
                    <ArrowLeft />
                  </View>
                </TouchableOpacity>
              );
            }}
            contentContainerStyle={{
              gap: 30,
              marginVertical: screenHeight * 0.025,
            }}
          />
        </View>

        {/* Members Details  */}

        <View style={styles.menuContainer}>
          <Text style={styles.itemname}>GROUP MEMBERS</Text>
          <View style={styles.membersContainer}>
            <Text style={styles.regularText}>
              {groupData?.members?.length} Members
            </Text>
          </View>
        </View>

        <View>
          <FlatList
            data={groupData?.members}
            renderItem={({ item }) => {
              const role = approvedRoles.includes(item?.privilege);

              return (
                <View style={styles.memberContainer}>
                  <View style={styles.rowContainer}>
                    <Image
                      source={{
                        uri: `${BASE_URL}/images/${item?.member?.profile}`,
                      }}
                      style={styles.profileImage}
                    />
                    <View style={{ gap: 4 }}>
                      <View style={styles.rowContainer}>
                        <Text style={styles.username}>
                          {item?.member?.phoneNumber === userState?.phoneNumber
                            ? 'You'
                            : item?.member?.fullName}
                        </Text>

                        {role && (
                          <View style={styles.rowContainer}>
                            <Entypo name="dot-single" />

                            <Text style={styles.regularText}>
                              {item?.privilege}
                            </Text>
                          </View>
                        )}
                      </View>
                    </View>
                  </View>

                  <View>
                    {item?.privilege !== 'Owner' && (
                      <Text style={{ ...styles.username, color: Color.Black }}>
                        Remove
                      </Text>
                    )}
                  </View>
                </View>
              );
            }}
            contentContainerStyle={{
              gap: 12,
              marginVertical: screenHeight * 0.02,
            }}
          />
        </View>
      </View>
    </View>
  );
};

export default ChannalSetting;

const styles = StyleSheet.create({
  container: {
    backgroundColor: Color.White,
    flex: 1,
  },
  header: {
    backgroundColor: Color.Blue,
    flexDirection: 'row',
    paddingVertical: screenHeight * 0.018,
    paddingHorizontal: screenWidth * 0.025,
    alignItems: 'center',
    gap: 10,
  },
  profileImage: {
    width: 56,
    height: 55,
    borderRadius: 28,
    resizeMode: 'cover',
  },
  title: {
    fontFamily: 'Roboto_500Medium',
    color: Color.White,
    fontSize: screenHeight * 0.016,
  },
  rowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  icon: {
    color: Color.White,
    fontSize: screenHeight * 0.019,
    paddingLeft: screenWidth * 0.02,
  },
  menuContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  itemname: {
    fontFamily: 'Roboto_500Medium',
    fontSize: screenHeight * 0.017,
  },
  regularText: {
    fontFamily: 'Poppins_400Regular',
    fontSize: screenHeight * 0.014,
  },
  membersContainer: {
    backgroundColor: Color.Disable,
    paddingHorizontal: screenWidth * 0.03,
    paddingVertical: screenHeight * 0.006,
    borderRadius: screenHeight * 0.01,
  },
  memberContainer: {
    backgroundColor: Color.Disable,
    paddingVertical: screenHeight * 0.01,
    paddingHorizontal: screenWidth * 0.02,
    borderRadius: screenHeight * 0.01,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    justifyContent: 'space-between',
  },
  username: {
    fontFamily: 'Poppins_500Medium',
    color: Color.Grey,
    fontWeight: '900',
    fontSize: screenHeight * 0.017,
  },
});
