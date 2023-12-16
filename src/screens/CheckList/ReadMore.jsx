import { StyleSheet, Text, View, Pressable, Dimensions } from "react-native";
import React, { useState } from "react";
import Color from "../../../assets/colors/Color";

const Width = Dimensions.get("screen").width;
const Height = Dimensions.get("screen").height;

const ReadMore = ({ description }) => {
  const [showAll, setShowAll] = useState(false);
  const toggleShowAll = () => setShowAll(!showAll);

  let limit = 27;
  const shouldTruncate = description.length > limit;
  return (
    <View>
      <View></View>
      <Text style={styles.userName}>
        {shouldTruncate && !showAll
          ? `${description.slice(0, limit)}...`
          : description}
      </Text>

      {shouldTruncate && (
        <Pressable onPress={toggleShowAll}>
          <Text
            style={{
              ...styles.userName,
              fontSize: 12,
              // alignSelf: "center",
              color: Color.Blue,
            }}
          >
            {showAll ? "Read less" : "Read more"}
          </Text>
        </Pressable>
      )}
    </View>
  );
};

export default ReadMore;

const styles = StyleSheet.create({
  userName: {
    marginLeft: Width * 0.018,
    fontWeight: "500",
    fontSize: Height * 0.016,
    color: Color.Black,
    fontFamily: "Roboto_400Regular",
  },
});
