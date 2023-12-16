import React from "react";
import { ScrollView, View, StyleSheet, Dimensions } from "react-native";
import SingleStory from "./SingleStory";
import HeaderNormal from "../../components/HeaderNormal";
import { useRoute } from "@react-navigation/native";
import { useStateContext } from "../../contexts/ContextProvider";
import MiniVideoPlayer from "../../components/MiniVideoPlayer";
import { FlatList } from "react-native";

const Height = Dimensions.get("screen").height;

const renderPost = ({ item }) => <SingleStory key={item._id} post={item} />;

const StoriesPosts = (props) => {
  const route = useRoute();
  const posts = props.route.params.Stories;
  const { setSelectedStory, showMiniWindow, videoURI, videoAutherName } =
    useStateContext();

  return (
    <View style={styles.container}>
      <HeaderNormal title="Spotlight" />
      <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1 }}>
        <FlatList
          data={posts}
          renderItem={renderPost}
          keyExtractor={(item) => item._id}
        />
      </ScrollView>
      {showMiniWindow && (
        <View
          style={{
            backgroundColor: "red",
            position: "relative",
            zIndex: 200,
            // bottom: -200,
            width: "100%",
            height: "9%",
            bottom: 0,
          }}
        >
          <MiniVideoPlayer uri={videoURI} videoAutherName={videoAutherName} />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    height: "100%",
    flex: 1,
  },
});

export default StoriesPosts;
