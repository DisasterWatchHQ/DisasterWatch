import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import { Text, SegmentedButtons } from "react-native-paper";

export default function DisasterFeed() {
  const [selectedTab, setSelectedTab] = useState("all");

  return (
    <View style={styles.container}>
      <Text variant="headlineMedium">Disaster Feed</Text>
      <SegmentedButtons
        value={selectedTab}
        onValueChange={setSelectedTab}
        buttons={[
          { value: "all", label: "All Reports" },
          { value: "verified", label: "Verified Only" },
        ]}
        style={styles.segmentedButtons}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: 40,
  },
  segmentedButtons: {
    margin: 12,
  },
});
