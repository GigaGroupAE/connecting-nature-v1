import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Dimensions,
  FlatList,
  Pressable,
} from 'react-native';
import { Entypo } from 'react-native-vector-icons';
import Color from '../../../../assets/colors/Color';
import CurrentMember from './CurrentMember';
import { useStateContext } from '../../../contexts/ContextProvider';
import { axiosInstance } from '../../../../axiosInstance';

const Height = Dimensions.get('screen').height;
const Width = Dimensions.get('screen').width;

const Members = (props) => {
  // const navigation = useNavigation();
  const [currentPage, setCurrentPage] = useState('Team A');
  const [HomePage, setHomePage] = useState(true);
  const [TeamB, setTeamB] = useState(false);
  const [users, setUsers] = useState(null);

  const { group, setLoading } = useStateContext();

  const ATeam = () => {
    setCurrentPage('Team A');
    setHomePage(true);
    setTeamB(false);
  };
  const BTeam = () => {
    setCurrentPage('Team B');
    setHomePage(false);
    setTeamB(true);
  };

  const renderItem = ({ item }) => {
    const data = currentPage === 'Team A' ? item.member : item;
    return (
      <View>
        <CurrentMember data={data} CurrentPage={currentPage} />
      </View>
    );
  };

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      const { data } = await axiosInstance.get(
        '/user/get-by-query?type=Manager',
      );
      //filtering out those who are already the part of group

      const groupMembers = group?.members?.map((m) => m.member?._id);

      const filteredUsers = data?.users?.filter((user) => {
        return !groupMembers.includes(user._id);
      });
      setUsers(filteredUsers);
      setLoading(false);
    };
    fetchUsers();
  }, [group]);

  return (
    <Modal animationType="slide" transparent>
      <View
        style={{
          height: '100%',
          width: '100%',
          //   paddingHorizontal: 17,
          marginTop: '20%',
          borderTopLeftRadius: Height * 0.02,
          borderTopRightRadius: Height * 0.02,
          backgroundColor: Color.White,
          borderRadius: 8,
          shadowColor: Color.Grey,
          shadowOffset: {
            width: 0,
            height: 4,
          },
          shadowOpacity: 0.27,
          shadowRadius: 4.65,
          elevation: 6,
        }}
      >
        <TouchableOpacity
          onPress={() => props.onCancel()}
          style={{ alignSelf: 'flex-end', marginRight: Width * 0.03 }}
        >
          <Entypo name="cross" color={Color.Black} size={30} />
        </TouchableOpacity>
        <View>
          <View style={styles.listContainer}>
            <Pressable
              onPress={ATeam}
              style={HomePage ? styles.active : styles.disable}
            >
              <View>
                <Text style={HomePage ? styles.HeadingActive : styles.Heading}>
                  Current Member
                </Text>
              </View>
            </Pressable>
            <TouchableOpacity
              onPress={BTeam}
              style={TeamB ? styles.active : styles.disable}
            >
              <View>
                <Text style={TeamB ? styles.HeadingActive : styles.Heading}>
                  Invite Member
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
        <View>
          {currentPage === 'Team A' && (
            <FlatList
              data={group?.members}
              renderItem={renderItem}
              keyExtractor={(item) => item._id}
              ItemSeparatorComponent={() => <View style={styles.separator} />}
              style={{ zIndex: 1 }}
            />
          )}
          {currentPage === 'Team B' && (
            <FlatList
              data={users}
              renderItem={renderItem}
              keyExtractor={(item) => item._id}
              ItemSeparatorComponent={() => <View style={styles.separator} />}
              style={{ zIndex: 1 }}
            />
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Color.White,
    height: '100%',
  },
  listContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',

    borderBottomWidth: 0.5,
    borderBottomColor: Color.Grey,
    height: Height * 0.06,
  },

  active: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '40%',

    borderBottomColor: Color.Blue,
    borderBottomWidth: 2,
    justifyContent: 'center',
  },
  disable: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '40%',
    justifyContent: 'center',
  },
  Heading: {
    alignSelf: 'center',
    fontFamily: 'Roboto_500Medium',
    fontSize: 14,
    fontWeight: '6',
  },
  HeadingActive: {
    alignSelf: 'center',
    fontFamily: 'Roboto_500Medium',
    fontWeight: '6',
    // color: Color.Blue,
    fontSize: Height * 0.018,
  },
});

export default Members;
