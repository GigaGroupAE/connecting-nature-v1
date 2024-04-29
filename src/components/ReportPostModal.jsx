import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  TextInput,
} from 'react-native';
import React, { useState } from 'react';
import { Modal, Portal } from 'react-native-paper';
import {
  buttonContainer,
  buttonTitle,
  container,
  inputstyle,
  modalTitle,
} from '../screens/Decorations/ModalStyle'; // Assuming you have these styles
import { screenHeight, screenWidth } from '../utils/ScreenDimensions';
import { useUserState } from '../slices/userSlice';
import { axiosInstance } from '../../axiosInstance';

const reportOptions = [
  {
    key: '1',
    label: 'Inappropriate Content',
  },
  { key: '2', label: 'Spam or Scam' },
  { key: '3', label: 'Violence or Harmful Behavior' },
  { key: '4', label: 'False Information' },
  { key: '5', label: 'Hate Speech' },
  { key: '6', label: 'Nudity' },
  { value: '9', label: 'Involves a child' },
  { value: '7', label: 'Other' },
];

const ReportPostModal = ({
  modalVisible,
  setModalVisible,
  id,
  showSnackbar,
  setmainModal,
}) => {
  const userState = useUserState();
  const [isOthers, setisOthers] = useState(false);
  const [otherReason, setotherReason] = useState('');

  const handleReport = (reason) => {
    if (reason === 'Other') {
      setisOthers(true);
    } else {
      setisOthers(false);

      handleReportPost(reason);
    }
  };

  const handleReportPost = async (reason) => {
    const reportData = {
      postId: id,
      reportedBy: userState?.id,
      reasons: reason,
    };
    try {
      const data = await axiosInstance.post(`/posts/report-post`, {
        reportData,
      });
      showSnackbar(
        'Thank you for your submission! We appreciate your help in keeping our community safe. Our team will review the reported post',
      );
      setModalVisible(false);
      setotherReason('');
      setisOthers(false);
      setmainModal(false);
    } catch {}
  };

  const handleOthersSubmmit = () => {
    handleReportPost(otherReason);
  };

  const renderItem = ({ item }) => (
    <View
      style={{
        maxHeight: screenHeight * 0.4,
      }}
    >
      <TouchableOpacity onPress={() => handleReport(item.label)}>
        <Text style={styles.optionText}>{item.label}</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <Portal>
      <Modal visible={modalVisible} onDismiss={() => setModalVisible(false)}>
        <View style={container}>
          <Text style={modalTitle}>Please select a problem</Text>
          <View
            style={{
              maxHeight: screenHeight * 0.7,
              width: screenWidth * 0.8,
              paddingTop: screenHeight * 0.01,
            }}
          >
            <FlatList
              data={reportOptions}
              renderItem={renderItem}
              keyExtractor={(item) => item.key}
              contentContainerStyle={{ gap: 18 }}
            />

            {isOthers && (
              <View style={{}}>
                <TextInput
                  value={otherReason}
                  onChangeText={(e) => setotherReason(e)}
                  style={{ ...inputstyle, width: '100%' }}
                  placeholder="Other reason (please specify)"
                />
              </View>
            )}
            {otherReason !== '' && (
              <TouchableOpacity
                style={buttonContainer}
                onPress={handleOthersSubmmit}
              >
                <Text style={buttonTitle}>Submit</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </Modal>
    </Portal>
  );
};

export default ReportPostModal;

const styles = StyleSheet.create({
  optionText: {
    fontFamily: 'Roboto_400Regular',
    fontSize: screenHeight * 0.0166,
  },
});
