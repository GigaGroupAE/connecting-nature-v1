import {
  Dimensions,
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React from "react";
import { Entypo } from "react-native-vector-icons";
import Color from "../../../assets/colors/Color";
import symbolicateStackTrace from "react-native/Libraries/Core/Devtools/symbolicateStackTrace";

const Height = Dimensions.get("screen").height;
const Width = Dimensions.get("screen").width;

const AcceptPolicy = ({ setmodalPolicy }) => {
  return (
    <View style={{}}>
      <View style={styles.headerContainer}>
        <View style={styles.headerTextContainer}>
          <Text style={styles.headerTitle}>CN - Privacy Policy</Text>
          <Text style={styles.headerSubtitle}>
            Last updated: 01st August, 2023
          </Text>
        </View>
        <TouchableOpacity onPress={() => setmodalPolicy(false)}>
          <Entypo name="cross" style={styles.closeICon} />
        </TouchableOpacity>
      </View>

      <ScrollView style={{ paddingHorizontal: Width * 0.05 }}>
        <Text style={styles.subHeading}>
          <Text style={styles.title}> Connecting Nature </Text>("we", "us",
          "our") operates the Connecting Nature mobile application (the "App").
          This page informs you of our policies regarding the collection, use,
          and disclosure of personal information we receive from users of the
          App
        </Text>
        <Text style={styles.title}>1.Information Collection and Use </Text>
        <Text style={styles.title}>1.1 Personal Data </Text>
        <Text style={styles.subHeading}>
          When using our App, we may ask you to provide us with certain
          personally identifiable information that can be used to contact or
          identify you <Text style={styles.title}> ("Personal Data")</Text> .
          This information may include, but is not limited to
        </Text>
        <FlatList
          data={[
            { key: "Email address" },
            { key: "First name" },
            { key: "last name" },
            { key: "Phone number" },
            { key: "Location" },
            { key: "Cokkies and Usage Data" },
          ]}
          renderItem={({ item }) => (
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <View style={styles.bulletContainer}>
                <Text style={styles.bullet}>•</Text>
              </View>
              <Text
                style={{
                  ...styles.subHeading,
                  paddingVertical: Height * 0.001,
                  paddingHorizontal: Width * 0.016,
                }}
              >
                {item.key}
              </Text>
            </View>
          )}
        />
        <Text style={styles.title}>1.2 Usage Data </Text>
        <Text style={styles.subHeading}>
          When you access the App via a mobile device, we may collect certain
          information automatically, including, but not limited to, the type of
          mobile device you use, your mobile device's unique device ID, the IP
          address of your mobile device, your mobile operating system, the type
          of mobile Internet browser you use, and other statistics
          <Text style={styles.title}>("Usage Data")</Text>.
        </Text>
        <Text style={styles.title}> 1.3 Tracking & Cookies Data </Text>
        <Text style={styles.subHeading}>
          We use cookies and similar tracking technologies to track the activity
          on our App and hold certain information. Cookies are files with a
          small amount of data which may include an anonymous unique identifier.
          You can instruct your browser to refuse all cookies or to indicate
          when a cookie is being sent. However, if you do not accept cookies,
          you may not be able to use some portions of our App
        </Text>
        <Text style={styles.title}>2. Use of Data </Text>
        <Text style={styles.subHeading}>
          Connecting Nature uses the collected data for various purposes
        </Text>
        <FlatList
          data={[
            { key: "To provide and maintain the App" },
            { key: "To notify you about changes" },
            { key: "To our App To allow you" },
            {
              key: "To participate in interactive features of our App when you choose to do so",
            },
            { key: "To provide customer support" },
            {
              key: "To gather analysis or valuable information so that we can improve the App",
            },
            {
              key: "To monitor the usage of the App",
            },
            {
              key: "To detect, prevent, and address technical issues ",
            },
          ]}
          renderItem={({ item }) => (
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <View style={styles.bulletContainer}>
                <Text style={styles.bullet}>•</Text>
              </View>
              <Text
                style={{
                  ...styles.subHeading,
                  paddingVertical: Height * 0.001,
                  paddingHorizontal: Width * 0.016,
                }}
              >
                {item.key}
              </Text>
            </View>
          )}
        />
        <Text style={styles.title}>3.Information Sharing and Disclosure </Text>
        <Text style={styles.subHeading}>
          We may employ third-party companies and individuals to facilitate our
          App, to provide the App on our behalf, to perform App-related
          services, or to assist us in analyzing how our App is used. These
          third parties have access to your Personal Data only to perform these
          tasks on our behalf and are obligated not to disclose or use it for
          any other purpose.
        </Text>
        <Text style={styles.title}>
          We may also disclose your personal information
        </Text>

        <FlatList
          data={[
            { key: "To comply with a legal obligation" },
            {
              key: "To protect and defend the rights or property of Connecting Nature",
            },
            {
              key: "To prevent or investigate possible wrongdoing in connection with the App ",
            },
            {
              key: "To protect the personal safety of users of the App or the public",
            },
            { key: "To protect against legal liability" },
          ]}
          renderItem={({ item }) => (
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <View style={styles.bulletContainer}>
                <Text style={styles.bullet}>•</Text>
              </View>
              <Text
                style={{
                  ...styles.subHeading,
                  paddingVertical: Height * 0.001,
                  paddingHorizontal: Width * 0.016,
                }}
              >
                {item.key}
              </Text>
            </View>
          )}
        />

        <Text style={styles.title}>4. Security </Text>
        <Text style={styles.subHeading}>
          The security of your Personal Data is important to us but remember
          that no method of transmission over the Internet or method of
          electronic storage is 100% secure. While we strive to use commercially
          acceptable means to protect your Personal Data, we cannot guarantee
          its absolute security
        </Text>

        <Text style={styles.title}>International Transfer </Text>
        <Text style={styles.subHeading}>
          Transfer Your information, including Personal Data, may be transferred
          to — and maintained on — computers located outside of your state,
          province, country or other governmental jurisdiction where the data
          protection laws may differ from those of your jurisdiction.{" "}
        </Text>
        <Text style={styles.subHeading}>
          If you are located outside the United States and choose to provide
          information to us, please note that we transfer the data, including
          Personal Data, to the United States and process it there. Your consent
          to this Privacy Policy followed by your submission of such information
          represents your agreement to that transfer
        </Text>

        <Text style={styles.title}>6. Links to Other Sites </Text>
        <Text style={styles.subHeading}>
          Our App may contain links to other sites that are not operated by us.
          If you click on a third-party link, you will be directed to that third
          party's site. We strongly advise you to review the Privacy Policy of
          every site you visit.
        </Text>

        <Text style={styles.title}>7. Children's Privacy </Text>

        <Text>
          Our App does not address anyone under the age of 13 ("Children"). We
          do not knowingly collect personally identifiable information from
          anyone under the age of 13. If you are a parent or guardian and you
          are aware that your child has provided us with Personal Data, please
          contact us. If we become aware that we have collected Personal Data
          from children without verification of parental consent, we take steps
          to remove that information from our servers
        </Text>

        <Text style={styles.title}>8. Changes to This Privacy Policy </Text>
        <Text style={styles.subHeading}>
          We may update our Privacy Policy from time to time. We will notify you
          of any changes by posting the new Privacy Policy on this page. You are
          advised to review this Privacy Policy periodically for any changes.
          Contact Us
        </Text>

        <Text style={styles.title}> 9.Contact Us</Text>
        <View style={{ marginBottom: Height * 0.1 }}>
          <Text style={styles.subHeading}>
            If you have any questions about this Privacy Policy, please contact
            us by email at{" "}
            <Text style={styles.email}>support@connectingnature.com </Text> By
            using Connecting Nature, you consent to our Privacy Policy.
          </Text>

          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonTitle}>Chat Admin</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

export default AcceptPolicy;

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: Width * 0.05,
    paddingVertical: Height * 0.01,
  },

  headerTitle: {
    fontFamily: "Roboto_700Bold",
    fontSize: Height * 0.025,
  },
  headerSubtitle: {
    fontFamily: "Roboto_400Regular",
    color: "#999999",
    fontSize: Height * 0.015,
  },
  closeICon: {
    fontSize: Height * 0.035,
  },
  subHeading: {
    fontFamily: "Roboto_400Regular",
    fontSize: Height * 0.016,
    paddingVertical: Height * 0.015,
  },
  title: {
    fontFamily: "Roboto_700Bold",
    fontSize: Height * 0.019,
  },
  email: {
    fontFamily: "Roboto_400Regular",
    color: Color.Blue,
  },
  button: {
    width: Width * 0.4,
    marginVertical: Height * 0.02,
  },
  buttonTitle: {
    backgroundColor: Color.Blue,
    // alignSelf: "center",
    color: Color.White,
    borderRadius: Height * 0.01,
    paddingHorizontal: Width * 0.09,
    paddingVertical: Height * 0.015,
    fontSize: Height * 0.02,
    fontFamily: "Roboto_700Bold",
  },
  bulletContainer: {
    marginRight: 5,
  },
  bullet: {
    fontSize: 15,
  },
});
