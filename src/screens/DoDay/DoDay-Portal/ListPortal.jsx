import {
  Dimensions,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Alert,
  ScrollView,
} from "react-native";
import React, { useEffect, useState } from "react";
import HeaderList from "../VolunteersTeams/HeaderList";
import WinerCard from "./WinerCard";
import Color from "../../../../assets/colors/Color";
import { RadioButton } from "react-native-paper";
import { axiosInstance } from "../../../../axiosInstance";

import { AntDesign } from "react-native-vector-icons";

const Height = Dimensions.get("screen").height;
const Width = Dimensions.get("screen").width;

import { useStateContext } from "../../../contexts/ContextProvider";

import {
  QueryClient,
  useMutation,
  useQuery,
  useQueryClient,
} from "react-query";

const fetchBuckets = async () => {
  const { data } = await axiosInstance.get("/buckets/get");
  return data.buckets;
};

const ListPortal = () => {
  const queryClient = useQueryClient();
  const {
    data: bucketsData,
    isLoading: bucketsLoading,
    error: bucketsError,
  } = useQuery({
    queryKey: ["Buckets"],
    queryFn: fetchBuckets,
    staleTime: 1000 * 10, //data will go stale after 10 secs
  });
  const [checked, setChecked] = useState("teamA");
  const [showCompaign, setshowCompaign] = useState(false);
  const [bucket, setBucket] = useState(false);
  const [bucketCount, setBucketCount] = useState(1);
  const [buckets, setBuckets] = useState("");
  const [bucketId, setBucketId] = useState(null);
  const [teamName, setTeamName] = useState("");
  const [bucketName, setbucketName] = useState("Select Bucket");
  const { setLoading, activeCampaign, globalSocket, group } = useStateContext();

  const handleUpdate = () => {
    setTeamName(checked);
    if (!bucketId) {
      console.log("select a bucket id first ");
      return;
    }

    globalSocket.emit("update_points", {
      group: group._id,
      teamName: checked,
      bucketId,
      bucketCount,
      campaignId: activeCampaign._id,
    });

    setbucketName("Select Bucket");
    setBucketCount(1);
    setBucketId(null);
  };

  const handleIncreament = () => {
    setBucketCount((prev) => prev + 1);
  };
  const handleDecreament = () => {
    setBucketCount((prev) => {
      if (prev === 1) return prev;
      return prev - 1;
    });
  };

  const handleBucketName = (item) => {
    setbucketName(item.bucketName);
    setBucketId(item._id);
    setBucket(false);
  };

  if (bucketsLoading)
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Loading....</Text>
      </View>
    );

  if (bucketsError) {
    console.log("error is ", bucketsError.response.data);
    Alert.alert("error", bucketsError.response.data.message);
    return;
  }
  return (
    <ScrollView>
      <View style={{ flex: 1 }}>
        <View>
          <WinerCard winerTeam={checked} />
        </View>
        <View style={styles.bodyContainer}>
          <View style={styles.upgradReq}>
            <Text style={styles.reqText}>{activeCampaign?.campaignName}</Text>
          </View>
        </View>

        <View
          style={{
            flexDirection: "row",
            width: Width * 0.9,
            alignSelf: "center",
            justifyContent: "space-around",
            marginVertical: Height * 0.014,
          }}
        >
          <View style={{ ...styles.bodyContainer, width: "45%" }}>
            <View style={styles.upgradReq}>
              <Text style={styles.reqText}>Team A</Text>
              <TouchableOpacity>
                <RadioButton
                  value="teamA"
                  status={checked === "teamA" ? "checked" : "unchecked"}
                  onPress={() => setChecked("teamA")}
                  color="#3970AA"
                />
              </TouchableOpacity>
            </View>
          </View>
          <View style={{ ...styles.bodyContainer, width: "45%" }}>
            <View style={styles.upgradReq}>
              <Text style={styles.reqText}>Team B</Text>
              <TouchableOpacity>
                <RadioButton
                  value="second"
                  status={checked === "teamB" ? "checked" : "unchecked"}
                  onPress={() => setChecked("teamB")}
                  color="#3970AA"
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>
        <View style={styles.bodyContainer}>
          <TouchableOpacity
            style={styles.upgradReq}
            onPress={() => setBucket(!bucket)}
          >
            <Text style={styles.reqText}>{bucketName}</Text>
            <View>
              <AntDesign name="down" style={{ fontSize: 20 }} />
            </View>
          </TouchableOpacity>
        </View>
        {bucket && (
          <View
            style={{
              width: "88%",
              alignSelf: "center",
              overflow: "hidden",
              // flexWrap: "wrap",
            }}
          >
            <View>
              {bucketsData.map((item) => (
                <View key={item._id}>
                  <TouchableOpacity
                    style={{
                      flexDirection: "row",
                      flexWrap: "wrap",
                    }}
                    onPress={() => handleBucketName(item)}
                  >
                    <Text
                      style={{
                        paddingVertical: Height * 0.01,
                        fontSize: Height * 0.02,
                        flexWrap: "wrap",
                      }}
                    >
                      {item.bucketName}
                    </Text>
                    <Text
                      style={{
                        paddingVertical: Height * 0.01,
                        fontSize: Height * 0.02,
                        paddingHorizontal: Width * 0.018,
                      }}
                    >
                      {item.numOfPlants} x Plant
                    </Text>
                    <Text style={{ paddingVertical: Height * 0.01 }}>-</Text>
                    <Text
                      style={{
                        paddingVertical: Height * 0.01,
                        fontSize: Height * 0.02,
                        paddingHorizontal: Width * 0.018,
                      }}
                    >
                      {item.plantName}
                    </Text>
                    <Text
                      style={{
                        paddingVertical: Height * 0.01,
                        fontSize: Height * 0.02,
                      }}
                    >
                      -
                    </Text>
                    <Text
                      style={{
                        paddingVertical: Height * 0.01,
                        fontSize: Height * 0.02,
                        fontWeight: "700",
                        paddingHorizontal: Width * 0.018,
                      }}
                    >
                      {item.points} Points
                    </Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          </View>
        )}
        <View
          style={{
            width: "88%",
            alignSelf: "center",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            marginTop: Height * 0.014,
          }}
        >
          <View>
            <Text style={{ fontWeight: "700", fontSize: Height * 0.02 }}>
              No of Bucket
            </Text>
            <Text>Points will be calculate</Text>
          </View>
          <View>
            <View
              style={{
                ...styles.bodyContainer,
                width: "55%",
                backgroundColor: Color.Disable,
              }}
            >
              <TouchableOpacity
                style={{ alignSelf: "center" }}
                onPress={handleDecreament}
              >
                <AntDesign
                  name="left"
                  style={{ fontSize: 20, alignSelf: "center" }}
                />
              </TouchableOpacity>
              <View
                style={{
                  backgroundColor: Color.White,
                  paddingVertical: Height * 0.018,
                  paddingHorizontal: Width * 0.062,
                }}
              >
                <Text style={{ fontWeight: "400", fontSize: Height * 0.02 }}>
                  {bucketCount}
                </Text>
              </View>
              <TouchableOpacity
                style={{ alignSelf: "center" }}
                onPress={handleIncreament}
              >
                <AntDesign
                  name="right"
                  style={{ fontSize: 20, alignSelf: "center" }}
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>
        <View
          style={{
            width: "100%",
            alignSelf: "center",
            alignItems: "center",
            marginVertical: Height * 0.013,
            flex: 1,
          }}
        >
          <TouchableOpacity
            style={{
              paddingVertical: Height * 0.014,
              paddingHorizontal: Width * 0.1,
              backgroundColor: Color.Blue,
              borderRadius: Height * 0.01,
            }}
            onPress={() => handleUpdate()}
          >
            <Text style={{ color: Color.White, fontSize: Height * 0.021 }}>
              Update
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

export default ListPortal;

const styles = StyleSheet.create({
  upgradReq: {
    flexDirection: "row",
    alignSelf: "center",
    width: "100%",
    paddingHorizontal: Width * 0.025,
    justifyContent: "space-between",
    alignItems: "center",
  },
  reqText: {
    paddingVertical: Height * 0.02,
    marginLeft: Width * 0.025,
    fontSize: Height * 0.02,
    fontWeight: "400",
    fontFamily: "Roboto_500Medium",
    flex: 1,
    alignSelf: "center",
    color: Color.Grey,
  },
  bodyContainer: {
    flexDirection: "row",
    marginVertical: Height * 0.006,
    backgroundColor: Color.White,
    borderRadius: 8,
    shadowColor: Color.Grey,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
    elevation: 4,
    justifyContent: "space-between",
    width: "88%",
    alignSelf: "center",
  },
});
