import { View, Text, Dimensions } from "react-native";
import { Snackbar } from "react-native-paper";
import Color from "../../assets/colors/Color";
import { theme } from "../../theme";
import { useStateContext } from "../contexts/ContextProvider";

const SnackBar = ({ visible, onDismissSnackBar, title }) => {
  const { snackbarVisible, showSnackbar, hideSnackbar, snackbarTitle } =
    useStateContext();

  return (
    <Snackbar
      type={0}
      visible={snackbarVisible}
      style={{
        backgroundColor: Color.Grey,
        borderRadius: Dimensions.get("screen").height * 0,
        elevation: 0,
        width: "100%",
        marginLeft: 0,
        marginBottom: 0,
      }}
      onDismiss={hideSnackbar}
      duration={Snackbar.DURATION_SHORT}
      action={{
        label: "ok",
        color: Color.White,
        // label: <Entypo name="cross" color={"#707070"} size={28} />,
        onPress: () => {
          // Do something
        },
      }}
    >
      <Text
        style={{ fontFamily: theme.fonts.family.regular, color: Color.White }}
      >
        {snackbarTitle}
      </Text>
    </Snackbar>
  );
};

export default SnackBar;
