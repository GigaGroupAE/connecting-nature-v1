import { StyleSheet, View } from "react-native";
import React, { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import HeaderNormal from "../../components/HeaderNormal";
import PostHeader from "../Home/PostHeader";
import Color from "../../../assets/colors/Color";
import { axiosInstance } from "../../../axiosInstance";
import { useStateContext } from "../../contexts/ContextProvider";
import PostViewComments from "./PostViewComments";
import PostDeleteModal from "../Home/PostDeleteModal";
import { useQuery } from "react-query";
import SInglePostSkeleton from "../../components/Skeleton/SInglePostSkeleton";

const fetchPost = async (postId) => {
  const { data } = await axiosInstance.post(`/posts/getPost`, {
    id: postId,
  });
  return data;
};

const PostView = (props) => {
  const postId = props.route?.params?.postId;
  const { showSnackbar } = useStateContext();
  const navigation = useNavigation();
  const [modalVisible, setmodalVisible] = useState(false);
  const {
    data: post,
    isLoading,
    isError,
  } = useQuery(["postview", postId], () => fetchPost(postId), {
    retry: 1,
    onError: (error) => {
      navigation.navigate("Home");
      showSnackbar("Sorry, this post has been deleted");
    },
  });

  const reload = () => {
    navigation.navigate("Home");
  };

  return (
    <View style={styles.container}>
      <HeaderNormal title="Post" />
      {isLoading && <SInglePostSkeleton />}
      {!isLoading && post && (
        <View style={{ flex: 1 }}>
          {modalVisible && (
            <PostDeleteModal
              post={post}
              reload={reload}
              setmodalVisible={setmodalVisible}
            />
          )}
          <PostHeader data={post} setmodalVisible={setmodalVisible} />
          <PostViewComments post={post} />
        </View>
      )}
    </View>
  );
};

export default PostView;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Color.White,
  },
  image: {
    width: "100%",
    height: "65%",
  },
});
