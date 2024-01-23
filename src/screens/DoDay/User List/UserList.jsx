import {
  Dimensions,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import Color from "../../../../assets/colors/Color";
import ListCard from "./ListCard";
import { useStateContext } from "../../../contexts/ContextProvider";
import { axiosInstance } from "../../../../axiosInstance";
import UserListHeader from "./UserListHeader";
import { SafeAreaProvider } from "react-native-safe-area-context";
import CustomStatsBar from "../../../components/CustomStatsBar";

const Width = Dimensions.get("screen").width;
const Height = Dimensions.get("screen").height;

const UserList = () => {
  const [currentPage, setCurrentPage] = useState("All User");
  const [HomePage, setHomePage] = useState(true);
  const [Accepte, setAccept] = useState(false);
  const [pending, setPending] = useState(false);
  const [volunteers, setVolunteers] = useState([]);
  const [campaign, setCampaign] = useState({});
  const [counts, setCounts] = useState({ acceptedCount: 0, pendingCount: 0 });
  const { group, loading, setLoading } = useStateContext();

  const [refetch, setRefetch] = useState(null);

  const AllUser = () => {
    setCurrentPage("All User");
    setHomePage(true);
    setPending(false);
    setAccept(false);
  };
  const Accepted = () => {
    setCurrentPage("accepted");
    setHomePage(false);
    setPending(false);
    setAccept(true);
  };

  const Pending = () => {
    setCurrentPage("sent");
    setHomePage(false);
    setPending(true);
    setAccept(false);
  };

  useEffect(() => {
    //getting the group out of the group id
    const fetchData = async () => {
      try {
        setLoading(true);

        const { data } = await axiosInstance.get(
          `/campaigns/get-by-query?group=${group._id}`
        );
        if (data.success) {
          setVolunteers(data?.campaign?.volunteers);
          setCampaign(data?.campaign);
        }
        setLoading(false);
      } catch (error) {
        setLoading(false);
        console.log(error);
      }
    };
    fetchData();
  }, [refetch]);

  useEffect(() => {
    const counts = volunteers.reduce(
      (acc, item) => {
        if (item.status === "accepted") {
          acc.acceptedCount++;
        }
        if (item.status === "sent") {
          acc.pendingCount++;
        }
        return acc;
      },
      { acceptedCount: 0, pendingCount: 0 }
    );
    setCounts(counts);
  }, [volunteers]);

  const renderItem = ({ item }) => {
    if (currentPage === "All User") {
      return (
        <ListCard
          user={item.user}
          data={{
            status: item.status,
            campaignId: campaign?._id,
            setRefetch,
          }}
        />
      );
    }
    if (currentPage === item.status) {
      return (
        <ListCard
          user={item.user}
          data={{ status: item.status, campaignId: campaign?._id, setRefetch }}
        />
      );
    }
    return null;
  };
  return (
    <SafeAreaProvider style={styles.container}>
      <CustomStatsBar backgroundColor={Color.White} />
      <View>
        <View style={styles.container}>
          <UserListHeader campaign={campaign} />
          <View style={styles.listContainer}>
            <Pressable
              onPress={AllUser}
              style={HomePage ? styles.active : styles.disable}
            >
              <View
                style={{
                  alignItems: "center",
                  justifyContent: "center",
                  width: "100%",
                }}
              >
                <Text style={styles.Heading}>
                  All Users ({volunteers?.length})
                </Text>
              </View>
            </Pressable>
            <TouchableOpacity
              onPress={Accepted}
              style={Accepte ? styles.active : styles.disable}
            >
              <View
                style={{
                  alignItems: "center",
                  justifyContent: "center",
                  width: "100%",
                }}
              >
                <Text style={styles.Heading}>
                  Accepted ({counts?.acceptedCount})
                </Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={Pending}
              style={pending ? styles.active : styles.disable}
            >
              <View
                style={{
                  alignItems: "center",
                  justifyContent: "center",
                  width: "100%",
                }}
              >
                <Text style={styles.Heading}>
                  Pending ({counts?.pendingCount})
                </Text>
              </View>
            </TouchableOpacity>
          </View>

          <FlatList
            data={volunteers}
            keyExtractor={(item) => item._id}
            renderItem={renderItem}
          />
        </View>
      </View>
    </SafeAreaProvider>
  );
};

export default UserList;

const styles = StyleSheet.create({
  container: {
    backgroundColor: Color.White,
    height: "100%",
  },
  listContainer: {
    flexDirection: "row",
    width: "100%",
    alignItems: "center",
    // paddingHorizontal: 10,
    height: Height * 0.055,
  },

  active: {
    flexDirection: "row",
    width: "30%",
    borderBottomColor: Color.Blue,
    borderBottomWidth: 2,
    height: "100%",
  },
  disable: {
    flexDirection: "row",
    alignItems: "center",
    width: "30%",
  },
  Heading: {
    alignSelf: "center",
    fontFamily: "Roboto_500Medium",
    fontWeight: "6",
    fontSize: Height * 0.016,
  },
});
