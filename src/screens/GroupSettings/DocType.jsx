import React from 'react';
import {
  FlatList,
  Linking,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { Entypo } from 'react-native-vector-icons';
import { scale } from 'react-native-size-matters';
import MessageType from '../../components/DocumentMessage/MessageType';
import { calculateTimeDifference } from '../../utils/timeDifference';
import Color from '../../../assets/colors/Color';
import { useUserState } from '../../slices/userSlice';
const DocType = ({ data }) => {
  const handleDocumentPress = (item) => {
    Linking.openURL(`${item?.content?.path}`);
  };

  const userState = useUserState();

  return (
    <View style={{ position: 'relative', zIndex: 100, flex: 1 }}>
      <FlatList
        data={data}
        keyExtractor={(item) => {
          return item._id;
        }}
        renderItem={({ item }) => {
          let removeLineBreak = item?.content?.name;
          if (removeLineBreak?.length > 40) {
            removeLineBreak = removeLineBreak.slice(0, 37) + '...';
          }
          let timePassed = calculateTimeDifference(item?.updatedAt);

          return (
            <>
              <View style={styles.documentContainer}>
                <Pressable
                  style={styles.documentPressable}
                  onPress={() => handleDocumentPress(item)}
                >
                  {userState?.phoneNumber !== item?.from?.phoneNumber && (
                    <View style={styles.senderCon}>
                      <Text style={styles.sender}>Send By </Text>
                      <Entypo name="dot-single" />
                      <Text style={styles.senderName}>
                        {item?.from?.fullName}
                      </Text>
                    </View>
                  )}

                  <View style={styles.fileCon}>
                    <MessageType title={item?.content?.name} />
                    <Text style={styles.fileName}>{removeLineBreak}</Text>
                  </View>

                  <View style={styles.timeCon}>
                    <View>
                      <Text style={styles.size}>
                        {item?.content?.size
                          ? item?.content?.size >= 1000000
                            ? item?.content?.size / 1000000 +
                              ' ' +
                              'MB' +
                              ' ' +
                              '-' +
                              ' '
                            : item?.content?.size / 1000 +
                              ' ' +
                              'kB' +
                              ' ' +
                              '-' +
                              ' '
                          : 'somesize'}
                      </Text>
                    </View>
                    <Text style={styles.timepass}>{timePassed}</Text>
                  </View>
                </Pressable>
              </View>
            </>
          );
        }}
      />
    </View>
  );
};

export default DocType;

const styles = StyleSheet.create({
  documentContainer: {
    backgroundColor: Color.White,
    width: scale(320),
    alignSelf: 'center',
    marginVertical: scale(5),
    position: 'relative',
    top: scale(10),
    flex: 1,
    zIndex: 100,
  },
  documentPressable: {
    backgroundColor: Color.White,
    paddingVertical: scale(4),
    paddingHorizontal: scale(10),
    shadowColor: Color.Black,
    shadowOffset: {
      width: 0,
      height: 12,
    },
    shadowOpacity: 0.58,
    shadowRadius: 16.0,
    elevation: 3,
    zIndex: 100,
    flex: 1,
  },
  senderCon: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: scale(2),
  },
  sender: {
    fontFamily: 'Roboto_400Regular',
    fontSize: scale(12),
  },
  senderName: {
    fontFamily: 'Roboto_500Medium',
    paddingHorizontal: scale(10),
  },
  fileCon: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: scale(3),
  },
  fileName: {
    fontFamily: 'Roboto_500Medium',
    fontSize: scale(13),
    paddingHorizontal: scale(10),
  },
  timeCon: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: scale(2),
  },
  timepass: {
    fontFamily: 'Roboto_400Regular',
    fontSize: scale(11),
    color: Color.Grey,
  },
  size: {
    fontFamily: 'Roboto_400Regular',
    fontSize: scale(11),
  },
});
