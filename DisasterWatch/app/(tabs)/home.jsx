import React, { useState, useEffect } from "react";
import { View, SafeAreaView, ScrollView, ActivityIndicator } from "react-native";
import { Card, Text, Button } from "react-native-paper";
import HeaderBar from "../../components/headerBar";
import { useRouter } from "expo-router";
import { warningApi } from "../../services/warningApi";
import WarningDetailsModal from "../../components/warnings/WarningDetailsModal";

const Home = () => {
  const router = useRouter();
  const [activeWarnings, setActiveWarnings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedWarning, setSelectedWarning] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const fetchActiveWarnings = async () => {
    try {
      setLoading(true);
      const warnings = await warningApi.getActiveWarnings();
      setActiveWarnings(warnings);
    } catch (err) {
      setError("Failed to load warnings");
    } finally {
      setLoading(false);
    }
  };

  const handleWarningPress = async (warning) => {
    try {
      const warningDetails = await warningApi.getWarningById(warning._id);
      setSelectedWarning(warningDetails);
      setModalVisible(true);
    } catch (err) {
      setError("Failed to load warning details");
    }
  };

  useEffect(() => {
    fetchActiveWarnings();
  }, []);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#ffffff" }}>
      {/* Header */}
      <HeaderBar
        title="DisasterWatch"
        subtitle="Your safety companion"
        showBack={false}
        containerStyle={{ marginTop: 32 }}
      />

      {/* Active Warnings Section */}
      <ScrollView style={styles.scrollView}>
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text variant="titleMedium">Active Warnings</Text>
            <Button mode="text" onPress={() => router.push("/feed")}>
              See All
            </Button>
          </View>

          {loading ? (
            <ActivityIndicator size="large" style={{ padding: 20 }} />
          ) : error ? (
            <Text style={{ color: "red", padding: 20 }}>{error}</Text>
          ) : activeWarnings.length === 0 ? (
            <Text style={{ padding: 20 }}>No active warnings</Text>
          ) : (
            activeWarnings.map((warning) => (
              <Card
                key={warning._id}
                style={styles.warningCard}
                onPress={() => handleWarningPress(warning)}
              >
                <Card.Title title={warning.title} />
              </Card>
            ))
          )}
        </View>
      </ScrollView>

      <WarningDetailsModal
        visible={modalVisible}
        warning={selectedWarning}
        onDismiss={() => setModalVisible(false)}
      />
    </SafeAreaView>
  );
};

const styles = {
  scrollView: {
    backgroundColor: "#ffffff",
  },
  section: {
    marginHorizontal: 16,
    marginVertical: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  warningCard: {
    marginBottom: 8,
  },
};

export default Home;
