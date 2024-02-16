import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  FlatList,
  Image,
  Pressable,
  TouchableOpacity,
} from "react-native";
import React, { useCallback, useState } from "react";
import HeaderNormal from "../../components/HeaderNormal";
import Color from "../../../assets/colors/Color";
import { useNavigation } from "@react-navigation/native";
import { calculateTimeDifference } from "../../utils/timeDifference";
import VideoPlayer from "expo-video-player";
import { useStateContext } from "../../contexts/ContextProvider";

import { AntDesign, MaterialCommunityIcons } from "react-native-vector-icons";
import { BASE_URL } from "../../../CONSTANTS";
import { ScrollView } from "react-native-gesture-handler";

const width = Dimensions.get("screen").width;
const height = Dimensions.get("screen").height;

// check userName length
const MAX_USERNAME_LENGTH = 15;
const shortenUsername = (username) => {
  if (username.length <= MAX_USERNAME_LENGTH) {
    return username;
  } else {
    return username.substring(0, MAX_USERNAME_LENGTH) + "...";
  }
};

const TopStories = () => {
  const navigation = useNavigation();
  const { selectedStory, setSelectedStory, setStories, Stories } =
    useStateContext();

  const video = React.useRef(null);
  const [textShown, setTextShown] = useState(false); //To show ur remaining Text
  const [lengthMore, setLengthMore] = useState(false); //to show the "Read more & Less Line"

  const [scrollPosition, setScrollPosition] = useState(0);
  const [IsScroll, setIsScroll] = useState(false);

  // function for scroll
  const onScroll = (event) => {
    const position = event.nativeEvent.contentOffset.y;
    setScrollPosition(position);
    if (position > 90) {
      setIsScroll(true);
    } else {
      setIsScroll(false);
    }
  };

  const PostContainerStyle = IsScroll
    ? styles.minContainer
    : styles.maxContainer;

  // filter the propes to remove selected id story
  const filteredStories = Stories.filter(
    (story) => story._id !== selectedStory._id
  );

  const toggleNumberOfLines = () => {
    //To toggle the show text or hide it
    setTextShown(!textShown);
  };
  const onTextLayout = useCallback((e) => {
    setLengthMore(e.nativeEvent.lines.length >= 4); //to check the text is more than 4 lines or not
    // console.log(e.nativeEvent);
  }, []);

  // calculate time
  let timePassed = calculateTimeDifference(selectedStory.createdAT);

  // function to false the scroll positon
  const ctaNewStory = (item) => {
    setSelectedStory(item);
    setIsScroll(false);
    setScrollPosition(0);
  };

  const renderitem = ({ item }) => {
    const UserName = shortenUsername(item.postedby.fullName);
    const UserRole = shortenUsername(item.postedby.type);
    let timePassed = calculateTimeDifference(item.createdAT);

    return (
      <TouchableOpacity onPress={() => ctaNewStory(item)}>
        <View style={styles.mainContainer}>
          {/* user image*/}
          <View style={{ flexDirection: "row" }}>
            <Image
              style={styles.userImg}
              source={{
                uri: `${BASE_URL}/images/${item.postedby.profile}`,
              }}
              resizeMode="cover"
            />
          </View>

          {/* user details */}
          <View style={{ flex: 1, marginLeft: width * 0.03 }}>
            <View style={styles.userContainer}>
              <View style={styles.userNameContainer}>
                <Text style={styles.userName}>{UserName}</Text>
                <Text style={styles.postDuration}>{timePassed} </Text>
                <Text
                  style={[
                    styles.postDuration,
                    { color: Color.Blue, paddingHorizontal: 0 },
                  ]}
                >
                  {UserRole}
                </Text>
              </View>
              <AntDesign
                name="ellipsis1"
                style={{ fontSize: 24, color: Color.DarkGrey }}
              />
            </View>
            {/* story description  */}
            <View style={{ flex: 1, marginVertical: height * 0.0033 }}>
              <Text
                style={styles.postDescr}
                onTextLayout={onTextLayout}
                numberOfLines={textShown ? undefined : 4}
              >
                {item.description}
              </Text>
              {lengthMore ? (
                <Text
                  onPress={toggleNumberOfLines}
                  style={{ marginTop: 5, color: Color.Blue }}
                >
                  {textShown ? "Read less..." : "Read more..."}
                </Text>
              ) : null}
            </View>

            {/* post image */}
            <View>
              <View>
                {item.media?.type === "image/jpeg" ||
                item.media?.type === "image/png" ||
                item.media?.type === "image/jpg" ? (
                  <View style={styles.postImg}>
                    <TouchableOpacity
                      key={selectedStory.index}
                      onPress={() => ctaNewStory(item)}
                    >
                      <Image
                        style={styles.postImg}
                        resizeMode="contain"
                        source={{
                          uri: `${BASE_URL}/images/${item.media.name}`,
                        }}
                      />
                    </TouchableOpacity>
                  </View>
                ) : null}
                <View>
                  {item.media?.type === "video/mp4" ? (
                    <VideoPlayer
                      style={styles.postImg}
                      fullscreen={{
                        enterFullscreen: () => {
                          navigation.navigate("PostView", {
                            url: `${BASE_URL}/images/${item.media.name}`,
                            message: "",
                            mediatype: "video",
                          });
                        },
                        exitFullscreen: (e) => console.log(e),
                      }}
                      defaultControlsVisible={true}
                      videoProps={{
                        isLooping: false,
                        ref: video,
                        source: {
                          uri: `${BASE_URL}/images/${item.media.name}`,
                        },
                        shouldPlay: false,
                        resizeMode: "contain",
                      }}
                    />
                  ) : null}
                </View>
              </View>
            </View>

            {/* comment container  */}
            <View style={styles.commentsContainer}>
              <View style={styles.postLikes}>
                <AntDesign name="hearto" style={styles.icons} />
                <Text style={styles.comment}>3.3k</Text>
              </View>
              <Pressable
                android_ripple={{ color: Color.LightGrey }}
                style={styles.mainAction}
                onPress={() => navigation.navigate("StoryComment", item)}
              >
                <View style={styles.postLikes}>
                  <MaterialCommunityIcons
                    name="comment-outline"
                    style={styles.icons}
                  />
                  <Text style={styles.comment}>1.8k</Text>
                </View>
              </Pressable>
              <View>
                <MaterialCommunityIcons
                  name="share-variant-outline"
                  style={[styles.icons, { paddingHorizontal: 0 }]}
                />
              </View>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };
  return (
    <View style={{ backgroundColor: Color.White, flex: 1 }}>
      <HeaderNormal title="Spotlight" />

      {/* selected story id  */}
      {selectedStory ? (
        <View style={PostContainerStyle}>
          <View>
            {/* post image */}

            <View>
              {selectedStory.media?.type === "video/mp4" ? (
                <VideoPlayer
                  style={IsScroll ? styles.TopStoryVideo : styles.fullVideo}
                  fullscreen={{
                    enterFullscreen: () => {
                      navigation.navigate("PostView", {
                        url: `${BASE_URL}/images/${selectedStory.media.name}`,
                        message: "",
                        mediatype: "video",
                        description: selectedStory.description,
                      });
                    },
                    exitFullscreen: (e) => console.log(e),
                  }}
                  defaultControlsVisible={true}
                  videoProps={{
                    isLooping: false,
                    ref: video,
                    source: {
                      uri: `${BASE_URL}/images/${selectedStory.media.name}`,
                    },
                    shouldPlay: false,
                    resizeMode: "contain",
                  }}
                />
              ) : null}
            </View>
            <View>
              <View>
                {selectedStory.media?.type === "image/jpeg" ||
                selectedStory.media?.type === "image/png" ||
                selectedStory.media?.type === "image/jpg" ? (
                  <View>
                    <TouchableOpacity key={selectedStory.index}>
                      <Image
                        style={[
                          styles.topPostImg,
                          IsScroll && { height: height * 0.17 },
                        ]}
                        resizeMode="stretch"
                        source={{
                          uri: `${BASE_URL}/images/${selectedStory.media.name}`,
                        }}
                      />
                    </TouchableOpacity>
                  </View>
                ) : null}
              </View>
              <View style={IsScroll ? styles.scrollContainer : null}>
                {/* user details container  */}
                <View
                  style={[
                    styles.userContainer,
                    {
                      width: "93%",
                      alignSelf: "center",
                      marginTop: height * 0.02,
                    },
                  ]}
                >
                  <View>
                    <View style={{ flex: 1 }}>
                      <Image
                        style={[
                          styles.userImg,
                          IsScroll && {
                            width: width * 0.095,
                            height: height * 0.045,
                          },
                        ]}
                        source={{
                          uri: `${BASE_URL}/images/${selectedStory?.postedby?.profile}`,
                        }}
                        resizeMode="cover"
                      />
                    </View>
                  </View>
                  {/* user details */}
                  <View style={[styles.topPostUserContainer]}>
                    {/* user type */}
                    <View
                      style={[
                        styles.topStoryUserContainer,
                        IsScroll && { marginTop: 6 },
                      ]}
                    >
                      <View style={styles.userNameContainer}>
                        <Text style={styles.userName}>
                          {selectedStory.postedby.fullName}
                        </Text>
                        <Text style={styles.postDuration}>{timePassed} </Text>
                        <Text
                          style={[
                            styles.postDuration,
                            { color: Color.Blue, paddingHorizontal: 0 },
                          ]}
                        >
                          {selectedStory.postedby.type}
                        </Text>
                      </View>
                      <AntDesign
                        name="ellipsis1"
                        style={{ fontSize: 24, color: Color.DarkGrey }}
                      />
                    </View>

                    <View>
                      <View>
                        <Text
                          style={[
                            styles.postDescr,
                            IsScroll && { display: "none" },
                          ]}
                        >
                          {selectedStory.description}
                        </Text>
                      </View>
                    </View>

                    {/* post image */}
                  </View>
                </View>

                {/* reaction container  */}
                <View style={{ marginTop: height * 0.015 }}>
                  <View
                    style={[
                      styles.topStoryMainContainer,
                      IsScroll && {
                        display: "none",
                        borderBottomColor: Color.DarkGrey,
                        borderWidth: 1,
                        // marginBottom: 10,
                      },
                    ]}
                  >
                    <View style={styles.topStoryContainer}>
                      <View style={styles.postLikes}>
                        <AntDesign name="hearto" style={styles.icons} />
                        <Text style={styles.comment}>3.3k</Text>
                      </View>
                      <Pressable
                        android_ripple={{ color: Color.LightGrey }}
                        style={styles.mainAction}
                        onPress={() =>
                          navigation.navigate("StoryComment", selectedStory)
                        }
                      >
                        <View style={styles.postLikes}>
                          <MaterialCommunityIcons
                            name="comment-outline"
                            style={styles.icons}
                          />
                          <Text style={styles.comment}>1.88k</Text>
                        </View>
                      </Pressable>
                      <View>
                        <MaterialCommunityIcons
                          name="share-variant-outline"
                          style={[styles.icons, { paddingHorizontal: 0 }]}
                        />
                      </View>
                    </View>
                  </View>
                </View>
              </View>
            </View>
          </View>
        </View>
      ) : null}

      <ScrollView onScroll={onScroll}>
        <FlatList
          data={filteredStories}
          renderItem={renderitem}
          keyExtractor={(item) => item._id}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
        />
      </ScrollView>
    </View>
  );
};

export default TopStories;

const styles = StyleSheet.create({
  mainContainer: {
    marginVertical: height * 0.01,
    flexDirection: "row",
    width: "95%",
    alignSelf: "center",
    backgroundColor: Color.White,
    flexDirection: "row",
  },
  userImg: {
    width: width * 0.13,
    height: height * 0.06,
    resizeMode: "contain",
    borderRadius: height * 0.1,
  },
  userContainer: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  userNameContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    overflow: "hidden",
  },
  userName: {
    fontFamily: "Roboto_600SemiBold",
    fontWeight: "500",
    fontSize: 18,
    color: Color.DarkGrey,
  },
  postDuration: {
    fontSize: 15,
    fontWeight: "400",
    fontFamily: "Roboto_500Medium",
    color: Color.DarkGrey,
    paddingHorizontal: width * 0.025,
  },
  postDescr: {
    fontSize: 13,
    fontFamily: "Roboto_500Medium",
    color: Color.Grey,
    lineHeight: 20,
  },
  postImg: {
    width: width * 0.77,
    height: height * 0.2,
    resizeMode: "cover",
    borderRadius: height * 0.01,
  },
  commentsContainer: {
    width: "97%",
    paddingVertical: height * 0.014,
    flexDirection: "row",
    justifyContent: "space-between",
    alignSelf: "center",
    alignItems: "center",
  },
  postLikes: {
    fontSize: 21,
    flexDirection: "row",
    alignItems: "center",
  },
  comment: {
    fontSize: 14,
    fontFamily: "Poppins_500Medium",
    fontWeight: "400",
    color: Color.Grey,
  },
  icons: {
    fontSize: 22,
    color: Color.Grey,
    paddingHorizontal: width * 0.02,
  },
  topStoryMainContainer: {
    backgroundColor: Color.White,
    shadowColor: Color.DarkGrey,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
    elevation: 6,
  },
  topStoryContainer: {
    justifyContent: "space-around",
    borderColor: Color.White,
    paddingVertical: height * 0.0095,
    flexDirection: "row",
  },
  maxContainer: {
    flex: 0,
    borderBottomColor: Color.DarkGrey,
    marginBottom: 10,
  },
  minContainer: {
    height: 215,
    // marginBottom: 10,
  },
  topPostImg: {
    width: "100%",
    height: height * 0.2,
    resizeMode: "cover",
  },
  topPostUserContainer: {
    flex: 1,
    marginLeft: width * 0.03,
  },
  topStoryUserContainer: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  topStoryType: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "red",
    width: "93%",
    alignSelf: "center",
    marginTop: height * 0.02,
  },
  scrollContainer: {
    backgroundColor: Color.White,
    shadowColor: Color.DarkGrey,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
    elevation: 6,
  },
  TopStoryVideo: {
    height: Dimensions.get("screen").height * 0.175,
  },
  fullVideo: {
    height: Dimensions.get("screen").height * 0.3,
  },
});
