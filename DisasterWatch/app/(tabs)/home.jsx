import React, { useState, useEffect } from "react";
import { View, SafeAreaView, ScrollView, ActivityIndicator } from "react-native";
import { Card, Text, Button } from "react-native-paper";
import HeaderBar from "../../components/headerBar";
import { useRouter } from "expo-router";
import * as Location from "expo-location";
import MapWindow from "../../components/mapwindow";
import { warningApi } from "../../services/warningApi";
import { facilityApi } from "../../services/resourceApi";

const Home = () => {
  const router = useRouter();
  const [activeWarnings, setActiveWarnings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [location, setLocation] = useState(null);
  const [markers, setMarkers] = useState([]);
  const [nearbyFacilities, setNearbyFacilities] = useState([]);

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

  const fetchNearbyFacilities = async () => {
    try {
      setLoading(true);
      const facilities = await facilityApi.getNearbyFacilities({
        latitude: location?.coords.latitude || 6.9271,
        longitude: location?.coords.longitude || 79.8612,
      });
      setNearbyFacilities(facilities);
    } catch (err) {
      setError("Failed to fetch nearby facilities");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLocation();
    fetchNearbyFacilities();
  }, [location]);

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
              <Card key={warning._id} style={styles.warningCard}>
                <Card.Title title={warning.title} />
              </Card>
            ))
          )}
        </View>

        {/* Nearby Facilities */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text variant="titleMedium">Nearby Facilities</Text>
            <Button mode="text" onPress={() => router.push("/resources")}>
              View All
            </Button>
          </View>

          {loading ? (
            <ActivityIndicator size="large" style={{ padding: 20 }} />
          ) : error ? (
            <Text style={{ color: "red", padding: 20 }}>{error}</Text>
          ) : nearbyFacilities.length === 0 ? (
            <Text style={{ padding: 20 }}>No nearby facilities</Text>
          ) : (
            nearbyFacilities.map((facility, index) => (
              <Card key={index} style={styles.facilityCard}>
                <Card.Title
                  title={facility.name}
                  subtitle={`${facility.distance} away`}
                  right={(props) => (
                    <Text
                      style={[
                        styles.statusText,
                        {
                          color:
                            facility.status === "open" ? "#10B981" : "#EF4444",
                        },
                      ]}
                    >
                      {facility.status}
                    </Text>
                  )}
                />
              </Card>
            ))
          )}
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
  facilityCard: {
    marginBottom: 8,
    elevation: 1,
  },
  statusText: {
    fontWeight: "bold",
    marginRight: 16,
  },
};

export default Home;
