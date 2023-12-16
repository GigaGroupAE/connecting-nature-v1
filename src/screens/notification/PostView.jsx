import { StyleSheet, View } from "react-native";
import React, { useEffect, useMemo, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import HeaderNormal from "../../components/HeaderNormal";
import PostHeader from "../Home/PostHeader";
import PostDescription from "../../components/PostDesciption";
import Color from "../../../assets/colors/Color";
import { axiosInstance } from "../../../axiosInstance";
import { useStateContext } from "../../contexts/ContextProvider";
import PostViewComments from "./PostViewComments";
import PostDeleteModal from "../Home/PostDeleteModal";

const PostView = (props) => {
  const postId = props.route?.params?.postId;
  const { setLoading, showSnackbar } = useStateContext();
  const [post, setpost] = useState();
  const navigation = useNavigation();
  const [modalVisible, setmodalVisible] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await axiosInstance.post(`/posts/getPost`, {
          id: postId,
        });
        setpost(response?.data);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        navigation.navigate("Home");
        showSnackbar("Sorry, this post has been deleted");
      }
    };
    fetchData();
  }, []);

  if (!post) {
    return null;
  }

  const reload = () => {
    navigation.navigate("Home");
  };

  return (
    <View style={styles.container}>
      <HeaderNormal title="Post" />
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
        {/* <PostDeleteModal
          post={post}
          reload={reload}
          setmodalVisible={setmodalVisible}
        /> */}
      </View>
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
