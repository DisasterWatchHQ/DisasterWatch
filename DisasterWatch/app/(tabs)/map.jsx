import { Text, View, StyleSheet, Alert } from 'react-native';
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import React, { useEffect, useState } from 'react';
import * as Location from 'expo-location';

const MapFeed = () => {
  
  const [location, setLocation] = useState(null); // To store the user's location
  const [region, setRegion] = useState(null); // To set the map's region
    
  useEffect(() => {
      (async () => {
        // Request permissions
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert(
            'Permission Denied',
            'Allow location access to display your location on the map.'
          );
          return;
        }
  
        // Get current location
        let userLocation = await Location.getCurrentPositionAsync({});
        const { latitude, longitude } = userLocation.coords;
  
        // Set location and map region
        setLocation({ latitude, longitude });
        setRegion({
          latitude,
          longitude,
          latitudeDelta: 0.01, // Smaller delta for a closer zoom
          longitudeDelta: 0.01,
        });
      })();
    }, []);
  
    if (!region) {
      return null; // Render nothing until location is available
    }
  
  return (
    <View style={styles.container}>
      <MapView 
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        initialRegion={region} // Set the initial region
        showsUserLocation // Highlight user's current location
        showsMyLocationButton // Show "Locate Me" button
      >
        { location && (
          <Marker
            coordinate={location}
            title="You are here" 
          />
          )
        }
      </MapView>
    </View>
  )
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: '100%',
    height: '100%',
  },
});

export default MapFeed;

