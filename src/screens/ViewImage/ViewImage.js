import React from 'react';
import { View, Text, ImageBackground } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { screenHeight, screenWidth } from '../../utils/ScreenDimensions';

export default function ViewImage(props) {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <ImageBackground
          resizeMode="contain"
          source={{ uri: props.route.params.url }}
          style={{ height: screenHeight, width: screenWidth }}
        />
      </View>
      <View>
        <Text>{props.route.params.message}</Text>
      </View>
    </SafeAreaView>
  );
}
