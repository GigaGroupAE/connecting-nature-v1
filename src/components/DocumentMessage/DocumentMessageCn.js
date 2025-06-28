import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Pressable,
} from 'react-native';
import { MaterialCommunityIcons } from 'react-native-vector-icons';
import { useNavigation } from '@react-navigation/native';
import { WebView } from 'react-native-webview';
import Modal from 'react-native-modal';

import { useUserState } from '../../slices/userSlice';
import { calculateTimeDifference } from '../../utils/timeDifference';
import { screenHeight } from '../../utils/ScreenDimensions';
import Color from '../../../assets/colors/Color';
import MessageType from './MessageType';

const Height = Dimensions.get('screen').height;
const Width = Dimensions.get('screen').width;

const DocumentMessageCn = (props) => {
  const { socket, item } = props;
  const timePassed = calculateTimeDifference(item.date);
  const userState = useUserState();
  const [document, setDocument] = React.useState(item?.content);
  const navigation = useNavigation();
  const [modalVisible, setModalVisible] = React.useState(false);

  const shortTitle =
    document?.name?.length > 10
      ? document?.name.slice(0, 28) + '...'
      : document?.name;

  return (
    <View>
      {/* Document Preview Modal */}
      <Modal
        isVisible={modalVisible}
        onBackdropPress={() => setModalVisible(false)}
        style={{ margin: 0 }}
      >
        <View style={{ flex: 1, backgroundColor: '#fff' }}>
          <WebView
            source={{ uri: document?.path }}
            startInLoadingState
            style={{ flex: 1 }}
          />
        </View>
      </Modal>

      {/* Document Message View */}
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
              onPress={() => setModalVisible(true)}
              onLongPress={() => props?.longPress(item._id, item?.from)}
            >
              <View>
                <View>
                  <View style={{ overflow: 'hidden', flexDirection: 'row' }}>
                    <MessageType title={item.content?.name} />
                    <Text
                      style={{
                        fontFamily: 'Roboto_500Medium',
                        fontSize: screenHeight * 0.015,
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
                        ? (document.size / 1000000).toFixed(2) + ' MB'
                        : (document.size / 1000).toFixed(2) + ' kB'
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
  shareMessage: {
    position: 'absolute',
    right: Width * 0.76,
    backgroundColor: '#CFCFCF',
    marginLeft: 9,
    borderRadius: 50,
    padding: 3,
  },
  receiverShareMessage: {
    position: 'absolute',
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
