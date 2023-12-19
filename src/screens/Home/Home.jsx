import React, { useCallback, useMemo } from "react"
import {
  StyleSheet,
  View,
  FlatList,
  Dimensions,
  RefreshControl,
  StatusBar,
  ActivityIndicator,
} from "react-native"
import BottomTab from "../../components/BottomTab.js"

import Post from "../../components/Post.js"
import { useState, useEffect, useRef } from "react"
import * as Device from "expo-device"
import * as Notifications from "expo-notifications"
import Constants from "expo-constants"
import { useUserState, useUserStateActions } from "../../slices/userSlice.js"
import axios from "axios"
import {
  useFocusEffect,
  useIsFocused,
  useNavigation,
} from "@react-navigation/native"
import { usePostsStateActions } from "../../slices/postsSlice.js"
import { SafeAreaView } from "react-native-safe-area-context"
import { BASE_URL } from "../../../CONSTANTS.js"
import Color from "../../../assets/colors/Color.js"
import AppLoader from "../../components/AppLoader.js"
import MiniVideoPlayer from "../../components/MiniVideoPlayer.js"
import { useStateContext } from "../../contexts/ContextProvider.js"
import HomeHeader from "./HomeHeader.jsx"
import StoryHeader from "./StoryHeader.jsx"
import HeaderForCampaign from "./HeaderForCampaign.jsx"
import { axiosInstance } from "../../../axiosInstance.js"

const LIMIT = 6 // initial number of posts
const Height = Dimensions.get("screen").height

export default function Home() {
  //loading while fetching posts during pagination
  const [loading, setLoading] = useState(false)
  const isFocused = useIsFocused()

  //pagination
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState()
  const [campaign, setcampaign] = useState([])

  //state context
  const { showMiniWindow, videoURI, videoAutherName, Stories, setStories } =
    useStateContext()

  const flatListRef = useRef(null)

  const scrollToTop = useCallback(() => {
    if (flatListRef.current) {
      flatListRef.current.scrollToOffset({
        offset: 0,
        animated: true,
        duration: 500,
      })
    }
  }, [])
  const [refresh, setRefresh] = useState(false)
  const reload = () => {
    setRefresh(true)
    setPage(2)
    axios
      .get(`${BASE_URL}/posts/posts-pagination?page=1&limit=${LIMIT}`, {
        headers: {
          "auth-token": userstate.token,
        },
      })
      .then((res) => {
        setposts(res.data.newPosts)
        setLoadingPending(false)
        setRefresh(false)
      })
      .catch((err) => {
        console.log(err)
      })
  }

  const [loadingPending, setLoadingPending] = useState(true)

  const userstate = useUserState()
  //INCLUDE user AS AN ARGUMENT IN BELOW 2 LINES IF YOU WANT TO ACCESS ADMIN AND CAMPAIGN CREATION.S

  const userActions = useUserStateActions()
  const PostActions = usePostsStateActions()
  const navigation = useNavigation()
  const [posts, setposts] = useState([])

  useFocusEffect(
    useCallback(() => {
      fetchData() // Fetch data whenever the screen gains focus
    }, [fetchData])
  )

  //function for fetching posts
  const fetchData = async () => {
    if (page === totalPages + 1) return
    console.log("fetch data is getting called with page number ", page)

    setLoading(true)

    axios
      .get(`${BASE_URL}/posts/posts-pagination?page=${page}&limit=${LIMIT}`, {
        headers: {
          "auth-token": userstate.token,
        },
      })
      .then((res) => {
        setLoading(false)
        setposts([...posts, ...res.data.newPosts])
        setTotalPages(res.data.totalPages)
        PostActions.setPosts({ posts })
        setLoadingPending(false)
        setRefresh(false)
        setPage((prev) => prev + 1)
      })
      .catch((err) => {
        setLoading(false)
        console.log("err while fetching posts is ", err)
      })
  }
  async function registerForPushNotificationsAsync() {
    let token
    if (Device.isDevice) {
      const { status: existingStatus } =
        await Notifications.getPermissionsAsync()
      let finalStatus = existingStatus
      if (existingStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync()
        finalStatus = status
      }
      if (finalStatus !== "granted") {
        alert("Failed to get push token for push notification!")
        return
      }
      token = await Notifications.getExpoPushTokenAsync({
        projectId: Constants.expoConfig.extra.eas.projectId,
      })
      console.log(token)
    } else {
      alert("Must use physical device for Push Notifications")
    }

    if (Platform.OS === "android") {
      Notifications.setNotificationChannelAsync("default", {
        name: "default",
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: "#FF231F7C",
      })
    }

    return token
  }

  useEffect(() => {
    if (isFocused) {
      registerForPushNotificationsAsync().then((token) => {
        setExpoPushToken(token)
        //make api call to save the token
        const config = {
          headers: {
            "auth-token": userstate.token,
          },
        }

        //if there's a token in the state
        //that means that there must be a token in the database
        //so only send request if there is no token in the state
        //fetch expo push token only if it is not present
        if (!userstate.expoPushToken) {
          axios
            .put(
              `${BASE_URL}/user/updateUserExpoToken`,
              { expoPushToken: `${token}` },
              config
            )
            .then((res) => {
              userActions.setExpoPushToken(res.data.expoPushToken)
            })
            .catch((err) => {
              console.log(err)
            })
        }
      })

      notificationListener.current =
        Notifications.addNotificationReceivedListener((notification) => {
          setNotification(notification)
        })

      responseListener.current =
        Notifications.addNotificationResponseReceivedListener((response) => {
          console.log(response)
        })

      return () => {
        Notifications.removeNotificationSubscription(
          notificationListener.current
        )
        Notifications.removeNotificationSubscription(responseListener.current)
      }
    }
  }, [isFocused])

  async function registerForPushNotificationsAsync() {
    let token

    if (Platform.OS === "android") {
      await Notifications.setNotificationChannelAsync("default", {
        name: "default",
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: "#FF231F7C",
      })
    }

    if (Device.isDevice) {
      const { status: existingStatus } =
        await Notifications.getPermissionsAsync()
      let finalStatus = existingStatus
      if (existingStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync()
        finalStatus = status
      }
      if (finalStatus !== "granted") {
        alert("Failed to get push token for push notification!")
        return
      }
      token = (await Notifications.getExpoPushTokenAsync()).data
    } else {
      alert("Must use physical device for Push Notifications")
    }

    return token
  }
  const [expoPushToken, setExpoPushToken] = useState("")
  const [notification, setNotification] = useState(false)
  const notificationListener = useRef()
  const responseListener = useRef()
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
    }),
  })

  const [videoInBottomNav, setNavVideo] = useState(null)
  const video = (props) => {
    setNavVideo(props)
  }

  const handleEndReached = () => {
    if (!loading) {
      fetchData()
    }
  }

  const fetchStory = async () => {
    setRefresh(true)
    try {
      const response = await axios.get(`${BASE_URL}/story/getstories`, {
        headers: {
          "auth-token": userstate.token,
        },
      })
      setStories([...response.data])

      setRefresh(false)
    } catch (error) {
      console.error("Error fetching stories:", error)
      setRefresh(false)
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosInstance.get(
          "/campaigns/mostrecentcampaign"
        )

        if (response?.data?.campaigns) {
          setcampaign(response?.data?.campaigns)
        }
      } catch (error) {
        console.log("Error:", error)
      }
    }

    fetchData()
  }, [])

  const HeaderComponent = useMemo(() => <HomeHeader />, [])
  const storyHeaderComponent = useMemo(() => <StoryHeader />, [Stories])
  const ActivCampaignHeader = useMemo(
    () => <HeaderForCampaign campaign={campaign} />,
    [campaign]
  )

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.pageContainer}>
        {HeaderComponent}
        {campaign.length !== 0 && <View>{ActivCampaignHeader}</View>}

        <FlatList
          style={styles.pageContainer}
          ref={flatListRef}
          // data={properArray}
          data={posts}
          keyExtractor={(item) => {
            return item._id
          }}
          ListHeaderComponent={storyHeaderComponent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              colors={[Color.Blue]}
              refreshing={refresh}
              onRefresh={() => reload()}
            />
          }
          //header component are the stories.
          renderItem={({ item }) => (
            <>
              <Post post={item} key={item._id} reload={reload} video={video} />
            </>
          )}
          // estimatedItemSize={200}
          onEndReachedThreshold={0.4}
          onEndReached={handleEndReached}
          //if we're rendering 10 posts. new api request will be made when we scroll to the 9th post
          ListFooterComponent={loading && <ActivityIndicator />}
        />
      </View>

      {showMiniWindow && (
        <View style={styles.showMiniVideo}>
          <MiniVideoPlayer uri={videoURI} videoAutherName={videoAutherName} />
        </View>
      )}
      <BottomTab
        activeMenu={"Home"}
        scrollToTop={scrollToTop}
        reload={reload}
        storyReload={fetchStory}
      />
      {loadingPending ? <AppLoader /> : null}

      <StatusBar backgroundColor={Color.Blue} />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Color.White,
    height: "100%",
  },
  pageContainer: {
    alignContent: "flex-start",
    backgroundColor: Color.VeryLightGrey,
    height: "100%",
    paddingBottom: Height * 0.06,
  },
  showMiniVideo: {
    position: "absolute",
    zIndex: 200,
    width: "100%",
    height: "9%",
    bottom: Height * 0.07,
  },
})
