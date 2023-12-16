import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Dimensions,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import HeaderNormal from "../../components/HeaderNormal";

export default function UsersList() {
  let height = Dimensions.get("screen").height;
  let width = Dimensions.get("screen").width;

  const data = [
    {
      id: "1",
      name: "Bilal Majeed",
      phone: "+92 333 7748656",
    },
    {
      id: "2",
      name: "Amna Yasir",
      phone: "+92 333 7748656",
    },
    {
      id: "3",
      name: "Iqra Jalal",
      phone: "+92 333 7748656",
    },
    {
      id: "4",
      name: "Sherbano",
      phone: "+92 333 7748656",
    },
    {
      id: "5",
      name: "Shah Rukh Khan",
      phone: "+92 333 7748656",
    },
    {
      id: "6",
      name: "Shah Rukh Khan",
      phone: "+92 333 7748656",
    },
    {
      id: "7",
      name: "Shah Rukh Khan",
      phone: "+92 333 7748656",
    },
    {
      id: "8",
      name: "Shah Rukh Khan",
      phone: "+92 333 7748656",
    },
  ];

  const navigation = useNavigation();

  const handlebackpress = () => {
    navigation.goBack();
  };
  return (
    <SafeAreaView style={{ backgroundColor: "#4582C3" }}>
      <HeaderNormal title={"Add Group Leader"} onback={handlebackpress} />
      <View style={styles.main}>
        <FlatList
          data={data}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={{}}>
              <View
                style={{
                  //   with: "100%",
                  marginTop: 10,
                  backgroundColor: "white",
                  elevation: 8,
                  paddingVertical: height * 0.012,
                  marginHorizontal: 20,
                  paddingHorizontal: height * 0.012,
                  borderRadius: 10,
                  flexDirection: "row",
                  //   justifyContent: "space-between",
                  alignContent: "center",
                  alignItems: "center",
                }}
              >
                <Image
                  style={{
                    width: height * 0.065,
                    height: height * 0.065,
                    borderRadius: height * 0.1,
                  }}
                  source={require("../../../assets/avatar-placeholder.png")}
                />
                <View style={{ marginLeft: 11 }}>
                  <Text>{item.name}</Text>
                  <Text>{item.phone}</Text>
                </View>
              </View>
              <TouchableOpacity
                style={{ position: "absolute", left: height * 0.3 }}
              >
                <View
                  style={{
                    backgroundColor: "#E4F1FF",
                    paddingHorizontal: 27,
                    paddingVertical: 7,
                    borderRadius: 27 / 2,
                  }}
                >
                  <Text>Invite</Text>
                </View>
              </TouchableOpacity>
            </View>
          )}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  main: {
    paddingTop: 10,
    width: "100%",
    height: "100%",
    backgroundColor: "white",
  },
});
