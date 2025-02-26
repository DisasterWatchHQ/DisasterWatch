import React, { useState, useEffect } from "react";
import { View, ScrollView, ActivityIndicator, StyleSheet } from "react-native";
import { Card, Button, Text, Chip } from "react-native-paper";

const DisasterFeed = () => {
  const [loading, setLoading] = useState(false);
  const [reports, setReports] = useState([]);

  useEffect(() => {
    const fetchReports = async () => {
      setLoading(true);
      try {
        // Example data fetching
        setReports([
          { id: 1, title: "Flood in Area X", description: "Severe flood reported", disaster_category: "flood", verification_status: "verified", timestamp: Date.now() },
          { id: 2, title: "Fire in Area Y", description: "Fire alert", disaster_category: "fire", verification_status: "unverified", timestamp: Date.now() },
        ]);
      } catch (error) {
        console.error("Error fetching reports:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  return (
    <View style={styles.container}>
      <Text variant="headlineMedium">Disaster Feed</Text>

      <ScrollView style={styles.reportsContainer}>
        {loading ? (
          <ActivityIndicator style={styles.loader} />
        ) : (
          reports.map((report) => (
            <Card key={report.id} style={styles.reportCard}>
              <Card.Title
                title={report.title}
                right={(props) => (
                  <View style={styles.shareButtons}>
                    <Button
                      compact
                      icon="twitter"
                      onPress={() => handleSocialShare(report, "twitter")}
                    />
                    <Button
                      compact
                      icon="facebook"
                      onPress={() => handleSocialShare(report, "facebook")}
                    />
                    <Button
                      compact
                      icon="whatsapp"
                      onPress={() => handleSocialShare(report, "whatsapp")}
                    />
                  </View>
                )}
              />
              <Card.Content>
                <Text>{report.description}</Text>
                <Chip>{report.disaster_category}</Chip>
                <Chip>{report.verification_status}</Chip>
              </Card.Content>
            </Card>
          ))
        )}
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
  reportsContainer: {
    flex: 1,
    paddingHorizontal: 12,
  },
  loader: {
    marginTop: 20,
  },
  reportCard: {
    marginBottom: 12,
    borderRadius: 12,
    elevation: 2,
  },
  shareButtons: {
    flexDirection: "row",
  },
});

export default DisasterFeed;
