import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  RefreshControl,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from "react-native"
import React, { useMemo } from "react"
import { useInfiniteQuery, useQuery } from "react-query"
import {
  fetchUser,
  fetchUserPosts,
  fetchUsersPostCount,
} from "../../Api/GetPost"
import { useUserState } from "../../slices/userSlice"
import Color from "../../../assets/colors/Color"
import HeaderUserProfile from "../../components/HeaderUserProfile"
import { useNavigation } from "@react-navigation/native"
import UserProfileState from "../../components/UserProfileState"
import PostSkeleton from "../../components/PostSkeleton"
import Post from "../../components/Post"

const Height = Dimensions.get("screen").height
const Width = Dimensions.get("screen").width

const UserProfile = (props) => {
  const userState = useUserState()
  const navigation = useNavigation()
  const userPhoneNumber =
    props.route.params.userPhoneNumber || userState.phoneNumber
  const {
    data: postsData,
    isLoading: postsLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
  } = useInfiniteQuery(
    ["userPosts", userPhoneNumber],

    ({ pageParam = 1 }) => fetchUserPosts({ userPhoneNumber, pageParam }),
    {
      getNextPageParam: (lastPage, allPages) => {
        if (lastPage?.currentPage && lastPage?.totalPages) {
          return lastPage.currentPage < lastPage.totalPages
            ? lastPage.currentPage + 1
            : null
        }
        return null
      },
      refetchOnWindowFocus: false,
      cacheTime: 1000 * 60 * 5,
    }
  )

  const {
    data: user,
    isLoading,
    refetch: refetchUser,
  } = useQuery(["user", userPhoneNumber], () => fetchUser(userPhoneNumber))
  const { data: userPostCount, isLoading: postCountLoading } = useQuery(
    ["postcount", userPhoneNumber],
    () => fetchUsersPostCount(userPhoneNumber)
  )
  const handleRefresh = () => {
    refetch()
  }

  const handleEndReached = () => {
    if (!isFetchingNextPage && hasNextPage) {
      fetchNextPage()
    }
  }

  const renderItem = useMemo(() => {
    return ({ item }) => {
      if (!postsData || postsLoading) {
        return <PostSkeleton />
      } else {
        return <Post post={item} key={item._id} reload={refetch} />
      }
    }
  }, [postsData, postsLoading])

  return (
    <SafeAreaView style={styles.safeArea}>
      <HeaderUserProfile
        type={
          user?.phoneNumber === userState.phoneNumber
            ? "current"
            : user?.fullName
        }
      />
      {!isLoading && !postCountLoading && (
        <UserProfileState
          user={user}
          postCount={userPostCount}
          refetch={refetchUser}
        />
      )}
      <View
        style={{
          flex: 1,
          backgroundColor: Color.Disable,
        }}
      >
        {postsLoading ? (
          <PostSkeleton />
        ) : (
          <FlatList
            data={postsData?.pages.flatMap((page) => page.posts) || []}
            keyExtractor={(item) => item._id}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                colors={[Color.Blue]}
                refreshing={postsLoading}
                onRefresh={handleRefresh}
              />
            }
            renderItem={renderItem}
            onEndReachedThreshold={0.5}
            onEndReached={handleEndReached}
            ListFooterComponent={isFetchingNextPage && <ActivityIndicator />}
          />
        )}
      </View>
    </SafeAreaView>
  )
}

export default UserProfile

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: Color.White,
    flex: 1,
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
})
