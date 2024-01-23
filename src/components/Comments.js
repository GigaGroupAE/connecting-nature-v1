import React from "react";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import Comment from "./Comment";
import CommentInput from "./CommentInput";

export default function Comments() {
  const [textInputFocused, setTextInputFocused] = useState(false);

  const handleTextInputFocus = () => {
    setTextInputFocused(true);
  };

  const handleTextInputBlur = () => {
    setTextInputFocused(false);
  };
  return (
    <View>
      <View style={styles.main}>
        <View style={styles.header}>
          <Text style={styles.headerLikes}>2.3k</Text>
          <Text style={styles.headerComments}>1.1k comments</Text>
          <Text style={styles.headerShares}>172 shares</Text>
          <TouchableOpacity>
            <Image
              style={styles.headerCross}
              source={require("../../assets/cancel-icon.png")}
            />
          </TouchableOpacity>
        </View>

        {/* Comment Section */}

        <View style={styles.mainContainer}>
          <Text style={styles.commentsHeadText}>Most recent comments</Text>
        </View>
        <ScrollView style={styles.mainScroll}>
          <Comment
            name={"Bilal Majeed"}
            comment={"Great Work bro."}
            time={"3 h"}
          />
          <Comment
            name={"Maya Yo."}
            comment={
              "In publishing and graphic design, Lorem ipsum is a placeholder text commonly"
            }
            time={"2 h"}
          />
          <Comment name={"Tanya K."} comment={"Great Work bro."} time={"1 h"} />
          <Comment
            name={"Bilal Majeed"}
            comment={
              "In publishing and graphic design, Lorem ipsum is a placeholder text commonly"
            }
            time={"2 h"}
          />
          <Comment name={"Sami Z."} comment={"Great Work bro."} time={"1 h"} />
          <Comment
            name={"Maya Yo."}
            comment={
              "In publishing and graphic design, Lorem ipsum is a placeholder text commonly"
            }
            time={"2 h"}
          />
          <Comment
            name={"Bilal Majeed"}
            comment={
              "In publishing and graphic design, Lorem ipsum is a placeholder text commonly"
            }
            time={"1 h"}
          />
          <Comment
            name={"Zubair Shahzad"}
            comment={"I am a good boy and having fun"}
            time={"20 m"}
          />
        </ScrollView>
      </View>
      <View style={styles.commentInput}>
        <CommentInput
          placeholder={"Write your comment"}
          onFocus={handleTextInputFocus}
          onBlur={handleTextInputBlur}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  main: {
    marginTop: 28,
    paddingHorizontal: 33,
    backgroundColor: "#fff",
    borderRadius: 20,
    height: "100%",
    width: "100%",
  },
  header: {
    marginTop: 24,
    flexDirection: "row",
    justifyContent: "space-between",
    alignContent: "center",
    alignItems: "center",
  },
  headerIcons: {
    width: 20,
    height: 20,
  },
  headerCross: {
    width: 15,
    height: 15,
  },
  headerLikes: {
    marginRight: 37,
    fontSize: 12,
    fontWeight: "400",
    color: "#707070",
  },
  headerComments: {
    fontSize: 12,
    fontWeight: "400",
    color: "#707070",
  },
  headerShares: {
    marginRight: 40,
    fontSize: 12,
    fontWeight: "400",
    color: "#707070",
  },
  mainContainer: {
    marginTop: 34,
  },
  commentsHeadText: {
    marginBottom: 14,
    fontSize: 14,
    fontWeight: "500",
    color: "#707070",
  },
  mainScroll: {
    width: "100%",
    marginBottom: 150,
  },
  commentMainContainer: {
    marginTop: 21,
    flexDirection: "row",
    alignContent: "center",
    alignItems: "center",
  },
  commentTextContainer: {
    marginLeft: 15,
    alignItems: "baseline",
    alignSelf: "flex-start",
    backgroundColor: "#fff",
    padding: 7,
    borderRadius: 8,
  },
  avatar: {
    borderRadius: 100,
    width: 35,
    height: 35,
  },
  nameFollow: {
    flexDirection: "row",
  },
  userName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#515151",
  },
  follow: {
    fontSize: 14,
    fontWeight: "700",
    color: "#4582C3",
    marginLeft: 13,
  },
  commentText: {
    fontSize: 13,
    fontWeight: "500",
    color: "#606060",
    lineHeight: 21,
  },
  action: {
    flexDirection: "row",
    marginLeft: 57,
  },
  time: {
    fontSize: 12,
    fontWeight: "500",
    color: "#585858",
    lineHeight: 21,
  },
  like: {
    marginLeft: 17,
    fontSize: 12,
    color: "#585858",
    fontWeight: "500",
    lineHeight: 21,
  },
  commentInput: {
    position: "absolute",
    width: "100%",
    top: 720,
  },
});
