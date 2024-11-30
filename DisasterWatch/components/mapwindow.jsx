// MapWindow.js
import React, { useState, useEffect } from 'react';
import { View, Text, Button, Modal, TouchableOpacity } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import Geocoder from 'react-native-geocoding';
import { GMAPS_API_KEY } from '@env';
import ChangeLocation from './changeLocation';

// Initialize Geocoding with your Google API key
Geocoder.init(GMAPS_API_KEY);

const MapWindow = ({ setLocation, setAddress }) => {
  const [location, setLocationState] = useState(null);
  const [address, setAddressState] = useState('Loading...');
  const [modalVisible, setModalVisible] = useState(false);
  
  
  // Get the current location
  const getCurrentLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      console.log('Permission denied');
      return;
    }

    const { coords } = await Location.getCurrentPositionAsync({});
    const { latitude, longitude } = coords;
    setLocationState({ latitude, longitude });

    // Get the address from the coordinates
    const result = await Geocoder.from(latitude, longitude);
    const formattedAddress = result.results[0].formatted_address;
    setAddressState(formattedAddress);
    setLocation({ latitude, longitude });
    setAddress(formattedAddress);
  };

  useEffect(() => {
    getCurrentLocation();
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <MapView
        style={{ flex: 1 }}
        region={{
          latitude: location ? location.latitude : 0,
          longitude: location ? location.longitude : 0,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
        showsUserLocation={true}
        followsUserLocation={true}
      >
        {location && <Marker coordinate={{ latitude: location.latitude, longitude: location.longitude }} />}
      </MapView>

      <View style={{ position: 'absolute', top: 20, left: 10, zIndex: 1 }}>
        <Text style={{ fontSize: 18, color: 'white' }}>Location: {address}</Text>
      </View>
      
    </View>
  );
};

export default MapWindow;
