import {
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React from 'react';
import { Entypo } from 'react-native-vector-icons';
import Color from '../../../assets/colors/Color';

const Height = Dimensions.get('screen').height;
const Width = Dimensions.get('screen').width;

const TermsCondition = ({ setmodalTerms }) => {
  return (
    <View style={{}}>
      <View style={styles.headerContainer}>
        <View style={styles.headerTextContainer}>
          <Text style={styles.headerTitle}>Terms and Conditions</Text>
          <Text style={styles.headerSubtitle}>
            Last updated: 01st August, 2023
          </Text>
        </View>
        <TouchableOpacity onPress={() => setmodalTerms(false)}>
          <Entypo name="cross" style={styles.closeICon} />
        </TouchableOpacity>
      </View>

      <ScrollView style={{ paddingHorizontal: Width * 0.05 }}>
        <Text style={styles.subHeading}>
          Welcome to our Social Media App about Nature and Plantation
          (hereinafter referred to as "the App"). The App provides you with
          access to a variety of resources including a chat system, sharing of
          content, and a platform to connect with like-minded individuals
          collectively referred to as "Services".
        </Text>

        <Text style={styles.subHeading}>
          Please read these Terms and Conditions ("Terms") carefully before
          using the App operated by{' '}
          <Text style={{ fontWeight: '900', color: '#000' }}>
            Connecting Nature Management
          </Text>
          ("us", "we", or "our").
        </Text>

        <Text style={styles.subHeading}>
          Your access to and use of the Services is conditioned on your
          acceptance of and compliance with these Terms. These Terms apply to
          all visitors, users, and others who access or use the Services.
        </Text>

        <Text style={styles.subHeading}>
          By accessing or using the Services you agree to be bound by these
          Terms. If you disagree with any part of the terms then you may not
          access the Services.
        </Text>

        <Text style={styles.title}>1. Accounts</Text>

        <Text style={styles.subHeading}>
          When you create an account with us, you must provide us with
          information that is accurate, complete, and current at all times.
          Failure to do so constitutes a breach of the Terms, which may result
          in immediate termination of your account on our Services.
        </Text>

        <Text style={styles.subHeading}>
          You are responsible for safeguarding the password that you use to
          access the Services and for any activities or actions under your
          password, whether your password is with our Services or a third-party
          service.
        </Text>

        <Text style={styles.subHeading}>
          You agree not to disclose your password to any third party. You must
          notify us immediately upon becoming aware of any breach of security or
          unauthorized use of your account
        </Text>

        <Text style={styles.title}>2. Content</Text>
        <Text style={styles.subHeading}>
          You retain any and all of your rights to any Content you submit, post,
          or display on or through the Services and you are responsible for
          protecting those rights.
        </Text>

        <Text style={styles.subHeading}>
          By posting Content to our Services, you grant us the right and license
          to use, modify, publicly perform, publicly display, reproduce, and
          distribute such content on and through the Services.
        </Text>

        <Text style={styles.subHeading}>
          The App respects copyright law and expects its users to do the same.
          It is our policy to terminate in appropriate circumstances Account
          holders who repeatedly infringe or are believed to be repeatedly
          infringing the rights of copyright holders.
        </Text>

        <Text style={styles.title}>3. Acceptable Use</Text>
        <Text style={styles.subHeading}>
          The App is dedicated to fostering a respectful and engaging community
          focused on nature and plantation.
        </Text>

        <Text style={styles.subHeading}>
          You agree not to post, upload, publish, submit or transmit any Content
          that: (i) is offensive, defamatory, obscene, violent, sexually
          explicit, or otherwise objectionable; (ii) you do not have a right to
          transmit under any law or under contractual or fiduciary
          relationships; (iii) infringes any patent, trademark, trade secret,
          copyright, or other proprietary rights of any party; (iv) contains
          software viruses or any other computer code, files or programs
          designed to interrupt, destroy or limit the functionality of any
          computer software or hardware or telecommunications equipment.
        </Text>

        <Text style={styles.title}>4. Modification and Termination</Text>
        <Text style={styles.subHeading}>
          We reserve the right, at our sole discretion, to modify or replace
          these Terms at any time. If a revision is material, we will try to
          provide at least 30 days notice prior to any new terms taking effect.
        </Text>
        <Text>
          We also reserve the right to suspend or end the Services at any time,
          with or without cause, and with or without notice.
        </Text>

        <Text style={styles.title}>5. Disclaimer</Text>
        <Text style={styles.subHeading}>
          Your use of the Services is at your sole risk. The Services are
          provided on an "AS IS" and "AS AVAILABLE" basis. The Services are
          provided without warranties of any kind, whether express or implied,
          including, but not limited to, implied warranties of merchantability,
          fitness for a particular purpose, non-infringement, or course of
          performance.
        </Text>

        <Text style={styles.title}>6. Governing Law</Text>
        <Text style={styles.subHeading}>
          These Terms shall be governed and construed in accordance with the
          laws of Pakistan, without regard to its conflict of law provisions.
        </Text>
        <Text style={styles.subHeading}>
          Our failure to enforce any right or provision of these Terms will not
          be considered a waiver of those rights. If any provision of these
          Terms is held to be invalid or unenforceable by a court, the remaining
          provisions of these Terms will remain in effect.
        </Text>
        <Text style={styles.subHeading}>
          By continuing to access or use our Services after those revisions
          become effective, you agree to be bound by the revised terms. If you
          do not agree to the new terms, please stop using the Services.
        </Text>
        <Text style={styles.title}>Contact Us</Text>
        <View style={{ marginBottom: Height * 0.1 }}>
          <Text style={styles.subHeading}>
            If you have any questions about these Terms, please contact us;
          </Text>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={styles.title}>Email:</Text>
            <Text style={styles.email}>support@connectingnature.com</Text>
          </View>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonTitle}>Chat Admin</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

export default TermsCondition;

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Width * 0.05,
    paddingVertical: Height * 0.01,
  },

  headerTitle: {
    fontFamily: 'Roboto_700Bold',
    fontSize: Height * 0.025,
  },
  headerSubtitle: {
    fontFamily: 'Roboto_400Regular',
    color: '#999999',
    fontSize: Height * 0.015,
  },
  closeICon: {
    fontSize: Height * 0.035,
  },
  subHeading: {
    fontFamily: 'Roboto_400Regular',
    fontSize: Height * 0.015,
    paddingVertical: Height * 0.016,
  },
  title: {
    fontFamily: 'Roboto_700Bold',
    fontSize: Height * 0.019,
  },
  email: {
    fontFamily: 'Roboto_400Regular',
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
    fontFamily: 'Roboto_700Bold',
  },
});
