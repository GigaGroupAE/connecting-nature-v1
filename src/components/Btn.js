import { Pressable, StyleSheet, Text } from "react-native";
import { theme } from "../../theme";

const Btn = ({
  backgroundColor = "#fff",
  textColor = "black",
  text = "default",
  marginLeft = 0,
  marginRight = 0,
  disabled = false,
  onPress
}) => {
  return (
    <Pressable
    disabled={disabled}
    
    onPress={onPress}
      style={({ pressed }) =>
        pressed
          ? [
              styles.button,
              { backgroundColor, opacity: 0.5, marginLeft, marginRight },
            ]
          : [styles.button, { backgroundColor, marginLeft, marginRight }]
      }
    >
      <Text
        style={{ color: textColor, fontFamily: theme.fonts.family.semiBold }}
      >
        {text}
      </Text>
    </Pressable>
  );
};

export default Btn;

const styles = StyleSheet.create({
  button: {
    flex: 1,
    borderRadius: 8,
    paddingVertical: 5,
    justifyContent: "center",
    alignItems: "center",
  },
});
