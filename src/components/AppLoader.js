import { View, StyleSheet } from "react-native";
import LottieView from "lottie-react-native";
import Color from "../../assets/colors/Color";
import { ActivityIndicator } from "react-native";

const AppLoader = () => {
  return (
    <View style={[StyleSheet.absoluteFillObject, styles.mainContainer]}>
      <ActivityIndicator size="large" color={Color.Blue} />
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.3)",
    zIndex: 1,
  },
});

export default AppLoader;
