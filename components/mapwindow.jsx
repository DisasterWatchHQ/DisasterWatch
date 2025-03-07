import React, { useState, useEffect } from "react";
import { View, StyleSheet } from "react-native";
import {
  Surface,
  Text,
  IconButton,
  ActivityIndicator,
  useTheme,
} from "react-native-paper";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import * as Location from "expo-location";
import Geocoder from "react-native-geocoding";
import { GMAPS_API_KEY } from "@env";

Geocoder.init(GMAPS_API_KEY);

const MapWindow = ({
  markers = [],
  height = 200,
  title = "Your Location",
  onPress,
  style,
}) => {
  const [location, setLocation] = useState(null);
  const [address, setAddress] = useState("Loading...");
  const [loading, setLoading] = useState(true);
  const theme = useTheme();

  const getCurrentLocation = async () => {
    try {
      setLoading(true);
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setAddress("Location access denied");
        return;
      }

      const { coords } = await Location.getCurrentPositionAsync({});
      setLocation({
        latitude: coords.latitude,
        longitude: coords.longitude,
      });

      const result = await Geocoder.from(coords.latitude, coords.longitude);
      const formattedAddress =
        result.results[0]?.formatted_address || "Address unavailable";
      setAddress(formattedAddress);
    } catch (error) {
      console.error("Error:", error);
      setAddress("Location unavailable");
    } finally {
      setLoading(false);
    }
  };

  const getMapRegion = () => {
    if (location) {
      return {
        latitude: location.latitude,
        longitude: location.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      };
    }
    if (markers.length > 0) {
      return {
        latitude: markers[0].coordinate.latitude,
        longitude: markers[0].coordinate.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      };
    }
    return {
      latitude: 0,
      longitude: 0,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
    };
  };

  useEffect(() => {
    getCurrentLocation();
  }, []);

  return (
    <Surface style={[styles.container, style]} elevation={1}>
      <View style={styles.header}>
        <View style={styles.locationInfo}>
          <IconButton
            icon="map-marker"
            iconColor={theme.colors.error}
            size={24}
            style={styles.locationIcon}
          />
          <View>
            <Text
              variant="labelSmall"
              style={{ color: theme.colors.onSurfaceVariant }}
            >
              {title}
            </Text>
            <Text
              variant="bodyMedium"
              style={{ color: theme.colors.onSurface }}
            >
              {address}
            </Text>
          </View>
        </View>
        <IconButton
          icon="refresh"
          mode="contained"
          onPress={getCurrentLocation}
          disabled={loading}
        />
      </View>

      <View style={[styles.mapContainer, { height }]}>
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" />
          </View>
        ) : location || markers.length > 0 ? (
          <MapView
            provider={PROVIDER_GOOGLE}
            style={styles.map}
            region={getMapRegion()}
            showsUserLocation={true}
            onPress={onPress}
          >
            {location && <Marker coordinate={location} />}
            {markers.map((marker, index) => (
              <Marker
                key={index}
                coordinate={marker.coordinate}
                title={marker.title}
                description={marker.description}
                pinColor={marker.color}
                image={marker.icon}
              />
            ))}
          </MapView>
        ) : (
          <View style={styles.errorContainer}>
            <Text variant="bodyMedium" style={{ color: theme.colors.error }}>
              Unable to load map
            </Text>
          </View>
        )}
      </View>
    </Surface>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: "#ffffff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  locationInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    gap: 8,
  },
  locationIcon: {
    margin: 0,
    backgroundColor: "#f8f8f8",
    borderRadius: 8,
  },
  mapContainer: {
    overflow: "hidden",
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
  },
  map: {
    flex: 1,
    width: "100%",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ffffff",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff5f5",
    padding: 16,
  },
  errorText: {
    color: "#dc2626",
    textAlign: "center",
    fontSize: 14,
    fontWeight: "500",
  },
});

export default MapWindow;
