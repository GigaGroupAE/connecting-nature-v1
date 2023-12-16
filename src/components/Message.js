import { View, Text, Image, StyleSheet, ScrollView } from "react-native";
import React, { useState, useCallback, useEffect } from "react";

export default function Message(props) {
  const [currentDate, setCurrentDate] = useState("");

  useEffect(() => {
    var date = new Date().getDate(); //Current Date
    var month = new Date().getMonth() + 1; //Current Month
    setCurrentDate(date + "/" + month);
  }, []);

  const [textShown, setTextShown] = useState(false); //To show ur remaining Text
  const [lengthMore, setLengthMore] = useState(false); //to show the "Read more & Less Line"
  const toggleNumberOfLines = () => {
    //To toggle the show text or hide it
    setTextShown(!textShown);
  };

  const onTextLayout = useCallback((e) => {
    setLengthMore(e.nativeEvent.lines.length >= 2); //to check the text is more than 2 lines or not
    // console.log(e.nativeEvent);
  }, []);

  return (
    <ScrollView>
      <View style={styles.mainBody}>
        <View style={styles.singleNotification}>
          <Image
            style={styles.avatar}
            source={require("../../assets/avatar-placeholder.png")}
          />
          <View style={styles.mainContent}>
            <View style={styles.notificationHead}>
              <Text style={styles.userName}>Bilal Majeed</Text>
              <Text style={styles.categoryText}>Management</Text>
              <View style={styles.timeContainer}>
                <Text style={styles.timeText}>{currentDate}</Text>
              </View>
            </View>
            <View style={styles.messageContainer}>
              <Text
                onTextLayout={onTextLayout}
                numberOfLines={textShown ? undefined : 2}
                style={styles.notification}
              >
                {props.index}
                {lengthMore ? (
                  <Text onPress={toggleNumberOfLines} style={styles.readMore}>
                    {textShown ? "Read less" : "Read more..."}
                  </Text>
                ) : null}
              </Text>

              {/* <Text style={styles.notification}>{item.message}</Text> */}
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    width: "100%",
  },
  mainBody: {
    alignContent: "center",
    alignItems: "center",
    width: "100%",
  },
  singleNotification: {
    flexDirection: "row",
    alignItems: "flex-start",
    width: 345,
    height: "100%",
    backgroundColor: "#fff",
    marginTop: 20,
    paddingVertical: 5,
  },
  avatar: {
    width: 54,
    height: 54,
    borderRadius: 54 / 2,
    borderWidth: 1,
    borderColor: "#000",
    alignSelf: "flex-start",
  },
  notificationHead: {
    width: "100%",
    flexDirection: "row",
    alignItems: "baseline",
    backgroundColor: "#fff",
    alignSelf: "flex-end",
  },
  userName: {
    fontFamily: "Roboto",
    fontSize: 14,
    fontWeight: "700",
    color: "#707070",
    marginLeft: 11,
    lineHeight: 18,
  },
  categoryText: {
    fontFamily: "Roboto",
    fontSize: 12,
    fontWeight: "400",
    color: "#4582C3",
    marginLeft: 9,
    marginRight: 9,
    alignSelf: "flex-end",
  },
  timeContainer: {
    alignSelf: "flex-end",
  },
  timeText: {
    fontFamily: "Roboto",
    fontSize: 12,
    fontWeight: "400",
    color: "#707070",
    opacity: 0.7,
  },
  messageContainer: {
    flexDirection: "row",
    width: "90%",
  },
  notification: {
    fontFamily: "Roboto",
    fontSize: 13,
    fontWeight: "400",
    color: "#707070",
    marginLeft: 11,
    lineHeight: 21,
    flexWrap: "wrap",
  },
  readMore: {
    fontFamily: "Roboto",
    fontSize: 13,
    fontWeight: "500",
    color: "#000",
    marginLeft: 11,
    lineHeight: 21,
  },
  textInputContainer: {
    alignContent: "center",
    width: "100%",
    top: 140,
    flexDirection: "row",
    paddingHorizontal: 17,
  },
  textInput: {
    width: 345,
    borderRadius: 8,
    height: 55,
    backgroundColor: "#eee",
    paddingHorizontal: 17,
  },
});
