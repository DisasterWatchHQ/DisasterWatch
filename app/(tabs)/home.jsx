import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
  Alert,
  RefreshControl,
} from "react-native";
import { Card, Text, Button } from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as Location from "expo-location";
import WarningMain from "../../components/warningMain";
import HeaderBar from "../../components/HeaderBar";
import { useRouter } from "expo-router";
import { warningApi } from "../../api/services/warnings";
import { resourceApi } from "../../api/services/resources";
import WarningDetailsModal from "../../components/warnings/WarningDetailsModal";

const Home = () => {
  const router = useRouter();

  const [activeWarnings, setActiveWarnings] = useState([]);
  const [nearbyFacilities, setNearbyFacilities] = useState([]);
  const [location, setLocation] = useState(null);
  const [selectedWarning, setSelectedWarning] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const [loadingStates, setLoadingStates] = useState({
    location: false,
    warnings: false,
    facilities: false,
  });
  const [errors, setErrors] = useState({
    location: null,
    warnings: null,
    facilities: null,
  });

  const isLoading = Object.values(loadingStates).some((state) => state);
  const hasError = Object.values(errors).some((error) => error !== null);

  const fetchLocation = useCallback(async () => {
    try {
      setLoadingStates((prev) => ({ ...prev, location: true }));
      setErrors((prev) => ({ ...prev, location: null }));

      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        throw new Error("Location permission denied");
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      const [geocodeResult] = await Location.reverseGeocodeAsync({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });

      if (!geocodeResult) {
        throw new Error("Failed to get location details");
      }

      setLocation({
        ...location,
        address: {
          district:
            geocodeResult.district ||
            geocodeResult.subregion ||
            geocodeResult.region,
          city: geocodeResult.city,
          region: geocodeResult.region,
        },
      });
    } catch (err) {
      console.error("Location fetch error:", err);
      setErrors((prev) => ({
        ...prev,
        location: "Failed to access location. Please enable location services.",
      }));
    } finally {
      setLoadingStates((prev) => ({ ...prev, location: false }));
    }
  }, []);

  const fetchActiveWarnings = useCallback(async () => {
    try {
      setLoadingStates((prev) => ({ ...prev, warnings: true }));
      setErrors((prev) => ({ ...prev, warnings: null }));

      const response = await warningApi.getActiveWarnings();

      if (!response || !Array.isArray(response)) {
        throw new Error("Invalid response format from server");
      }

      setActiveWarnings(response);
    } catch (err) {
      console.error("Warning fetch error:", err);
      setErrors((prev) => ({
        ...prev,
        warnings:
          err.message || "Failed to load warnings. Please try again later.",
      }));
    } finally {
      setLoadingStates((prev) => ({ ...prev, warnings: false }));
    }
  }, []);

  const fetchNearbyFacilities = useCallback(async () => {
    if (!location?.coords || !location?.address?.district) return;

    try {
      setLoadingStates((prev) => ({ ...prev, facilities: true }));
      setErrors((prev) => ({ ...prev, facilities: null }));

      const response = await resourceApi.getNearbyFacilities({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        district: location.address.district,
        maxDistance: 5, 
      });

      if (
        !response ||
        !response.success ||
        !Array.isArray(response.resources)
      ) {
        throw new Error("Invalid facilities response format");
      }

      const sortedFacilities = response.resources.sort((a, b) => {
        if (a.distance && b.distance) {
          return parseFloat(a.distance) - parseFloat(b.distance);
        }
        return 0;
      });

      setNearbyFacilities(sortedFacilities);
    } catch (err) {
      console.error("Facilities fetch error:", err);
      setErrors((prev) => ({
        ...prev,
        facilities: err.message || "Failed to load nearby facilities.",
      }));
    } finally {
      setLoadingStates((prev) => ({ ...prev, facilities: false }));
    }
  }, [location?.coords, location?.address?.district]);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await Promise.all([
        fetchLocation(),
        fetchActiveWarnings(),
        location?.coords && fetchNearbyFacilities(),
      ]);
    } catch (err) {
      console.error("Refresh error:", err);
    } finally {
      setRefreshing(false);
    }
  }, [
    fetchLocation,
    fetchActiveWarnings,
    fetchNearbyFacilities,
    location?.coords,
  ]);

  const handleWarningPress = useCallback(async (warning) => {
    try {
      if (!warning?._id && !warning?.id) {
        throw new Error("Invalid warning data");
      }

      const warningId = warning._id || warning.id;
      const warningDetails = await warningApi.getWarningById(warningId);

      if (!warningDetails) {
        throw new Error("Warning details not found");
      }

      setSelectedWarning(warningDetails);
      setModalVisible(true);
    } catch (err) {
      console.error("Warning details fetch error:", err);
      Alert.alert("Error", "Failed to load warning details. Please try again.");
    }
  }, []);

  useEffect(() => {
    fetchLocation();
    fetchActiveWarnings();

    const locationInterval = setInterval(fetchLocation, 300000); 
    const warningsInterval = setInterval(fetchActiveWarnings, 60000);

    return () => {
      clearInterval(locationInterval);
      clearInterval(warningsInterval);
    };
  }, []);

  useEffect(() => {
    if (location?.coords) {
      fetchNearbyFacilities();
    }
  }, [location?.coords]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#ffffff" }}>
      <HeaderBar
        title="DisasterWatch"
        subtitle="Your safety companion"
        showBack={false}
        containerStyle={{ marginTop: 32 }}
      />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={["#2563EB"]}
            tintColor="#2563EB"
            title="Pull to refresh"
            titleColor="#6B7280"
          />
        }
      >
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text variant="titleMedium">Active Warnings</Text>
            <Button mode="text" onPress={() => router.push("/feed")}>
              See All
            </Button>
          </View>

          {isLoading ? (
            <ActivityIndicator size="large" style={{ padding: 20 }} />
          ) : hasError ? (
            <Text style={{ color: "red", padding: 20 }}>{errors.warnings}</Text>
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
            <Text variant="titleMedium">Nearby Shelters</Text>
            <Button mode="text" onPress={() => router.push("/resources")}>
              View All
            </Button>
          </View>
          {isLoading ? (
            <ActivityIndicator size="large" style={{ padding: 20 }} />
          ) : hasError ? (
            <Text style={{ color: "red", padding: 20 }}>
              {errors.facilities}
            </Text>
          ) : nearbyFacilities.length === 0 ? (
            <Text style={{ padding: 20 }}>No nearby shelters</Text>
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
