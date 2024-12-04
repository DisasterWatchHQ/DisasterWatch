import 'react-native-get-random-values';
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, ActivityIndicator } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import Geocoder from 'react-native-geocoding';
import { MaterialIcons } from '@expo/vector-icons';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { GMAPS_API_KEY } from '@env';

Geocoder.init(GMAPS_API_KEY);

const MapWindow = ({ markers = [], height = 200 }) => {
  const [location, setLocation] = useState(null);
  const [address, setAddress] = useState('Loading...');
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);

  const getCurrentLocation = async () => {
    setIsLoading(true);
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.log('Permission denied');
        return;
      }

      const { coords } = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = coords;
      await updateLocation(latitude, longitude);
    } catch (error) {
      console.error('Error getting location:', error);
      setAddress('Unable to get location');
    } finally {
      setIsLoading(false);
    }
  };

  const updateLocation = async (latitude, longitude) => {
    try {
      setLocation({ latitude, longitude });
      const result = await Geocoder.from(latitude, longitude);
      const formattedAddress = result.results[0].formatted_address;
      setAddress(formattedAddress);
    } catch (error) {
      console.error('Geocoding error:', error);
      setAddress('Location found, but address unavailable');
    }
  };

  useEffect(() => {
    getCurrentLocation();
  }, []);

  const handleLocationSelect = (data, details) => {
    if (details) {
      setSelectedLocation({
        latitude: details.geometry.location.lat,
        longitude: details.geometry.location.lng,
        address: data.description
      });
    }
  };

  const confirmLocationChange = () => {
    if (selectedLocation) {
      updateLocation(selectedLocation.latitude, selectedLocation.longitude);
      setAddress(selectedLocation.address);
      setShowLocationModal(false);
      setSelectedLocation(null);
    }
  };

  return (
    <View style={styles.container}>
      {/* Location Header */}
      <View style={styles.header}>
        <View style={styles.locationInfo}>
          <MaterialIcons name="location-on" size={24} color="#FF4444" />
          <Text style={styles.locationText} numberOfLines={1}>
            {address}
          </Text>
        </View>
        <TouchableOpacity 
          style={styles.changeButton}
          onPress={() => setShowLocationModal(true)}
        >
          <MaterialIcons name="edit-location" size={24} color="white" />
        </TouchableOpacity>
      </View>

      {/* Map */}
      <View style={[styles.mapContainer, { height }]}>
        {location && (
          <MapView
            style={styles.map}
            region={{
              latitude: location.latitude,
              longitude: location.longitude,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }}
            showsUserLocation={true}
          >
            <Marker
              coordinate={{
                latitude: location.latitude,
                longitude: location.longitude,
              }}
              title="Selected Location"
            />
            {markers.map((marker, index) => (
              <Marker
                key={index}
                coordinate={marker.coordinate}
                title={marker.title}
                description={marker.description}
                pinColor={marker.color || 'red'}
              />
            ))}
          </MapView>
        )}
      </View>

      {/* Location Search Modal */}
      <Modal
        visible={showLocationModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowLocationModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Change Location</Text>
              <TouchableOpacity 
                onPress={() => setShowLocationModal(false)}
                style={styles.closeButton}
              >
                <MaterialIcons name="close" size={24} color="white" />
              </TouchableOpacity>
            </View>

            <GooglePlacesAutocomplete
              placeholder='Search for a location'
              onPress={handleLocationSelect}
              query={{
                key: GMAPS_API_KEY,
                language: 'en',
              }}
              fetchDetails={true}
              styles={{
                container: {
                  flex: 0,
                  marginBottom: 20,
                },
                textInput: {
                  height: 45,
                  color: '#000',
                  fontSize: 16,
                  backgroundColor: '#f0f0f0',
                  borderRadius: 8,
                },
                listView: {
                  backgroundColor: '#fff',
                  borderRadius: 8,
                  maxHeight: 200,
                },
                row: {
                  backgroundColor: '#fff',
                  padding: 13,
                  height: 44,
                  flexDirection: 'row',
                },
                separator: {
                  height: 1,
                  backgroundColor: '#c8c7cc',
                },
                description: {
                  color: '#000',
                },
              }}
            />

            {/* Confirm Location Button */}
            {selectedLocation && (
              <TouchableOpacity 
                style={[styles.currentLocationButton, { backgroundColor: '#4CAF50' }]}
                onPress={confirmLocationChange}
              >
                <MaterialIcons name="check" size={24} color="white" />
                <Text style={styles.currentLocationText}>Confirm Location</Text>
              </TouchableOpacity>
            )}

            {/* Current Location Button */}
            <TouchableOpacity 
              style={[styles.currentLocationButton, { marginTop: 10 }]}
              onPress={() => {
                getCurrentLocation();
                setShowLocationModal(false);
              }}
            >
              <MaterialIcons name="my-location" size={24} color="white" />
              <Text style={styles.currentLocationText}>Use Current Location</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#262626',
    borderRadius: 12,
    overflow: 'hidden',
    margin: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    backgroundColor: '#333333',
  },
  locationInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 10,
  },
  locationText: {
    color: 'white',
    fontSize: 16,
    marginLeft: 8,
    flex: 1,
  },
  changeButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#444444',
  },
  mapContainer: {
    overflow: 'hidden',
    borderRadius: 12,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#262626',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  closeButton: {
    padding: 5,
  },
  currentLocationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#444444',
    padding: 15,
    borderRadius: 10,
    justifyContent: 'center',
  },
  currentLocationText: {
    color: 'white',
    marginLeft: 10,
    fontSize: 16,
  },
});

export default MapWindow;