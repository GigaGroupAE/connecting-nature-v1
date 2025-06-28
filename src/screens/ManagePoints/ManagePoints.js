import axios from 'axios';
import React, { useEffect, useState } from 'react';
import {
  Text,
  Image,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  SafeAreaView,
  Modal, // Import Modal component
  View,
  StatusBar,
  ScrollView, // Import View component
} from 'react-native';
//TODO :: UNINSTALL BELOW PKG

import Color from '../../../assets/colors/Color';
import { BASE_URL, OUTSOURC_GROUP } from '../../../CONSTANTS';
import HeaderNormal from '../../components/HeaderNormal';
import { useStateContext } from '../../contexts/ContextProvider';
import { useUserState } from '../../slices/userSlice';

//make sure backend can handle all these categories
const categories = [
  { id: 1, name: 'Campaigns Volunteering' },
  { id: 2, name: 'Order Volunteering' },
  { id: 3, name: 'Bonus' },
  { id: 4, name: 'Posts' },
];

const users = [
  {
    id: '1',
    name: 'John Doe',
    role: 'Developer',
    image: 'https://randomuser.me/api/portraits/men/1.jpg',
  },
  {
    id: '2',
    name: 'Jane Smith',
    role: 'Designer',
    image: 'https://randomuser.me/api/portraits/women/2.jpg',
  },
  // Add more users here
  {
    id: '1',
    name: 'John Doe',
    role: 'Developer',
    image: 'https://randomuser.me/api/portraits/men/1.jpg',
  },
  {
    id: 'kaljfd',
    name: 'Jane Smith',
    role: 'Designer',
    image: 'https://randomuser.me/api/portraits/women/2.jpg',
  },
  {
    id: 'asdfafa',
    name: 'John Doe',
    role: 'Developer',
    image: 'https://randomuser.me/api/portraits/men/1.jpg',
  },
  {
    id: 'asfdadf',
    name: 'Jane Smith',
    role: 'Designer',
    image: 'https://randomuser.me/api/portraits/women/2.jpg',
  },
  {
    id: '   we',
    name: 'John Doe',
    role: 'Developer',
    image: 'https://randomuser.me/api/portraits/men/1.jpg',
  },
  {
    id: 'dsaf',
    name: 'Jane Smith',
    role: 'Designer',
    image: 'https://randomuser.me/api/portraits/women/2.jpg',
  },
  {
    id: '   adfaf',
    name: 'John Doe',
    role: 'Developer',
    image: 'https://randomuser.me/api/portraits/men/1.jpg',
  },
  {
    id: 'afdq',
    name: 'Jane Smith',
    role: 'Designer',
    image: 'https://randomuser.me/api/portraits/women/2.jpg',
  },
];

const UserListItem = ({ user, onPress }) => (
  <TouchableOpacity style={styles.userItemContainer} onPress={onPress}>
    <Image source={{ uri: `${user.photo}` }} style={styles.userItemImage} />
    <Text style={styles.userItemName}>{user.name}</Text>
    <Text style={styles.userItemRole}>{user.phoneNumber}</Text>
  </TouchableOpacity>
);

const ManagePointsScreen = () => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [modalVisible, setModalVisible] = useState(false); // State variable to control modal visibility
  const [usersData, setUsersData] = useState();
  const userState = useUserState();
  const { setLoading, showSnackbar } = useStateContext();

  const handleUserPress = (user) => {
    setSelectedUser(user);
    setModalVisible(true); // Open the modal when the user is pressed
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setSelectedCategory('');
  };

  const renderUserItem = ({ item }) => (
    <UserListItem user={item} onPress={() => handleUserPress(item)} />
  );

  //categories
  const [selectedCategory, setSelectedCategory] = useState('');

  const handleCategorySelect = (id) => {
    setSelectedCategory(id);
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      handleCloseModal();
      const { data } = await axios.post(
        `${BASE_URL}/user/award-points`,
        {
          phoneNumber: selectedUser.phoneNumber,
          category: categories[selectedCategory - 1].name,
        },
        {
          headers: {
            'auth-token': userState.token,
          },
        },
      );
      if (data.success) {
        showSnackbar(data.message);
      }
    } catch (error) {
      showSnackbar(error.message);
      console.log('error is ', error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await axios.get(
        `${BASE_URL}/groups/getgroupbyid/${OUTSOURC_GROUP}`,
        {
          headers: {
            'auth-token': userState.token,
          },
        },
      );

      setUsersData(data.members);
    };
    fetchData();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar translucent backgroundColor={Color.Blue} />
      <View style={{ marginTop: StatusBar.currentHeight }}>
        <HeaderNormal title={'Award Points'} />
      </View>

      <FlatList
        data={usersData}
        renderItem={renderUserItem}
        keyExtractor={(user) => user.phoneNumber}
        numColumns={2}
        contentContainerStyle={styles.listContainer}
      />

      <Modal
        visible={modalVisible} // Show modal when modalVisible is true
        onRequestClose={handleCloseModal} // Close modal when back button is pressed
        animationType="slide"
        transparent={true}
      >
        <View style={styles.modalContainer}>
          <TouchableOpacity
            style={styles.blurrePortion}
            onPress={handleCloseModal}
          ></TouchableOpacity>
          <View style={styles.contentPortion}>
            {/* CONTENT WILL GO HERE */}

            <Text style={styles.title}>Select a Category</Text>
            <ScrollView>
              {categories.map((category) => (
                <TouchableOpacity
                  key={category.id}
                  onPress={() => handleCategorySelect(category.id)}
                  style={[
                    styles.categoryButton,
                    selectedCategory === category.id &&
                      styles.selectedCategoryButton,
                  ]}
                  activeOpacity={0.8}
                >
                  <Text
                    style={[
                      styles.categoryText,
                      selectedCategory === category.id &&
                        styles.selectedCategoryText,
                    ]}
                  >
                    {category.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            <TouchableOpacity
              disabled={!selectedCategory}
              style={[
                styles.submitButton,
                !selectedCategory && styles.disabledSubmitButton,
              ]}
              activeOpacity={0.8}
              onPress={handleSubmit}
            >
              <Text style={styles.submitButtonText}>Submit</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContainer: {
    paddingHorizontal: 16,
    paddingVertical: 24,
  },
  userItemContainer: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 8,
    marginHorizontal: 8,
    marginVertical: 8,
    alignItems: 'center',
    padding: 16,
    maxWidth: '50%',
  },
  userItemImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 8,
  },
  userItemName: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 4,
  },
  userItemRole: {
    fontSize: 14,
    color: '#777',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)', // Semi-transparent background
  },
  blurrePortion: {
    flex: 1,
  },
  contentPortion: {
    //backgroundColor: "white",
    height: '50%',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    overflow: 'hidden',
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  categoryButton: {
    backgroundColor: '#f2f2f2',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  categoryText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  selectedCategoryButton: {
    backgroundColor: '#3498db',
  },
  selectedCategoryText: {
    color: '#fff',
  },
  submitButton: {
    backgroundColor: '#3498db',
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
  },
  submitButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  disabledSubmitButton: {
    backgroundColor: '#bdc3c7',
  },
});

export default ManagePointsScreen;
