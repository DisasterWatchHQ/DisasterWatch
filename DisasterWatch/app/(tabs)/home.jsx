import React, { useState, useEffect } from "react";
import {
  View,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { Card, Text, Button, Surface } from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as Location from "expo-location";
import MapWindow from "../../components/mapwindow";
import WarningMain from "../../components/warningMain";
import HeaderBar from "../../components/headerBar";
import { useRouter } from "expo-router";
import { warningApi } from "../../services/warningApi";
import { facilityApi } from "../../services/resourceApi";
import WarningDetailsModal from "../../components/warnings/WarningDetailsModal";

const Home = () => {
  const router = useRouter();
  const [activeWarnings, setActiveWarnings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [markers, setMarkers] = useState([]);
  const [nearbyFacilities, setNearbyFacilities] = useState([]);
  const [location, setLocation] = useState(null);
  const [selectedWarning, setSelectedWarning] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const getMarkerColor = (disasterCategory, severity) => {
    if (severity) {
      switch (severity.toLowerCase()) {
        case "high":
          return "red";
        case "medium":
          return "orange";
        case "low":
          return "yellow";
      }
    }

    switch (disasterCategory?.toLowerCase()) {
      case "flood":
        return "blue";
      case "fire":
        return "red";
      case "landslide":
        return "brown";
      case "tsunami":
        return "teal";
      case "earthquake":
        return "orange";
      default:
        return "gray";
    }
  };

  const getMarkerIcon = (disasterCategory) => {
    switch (disasterCategory?.toLowerCase()) {
      case "flood":
        return require("../../assets/icons/flood.png");
      case "fire":
        return require("../../assets/icons/fire.png");
      case "landslide":
        return require("../../assets/icons/landslide.png");
      case "tsunami":
        return require("../../assets/icons/tsunami.png");
      case "earthquake":
        return require("../../assets/icons/earthquake.png");
      default:
        return null;
    }
  };

  useEffect(() => {
    const fetchLocation = async () => {
      try {
        setLoading(true);
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          setError("Permission to access location was denied");
          return;
        }

        const location = await Location.getCurrentPositionAsync({});
        setLocation(location);
      } catch (err) {
        setError("Failed to fetch location");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    // Fetch the location initially
    fetchLocation();

    // Set an interval to fetch the location every 1 hour (3600000 milliseconds)
    const locationInterval = setInterval(() => {
      fetchLocation();
    }, 3600000); // 1 hour

    // Cleanup interval when component unmounts
    return () => clearInterval(locationInterval);
  }, []);

  const handleWarningPress = async (warning) => {
    try {
      // Add validation for warning ID
      if (!warning?._id && !warning?.id) {
        console.error("Warning ID is missing:", warning);
        setError("Invalid warning data");
        return;
      }

      const warningId = warning._id || warning.id;
      console.log("Fetching warning details for ID:", warningId);

      const warningDetails = await warningApi.getWarningById(warningId);
      console.log("Warning details received:", warningDetails);

      if (!warningDetails) {
        throw new Error("No warning details returned");
      }

      setSelectedWarning(warningDetails);
      setModalVisible(true);
    } catch (err) {
      console.error("Failed to fetch warning details:", err);
      // Log more details about the error
      if (err.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.error("Error response:", {
          data: err.response.data,
          status: err.response.status,
          headers: err.response.headers,
        });
      } else if (err.request) {
        // The request was made but no response was received
        console.error("No response received:", err.request);
      }
      setError(
        "Failed to load warning details: " + (err.message || "Unknown error"),
      );
    }
  };

  const fetchActiveWarnings = async () => {
    try {
      setLoading(true);
      const warnings = await warningApi.getActiveWarnings();
      setActiveWarnings(warnings);

      const warningMarkers = warnings.flatMap((warning) =>
        warning.affected_locations.map((location) => ({
          coordinate: {
            latitude: location.latitude || location.coordinates[1],
            longitude: location.longitude || location.coordinates[0],
          },
          title: warning.title,
          description: `${warning.disaster_category} - ${warning.severity} severity`,
          color: getMarkerColor(warning.disaster_category, warning.severity),
          icon: getMarkerIcon(warning.disaster_category),
          metadata: {
            status: warning.status,
            createdAt: warning.created_at,
            severity: warning.severity,
            category: warning.disaster_category,
            address: location.address,
          },
        })),
      );

      setMarkers(warningMarkers);
    } catch (err) {
      console.error("Failed to fetch warnings:", err);
      setError("Failed to load warnings");
    } finally {
      setLoading(false);
    }
  };

  const fetchNearbyFacilities = async () => {
    try {
      setLoading(true);
      const facilities = await facilityApi.getNearbyFacilities({
        latitude: location?.coords.latitude || 6.9271, // Use current user's latitude
        longitude: location?.coords.longitude || 79.8612, // Use current user's longitude
      });
      setNearbyFacilities(facilities);
    } catch (err) {
      console.error("Failed to fetch nearby facilities:", err);
      setError("Failed to load facilities");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActiveWarnings();
    fetchNearbyFacilities();
  }, [location]); // Fetch warnings and facilities when location changes

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
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.horizontalScroll}
              contentContainerStyle={styles.horizontalContent}
            >
              {activeWarnings.map((warning) => (
                <WarningMain
                  key={warning._id}
                  {...warning}
                  style={styles.warningCard}
                  handleWarningPress={() => handleWarningPress(warning)} // Pass the warning object directly
                />
              ))}
            </ScrollView>
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
                  left={(props) => (
                    <MaterialCommunityIcons
                      name="hospital-building"
                      size={24}
                      color={props.color}
                    />
                  )}
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
      <WarningDetailsModal
        visible={modalVisible}
        warning={selectedWarning}
        onDismiss={() => {
          setModalVisible(false);
          setSelectedWarning(null);
        }}
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
  sectionTitle: {
    marginBottom: 12,
  },
  quickActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 8,
  },
  actionButton: {
    flex: 1,
  },
  facilityCard: {
    marginBottom: 8,
    elevation: 1,
  },
  statusText: {
    fontWeight: "bold",
    marginRight: 16,
  },
  horizontalScroll: {
    paddingVertical: 10,
  },
  horizontalContent: {
    flexDirection: "row",
    gap: 8,
  },
  warningCard: {
    width: 250,
    marginRight: 8,
  },
  modalContainer: {
    flex: 1,
    margin: 16,
    justifyContent: "center", // Add this
    backgroundColor: "white", // Optional: for better visibility
    maxHeight: "90%", // Add this to prevent full screen
    marginTop: 50, // Add some top margin
    marginBottom: 50, // Add some bottom margin
    borderRadius: 16,
  },
};

export default Home;
