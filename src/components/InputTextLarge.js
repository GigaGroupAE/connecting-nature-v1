import { SafeAreaView, StyleSheet, View, TextInput } from 'react-native';
import Color from '../../assets/colors/Color';

export default function InputTextLarge(props) {
  return (
    <SafeAreaView>
      <View style={styles.mainContainer}>
        <View>
          <TextInput
            style={styles.textInput}
            multiline
            numberOfLines={10}
            textAlignVertical="top"
            maxLength={350}
            placeholder={props.title}
            value={props.value}
            onChangeText={(e) => {
              props.onchange(e);
            }}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    alignContent: 'center',
    width: '100%',
    marginTop: 16,
    backgroundColor: '#fff',
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
    position: 'relative',
  },
  textInput: {
    // paddingBottom: 59,
    padding: 15,
    borderRadius: 8,
    width: 318,
    height: 100,
    fontSize: 14,
    fontFamily: 'Roboto_500Medium',
  },
});
