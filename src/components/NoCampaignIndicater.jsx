import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native"
import React, { useEffect, useState } from "react"
import campaignIcon from "../../assets/campaignICon.png"
import { useNavigation } from "@react-navigation/native"
import Color from "../../assets/colors/Color"
import { scale } from "react-native-size-matters"
import { axiosInstance } from "../../axiosInstance"

const Height = Dimensions.get("screen").height
const Width = Dimensions.get("screen").width

const NoCampaignIndicater = () => {
  const navigation = useNavigation()
  const [archived, setarchived] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosInstance.get(
          "/archives/getArchiveCampaigns"
        )
        setarchived(response?.data?.newcampaigns)
      } catch (error) {
        console.log("Error:", error)
      }
    }

    fetchData()
  }, [])
  return (
    <View>
      <View
        style={{
          alignItems: "center",
        }}
      >
        <Image source={campaignIcon} style={styles.bellIcon} />
        <Text style={styles.heading}>Currently No Post Shared</Text>
        <Text style={styles.subHeading}>
          Currently, there are no activity in this section. Once admin start
          campaign in your radius, You will get notify. Stay tune...
        </Text>

        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.buttonTitle}>Back to Home</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.archivebutton}
          onPress={() => navigation.navigate("ArchivedScreen", { archived })}
        >
          <Text style={styles.archiveText}>Archived Campaigns</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

export default NoCampaignIndicater

const styles = StyleSheet.create({
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
    fontSize: scale(20),
    marginTop: 10,
  },
  archiveText: {
    fontSize: scale(18),
    fontFamily: "Roboto_400Regular",
    color: Color.Blue,
  },
})
