import 'react-native-get-random-values';
import { Text, View, Alert, TouchableOpacity, ActivityIndicator } from 'react-native';
import MapView, { PROVIDER_GOOGLE, Marker, Callout } from 'react-native-maps';
import React, { useEffect, useState, useRef, useMemo, useCallback } from 'react';
import * as Location from 'expo-location';
import { MaterialIcons } from '@expo/vector-icons';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { GMAPS_API_KEY } from '@env';
import debounce from 'lodash/debounce';

const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = 0.0421;

const markerTypes = [
  { type: 'Flood', color: 'blue', icon: 'water' },
  { type: 'Fire', color: 'red', icon: 'local-fire-department' },
  { type: 'Landslide', color: 'brown', icon: 'landscape' },
  { type: 'Storm', color: 'purple', icon: 'thunderstorm' },
];

const MapControl = React.memo(({ icon, onPress, className }) => (
  <TouchableOpacity 
    className={`p-3 bg-white rounded-lg shadow-lg ${className}`}
    onPress={onPress}
  >
    <MaterialIcons name={icon} size={24} color="black" />
  </TouchableOpacity>
));

const DisasterMarker = React.memo(({ marker }) => (
  <Marker
    coordinate={marker.coordinate}
    pinColor={markerTypes.find(t => t.type === marker.type)?.color || 'red'}
  >
    <Callout>
      <View className="p-3">
        <Text className="font-bold text-base">{marker.type}</Text>
        <Text className="text-sm mt-1">{marker.description}</Text>
        <Text className="text-xs text-gray-500 mt-2">{marker.timestamp}</Text>
      </View>
    </Callout>
  </Marker>
));

const MapFeed = ({ disasterMarkers = [] }) => {
  const mapRef = useRef(null);
  const [location, setLocation] = useState(null);
  const [showLegend, setShowLegend] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const getCurrentLocation = useCallback(async () => {
    try {
      setIsLoading(true);
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        throw new Error('Location permission denied');
      }

      let userLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced, // Changed to Balanced for faster response
      });
      
      const newLocation = {
        latitude: userLocation.coords.latitude,
        longitude: userLocation.coords.longitude,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA,
      };

      setLocation(newLocation);
      mapRef.current?.animateToRegion(newLocation, 1000);
    } catch (error) {
      setError(error.message);
      Alert.alert('Error', error.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    getCurrentLocation();
  }, [getCurrentLocation]);

  const handleRegionChange = useCallback(debounce((newRegion) => {
    setLocation(newRegion);
  }, 100), []);

  const handleZoom = useCallback((factor) => {
    if (!location) return;
    const newLocation = {
      ...location,
      latitudeDelta: location.latitudeDelta * factor,
      longitudeDelta: location.longitudeDelta * factor,
    };
    mapRef.current?.animateToRegion(newLocation, 500);
  }, [location]);

  const memoizedMarkers = useMemo(() => (
    Array.isArray(disasterMarkers) && disasterMarkers.map((marker, index) => (
      <DisasterMarker key={`${marker.coordinate.latitude}-${marker.coordinate.longitude}`} marker={marker} />
    ))
  ), [disasterMarkers]);

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
        <MapView
          ref={mapRef}
          style={{ width: '100%', height: '100%' }}
          provider={PROVIDER_GOOGLE}
          initialRegion={location}
          onRegionChangeComplete={handleRegionChange}
          showsUserLocation={true}
          showsMyLocationButton={false}
          showsCompass={false}
          loadingEnabled={true}
          moveOnMarkerPress={false}
        >
          {memoizedMarkers}
        </MapView>
      )}

      {/* Search Bar */}
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
            language: 'en',
          }}
          styles={{
            container: { flex: 0 },
            textInput: {
              height: 40,
              backgroundColor: 'white',
              borderRadius: 8,
              paddingHorizontal: 10,
              fontSize: 16,
            },
            listView: {
              backgroundColor: 'white',
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

      {/* Map Controls */}
      <View className="absolute right-4 top-1/3 flex gap-2">
        <MapControl 
          icon="explore" 
          onPress={() => {
            mapRef.current?.setCamera({
              heading: 0,
              pitch: 0,
              center: location
            });
          }}
        />
        
        <View className="bg-white rounded-lg shadow-lg">
          <MapControl 
            icon="zoom-in" 
            onPress={() => handleZoom(0.5)}
            className="border-b border-gray-200"
          />
          <MapControl 
            icon="zoom-out" 
            onPress={() => handleZoom(2)}
          />
        </View>

        <MapControl 
          icon="layers" 
          onPress={() => setShowLegend(!showLegend)}
          className={showLegend ? 'bg-gray-200' : ''}
        />
      </View>

      <MapControl 
        icon="my-location" 
        onPress={getCurrentLocation}
        className="absolute right-4 bottom-6"
      />

      {showLegend && (
        <View className="absolute bottom-20 left-4 bg-white p-4 rounded-lg shadow-lg">
          <Text className="font-bold text-base mb-3">Disaster Types</Text>
          {markerTypes.map((item, index) => (
            <View key={index} className="flex-row items-center mb-2">
              <MaterialIcons name={item.icon} size={24} color={item.color} />
              <Text className="ml-2">{item.type}</Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );
};

export default React.memo(MapFeed);