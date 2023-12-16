import React, { useEffect, useState, useRef } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  Dimensions,
  FlatList,
  TouchableOpacity,
  RefreshControl,
} from "react-native";
import Post from "../../components/Post";
import { useNavigation } from "@react-navigation/native";
import { useUserState, useUserStateActions } from "../../slices/userSlice";
import { BASE_URL } from "../../../CONSTANTS.js";
import Color from "../../../assets/colors/Color.js";
import { SafeAreaView } from "react-native-safe-area-context";
import HeaderUserProfile from "../../components/HeaderUserProfile.js";
import axios from "axios";
import { isFollowing } from "../../utils/isFollowing.js";
import VideoPlayer from "expo-video-player";
import { useStateContext } from "../../contexts/ContextProvider.js";
import { MaterialCommunityIcons } from "react-native-vector-icons";
import { ActivityIndicator } from "react-native";
import NoPostHeader from "./NoPostHeader.jsx";

const ITEMS_PER_PAGE = 5;
const Height = Dimensions.get("screen").height;
const Width = Dimensions.get("screen").width;
export default function UserProfile(props) {
  const { setgroup } = useStateContext();
  const [user, setUser] = useState(null);
  const [refresh, setRefresh] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();
  const video = useRef(null);
  const userState = useUserState();
  const [following, setFollowing] = useState(userState.following);
  const [CNGroups, setCNGroups] = useState([]);
  const [posts, setposts] = useState([]);
  const [followersPost, setfollowersPost] = useState([]);
  const userActions = useUserStateActions();
  const [bottomvideo, setbottomvideo] = useState("");
  const [showPostCount, setshowPostCount] = useState([]);

  const [followingg, setIsFollowingg] = useState(
    isFollowing(following, user?.phoneNumber)
  );

  const UserPhoneNumber = props?.route?.params?.userPhoneNumber;
  const activeScreen = props?.route?.params?.screen;

  useEffect(() => {
    axios
      .get(`${BASE_URL}/chat/get-my-chats`, {
        headers: {
          "auth-token": userState.token,
        },
      })
      .then((res) => {
        setCNGroups([...res.data.myChats]);
      })
      .catch((e) => {
        console.log(e);
      });
  }, [UserPhoneNumber]);

  useEffect(() => {
    const getUser = async () => {
      const { data } = await axios.get(
        `${BASE_URL}/user/get-user/${
          props.route.params.userPhoneNumber || userState.phoneNumber
        }`,
        {
          headers: { "auth-token": userState.token },
        }
      );
      setUser(data.user);
      setIsFollowingg(isFollowing(userState.following, user.phoneNumber));
    };
    getUser();
  }, [following, UserPhoneNumber]);

  const handleFollow = async () => {
    //here  do the api call

    try {
      const { data } = await axios.patch(
        `${BASE_URL}/user/toggleFollow/${user.phoneNumber}`,
        {},
        {
          headers: {
            "auth-token": userState.token,
          },
        }
      );
      if (data.success) {
        userActions.setFollowing(data.following);
        setFollowing(data.following);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const selectcontact = (props) => {
    let first = false;
    let second = false;
    let foundGroup = {};
    const individualGroups = CNGroups;
    individualGroups.map((group) => {
      if (
        group.members[0].phoneNumber === userState.phoneNumber ||
        group.members[0].phoneNumber === props.phoneNumber
      ) {
        first = true;
        if (
          group.members[1].phoneNumber === userState.phoneNumber ||
          group.members[1].phoneNumber === props.phoneNumber
        ) {
          second = true;
          foundGroup = group;
        }
      }
    });
    if (first === true && second === true) {
      setgroup(foundGroup);
      console.log(foundGroup);
      navigation.navigate("ChatCN", { group: foundGroup });
    } else {
      console.log("login user is ===>", userState.id);
      console.log("props user is =====>", props._id);

      let members = [userState.id, props._id];
      let data;

      data = {
        members: members,
        messages: [],
      };
      axios
        .post(`${BASE_URL}/chat/createchat`, data, {
          headers: {
            "auth-token": userState.token,
          },
        })
        .then((response) => {
          axios
            .get(`${BASE_URL}/chat/get-my-chats`, {
              headers: {
                "auth-token": userState.token,
              },
            })
            .then((res) => {
              const newgroup = res.data.myChats.filter((singlegroup) => {
                return singlegroup._id === response.data._id;
              });
              setgroup(newgroup[0]);
              navigation.navigate("ChatCN", { group: newgroup[0] });
            })
            .catch((e) => console.log(e));
        })
        .catch((e) => console.log(e));
    }
  };

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const handleLoadMore = () => {
    if (page < totalPages) {
      setPage(page + 1);
    }
  };

  useEffect(() => {
    setLoading(true);

    axios
      .get(
        `${BASE_URL}/posts/get-user-posts/${
          props.route.params.userPhoneNumber || userState.phoneNumber
        }`,
        {
          headers: { "auth-token": userState.token },
        }
      )
      .then((res) => {
        setposts([...posts, ...res.data.posts]);
        setfollowersPost(res.data.posts);
        // setshowPostCount(res.data.posts);
        setTotalPages(res.data.totalPages);
        setLoading(false);
      })
      .catch((e) => {
        setLoading(false);
      });
  }, [page, UserPhoneNumber]);
  useEffect(() => {
    axios
      .get(
        `${BASE_URL}/posts/get-user-posts/${
          props.route.params.userPhoneNumber || userState.phoneNumber
        }`,
        {
          headers: { "auth-token": userState.token },
        }
      )
      .then((res) => {
        setshowPostCount(res.data.posts);
      })
      .catch((e) => {
        setLoading(false);
      });
  }, [UserPhoneNumber]);

  const reload = () => {
    setRefresh(true);
    axios
      .get(
        `${BASE_URL}/posts/get-user-posts/${
          props.route.params.userPhoneNumber || userState.phoneNumber
        }`,
        {
          headers: { "auth-token": userState.token },
        }
      )
      .then((res) => {
        const newPosts = res.data.posts;
        setposts((prevPosts) => [...prevPosts, ...newPosts]);
        setshowPostCount(res.data.posts);
        setRefresh(false);
      })
      .catch((err) => {
        console.log(err);
        setRefresh(false);
      });
  };

  const handleFollowers = () => {
    navigation.navigate("Followers", {
      userFollowing: user,
      screen: "Followers",
      user: user,
    });
  };

  const handleFollowing = () => {
    navigation.navigate("Followers", {
      userFollowing: user,
      screen: "Following",
      user: user,
    });
  };

  const handleEditProfile = () => {
    navigation.navigate("EditProfile");
  };
  const handleAddPost = () => {
    navigation.navigate("AddPost", { origin: "post" });
  };

  posts?.sort((a, b) => new Date(b.createdAT) - new Date(a.createdAT));
  followersPost?.sort((a, b) => new Date(b.createdAT) - new Date(a.createdAT));
  return (
    user && (
      <SafeAreaView style={styles.safeArea}>
        <HeaderUserProfile
          type={
            user.phoneNumber === userState.phoneNumber
              ? "current"
              : user.fullName
          }
        />
        <View style={styles.profileContainer}>
          <View>
            <View style={styles.profileTitle}>
              <Image
                style={styles.avatar}
                source={{
                  uri: `${BASE_URL}/images/${user.profile}`,
                }}
              />

              <View style={styles.userNameContainer}>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                >
                  <Text style={styles.userName}>{user.fullName}</Text>

                  {(user.type === "Operations" ||
                    user.type === "Admin" ||
                    user.type === "Manager" ||
                    user.type === "Assistant Manager" ||
                    user.type === "Super Admin" ||
                    user.type === "celebrity") && (
                    <MaterialCommunityIcons
                      name="check-decagram"
                      style={styles.adminIcon}
                    />
                  )}
                </View>

                <View style={styles.userProfileStats}>
                  <TouchableOpacity style={styles.followersStats}>
                    <Text style={styles.statCount}>{showPostCount.length}</Text>
                    <Text style={styles.statText}>Posts</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.followersStats}
                    onPress={handleFollowers}
                  >
                    <Text style={styles.statCount}>
                      {user.followers.length}
                    </Text>
                    <Text style={styles.statText}>Followers</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.followingStats}
                    onPress={handleFollowing}
                  >
                    <Text style={styles.statCount}>
                      {user.following.length}
                    </Text>
                    <Text style={styles.statText}>Following</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>

          {user.phoneNumber !== userState.phoneNumber ? (
            <View style={styles.buttons}>
              <TouchableOpacity
                style={styles.FollowButton}
                onPress={handleFollow}
              >
                <Text style={styles.title}>
                  {isFollowing(userState.following, user.phoneNumber)
                    ? "Following"
                    : "Follow +"}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  ...styles.FollowButton,
                  backgroundColor: Color.White,
                  borderColor: Color.Black,
                  borderWidth: 0.7,
                  marginLeft: Width * 0.07,
                }}
                onPress={() => selectcontact(user)}
              >
                <Text style={{ ...styles.title, color: Color.Black }}>
                  Message
                </Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.buttons}>
              <TouchableOpacity
                style={styles.FollowButton}
                onPress={handleAddPost}
              >
                <Text style={styles.title}>Create Post</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  ...styles.FollowButton,
                  backgroundColor: Color.White,
                  borderColor: Color.Black,
                  borderWidth: 0.7,
                  marginLeft: Width * 0.07,
                }}
                onPress={handleEditProfile}
              >
                <Text style={{ ...styles.title, color: Color.Black }}>
                  Edit Profile
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        <View
          style={{
            flex: 1,
            backgroundColor: Color.Disable,
          }}
        >
          {loading === true ? (
            <ActivityIndicator
              style={{ position: "absolute", bottom: "20%", left: "48%" }}
              size={"large"}
              color={Color.Blue}
            />
          ) : (
            <View>
              {posts.length === 0 && <NoPostHeader />}
              <View>
                {activeScreen === "follower" ? (
                  <View>
                    {followersPost.length === 0 ? (
                      <NoPostHeader />
                    ) : (
                      <FlatList
                        data={followersPost}
                        keyExtractor={(item) => {
                          return item._id;
                        }}
                        onEndReached={handleLoadMore}
                        // onEndReachedThreshold={0.5}
                        showsVerticalScrollIndicator={false}
                        renderItem={({ item }) => (
                          <Post post={item} reload={reload} key={item._id} />
                        )}
                      />
                    )}
                  </View>
                ) : (
                  <FlatList
                    data={posts}
                    keyExtractor={(item) => {
                      return item._id;
                    }}
                    // onEndReached={handleLoadMore}
                    onEndReachedThreshold={0.5}
                    showsVerticalScrollIndicator={false}
                    renderItem={({ item }) => (
                      <Post post={item} reload={reload} key={item._id} />
                    )}
                    refreshControl={
                      <RefreshControl
                        colors={[Color.Blue]}
                        refreshing={refresh}
                        onRefresh={() => reload()}
                      />
                    }
                  />
                )}
              </View>
            </View>
          )}
        </View>
        {bottomvideo !== "" ? (
          <View
            style={{
              height: Dimensions.get("screen").height * 0.1,
              backgroundColor: Color.White,
              display: "flex",
              flexDirection: "column",
              alignContent: "center",
              justifyContent: "center",
            }}
          >
            <VideoPlayer
              style={{
                height: Dimensions.get("screen").height * 0.1,
                width: Dimensions.get("screen").width,
              }}
              slider={false}
              timeVisible={false}
              fullscreen={false}
              defaultControlsVisible={false}
              videoProps={{
                isLooping: false,
                ref: video,
                source: {
                  uri: bottomvideo,
                },
                useNativeControls: true,
                shouldPlay: true,
                resizeMode: "contain",
              }}
            />
          </View>
        ) : null}
      </SafeAreaView>
    )
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: Color.White,
    flex: 1,
  },

  profileContainer: {
    backgroundColor: Color.White,
    paddingHorizontal: 17,
    paddingTop: 10,
    borderBottomWidth: 2,
    borderColor: Color.VeryLightGrey,
  },
  profileTitle: {
    flexDirection: "row",
  },
  avatar: {
    borderRadius: Dimensions.get("screen").height * 0.1,
    width: Dimensions.get("screen").height * 0.09,
    height: Dimensions.get("screen").height * 0.09,
    backgroundColor: Color.VeryLightGrey,
  },
  userNameContainer: {
    justifyContent: "center",
  },
  userName: {
    fontSize: 15,
    fontFamily: "Roboto_600SemiBold",
    color: Color.Black,
    alignSelf: "center",
    marginLeft: 15,
  },
  userCategory: {
    marginLeft: 15,
    fontSize: 14,
    fontFamily: "Roboto_400Regular",
    color: Color.Blue,
  },
  userDescription: {
    marginTop: 14,
    fontSize: 14,
    fontFamily: "Roboto_400Regular",
    color: Color.Black,
    textAlign: "left",
  },
  userProfileStats: {
    flexDirection: "row",
    marginTop: 16,
    // paddingHorizontal: 35,
    justifyContent: "space-between",
    width: "73%",
    position: "relative",
    top: Height * -0.02,
    left: Width * 0.038,
    paddingVertical: Height * 0.008,
  },
  postsStats: {
    alignItems: "center",
  },
  followersStats: {
    alignItems: "center",
  },
  followingStats: {
    alignItems: "center",
  },
  statCount: {
    fontSize: Height * 0.025,
    fontFamily: "Roboto_600SemiBold",
    color: Color.Black,
    fontWeight: "700",
  },
  statText: {
    fontSize: Height * 0.017,
    // fontWeight: "500",
    fontFamily: "Roboto_700Bold",
    lineHeight: 21,
    color: Color.Black,
  },
  buttons: {
    flexDirection: "row",
    marginBottom: 16,
    width: "80%",
  },
  adminIcon: {
    marginLeft: 5,
    alignSelf: "center",
    fontSize: Height * 0.019,
    color: Color.Blue,
  },
  noPostsText: {
    fontFamily: "Roboto_500Medium",
    fontSize: Height * 0.02,
    alignSelf: "center",
    justifyContent: "center",
  },
  heading: {
    fontFamily: "Roboto_700Bold",
    color: Color.Black,
    fontSize: Height * 0.019,
    paddingVertical: Height * 0.01,
  },
  subHeading: {
    fontFamily: "Roboto_500Medium",
    color: Color.Black,
    fontSize: Height * 0.016,
  },
  bellIcon: {
    width: Width * 0.3,
    height: Height * 0.13,
    resizeMode: "contain",
  },
  button: {
    backgroundColor: Color.Blue,
    marginTop: Height * 0.05,
    paddingHorizontal: Width * 0.06,
    paddingVertical: Height * 0.013,
    borderRadius: Height * 0.01,
  },
  buttonTitle: {
    fontFamily: "Roboto_600SemiBold",
    color: Color.White,
    fontSize: Height * 0.02,
  },
  FollowButton: {
    backgroundColor: Color.Blue,
    // paddingHorizontal: Width * 0.02,
    width: "45%",
    alignItems: "center",
    paddingVertical: Height * 0.009,
    borderRadius: Height * 0.01,
  },
  title: {
    alignSelf: "center",
    color: Color.White,
    fontFamily: "Roboto_600SemiBold",
    fontSize: 14,
  },
});
