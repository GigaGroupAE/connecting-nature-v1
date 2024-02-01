import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Linking,
  Pressable,
} from 'react-native';
import { MaterialCommunityIcons } from 'react-native-vector-icons';
import { BASE_URL } from '../../../CONSTANTS';
import { useUserState } from '../../slices/userSlice';
import Color from '../../../assets/colors/Color';
import { useNavigation } from '@react-navigation/native';
import MessageType from './MessageType';
import { calculateTimeDifference } from '../../utils/timeDifference';

const Height = Dimensions.get('screen').height;
const Width = Dimensions.get('screen').width;

const DocumentMessageCn = (props) => {
  const { socket, item } = props;
  const timePassed = calculateTimeDifference(item.date);

  const userState = useUserState();
  const [document, setDocument] = React.useState(item?.content);
  const navigation = useNavigation();

  const shortTitle =
    document?.name?.length > 10
      ? document?.name.slice(0, 28) + '...'
      : document?.name;

  return (
    <View>
      <Pressable
        style={[
          userState.id === item?.from
            ? styles.receiverTextMessageMainContainer
            : styles.senderTextMessageMainContainer,
        ]}
        android_ripple={{ color: Color.LightGrey }}
        onLongPress={() => props?.longPress(item._id, item?.from)}
      >
        <View
          style={[
            userState.id === item?.from
              ? styles.receiverTextMessageContainer
              : styles.senderTextMessageContainer,
          ]}
        >
          <View
            style={[
              userState.id === item?.from
                ? styles.receiverDocumentContainer
                : styles.senderDocumentContainer,
            ]}
          >
            <Pressable
              onPress={() => {
                Linking.openURL(
                  `${BASE_URL}/messageMedia/${item.content.path}`,
                );
              }}
              onLongPress={() => props?.longPress(item._id, item?.from)}
            >
              <View>
                <View>
                  <View
                    style={{
                      overflow: 'hidden',
                      flexDirection: 'row',
                    }}
                  >
                    <MessageType title={item.content?.name} />
                    <Text
                      style={{
                        fontFamily: 'Roboto_500Medium',
                        fontSize: Height * 0.019,
                        alignSelf: 'center',
                      }}
                    >
                      {document.name ? shortTitle : 'Testing'}
                    </Text>
                  </View>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <Text
                    style={{
                      fontSize: 11,
                      color: 'grey',
                      marginLeft: Width * 0.017,
                      position: 'relative',
                      left: 22,
                    }}
                  >
                    {document.size
                      ? document.size >= 1000000
                        ? document.size / 1000000 + ' ' + 'MB' + ' '
                        : document.size / 1000 + ' ' + 'kB' + ' '
                      : 'somesize'}
                  </Text>
                  <Text
                    style={{
                      fontSize: 11,
                      color: 'grey',
                      marginLeft: Width * 0.017,
                    }}
                  >
                    {timePassed}
                  </Text>
                </View>
              </View>
            </Pressable>
          </View>
        </View>
        <TouchableOpacity
          onPress={() =>
            navigation.navigate('MsgShare', {
              forwardFrom: userState?.id,
              forwardChat: 'chatId',
              forwardType: 'document',
              forwardContent: item.content,
              socket: socket,
            })
          }
          style={[
            userState.id === item?.from
              ? styles.shareMessage
              : styles.receiverShareMessage,
          ]}
        >
          <View>
            <MaterialCommunityIcons
              name="share"
              size={22}
              style={{ color: 'white' }}
            />
          </View>
        </TouchableOpacity>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  senderTextMessageMainContainer: {
    flex: 1,
    flexDirection: 'row',
    alignContent: 'center',
    alignItems: 'center',
  },
  receiverTextMessageMainContainer: {
    flex: 1,
    flexDirection: 'row',
    alignContent: 'center',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  senderTextMessageContainer: {
    backgroundColor: Color.White,
    maxWidth: '80%',
    width: '75%',
    borderRadius: 15,
    marginVertical: 4,
    paddingHorizontal: 5,
  },
  receiverTextMessageContainer: {
    backgroundColor: Color.White,
    maxWidth: '80%',
    width: Width * 0.75,
    borderRadius: 15,
    paddingHorizontal: 5,
    marginVertical: 4,
  },
  textMessageMainContainer: {
    flex: 1,
    flexDirection: 'row',
    alignContent: 'center',
    alignItems: 'center',
  },
  textMessageContainer: {
    alignItems: 'baseline',
    width: Dimensions.get('screen').width * 0.64,
    // alignSelf: "flex-start",
    backgroundColor: 'white',
    maxWidth: '80%',
    borderLeftWidth: 4,
    borderColor: '#4582C3',
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
    marginVertical: 4.5,
    paddingHorizontal: 5,
  },
  username: {
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 5,
    fontFamily: 'Roboto_500Medium',
    paddingVertical: 3,
    color: '#4582C3',
  },
  message: {
    fontSize: 14,
    marginLeft: 5,
    lineHeight: 18,
    fontFamily: 'Roboto_400Regular',
    paddingVertical: 3,
  },
  timeContainer: {
    flexDirection: 'row',
    alignSelf: 'flex-end',
    marginVertical: '1%',
  },
  time: {
    fontSize: 12,
    color: Color.Grey,
    fontFamily: 'Roboto_400Regular',
    marginLeft: '10%',
  },
  shareMessage: {
    position: 'absolute',
    right: Width * 0.76,
    // bottom: -15,
    backgroundColor: '#CFCFCF',
    marginLeft: 9,
    borderRadius: 50,
    padding: 3,
  },
  receiverShareMessage: {
    position: 'absolute',
    // right: -40,
    // bottom: -15,
    left: Width * 0.7,
    backgroundColor: '#CFCFCF',
    marginLeft: 9,
    borderRadius: 50,
    padding: 3,
  },
  receiverDocumentContainer: {
    marginTop: 5,
    backgroundColor: Color.LightBg,
    paddingVertical: 10,
    borderRadius: 15,
    paddingHorizontal: 8,
    borderWidth: 4,
    borderColor: Color.LightBlue,
  },
  senderDocumentContainer: {
    marginTop: 5,
    backgroundColor: Color.LightBg,
    paddingVertical: 10,
    borderRadius: 15,
    paddingHorizontal: 8,
    borderWidth: 4,
    borderColor: Color.VeryLightGrey,
  },
});

export default DocumentMessageCn;
