import {
  SafeAreaView,
  StyleSheet,
  View,
  TextInput,
  KeyboardAvoidingView,
} from "react-native";
import Color from "../../assets/colors/Color";

export default function ExtendTimeCampaign({
  title,
  onchange,
  keyboardType = "default",
  value = null,
  defaultValue = null,
  editable = editable,
  maxLength = 30,
  edit = true,
}) {
  return (
    <SafeAreaView>
      <KeyboardAvoidingView>
        <View style={styles.mainContainer}>
          <View>
            <TextInput
              maxLength={maxLength}
              keyboardType={keyboardType}
              style={styles.textInput}
              placeholder={title}
              defaultValue={defaultValue}
              value={value}
              editable={edit}
              onChangeText={(e) => {
                onchange(e);
              }}
            />
          </View>
        </View>
      </KeyboardAvoidingView>
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
    elevation: 3,
    zIndex: 100,
    position: "relative",
  },
  textInput: {
    padding: 15,
    borderRadius: 8,
    width: 318,
    height: 50,
    fontSize: 14,
    fontFamily: "Roboto_500Medium",
  },
});
