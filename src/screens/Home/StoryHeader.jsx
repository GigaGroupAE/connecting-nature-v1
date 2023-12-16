import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  StyleSheet,
  FlatList,
} from "react-native";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import axios from "axios";
import { BASE_URL } from "../../../CONSTANTS";
import Color from "../../../assets/colors/Color";
import { useUserState } from "../../slices/userSlice";
import { useStateContext } from "../../contexts/ContextProvider";
import StoryCard from "../../components/StoryCard";

const StoryHeader = () => {
  const navigation = useNavigation();
  const userstate = useUserState();
  const isFocused = useIsFocused();
  const { Stories, setStories } = useStateContext();
  const [refresh, setRefresh] = useState(false);

  const fetchStory = async () => {
    setRefresh(true);
    try {
      const response = await axios.get(`${BASE_URL}/story/getstories`, {
        headers: {
          "auth-token": userstate.token,
        },
      });
      setStories([...response.data]);
      setRefresh(false);
    } catch (error) {
      console.error("Error fetching stories:", error);
      setRefresh(false);
    }
  };

  useEffect(() => {
    fetchStory();
  }, [isFocused]);

  const handleStoryNavigation = () => {
    navigation.navigate("StoriesPosts", {
      Stories,
    });
  };

  Stories?.sort((a, b) => new Date(b.createdAT) - new Date(a.createdAT));

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>Spotlight</Text>
      <TouchableOpacity
        style={styles.seeAllButton}
        onPress={handleStoryNavigation}
      >
        <Text style={styles.seeAllText}>see all</Text>
      </TouchableOpacity>
      <FlatList
        data={Stories}
        keyExtractor={(item) => item._id}
        horizontal={true}
        initialNumToRender={3}
        renderItem={({ item }) => <StoryCard story={item} />}
        showsHorizontalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Color.White,
  },
  headerText: {
    color: Color.Black,
    fontSize: 16,
    fontFamily: "Roboto_600SemiBold",
    marginHorizontal: Dimensions.get("screen").width * 0.05,
    paddingVertical: Dimensions.get("screen").height * 0.009,
  },
  seeAllButton: {
    position: "absolute",
    right: 15,
    top: 10,
  },
  seeAllText: {
    color: Color.Blue,
    fontSize: 12,
    fontFamily: "Roboto_400Regular",
  },
});

export default StoryHeader;
