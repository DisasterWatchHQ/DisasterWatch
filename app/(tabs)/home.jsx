import React, { useState, useEffect } from "react";
import {
  View,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { Card, Text, Button, FAB } from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as Location from "expo-location";
import MapWindow from "../../components/mapwindow";
import WarningMain from "../../components/warningMain";
import HeaderBar from "../../components/headerBar";
import { useRouter } from "expo-router";
import { warningApi } from "../../services/warningApi";
import { facilityApi } from "../../services/resourceApi";
import WarningDetailsModal from "../../components/warnings/WarningDetailsModal";
import { useNavigation } from "@react-navigation/native";

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
  const navigation = useNavigation();
  

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
    fetchLocation();
    const locationInterval = setInterval(() => {
      fetchLocation();
    }, 3600000);

    return () => clearInterval(locationInterval);
  }, []);

  const handleWarningPress = async (warning) => {
    try {
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
      if (err.response) {
        console.error("Error response:", {
          data: err.response.data,
          status: err.response.status,
          headers: err.response.headers,
        });
      } else if (err.request) {
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
        latitude: location?.coords.latitude || 6.9271,
        longitude: location?.coords.longitude || 79.8612,
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
      
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContent}
      >
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
                  handleWarningPress={() => handleWarningPress(warning)}
                />
              ))}
            </ScrollView>
          )}
        </View>

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
      <FAB
        icon="tab"
        style={styles.fab}
        onPress={() => navigation.navigate("Dashboard")}
        label="Go to Dash"
      />
    </SafeAreaView>
  );
};

const styles = {
  fab: {
    position: "absolute",
    margin: 16,
    right: 0,
    bottom: 80,
  },
  scrollView: {
    backgroundColor: "#ffffff",
    flex: 1,
  },
  scrollViewContent: {
    paddingBottom: 80,
  },
  section: {
    marginHorizontal: 16,
    marginVertical: 12,
    backgroundColor: "#ffffff",
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    padding: 16,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
    paddingHorizontal: 4,
  },
  quickActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
    marginTop: 8,
  },
  actionButton: {
    flex: 1,
    borderRadius: 12,
  },
  facilityCard: {
    marginBottom: 12,
    borderRadius: 12,
    elevation: 2,
    backgroundColor: "#ffffff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
  },
  statusText: {
    fontWeight: "600",
    marginRight: 16,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  horizontalScroll: {
    paddingVertical: 8,
    marginHorizontal: -4,
  },
  horizontalContent: {
    flexDirection: "row",
    gap: 12,
    paddingHorizontal: 4,
  },
  warningCard: {
    width: 280,
    marginRight: 8,
    borderRadius: 12,
    elevation: 2,
  },
  modalContainer: {
    flex: 1,
    margin: 20,
    backgroundColor: "white",
    maxHeight: "80%",
    marginTop: 60,
    marginBottom: 60,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 5,
  },
};

export default Home;
