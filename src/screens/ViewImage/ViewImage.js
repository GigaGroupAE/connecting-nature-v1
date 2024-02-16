import React from "react";
import {
  View,
  Text,
  ImageBackground,
  Animated,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ViewImage(props) {
  let deviceHeight = Dimensions.get("screen").height;
  let deviceWidth = Dimensions.get("screen").width;
  return (
    <SafeAreaView>
      <View>
        <ImageBackground
          resizeMode="contain"
          source={{ uri: props.route.params.url }}
          style={{ height: deviceHeight, width: deviceWidth }}
        />
      </View>
      <View>
        <Text>{props.route.params.message}</Text>
      </View>
    </SafeAreaView>
  );
}
