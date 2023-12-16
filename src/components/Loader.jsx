import { View, ActivityIndicator } from "react-native";

const Loader = () => {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <ActivityIndicator color="#007BFF" size="large" />
    </View>
  );
};

export default Loader;
