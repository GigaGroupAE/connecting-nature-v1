import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Keyboard,
} from 'react-native';

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons.js';
import Color from '../../assets/colors/Color';
import LivepollComments from '../LivepollComments';
import { screenHeight } from '../utils/ScreenDimensions';

const comments = [
  'Great job!',
  'I love it!',
  'Awesome work!',
  'Keep it up!',
  'Fantastic!',
  'Impressive!',
  'Well done!',
  'Amazing!',
  'You nailed it!',
  'Bravo!',
  'Excellent!',
  'Superb!',
  'Incredible!',
  'Outstanding!',
  'WOW!',
  'Very impressive!',
  'Thumbs up!',
  'Go Teams 🚀',
  'Go Team A🚀',
  'Go Team B 🚀',
  'Hurrah!',
  'Good bro 🔥',
];

export default function CampaignCommentInput(props) {
  const [value, setvalue] = useState('');
  const [suggsComments, setSuggesComments] = useState([]);
  useEffect(() => {
    const shuffledComments = comments.sort(() => 0.5 - Math.random());
    const selectedComments = shuffledComments.slice(0, 6);
    setSuggesComments(selectedComments);
  }, []);

  return (
    <View>
      <ScrollView
        horizontal
        style={{ flexDirection: 'row', backgroundColor: Color.White }}
        showsHorizontalScrollIndicator={false}
      >
        <LivepollComments id={props?.id} screen="comment" />
      </ScrollView>
      <View style={styles.container}>
        <TextInput
          // autoFocus
          onFocus={props?.onFocus}
          onBlur={props?.onBlur}
          defaultValue={value}
          style={styles.input}
          placeholder={props.placeholder}
          onChangeText={(e) => {
            props.onchange(e);
            setvalue(e);
          }}
          multiline
        />
        <TouchableOpacity
          disabled={props.disabled}
          onPress={() => {
            setvalue('');
            props.onPress();
          }}
        >
          <MaterialCommunityIcons
            name="send"
            color={Color.White}
            size={25}
            style={styles.sendIcon}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  main: {
    flex: 1,
    position: 'absolute',
    bottom: 10,
    alignItems: 'center',
    alignContent: 'center',
    width: '100%',
    // height: 65,
    // paddingHorizontal: 19,
    backgroundColor: Color.White,
  },
  container: {
    marginTop: 3,
    justifyContent: 'space-between',
    flexDirection: 'row',
    borderRadius: 8,
    paddingLeft: 17,
    width: '100%',
    backgroundColor: Color.White,
    shadowColor: Color.Black,
    shadowOffset: {
      width: 0,
      height: 12,
    },
    shadowOpacity: 0.58,
    shadowRadius: 16.0,
    elevation: 10,
  },
  input: {
    width: '80%',
    fontSize: 16,
  },
  sendIcon: {
    backgroundColor: Color.Blue,
    padding: 10,
    borderTopRightRadius: 8,
    borderBottomRightRadius: 8,
    paddingLeft: 15,
  },
});
