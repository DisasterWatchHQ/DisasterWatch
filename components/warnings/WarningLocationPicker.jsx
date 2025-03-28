import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, TextInput, useTheme, ActivityIndicator } from 'react-native-paper';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import PropTypes from 'prop-types';

/**
 * @typedef {Object} LocationData
 * @property {number} latitude - Latitude coordinate
 * @property {number} longitude - Longitude coordinate
 * @property {Object} address - Address details
 * @property {string} address.city - City name
 * @property {string} address.district - District name
 * @property {string} address.province - Province name
 * @property {string} address.details - Additional address details
 */

/**
 * @typedef {Object} WarningLocationPickerProps
 * @property {Object} control - React Hook Form control object
 * @property {Object} errors - Form validation errors
 * @property {Function} setValue - React Hook Form setValue function
 */

/**
 * Component for picking warning location on a map
 * @param {WarningLocationPickerProps} props
 */
const WarningLocationPicker = ({ control, errors, setValue }) => {
  const theme = useTheme();
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const getCurrentLocation = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        throw new Error('Permission to access location was denied');
      }

      const currentLocation = await Location.getCurrentPositionAsync({});
      setLocation(currentLocation.coords);
      setValue('affected_locations.0.latitude', currentLocation.coords.latitude);
      setValue('affected_locations.0.longitude', currentLocation.coords.longitude);

      await reverseGeocode(currentLocation.coords.latitude, currentLocation.coords.longitude);
    } catch (err) {
      console.error('Error getting location:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [setValue]);

  const reverseGeocode = async (latitude, longitude) => {
    try {
      const response = await Location.reverseGeocodeAsync({ latitude, longitude });

      if (response[0]) {
        const addressData = response[0];
        const address = {
          city: addressData.city || addressData.subregion || '',
          district: addressData.district || addressData.region || '',
          province: addressData.region || '',
          details: `${addressData.street || ''} ${addressData.name || ''}`.trim(),
        };

        setValue('affected_locations.0.address', address);
      }
    } catch (err) {
      console.error('Error reverse geocoding:', err);
      setError('Failed to get address details');
    }
  };

  const onMapPress = useCallback((e) => {
    const { latitude, longitude } = e.nativeEvent.coordinate;
    setLocation({ latitude, longitude });
    setValue('affected_locations.0.latitude', latitude);
    setValue('affected_locations.0.longitude', longitude);
    reverseGeocode(latitude, longitude);
  }, [setValue]);

  useEffect(() => {
    getCurrentLocation();
  }, [getCurrentLocation]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
        <Text style={{ color: theme.colors.onSurfaceVariant }}>
          Getting location...
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text 
        variant="titleMedium" 
        style={[styles.sectionTitle, { color: theme.colors.onSurface }]}
      >
        Location Details
      </Text>

      {error && (
        <Text style={[styles.errorText, { color: theme.colors.error }]}>
          {error}
        </Text>
      )}

      <View style={styles.mapContainer}>
        {location && (
          <MapView
            style={styles.map}
            initialRegion={{
              latitude: location.latitude,
              longitude: location.longitude,
              latitudeDelta: 0.02,
              longitudeDelta: 0.02,
            }}
            onPress={onMapPress}
          >
            <Marker
              coordinate={{
                latitude: location.latitude,
                longitude: location.longitude,
              }}
            />
          </MapView>
        )}
      </View>

      <View style={styles.addressFields}>
        <Controller
          control={control}
          name="affected_locations.0.address.city"
          render={({ field: { onChange, value } }) => (
            <TextInput
              label="City"
              value={value}
              onChangeText={onChange}
              mode="outlined"
              error={!!errors?.affected_locations?.[0]?.address?.city}
              style={styles.input}
            />
          )}
        />

        <Controller
          control={control}
          name="affected_locations.0.address.district"
          render={({ field: { onChange, value } }) => (
            <TextInput
              label="District"
              value={value}
              onChangeText={onChange}
              mode="outlined"
              error={!!errors?.affected_locations?.[0]?.address?.district}
              style={styles.input}
            />
          )}
        />

        <Controller
          control={control}
          name="affected_locations.0.address.province"
          render={({ field: { onChange, value } }) => (
            <TextInput
              label="Province"
              value={value}
              onChangeText={onChange}
              mode="outlined"
              error={!!errors?.affected_locations?.[0]?.address?.province}
              style={styles.input}
            />
          )}
        />

        <Controller
          control={control}
          name="affected_locations.0.address.details"
          render={({ field: { onChange, value } }) => (
            <TextInput
              label="Additional Details"
              value={value}
              onChangeText={onChange}
              mode="outlined"
              multiline
              numberOfLines={2}
              style={styles.input}
            />
          )}
        />
      </View>

      {errors?.affected_locations && (
        <Text style={[styles.errorText, { color: theme.colors.error }]}>
          {errors.affected_locations.message}
        </Text>
      )}
    </View>
  );
};

WarningLocationPicker.propTypes = {
  control: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
  setValue: PropTypes.func.isRequired,
};

const styles = StyleSheet.create({
  container: {
    gap: 16,
  },
  sectionTitle: {
    marginBottom: 8,
    fontWeight: '500',
  },
  loadingContainer: {
    padding: 20,
    alignItems: 'center',
    gap: 12,
  },
  mapContainer: {
    height: 200,
    borderRadius: 8,
    overflow: 'hidden',
  },
  map: {
    flex: 1,
  },
  addressFields: {
    gap: 12,
  },
  input: {
    backgroundColor: 'transparent',
  },
  errorText: {
    fontSize: 12,
  },
}); 