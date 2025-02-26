import React, { useState, useEffect } from "react";
import { View, SafeAreaView, ScrollView, ActivityIndicator } from "react-native";
import { Card, Text, Button } from "react-native-paper";
import HeaderBar from "../../components/headerBar";
import { useRouter } from "expo-router";
import * as Location from "expo-location";
import MapWindow from "../../components/mapwindow";
import { warningApi } from "../../services/warningApi";

const Home = () => {
  const router = useRouter();
  const [activeWarnings, setActiveWarnings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [location, setLocation] = useState(null);
  const [markers, setMarkers] = useState([]);

  const fetchLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setError("Permission to access location was denied");
        return;
      }
      const loc = await Location.getCurrentPositionAsync({});
      setLocation(loc);
    } catch (err) {
      setError("Failed to fetch location");
    }
  };

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

  useEffect(() => {
    fetchLocation();
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
          ) : (
            <Text style={{ padding: 20 }}>No active warnings</Text>
          )}
        </View>

        {/* Map Overview */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text variant="titleMedium">Disaster Map</Text>
            <Button mode="text" onPress={() => router.push("/map")}>
              Full Map
            </Button>
          </View>
          <MapWindow markers={markers} height={200} />
        </View>
      </ScrollView>
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
};

export default Home;
