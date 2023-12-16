import React, { useCallback } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import HeaderBack from "../../components/HeaderBack";
import CampaignCard from "./CampaignCard";
import BottomTab from "../../components/BottomTab";
import { useState, useEffect } from "react";
import axios from "axios";
import { useUserState } from "../../slices/userSlice";
import { useNavigation } from "@react-navigation/native";
import { BASE_URL } from "../../../CONSTANTS";
import Color from "../../../assets/colors/Color";
import { axiosInstance } from "../../../axiosInstance";
import { useStateContext } from "../../contexts/ContextProvider";
import { ActivityIndicator } from "react-native";
import campaignIcon from "../../../assets/campaignICon.png";
import moment from "moment";
import { scale } from "react-native-size-matters";
const Height = Dimensions.get("screen").height;
const Width = Dimensions.get("screen").width;

export default function CampaignsScreen() {
  const [campaigns, setcampaigns] = useState([]);
  const [loading, setLoading] = useState(false);
  const [archived, setarchived] = useState([]);
  const navigation = useNavigation();
  const userState = useUserState();
  const { setGlobalSocket, reactions, setreactions, comment, setcomment } =
    useStateContext();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await axiosInstance.get(
          "/campaigns/get-multiple-by-query?status=executed"
        );

        setcampaigns(response.data.campaigns);
        setLoading(false);
      } catch (error) {
        console.log("Error:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await axiosInstance.get(
          "/archives/getArchiveCampaigns"
        );
        setarchived(response?.data?.newcampaigns);

        setLoading(false);
      } catch (error) {
        console.log("Error:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handlebackpress = () => {
    navigation.goBack();
  };

  const sortedArray = campaigns.sort((a, b) => b._id - a._id);

  const scrollToTop = useCallback(() => {}, []);

  const handleNavigation = (campaign) => {
    setreactions(campaign?.reactions);
    setcomment(campaign?.messages);
    navigation.navigate("CampaignWithPosts", { campaign });
  };

  return (
    <SafeAreaView style={{ backgroundColor: Color.LightBlue, height: "100%" }}>
      {/* onPress Command can be use in next "Header Back line (18)". It's a props */}
      <HeaderBack
        title={"Campaigns"}
        onback={handlebackpress}
        archived={archived}
        loading={loading}
      />
      <View style={styles.main}>
        <Text style={styles.screenTitle}>Live & Upcoming Events</Text>
        <Text style={styles.description}>Are you ready for it?</Text>

        {loading === true ? (
          <ActivityIndicator
            style={{ position: "absolute", bottom: "20%", left: "48%" }}
            size={"large"}
            color={Color.Blue}
          />
        ) : (
          <ScrollView style={styles.scrollView}>
            <View>
              {campaigns.length === 0 ? (
                <View
                  style={{
                    height: "100%",
                    alignItems: "center",
                    justifyContent: "center",
                    paddingVertical: Height * 0.2,
                  }}
                >
                  <View
                    style={{
                      alignItems: "center",
                    }}
                  >
                    <Image source={campaignIcon} style={styles.bellIcon} />
                    <Text style={styles.heading}>Currently No Post Shared</Text>
                    <Text style={styles.subHeading}>
                      Currently, there are no activity in this section. Once
                      admin start campaign in your radius, You will get notify.
                      Stay tune...
                    </Text>

                    <TouchableOpacity
                      style={styles.button}
                      onPress={() => navigation.goBack()}
                    >
                      <Text style={styles.buttonTitle}>Back to Home</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.archivebutton}
                      onPress={() =>
                        navigation.navigate("ArchivedScreen", { archived })
                      }
                    >
                      <Text style={styles.archiveText}>Archived Campaigns</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ) : (
                <View>
                  {campaigns.map((campaign) => {
                    return (
                      <TouchableOpacity
                        onPress={() => handleNavigation(campaign)}
                        key={campaign._id}
                      >
                        <CampaignCard
                          title={campaign?.campaignName}
                          leaderA={campaign?.teamA?.leader?.fullName}
                          leaderB={campaign?.teamB?.leader?.fullName}
                          location={campaign?.venue || "Coming Soon..."}
                          date={campaign?.date}
                          mainBg={styles.cardBg}
                          countA={campaign?.teamA?.members?.length}
                          countB={campaign?.teamB?.members?.length}
                          locked={campaign?.locked}
                          color={campaign?.color}
                          teamAuser={campaign?.teamA?.members}
                          teamBuser={campaign?.teamB?.members}
                        />
                      </TouchableOpacity>
                    );
                  })}
                </View>
              )}
            </View>
          </ScrollView>
        )}
      </View>

      <BottomTab activeMenu={"Campaign"} scrollToTop={scrollToTop} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  main: {
    backgroundColor: Color.White,
    flex: 1,
    paddingTop: Height * 0.014,
    paddingHorizontal: Width * 0.045,
  },
  cardBg: {
    paddingVertical: 15,
    backgroundColor: "red",
    marginTop: Height * 0.022,
    borderRadius: Height * 0.01,
    paddingHorizontal: Width * 0.045,
  },
  scrollView: {
    marginBottom: "24%",
  },
  screenTitle: {
    fontFamily: "Roboto_600SemiBold",
    fontSize: Height * 0.032,
    color: Color.Black,
    fontWeight: "600",
  },
  description: {
    fontFamily: "Roboto_500Medium",
    fontSize: Height * 0.019,
    color: Color.Black,
  },
  heading: {
    fontFamily: "Roboto_700Bold",
    color: Color.Black,
    fontSize: Height * 0.019,
    paddingVertical: Height * 0.01,
  },
  subHeading: {
    fontFamily: "Roboto_500Medium",
    color: Color.Grey,
    fontSize: Height * 0.016,
    width: scale(270),
    lineHeight: scale(17),
    textAlign: "center",
  },
  bellIcon: {
    width: Width * 0.3,
    height: Height * 0.13,
    resizeMode: "contain",
  },
  button: {
    backgroundColor: Color.Blue,
    marginTop: Height * 0.05,
    paddingHorizontal: Width * 0.06,
    paddingVertical: Height * 0.013,
    borderRadius: Height * 0.01,
  },
  buttonTitle: {
    fontFamily: "Roboto_600SemiBold",
    color: Color.White,
    fontSize: Height * 0.02,
  },
  archivebutton: {
    marginTop: scale(25),
    fontSize: scale(20),
  },
  archiveText: {
    fontSize: scale(18),
    fontFamily: "Roboto_400Regular",
    color: Color.Blue,
  },
});
