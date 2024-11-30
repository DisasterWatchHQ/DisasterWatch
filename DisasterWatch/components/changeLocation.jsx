// ChangeLocation.js
import React, { useState } from 'react';
import { View, TextInput, Button, Text, Modal, TouchableOpacity } from 'react-native';
import Geocoder from 'react-native-geocoding';
import { GMAPS_API_KEY } from '@env';

// Initialize Geocoding with your Google API key
// Geocoder.init('GMAPS_API_KEY');

const ChangeLocation = ({ setLocation, setAddress }) => {
  const [manualLocation, setManualLocation] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const changeLocation = async () => {
    try {
      const result = await Geocoder.from(manualLocation);
      if (result.results.length > 0) {
        const { lat, lng } = result.results[0].geometry.location;
        setLocation({ latitude: lat, longitude: lng });
        setAddress(result.results[0].formatted_address);
      } else {
        setErrorMessage('Location not found');
      }
    } catch (error) {
      setErrorMessage('Location not found');
      console.error(error);
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', padding: 20 }}>
      <TextInput
        style={{
          height: 40,
          borderColor: 'gray',
          borderWidth: 1,
          marginBottom: 20,
          paddingLeft: 8,
        }}
        placeholder="Enter new location"
        value={manualLocation}
        onChangeText={setManualLocation}
      />
      <Button title="Find Location" onPress={changeLocation} />
      {errorMessage ? <Text>{errorMessage}</Text> : null}
    </View>
  );
};

export default ChangeLocation;
