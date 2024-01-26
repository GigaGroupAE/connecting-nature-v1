import { useState, useEffect } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Pressable,
  Image,
  Dimensions,
  TextInput,
} from 'react-native';
import {
  AntDesign,
  Ionicons,
  Entypo,
  MaterialCommunityIcons,
} from 'react-native-vector-icons';
import axios from 'axios';
import { useUserState } from '../../slices/userSlice';
import { BASE_URL } from '../../../CONSTANTS';
import Post from '../../components/Post';
import { theme } from '../../../theme';
import { usePostState } from '../../slices/postsSlice';
import Color from './../../../assets/colors/Color';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
import { axiosInstance } from '../../../axiosInstance';
import _debounce from 'lodash.debounce';

const SearchScreen = () => {
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState('');
  const userstate = useUserState();
  const [user, setuser] = useState([]);
  const [activeFilter, setActiveFilter] = useState('post');
  const handleCross = () => {
    setSearchQuery('');
  };
  const [posts, setposts] = useState([]);
  const postState = usePostState();
  useEffect(() => {
    axios
      .get(`${BASE_URL}/user/new-chat-contacts`, {
        headers: {
          'auth-token': userstate.token,
        },
      })
      .then((res) => {
        //1- EXCLUDING LOGGED IN USER
        const tempUsers = res.data.contacts.filter(
          (user) => user.phoneNumber !== userstate.phoneNumber,
        );

        setuser([...tempUsers]);
      })
      .catch((e) => {});
  }, []);

  const handlebackpress = () => {
    navigation.goBack();
  };
  const debouncedSearch = _debounce(async (query) => {
    try {
      const response = await axiosInstance.get(
        `/posts/search-post?search=${query}`,
      );
      setposts(response?.data?.searchResult);
    } catch (error) {}
  }, 1000);
  const onChangeSearch = (query) => {
    setSearchQuery(query);
    if (activeFilter === 'post' || 'hashtag') {
      debouncedSearch(query);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Color.White }}>
      <ScrollView>
        <View style={styles.mainContainer}>
          <TouchableOpacity onPress={handlebackpress}>
            <AntDesign name="arrowleft" size={28} color={Color.Black} />
          </TouchableOpacity>
          <View style={styles.searchContainer}>
            <TextInput
              autoFocus
              placeholder="Search"
              value={searchQuery}
              onChangeText={onChangeSearch}
              style={styles.textInput}
              placeholderTextColor={Color.Black}
            />
            <Pressable onPress={handleCross}>
              {searchQuery === '' ? (
                <Ionicons name="search" size={20} color={Color.Black} />
              ) : (
                <Entypo name="cross" size={20} color={Color.Black} />
              )}
            </Pressable>
          </View>
        </View>

        <ScrollView horizontal={true}>
          <>
            <View
              style={
                activeFilter === 'post' ? styles.activeTagMain : styles.tagMain
              }
            >
              <Pressable
                onPress={() => setActiveFilter('post')}
                style={({ pressed }) => pressed && styles.pressedItem}
              >
                <Text
                  style={
                    activeFilter === 'post'
                      ? styles.activeTagText
                      : styles.tagText
                  }
                >
                  Posts
                </Text>
              </Pressable>
            </View>
            <View
              style={
                activeFilter === 'users' ? styles.activeTagMain : styles.tagMain
              }
            >
              <Pressable
                onPress={() => setActiveFilter('users')}
                style={({ pressed }) => pressed && styles.pressedItem}
              >
                <Text
                  style={
                    activeFilter === 'users'
                      ? styles.activeTagText
                      : styles.tagText
                  }
                >
                  Users
                </Text>
              </Pressable>
            </View>
            <View
              style={
                activeFilter === 'hashtag'
                  ? styles.activeTagMain
                  : styles.tagMain
              }
            >
              <Pressable
                onPress={() => setActiveFilter('hashtag')}
                style={({ pressed }) => pressed && styles.pressedItem}
              >
                <Text
                  style={
                    activeFilter === 'hashtag'
                      ? styles.activeTagText
                      : styles.tagText
                  }
                >
                  Trending
                </Text>
              </Pressable>
            </View>
          </>
        </ScrollView>

        {searchQuery === ''
          ? null
          : activeFilter === 'post' &&
            posts
              .filter((post) =>
                post.description
                  .toLowerCase()
                  .includes(searchQuery.toLowerCase()),
              )
              .map((post, index) => <Post post={post} key={index} />)}

        {searchQuery === ''
          ? null
          : activeFilter === 'hashtag' &&
            posts
              .filter((post) =>
                post.description
                  .toLowerCase()
                  .includes(searchQuery.toLowerCase()),
              )
              .map((post, index) => <Post post={post} key={index} />)}
        {searchQuery === ''
          ? null
          : activeFilter === 'users' &&
            user.map((u, idx) => {
              if (u.fullName.match(searchQuery)) {
                return (
                  <Pressable
                    android_ripple={{ color: Color.VeryLightGrey }}
                    style={styles.personCard}
                    onPress={() =>
                      navigation.navigate('UserProfile', {
                        userPhoneNumber: u?.phoneNumber,
                      })
                    }
                    key={idx}
                  >
                    {/* //IMAGE HERE */}
                    <View
                      style={{ flexDirection: 'row', alignItems: 'center' }}
                    >
                      {u.profile ? (
                        <View
                          style={{
                            flexDirection: 'row',
                          }}
                        >
                          <Image
                            source={{ uri: `${BASE_URL}/images/${u.profile}` }}
                            style={{
                              height: Dimensions.get('screen').height * 0.05,
                              width: Dimensions.get('screen').height * 0.05,
                              borderRadius:
                                Dimensions.get('screen').height * 0.1,
                              backgroundColor: Color.VeryLightGrey,
                            }}
                          />
                          <View
                            style={{
                              marginLeft: '9%',
                              flexDirection: 'row',
                              alignItems: 'center',
                              marginTop: '-7%',
                            }}
                          >
                            <Text style={styles.name}>{u.fullName}</Text>
                            {(u.type === 'Operations' ||
                              u.type === 'Admin' ||
                              u.type === 'Manager' ||
                              u.type === 'Assistant Manager' ||
                              u.type === 'Super Admin' ||
                              u.type === 'celebrity') && (
                              <MaterialCommunityIcons
                                name="check-decagram"
                                style={styles.adminIcon}
                              />
                            )}
                          </View>
                        </View>
                      ) : (
                        <Ionicons
                          name="search"
                          size={20}
                          color={Color.LightGrey}
                        />
                      )}
                    </View>
                    {/* //arrow */}
                    <View
                      style={{
                        alignItems: 'center',
                      }}
                    >
                      <AntDesign
                        name="arrowright"
                        size={22}
                        style={styles.icon}
                      />
                    </View>
                  </Pressable>
                );
              } else {
                return null;
              }
            })}
        {searchQuery === ''
          ? null
          : activeFilter === 'videos' &&
            postState.posts.map((post, index) => {
              if (post.description.match(searchQuery)) {
                if (post.media.type === 'video/mp4') {
                  return <Post post={post} key={index} />;
                }
              } else {
                return null;
              }
            })}
        {searchQuery && (
          <Pressable style={({ pressed }) => pressed && styles.pressedItem}>
            <Text style={styles.allResult}>
              See all result for "{searchQuery}"
            </Text>
          </Pressable>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default SearchScreen;
const styles = StyleSheet.create({
  filter: {
    flexDirection: 'row',
    backgroundColor: Color.White,
    height: Dimensions.get('screen').height * 0.08,
    paddingVertical: Dimensions.get('screen').height * 0.02,
    justifyContent: 'space-evenly',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: Color.LightGrey,
    flexWrap: 'wrap',
  },
  mainContainer: {
    flexDirection: 'row',
    alignContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    marginHorizontal: 10,
  },
  btn: {
    height: '100%',
    width: '20%',
  },
  verticleLine: {
    height: '100%',
    width: 1,
    backgroundColor: '#909090',
  },
  pressed: {
    opacity: 0.5,
  },
  activeFilter: {
    color: Color.Blue,
    width: '100%',
    fontSize: 20,
  },
  inactiveFilter: {
    color: Color.LightGrey,
    width: '100%',
    fontSize: 20,
  },
  personCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderColor: 'rgba(154, 154, 154, 0.5)',
    paddingHorizontal: 15,
    paddingVertical: 10,
    alignItems: 'center',
  },
  icon: {
    alignSelf: 'center',
    color: Color.Grey,
    marginRight: '3%',
  },
  name: {
    color: Color.Black,
    fontSize: 14,
    fontFamily: 'Roboto_600SemiBold',
    alignSelf: 'center',
  },
  type: {
    fontFamily: theme.fonts.family.regular,
    fontSize: 12,
    color: Color.Black,
  },
  tagMain: {
    backgroundColor: Color.White,
    elevation: 4,
    flexDirection: 'row',
    marginRight: 5,
    marginLeft: 5,
    marginTop: 10,
    borderRadius: Dimensions.get('screen').height * 0.1,
    marginBottom: 10,
  },
  tagText: {
    fontFamily: 'Roboto_500Medium',
    fontSize: 13,
    color: Color.Black,
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderRadius: 50,
  },
  activeTagMain: {
    backgroundColor: Color.LightBlue,
    elevation: 4,
    flexDirection: 'row',
    marginRight: 5,
    marginLeft: 5,
    marginTop: 10,
    borderRadius: Dimensions.get('screen').height * 0.1,
    marginBottom: 10,
  },
  activeTagText: {
    fontFamily: 'Roboto_600SemiBold',
    fontSize: 13,
    color: Color.Black,
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderRadius: 50,
  },
  pressedItem: {
    opacity: 0.5,
    color: Color.Black,
  },
  allResult: {
    color: Color.Blue,
    fontFamily: 'Roboto_500Medium',
    fontSize: 13,
    paddingHorizontal: 15,
    marginTop: 10,
  },
  adminIcon: {
    marginLeft: 5,
    alignSelf: 'center',
    fontSize: 14,
    color: Color.Blue,
  },
  searchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 4,
    marginLeft: 10,
    borderRadius: Dimensions.get('screen').height * 0.1,
    backgroundColor: '#F1F1F1',
  },
  textInput: {
    fontSize: 14,
    marginTop: 3,
    fontFamily: 'Roboto_400Regular',
    width: '82%',
  },
});
