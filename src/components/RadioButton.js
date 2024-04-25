import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { CheckBox } from 'react-native-elements';

export default function RadioButton(props) {
  const [male, setMale] = useState(false);
  const [female, setFemale] = useState(false);

  const genderMale = () => {
    setMale(true);
    setFemale(false);
    props.onselect('male');
  };
  const genderFemale = () => {
    setMale(false);
    setFemale(true);
    props.onselect('female');
  };
  return (
    <View style={styles.main}>
      <View style={styles.option1}>
        <Text style={styles.optionTitle}>{props.option1}</Text>
        <CheckBox
          style={styles.checkBox}
          right
          size={20}
          checked={male}
          checkedIcon="dot-circle-o"
          uncheckedIcon="circle-o"
          onPress={genderMale}
          checkedColor="#4582C3"
        />
      </View>
      <View style={styles.option2}>
        <Text style={styles.optionTitle}>{props.option2}</Text>
        <CheckBox
          style={styles.checkBox}
          right
          size={20}
          checked={female}
          checkedIcon="dot-circle-o"
          uncheckedIcon="circle-o"
          onPress={genderFemale}
          checkedColor="#4582C3"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  main: {
    flexDirection: 'row',
    marginTop: 16,
    justifyContent: 'space-between',
    paddingLeft: 30,
    paddingRight: 30,
    width: '100%',
  },
  option1: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    width: '48%',
    height: 50,
    marginRight: 6,
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowColor: '#707070',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
    elevation: 4,
  },
  option2: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    width: '48%',
    height: 50,
    marginLeft: 6,
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowColor: '#707070',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
    elevation: 4,
  },
  optionTitle: {
    color: '#636464',
    fontSize: 14,
    fontWeight: '400',
    padding: 15,
  },
  checkBox: {
    padding: 30,
  },
});
