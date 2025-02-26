import React, { useState, useEffect } from "react";
import { View, ScrollView, StyleSheet } from "react-native";
import { Chip, Text } from "react-native-paper";
import { warningApi } from "../../services/warningApi"; // Import your warningApi

export default function DisasterFeed() {
  const [activeWarnings, setActiveWarnings] = useState([]);

  useEffect(() => {
    const fetchActiveWarnings = async () => {
      try {
        const warnings = await warningApi.getActiveWarnings();
        setActiveWarnings(warnings);
      } catch (error) {
        console.error("Error fetching active warnings:", error);
      }
    };

    fetchActiveWarnings();
  }, []);

  return (
    <View style={styles.container}>
      <Text variant="headlineMedium">Disaster Feed</Text>
      {activeWarnings.length > 0 && (
        <ScrollView horizontal style={styles.warningBanner}>
          {activeWarnings.map((warning, index) => (
            <Chip key={index} style={styles.warningChip}>
              {`${warning.disaster_category}: ${warning.title}`}
            </Chip>
          ))}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: 40,
  },
  warningBanner: {
    backgroundColor: "#FEF3C7",
    padding: 8,
    maxHeight: 60,
  },
  warningChip: {
    marginHorizontal: 4,
    backgroundColor: "#FBBF24",
    height: 36,
  },
});
