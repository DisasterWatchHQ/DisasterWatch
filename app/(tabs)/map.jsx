import "react-native-get-random-values";
import {
  Text,
  View,
  Alert,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  Platform,
} from "react-native";
import MapView, { PROVIDER_GOOGLE, Marker, Callout, Circle } from "react-native-maps";
import React, {
  useEffect,
  useState,
  useRef,
  useMemo,
  useCallback,
} from "react";
import * as Location from "expo-location";
import { MaterialIcons } from "@expo/vector-icons";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import { GMAPS_API_KEY } from "@env";
import debounce from "lodash/debounce";
import { warningApi } from "../../api/services/warnings";
import { useTheme } from "react-native-paper";

const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = 0.0421;

const SEVERITY_COLORS = {
  low: "#3b82f6", // blue
  medium: "#eab308", // yellow
  high: "#f97316", // orange
  critical: "#ef4444", // red
};

const SEVERITY_RADIUS = {
  low: 1000, // 1km
  medium: 2000, // 2km
  high: 5000, // 5km
  critical: 10000, // 10km
};

const MapControl = React.memo(({ icon, onPress, className, disabled }) => (
  <TouchableOpacity
    className={`p-3 bg-white rounded-lg shadow-lg ${className} ${disabled ? 'opacity-50' : ''}`}
    onPress={onPress}
    disabled={disabled}
  >
    <MaterialIcons name={icon} size={24} color="black" />
  </TouchableOpacity>
));

const DisasterMarker = React.memo(({ warning }) => {
  if (!warning) {
    return null;
  }

  // Handle different coordinate formats
  let coordinates;
  try {
    if (warning.affected_locations?.[0]?.coordinates) {
      coordinates = warning.affected_locations[0].coordinates;
    } else if (warning.location?.coordinates) {
      coordinates = warning.location.coordinates;
    } else if (warning.coordinates) {
      coordinates = warning.coordinates;
    } else {
      return null;
    }

    // Validate coordinates
    const lat = parseFloat(coordinates.latitude || coordinates[1]);
    const lng = parseFloat(coordinates.longitude || coordinates[0]);

    if (isNaN(lat) || isNaN(lng)) {
      return null;
    }

    const severity = warning.severity?.toLowerCase() || 'medium';
    const color = SEVERITY_COLORS[severity] || SEVERITY_COLORS.medium;
    const radius = SEVERITY_RADIUS[severity] || SEVERITY_RADIUS.medium;

    return (
      <>
        <Circle
          center={{
            latitude: lat,
            longitude: lng,
          }}
          radius={radius}
          fillColor={color}
          strokeColor={color}
          strokeWidth={1}
          opacity={0.2}
        />
        <Marker
          coordinate={{
            latitude: lat,
            longitude: lng,
          }}
          pinColor={color}
        >
          <Callout>
            <View className="p-3 max-w-[300px]">
              <Text className="font-bold text-base">{warning.title || 'No Title'}</Text>
              <Text className="text-sm mt-1">
                {warning.disaster_category || 'Unknown Category'} - Severity: {warning.severity || 'Medium'}
              </Text>
              <Text className="text-sm mt-1">{warning.description || 'No description available'}</Text>
              <Text className="text-xs text-gray-500 mt-2">
                Created: {warning.created_at ? new Date(warning.created_at).toLocaleString() : 'Unknown date'}
              </Text>
              {warning.updates?.length > 0 && (
                <View className="mt-2 border-t pt-2">
                  <Text className="text-sm font-medium">Latest Update:</Text>
                  <Text className="text-sm">
                    {warning.updates[warning.updates.length - 1].update_text}
                  </Text>
                </View>
              )}
            </View>
          </Callout>
        </Marker>
      </>
    );
  } catch (error) {
    console.error("Error rendering marker:", error);
    return null;
  }
});

const MapFeed = () => {
  const mapRef = useRef(null);
  const [location, setLocation] = useState(null);
  const [showLegend, setShowLegend] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [warnings, setWarnings] = useState([]);
  const [userLocation, setUserLocation] = useState(null);
  const [isLocationEnabled, setIsLocationEnabled] = useState(false);
  const theme = useTheme();

  const getCurrentLocation = useCallback(async () => {
    try {
      setIsLoading(true);
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        throw new Error("Location permission denied");
      }

      let location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      const newLocation = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA,
      };

      setUserLocation(newLocation);
      setLocation(newLocation);
      setIsLocationEnabled(true);
      
      // Ensure the map is ready before animating
      if (mapRef.current) {
        setTimeout(() => {
          mapRef.current?.animateToRegion(newLocation, 1000);
        }, 100);
      }
    } catch (error) {
      console.error("Error getting location:", error);
      setError(error.message);
      setIsLocationEnabled(false);
      Alert.alert("Error", error.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    getCurrentLocation();
  }, [getCurrentLocation]);

  useEffect(() => {
    const fetchWarnings = async () => {
      try {
        const response = await warningApi.getActiveWarnings();
        const warningData = Array.isArray(response) ? response : [];
        setWarnings(warningData);
      } catch (error) {
        console.error("Error fetching warnings:", error);
        setWarnings([]); // Set empty array on error
      }
    };

    fetchWarnings();
    const interval = setInterval(fetchWarnings, 60000); // Refresh every minute
    return () => clearInterval(interval);
  }, []);

  const handleRegionChange = useCallback(
    debounce((newRegion) => {
      setLocation(newRegion);
    }, 100),
    [],
  );

  const handleZoom = useCallback(
    (factor) => {
      if (!location) return;
      const newLocation = {
        ...location,
        latitudeDelta: location.latitudeDelta * factor,
        longitudeDelta: location.longitudeDelta * factor,
      };
      mapRef.current?.animateToRegion(newLocation, 500);
    },
    [location],
  );

  const handleCenterOnUser = useCallback(() => {
    if (userLocation && mapRef.current) {
      // Force a location update before centering
      Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      }).then(location => {
        const newLocation = {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          latitudeDelta: LATITUDE_DELTA,
          longitudeDelta: LONGITUDE_DELTA,
        };
        setUserLocation(newLocation);
        mapRef.current?.animateToRegion(newLocation, 1000);
      }).catch(error => {
        console.error("Error updating location:", error);
        Alert.alert("Error", "Could not update location");
      });
    }
  }, [userLocation]);

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-neutral-800">
        <ActivityIndicator size="large" color="#fff" />
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 items-center justify-center bg-neutral-800">
        <Text className="text-white">{error}</Text>
        <TouchableOpacity onPress={getCurrentLocation}>
          <Text className="text-blue-500 mt-2">Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-neutral-800">
      {location && (
        <>
          <MapView
            ref={mapRef}
            style={{ width: "100%", height: "100%" }}
            provider={PROVIDER_GOOGLE}
            initialRegion={location}
            onRegionChangeComplete={handleRegionChange}
            showsUserLocation={isLocationEnabled}
            showsMyLocationButton={false}
            showsCompass={true}
            loadingEnabled={true}
            moveOnMarkerPress={false}
            toolbarEnabled={true}
            showsScale={true}
            showsBuildings={true}
            showsTraffic={true}
            showsIndoors={true}
            showsPointsOfInterest={true}
            followsUserLocation={true}
          >
            {Array.isArray(warnings) && warnings.length > 0 && warnings.map((warning, index) => {
              if (!warning) return null;
              return (
                <DisasterMarker
                  key={`${warning._id || index}-${index}`}
                  warning={warning}
                />
              );
            })}
          </MapView>
          {(!Array.isArray(warnings) || warnings.length === 0) && (
            <View style={styles.noDataContainer}>
              <Text style={styles.noDataText}>No active warnings in your area</Text>
            </View>
          )}
        </>
      )}

      <View className="absolute top-4 w-11/12 self-center mt-8 z-10">
        <GooglePlacesAutocomplete
          placeholder="Search location..."
          onPress={(data, details = null) => {
            if (details) {
              const { lat, lng } = details.geometry.location;
              const newLocation = {
                latitude: lat,
                longitude: lng,
                latitudeDelta: LATITUDE_DELTA,
                longitudeDelta: LONGITUDE_DELTA,
              };
              setLocation(newLocation);
              mapRef.current?.animateToRegion(newLocation, 1000);
            }
          }}
          query={{
            key: GMAPS_API_KEY,
            language: "en",
          }}
          styles={{
            container: { flex: 0 },
            textInput: {
              height: 40,
              backgroundColor: "white",
              borderRadius: 8,
              paddingHorizontal: 10,
              fontSize: 16,
            },
            listView: {
              backgroundColor: "white",
              borderRadius: 8,
              marginTop: 5,
            },
          }}
          fetchDetails={true}
          enablePoweredByContainer={false}
          minLength={2}
          debounce={300}
        />
      </View>

      <View className="absolute right-4 top-1/3 flex gap-2">
        <MapControl
          icon="explore"
          onPress={() => {
            mapRef.current?.setCamera({
              heading: 0,
              pitch: 0,
              center: location,
            });
          }}
        />

        <View className="bg-white rounded-lg shadow-lg">
          <MapControl
            icon="zoom-in"
            onPress={() => handleZoom(0.5)}
            className="border-b border-gray-200"
          />
          <MapControl icon="zoom-out" onPress={() => handleZoom(2)} />
        </View>

        <MapControl
          icon="layers"
          onPress={() => setShowLegend(!showLegend)}
          className={showLegend ? "bg-gray-200" : ""}
        />
      </View>

      <MapControl
        icon="my-location"
        onPress={handleCenterOnUser}
        className="absolute right-4 bottom-6"
        disabled={!isLocationEnabled}
      />

      {showLegend && (
        <View className="absolute bottom-20 left-4 bg-white p-4 rounded-lg shadow-lg">
          <Text className="font-bold text-base mb-3">Warning Severity</Text>
          {Object.entries(SEVERITY_COLORS).map(([severity, color]) => (
            <View key={severity} className="flex-row items-center mb-2">
              <View
                style={{
                  width: 12,
                  height: 12,
                  borderRadius: 6,
                  backgroundColor: color,
                  marginRight: 8,
                }}
              />
              <Text className="capitalize">{severity}</Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  noDataContainer: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -100 }, { translateY: -20 }],
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    padding: 10,
    borderRadius: 8,
    width: 200,
    alignItems: 'center',
    zIndex: 1,
  },
  noDataText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 14,
  },
});

export default React.memo(MapFeed);
