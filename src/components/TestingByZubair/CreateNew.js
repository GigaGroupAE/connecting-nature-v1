import * as React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { Modal, Portal, Button, Provider } from "react-native-paper";
import { FontAwesome5, Entypo, Ionicons } from "react-native-vector-icons";
import Color from "../../../assets/colors/Color";
import { useNavigation } from "@react-navigation/native";

const TestingCreateNew = (props) => {
  const navigation = useNavigation();

  return (
    <Provider>
      <Portal>
        <Modal
          visible={props.visible}
          onDismiss={props.hideModal}
          contentContainerStyle={props.containerStyle}
        >
          {/* <Text>Example Modal. Click outside this area to dismiss.</Text> */}
          <View>{/* <Text>New Chat</Text> */}</View>

          <Pressable
            android_ripple={{ color: Color.LightGrey }}
            style={[styles.buttonWrapper]}
            onPress={() => navigation.navigate("InviteUsers")}
          >
            <FontAwesome5 name="user-plus" size={22} color={Color.Black} />
            <View>
              <Text style={styles.title}>Invite User</Text>
              <Text style={styles.subTitle}>
                Invite users from your contact and create communities to help
                nature
              </Text>
            </View>
            <Entypo
              name="chevron-right"
              size={20}
              color={Color.Black}
              style={{ position: "absolute", right: 15 }}
            />
          </Pressable>
          <Pressable
            android_ripple={{ color: Color.LightGrey }}
            style={[styles.buttonWrapper]}
            onPress={() => navigation.navigate("CreateGroup")}
          >
            <Ionicons name="add-circle" size={25} color={Color.Black} />
            <View>
              <Text style={styles.title}>Create Group</Text>
              <Text style={styles.subTitle}>
                Create groups to manage several tasks in their own circle
              </Text>
            </View>
            <Entypo
              name="chevron-right"
              size={20}
              color={Color.Black}
              style={{ position: "absolute", right: 15 }}
            />
          </Pressable>
        </Modal>
      </Portal>
    </Provider>
  );
};

const styles = StyleSheet.create({
  subTitle: {
    color: Color.Grey,
    marginLeft: 11,
    fontFamily: "Roboto_500Medium",
    fontSize: 11,
    width: "60%",
  },
  title: {
    color: Color.Black,
    marginLeft: 11,
    fontFamily: "Roboto_600SemiBold",
    fontSize: 14,
    width: "60%",
  },
  buttonWrapper: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 5,
    paddingHorizontal: 15,
    paddingVertical: 5,
  },
});

export default TestingCreateNew;
