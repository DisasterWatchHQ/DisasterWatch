import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { MaterialIcons } from '@expo/vector-icons';
import Geocoder from 'react-native-geocoding';
import { GMAPS_API_KEY } from '@env';

Geocoder.init(GMAPS_API_KEY);

const MapWindow = ({ markers = [], height = 200 }) => {
  const [location, setLocation] = useState(null);
  const [address, setAddress] = useState('Loading...');

  const getCurrentLocation = async () => {
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.log('Permission denied');
        return;
      }
  
      const { coords } = await Location.getCurrentPositionAsync({});
      setLocation({
        latitude: coords.latitude,
        longitude: coords.longitude,
      });
  
      const result = await Geocoder.from(coords.latitude, coords.longitude);
      const addressComponents = result.results[0].address_components;
      
      let street = addressComponents.find(component => 
        component.types.includes('route'))?.long_name;
      
      let district = addressComponents.find(component => 
        component.types.includes('administrative_area_level_2'))?.long_name;
      
      let province = addressComponents.find(component => 
        component.types.includes('administrative_area_level_1'))?.long_name;
  
      const formattedAddress = [street, district, province]
        .filter(item => item) 
        .join(', ');
  
      setAddress(formattedAddress || 'Address unavailable');
    } catch (error) {
      console.error('Error:', error);
      setAddress('Location unavailable');
    }
  };

  useEffect(() => {
    getCurrentLocation();
  }, []);

  return (
    <View className="bg-neutral-800 h-72 overflow-hidden m-5 rounded-2xl">
      <View className="flex-row items-center justify-between p-4 bg-neutral-700">
        <View className="flex-row items-center">
          <MaterialIcons name="location-on" size={24} color="#FF4444" />
          <Text className="text-neutral-100 text-lg font-semibold ml-2">
            {address}
          </Text>
        </View>
      </View>

      {location && (
        <MapView
          style={[{ height }]}
          className={`w-full `}
          region={{
            latitude: location.latitude,
            longitude: location.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
          showsUserLocation={true}
        >
          <Marker coordinate={location} />
          {markers.map((marker, index) => (
            <Marker
              key={index}
              coordinate={marker.coordinate}
              title={marker.title}
              description={marker.description}
            />
          ))}
        </MapView>
      )}
    </View>
  );
};

export default MapWindow;