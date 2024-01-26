import { Pressable, StyleSheet, Text, View } from "react-native";
import React from "react";
import Color from "../../../assets/colors/Color";
import { FontAwesome } from "react-native-vector-icons";

const PostAction = () => {
  return (
    <View style={styles.actionMainContainer}>
      <View>
        <Pressable
          android_ripple={{ color: Color.LightGrey }}
          style={styles.mainAction}
          // onPress={handleLike}
        >
          {liked ? (
            <FontAwesome
              name="thumbs-up"
              style={{ ...styles.shareIcon, color: Color.Blue }}
            />
          ) : (
            <FontAwesome name="thumbs-o-up" style={styles.shareIcon} />
          )}

          <Text style={liked ? styles.actionedText : styles.actionText}>
            Like
          </Text>
        </Pressable>
      </View>
      <View>
        <Pressable
          android_ripple={{ color: Color.LightGrey }}
          style={styles.mainAction}
          onPress={handleOnClickComment}
        >
          <FontAwesome name="comment-o" style={styles.shareIcon} />
          <Text style={styles.actionText}>Comment</Text>
        </Pressable>
      </View>
      <View>
        <Pressable
          android_ripple={{ color: Color.LightGrey }}
          style={styles.mainAction}
          onPress={() => handleonshare()}
        >
          <AntDesign name="sharealt" style={styles.shareIcon} />
          <Text style={styles.actionText}>Share</Text>
        </Pressable>
      </View>
    </View>
  );
};

export default PostAction;

const styles = StyleSheet.create({});
