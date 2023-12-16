import { SafeAreaView, StyleSheet, View, TextInput } from "react-native";
import Color from "../../assets/colors/Color";

export default function DescInputText({
  title,
  onchange,
  keyboardType = "default",
  value = null,
  defaultValue = null,
  editable = editable,
  multiline = multiline,
  textAlignVertical = textAlignVertical,
  maxLength = 200,
}) {
  return (
    <SafeAreaView>
      <View style={styles.mainContainer}>
        <View>
          <TextInput
            maxLength={maxLength}
            textAlignVertical={textAlignVertical}
            multiline={multiline}
            keyboardType={keyboardType}
            style={styles.textInput}
            placeholder={title}
            defaultValue={defaultValue}
            value={value}
            editable={true}
            onChangeText={(e) => {
              onchange(e);
            }}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    marginTop: 16,
    backgroundColor: Color.White,
    borderRadius: 8,
    shadowColor: Color.Grey,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
    elevation: 8,
  },
  textInput: {
    padding: 15,
    borderRadius: 8,
    width: 318,
    height: 150,
    fontSize: 14,
    fontFamily: "Roboto_500Medium",
  },
});
