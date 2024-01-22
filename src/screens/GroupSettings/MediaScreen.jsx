import React, { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useRoute } from "@react-navigation/native";
import { FlatList } from "react-native";
import { scale } from "react-native-size-matters";
import Color from "../../../assets/colors/Color";
import HeaderNormal from "../../components/HeaderNormal";
import FileMedia from "./FIleMedia";
import DocType from "./DocType";
import { SafeAreaProvider } from "react-native-safe-area-context";
import CustomStatsBar from "../../components/CustomStatsBar";

const MediaScreen = () => {
  const route = useRoute();

  const [isActiveMedia, setIsActiveMedia] = useState(true);
  const [isActiveDoc, setIsActiveDoc] = useState(false);

  const handleActiveMedia = () => {
    setIsActiveMedia(true);
    setIsActiveDoc(false);
  };

  const handleActiveDoc = () => {
    setIsActiveMedia(false);
    setIsActiveDoc(true);
  };

  const docData = route?.params?.data.filter(
    (item) => item?.type === "document"
  );
  const imageData = route?.params?.data.filter(
    (item) => item?.type !== "audio" && item?.type !== "document"
  );

  return (
    <SafeAreaProvider style={styles.container}>
      <CustomStatsBar backgroundColor={Color.White} />
      <View style={styles.container}>
        <HeaderNormal title={route?.params?.groupTitle} />

        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-around",
            width: "100%",
            borderBottomWidth: 1,
            borderBottomColor: Color.VeryLightGrey,
            height: scale(40),
          }}
        >
          <TouchableOpacity
            style={isActiveMedia ? styles.activeScreen : styles.mediaContainer}
            onPress={handleActiveMedia}
          >
            <Text style={styles.title}>Media</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={isActiveDoc ? styles.activeScreen : styles.docContainer}
            onPress={handleActiveDoc}
          >
            <Text style={styles.title}>Doc</Text>
          </TouchableOpacity>
          <TouchableOpacity></TouchableOpacity>
        </View>
        <ScrollView style={styles.content}>
          {isActiveDoc ? (
            <View style={styles.docs}>
              <DocType data={docData} />
            </View>
          ) : (
            <FlatList
              data={imageData}
              keyExtractor={(item) => {
                return item._id;
              }}
              renderItem={({ item }) => {
                return (
                  <View>
                    {item?.type !== "audio" && (
                      <FileMedia
                        data={item}
                        key={item._id}
                        activeScreen="media"
                      />
                    )}
                  </View>
                );
              }}
              numColumns={3}
            />
          )}
        </ScrollView>
      </View>
    </SafeAreaProvider>
  );
};

export default MediaScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Color.White,
  },
  content: {
    flex: 1,
  },
  title: {
    fontFamily: "Roboto_500Medium",
    fontSize: scale(12),
    paddingHorizontal: scale(4),
  },
  activeScreen: {
    flexDirection: "row",
    alignItems: "center",
    width: "40%",
    borderBottomColor: Color.Blue,
    borderBottomWidth: 2,
    justifyContent: "center",
  },
  mediaContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "40%",
    display: "flex",
    justifyContent: "center",
  },
  docContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "40%",
    display: "flex",
    justifyContent: "center",
  },
  docs: {
    flex: 1,
    // height: "100%",
  },
});
