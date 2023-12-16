import {
  Dimensions,
  FlatList,
  StyleSheet,
  Text,
  View,
  Image,
  Pressable,
} from "react-native";
import React, { useEffect, useState } from "react";
import HeaderList from "./HeaderList";

import VolunteersListCard from "./VolunteersListCard";
import { axiosInstance } from "../../../../axiosInstance";
import { useStateContext } from "../../../contexts/ContextProvider";

const VolunteersList = () => {
  const { activeCampaign } = useStateContext();

  const renderItem = ({ item }) => {
    if (item.team) return null;

    if (item.status !== "accepted") return null;
    return (
      <View>
        <VolunteersListCard data={item} />
      </View>
    );
  };
  return (
    <View style={{ flex: 1 }}>
      <HeaderList title="Volunteers" />
      <FlatList
        data={activeCampaign?.volunteers}
        renderItem={renderItem}
        keyExtractor={(item) => item._id}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
    </View>
  );
};

export default VolunteersList;
const styles = StyleSheet.create({});
