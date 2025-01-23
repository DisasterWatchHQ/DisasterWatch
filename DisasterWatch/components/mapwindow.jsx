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
      {/* Header */}
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

      {/* Map */}
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
                image={marker.icon} // Add custom icons for markers if available
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
    borderRadius: 12,
    overflow: "hidden",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  locationInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  locationIcon: {
    margin: 0,
  },
  mapContainer: {
    overflow: "hidden",
  },
  map: {
    flex: 1,
    width: "100%",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorContainer: {
    flex:1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8d7da",
  },
});

export default MapWindow;
