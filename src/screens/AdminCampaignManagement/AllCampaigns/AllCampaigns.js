//react imports
import { useEffect, useState } from "react";

//react-native imports
import {
  Dimensions,
  FlatList,
  Pressable,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
} from "react-native";

//components import
import HeaderNormal from "../../../components/HeaderNormal";
import { Badge } from "react-native-paper";

//themes Import
import Color from "../../../../assets/colors/Color";
import { theme } from "../../../../theme";

//network imports
import axios from "axios";
import { BASE_URL } from "../../../../CONSTANTS";
import { useUserState } from "../../../slices/userSlice";
import { useNavigation } from "@react-navigation/native";
import {
  Feather,
  MaterialCommunityIcons,
  AntDesign,
  Entypo,
  Ionicons,
} from "react-native-vector-icons";
import { returnCountDown } from "../../../utils/countdown";

// THIS SCREEN DISPLAYS THE LIST OF ALL THE CAMPAIGNS

const HEIGHT = Dimensions.get("screen").height - StatusBar.currentHeight;
const WIDTH = Dimensions.get("screen").width;

const AllCampaigns = (props) => {
  const [campaigns, setCampaigns] = useState([]);
  const userState = useUserState();
  const navigation = useNavigation();
  const [isSearch, setIsSearch] = useState(false);
  const onChangeSearch = (query) => setSearchQuery(query);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("");
  const [countDown, setCountDown] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    let compareDate = new Date(props.date);
    const interval = setInterval(() => {
      const newCountDown = returnCountDown(compareDate);
      if (newCountDown === "-1") {
        clearInterval(interval);
      } else {
        setCountDown(newCountDown);
      }
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [props.date]);

  const handleSearchBar = () => {
    setIsSearch(true);
  };

  const handleCross = () => {
    setSearchQuery("");
    setIsSearch(false);
  };

  useEffect(() => {
    const fetchData = async () => {
      const headers = {
        headers: {
          "auth-token": userState.token,
        },
      };
      try {
        const { data } = await axios.get(`${BASE_URL}/today/getoday`, headers);
        setCampaigns(data);
      } catch (error) {
        console.log("error is ", error);
      }
    };
    fetchData();
  }, []);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar translucent backgroundColor={Color.Blue}></StatusBar>
      <View style={styles.container}>
        {/* //HEADER */}
        <View
          style={{ marginTop: StatusBar.currentHeight, height: HEIGHT * 0.07 }}
        >
          {/* <HeaderNormal
            title={"Campaign Settings"}
            onback={() => navigation.goBack()}
          /> */}
          <View style={isSearch ? styles.searchHeader : styles.header}>
            <View style={styles.mainHeader}>
              <TouchableOpacity onPress={() => navigation.goBack()}>
                <AntDesign
                  name="arrowleft"
                  size={28}
                  color={Color.Grey}
                  style={{ alignSelf: "center", alignItems: "center" }}
                />
              </TouchableOpacity>
              {!isSearch && <Text style={styles.title}>Campaign Settings</Text>}
              {isSearch && (
                <TextInput
                  style={styles.input}
                  placeholder="Search"
                  onChangeText={onChangeSearch}
                  value={searchQuery}
                  autoFocus
                />
              )}
              {!isSearch ? (
                <Pressable onPress={handleSearchBar}>
                  <Ionicons name="search" size={22} color={Color.Grey} />
                </Pressable>
              ) : (
                <Pressable onPress={handleCross}>
                  <Entypo name="cross" size={22} color={Color.Grey} />
                </Pressable>
              )}
            </View>
          </View>
        </View>

        {/* LIST */}

        {searchQuery === "" ? (
          <View style={styles.campaignList}>
            <FlatList
              snapToStart={true}
              inverted={true}
              data={campaigns}
              keyExtractor={(item) => item._id}
              ListEmptyComponent={() => (
                <View>
                  <Text>Loading</Text>
                </View>
              )}
              renderItem={({ item }) => {
                return (
                  <Pressable
                    android_ripple={{ color: Color.LightGrey }}
                    style={styles.individualCard}
                    onPress={() => {
                      navigation.navigate("ManageVolunteers", {
                        campaign: item,
                      });
                    }}
                  >
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                      }}
                    >
                      <MaterialCommunityIcons
                        name="google-podcast"
                        size={25}
                        color={Color.LightGrey}
                      />

                      <Text numberOfLines={1} style={styles.campaignName}>
                        {item.campaignName}
                      </Text>
                      <Text style={styles.volunteers}>
                        {
                          item.volunteers.filter((v) => v.status === "accepted")
                            .length
                        }{" "}
                        Volunteers
                      </Text>
                      {countDown.days !== 0 ||
                      countDown.hours !== 0 ||
                      countDown.minutes !== 0 ||
                      countDown.seconds !== 0 ? (
                        <Text style={styles.campaignTime}>
                          {campaigns.date
                            ? `${countDown.days}d:${countDown.hours}h:${countDown.minutes}m:${countDown.seconds}s`
                            : "Event has Started"}
                        </Text>
                      ) : (
                        <Text style={styles.campaignTimeExpired}>Finished</Text>
                      )}
                    </View>
                    <View style={{ marginLeft: 35 }}>
                      <Text style={styles.leader}>Sajid Khan - Team A</Text>
                      <Text style={styles.leader}>Mubashir S. - Team B</Text>
                    </View>
                  </Pressable>
                );
              }}
            />
          </View>
        ) : null}
      </View>
      {searchQuery === ""
        ? null
        : activeFilter === "" &&
          campaigns.map((item, index) => {
            if (item.campaignName.match(searchQuery)) {
              return (
                <View>
                  <Text>{item.campaigns}</Text>
                </View>
              );
            } else {
              return null;
            }
          })}
    </SafeAreaView>
  );
};

export default AllCampaigns;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Color.White,
  },
  campaignList: {
    // height: HEIGHT * 1,
    marginBottom: HEIGHT * 0.01,
  },
  individualCard: {
    backgroundColor: Color.White,
    width: "100%",
    marginTop: "3%",
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  campaignName: {
    fontFamily: "Roboto_600SemiBold",
    fontSize: 14,
    color: Color.Black,
    marginLeft: 12,
    width: "50%",
  },
  volunteers: {
    fontFamily: "Roboto_400Regular",
    fontSize: 12,
    color: Color.LightGrey,
    position: "absolute",
    right: 5,
    top: "175%",
  },
  campaignTime: {
    backgroundColor: Color.Blue,
    paddingHorizontal: 10,
    paddingVertical: 1,
    borderRadius: Dimensions.get("screen").height * 0.1,
    fontFamily: "Roboto_400Regular",
    fontSize: 12,
    color: Color.White,
    position: "absolute",
    right: 5,
  },
  campaignTimeExpired: {
    backgroundColor: Color.LightRed,
    paddingHorizontal: 10,
    paddingVertical: 1,
    borderRadius: Dimensions.get("screen").height * 0.1,
    fontFamily: "Roboto_400Regular",
    fontSize: 12,
    color: Color.Red,
    position: "absolute",
    right: 5,
  },
  leader: {
    fontFamily: "Roboto_400Regular",
    fontSize: 12,
    color: Color.Grey,
  },
  badge: {
    position: "absolute",
    top: 5,
    right: 5,
    elevation: 5,
    color: "white",
  },
  mainHeader: {
    alignContent: "center",
    alignItems: "center",
    flexDirection: "row",
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderBottomWidth: 1.5,
    borderColor: Color.VeryLightGrey,
    justifyContent: "space-between",
  },
  title: {
    color: Color.Grey,
    fontSize: 20,
    fontFamily: "Roboto_600SemiBold",
    marginLeft: 10,
    width: "81%",
  },
  input: {
    width: "80%",
    backgroundColor: Color.LightBg,
    paddingVertical: 2,
    paddingHorizontal: 20,
    borderRadius: Dimensions.get("screen").height * 0.1,
  },
});
