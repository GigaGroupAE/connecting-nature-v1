import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { FontAwesome, AntDesign } from "react-native-vector-icons";
import HeaderNormal from "../../components/HeaderNormal";

const post = [
  {
    id: 1,
    username: "JohnDoe",
    content: "This is a comment on the post!",
    timestamp: "2023-07-22T13:00:00Z",
  },
  {
    id: 2,
    username: "Commenter2",
    content: "I also have something to say about this post!",
    timestamp: "2023-07-22T14:00:00Z",
  },
];
const comments = [
  {
    id: 1,
    username: "Commenter1",
    content: "This is a comment on the post!",
    timestamp: "2023-07-22T13:00:00Z",
  },
  {
    id: 2,
    username: "Commenter2",
    content: "I also have something to say about this post!",
    timestamp: "2023-07-22T14:00:00Z",
  },
];

const ExpandedPost = ({ post }) => {
  const [newComment, setNewComment] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);
  const [likes, setLikes] = useState(0);
  const [comments, setComments] = useState(0);
  const [shares, setShares] = useState(0);

  return (
    <View>
      <HeaderNormal title={"Post"} />
      <View style={styles.container}>
        <View style={{ flexDirection: "row" }}>
          <Image
            style={styles.profilePicture}
            source={{
              uri: "https://play-lh.googleusercontent.com/UjaAdTYsArv7zAJbqGWjQw2ftuOtnAlvokffC3TQQ2K12mwk0YdXUF2wZBTBA2kDZIk=w240-h480-rw",
            }}
          />
          <View>
            <Text style={styles.username}>JohnDoe</Text>
            <Text style={styles.commentTimestamp}>23 July 2023 05:00</Text>
          </View>
        </View>
        <View style={styles.contentContainer}>
          <Text style={styles.content}>
            Testing Post to Expanded Post Just Like Twitter
          </Text>
          <Image
            style={styles.postImage}
            source={{
              uri: "https://media.cntraveller.com/photos/611bf0b8f6bd8f17556db5e4/4:3/pass/gettyimages-1146431497.jpg",
            }}
          />
          <View style={styles.actionsContainer}>
            <TouchableOpacity onPress={() => setLikes(likes + 1)}>
              <View style={{ flexDirection: "row" }}>
                <FontAwesome name="heart-o" size={20} color="#000" />
                <View style={{ marginLeft: 7, alignSelf: "center" }}>
                  <Text>{likes}</Text>
                </View>
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setComments(comments + 1)}>
              <View style={{ flexDirection: "row" }}>
                <FontAwesome name="comment-o" size={20} color="#000" />
                <View style={{ marginLeft: 7, alignSelf: "center" }}>
                  <Text>{comments}</Text>
                </View>
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setShares(shares + 1)}>
              <View style={{ flexDirection: "row" }}>
                <AntDesign name="sharealt" size={20} color="#000" />
                <View style={{ marginLeft: 7, alignSelf: "center" }}>
                  <Text>{shares}</Text>
                </View>
              </View>
            </TouchableOpacity>
          </View>
          <View style={styles.commentsContainer}>
            <View style={styles.comment}>
              <Text style={styles.commentUsername}>Afzaal </Text>
              <Text style={styles.commentContent}>
                lore, ipsuim lorem padding make h480
              </Text>
              <Text style={styles.commentTimestamp}>1 day ago</Text>
            </View>
          </View>
          <TextInput
            style={styles.replyInput}
            value={newComment}
            onChangeText={(text) => setNewComment(text)}
            placeholder="Write a reply..."
          />
          <TouchableOpacity style={styles.postReplyButton}>
            <Text style={styles.postReplyButtonText}>Post Reply</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    backgroundColor: "white",
  },
  profilePicture: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  contentContainer: {
    // flex: 1,
    marginTop: 5,
  },
  username: {
    fontWeight: "bold",
    fontSize: 16,
  },
  content: {
    marginBottom: 10,
  },
  postImage: {
    width: "100%",
    height: Dimensions.get("screen").height * 0.25,
    resizeMode: "cover",
    marginBottom: 10,
    borderRadius: 15,
  },
  commentsContainer: {
    borderTopWidth: 1,
    borderTopColor: "#ddd",
    marginTop: 10,
    paddingTop: 10,
  },
  comment: {
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    paddingBottom: 10,
    marginBottom: 10,
  },
  commentUsername: {
    fontWeight: "bold",
  },
  commentContent: {},
  commentTimestamp: { fontSize: 12, color: "#999", marginTop: 5 },
  replyInput: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
    padding: 10,
    marginTop: 10,
  },
  postReplyButton: {
    backgroundColor: "#1da1f2",
    borderRadius: 5,
    padding: 10,
    marginTop: 10,
  },
  postReplyButtonText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
  },
});

export default ExpandedPost;
