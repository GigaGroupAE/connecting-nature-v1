import React, { useCallback, useMemo, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Color from '../../assets/colors/Color';

const DescriptionText = ({ description }) => {
  // Memoize the removeHashtags function
  const removeHashtags = useMemo(() => {
    return (text) => {
      const words = text?.split(/\s+/);
      const hasRegularWords = words?.some((word) => !/^#\S+/.test(word));
      if (!hasRegularWords) {
        return text;
      }
      const updatedText = text.replace(/#[^\s]+/g, '');
      return updatedText;
    };
  }, []);

  //variables end for bottom sheet
  const video = React.useRef(null);
  const [textShown, setTextShown] = useState(false); //To show ur remaining Text
  const [lengthMore, setLengthMore] = useState(false); //to show the "Read more & Less Line"
  const toggleNumberOfLines = () => {
    //To toggle the show text or hide it
    setTextShown(!textShown);
  };

  const onTextLayout = useCallback((e) => {
    setLengthMore(e.nativeEvent.lines.length >= 4); //to check the text is more than 4 lines or not
    // console.log(e.nativeEvent);
  }, []);

  // Process the description text
  const descriptionWithOutHashtags = useMemo(
    () => removeHashtags(description),
    [description],
  );

  // Extract unique hashtags
  const hashtagRegex = /#[^\s]+/g;
  const matches = description.match(hashtagRegex) || [];
  const uniqueMatches = matches.filter(
    (match) => !descriptionWithOutHashtags.includes(match),
  );

  return (
    <View style={styles.postDescription}>
      <Text
        onTextLayout={onTextLayout}
        numberOfLines={textShown ? undefined : 4}
        style={{
          ...styles.descriptionText,
          color: /^#\S+/.test(descriptionWithOutHashtags)
            ? Color.Blue
            : Color.White,
        }}
      >
        {descriptionWithOutHashtags}

        {uniqueMatches.map((match, index) => (
          <Text
            key={index}
            style={{ ...styles.descriptionText, color: Color.Blue }}
          >
            {match}
          </Text>
        ))}
      </Text>

      {lengthMore ? (
        <Text
          onPress={toggleNumberOfLines}
          style={{ marginTop: 5, color: Color.Blue }}
        >
          {textShown ? 'Read less...' : 'Read more...'}
        </Text>
      ) : null}
    </View>
  );
};

export default DescriptionText;
const styles = StyleSheet.create({
  postDescription: {
    paddingHorizontal: 17,
    paddingVertical: 7,
  },
  descriptionText: {
    fontSize: 14,
    fontFamily: 'Roboto_400Regular',
    color: Color.White,
    // flexWrap: "wrap-reverse",
  },
});
