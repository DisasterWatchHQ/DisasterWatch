import React, { useState } from "react";
import { View, ScrollView, StyleSheet } from "react-native";
import { Chip, Text, Button } from "react-native-paper";

const DisasterFeed = () => {
  const [selectedTab, setSelectedTab] = useState("all");
  const [filters, setFilters] = useState({ disaster_category: "", verification_status: "all" });

  const reports = [
    { id: 1, title: "Flood in Area X", description: "Severe flood reported", disaster_category: "flood", verification_status: "verified", timestamp: Date.now() },
    { id: 2, title: "Fire in Area Y", description: "Fire alert", disaster_category: "fire", verification_status: "unverified", timestamp: Date.now() },
  ];

  const filteredReports = (showVerifiedOnly) => {
    return reports.filter(
      (report) =>
        !showVerifiedOnly || report.verification_status === "verified",
    );
  };

  const handleFilterChange = (category) => {
    setFilters((prev) => ({
      ...prev,
      disaster_category: category === filters.disaster_category ? "" : category,
    }));
  };

  return (
    <View style={styles.container}>
      <Text variant="headlineMedium">Disaster Feed</Text>

      <ScrollView horizontal style={styles.filterContainer}>
        {["flood", "fire", "earthquake", "landslide", "cyclone"].map((category) => (
          <Chip
            key={category}
            selected={filters.disaster_category === category}
            onPress={() => handleFilterChange(category)}
            style={styles.filterChip}
          >
            {category.charAt(0).toUpperCase() + category.slice(1)}
          </Chip>
        ))}
      </ScrollView>

      <ScrollView style={styles.reportsContainer}>
        {filteredReports(selectedTab === "verified").map((report) => (
          <Card key={report.id} style={styles.reportCard}>
            <Card.Title title={report.title} />
            <Card.Content>
              <Text>{report.description}</Text>
              <View style={styles.badgeContainer}>
                <Chip>{report.disaster_category}</Chip>
                <Chip>{report.verification_status}</Chip>
              </View>
            </Card.Content>
          </Card>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: 40,
  },
  filterContainer: {
    maxHeight: 32,
    paddingHorizontal: 10,
    marginBottom: 8,
  },
  filterChip: {
    marginRight: 8,
    height: 32,
  },
  reportsContainer: {
    flex: 1,
    paddingHorizontal: 12,
  },
  reportCard: {
    marginBottom: 12,
    borderRadius: 12,
    elevation: 2,
  },
  badgeContainer: {
    flexDirection: "row",
    gap: 6,
  },
});

export default DisasterFeed;
