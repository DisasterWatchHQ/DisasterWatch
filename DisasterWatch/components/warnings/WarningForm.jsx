import React, { useState } from 'react';
import { View } from 'react-native';
import { TextInput, Button, SegmentedButtons } from 'react-native-paper';

const WarningForm = ({ onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    disaster_category: '',
    severity: '',
    affected_locations: [{
      address: {
        city: '',
        district: '',
        province: '',
        details: ''
      }
    }]
  });

  const handleSubmit = () => {
    onSubmit({
      ...formData,
      expected_duration: {
        start_time: new Date(),
        end_time: new Date(Date.now() + 24 * 60 * 60 * 1000) 
      }
    });
  };

  return (
    <View style={{ gap: 16 }}>
      <TextInput
        label="Title"
        value={formData.title}
        onChangeText={(text) => setFormData({ ...formData, title: text })}
      />

      <TextInput
        label="Description"
        value={formData.description}
        onChangeText={(text) => setFormData({ ...formData, description: text })}
        multiline
        numberOfLines={4}
      />

      <SegmentedButtons
        value={formData.disaster_category}
        onValueChange={(value) => setFormData({ ...formData, disaster_category: value })}
        buttons={[
          { value: 'flood', label: 'Flood' },
          { value: 'fire', label: 'Fire' },
          { value: 'earthquake', label: 'Earthquake' },
          { value: 'landslide', label: 'Landslide' },
          { value: 'cyclone', label: 'Cyclone' },
        ]}
      />

      <SegmentedButtons
        value={formData.severity}
        onValueChange={(value) => setFormData({ ...formData, severity: value })}
        buttons={[
          { value: 'low', label: 'Low' },
          { value: 'medium', label: 'Medium' },
          { value: 'high', label: 'High' },
          { value: 'critical', label: 'Critical' },
        ]}
      />

      <TextInput
        label="City"
        value={formData.affected_locations[0].address.city}
        onChangeText={(text) => setFormData({
          ...formData,
          affected_locations: [{
            ...formData.affected_locations[0],
            address: { ...formData.affected_locations[0].address, city: text }
          }]
        })}
      />

      <TextInput
        label="District"
        value={formData.affected_locations[0].address.district}
        onChangeText={(text) => setFormData({
          ...formData,
          affected_locations: [{
            ...formData.affected_locations[0],
            address: { ...formData.affected_locations[0].address, district: text }
          }]
        })}
      />

      <TextInput
        label="Province"
        value={formData.affected_locations[0].address.province}
        onChangeText={(text) => setFormData({
          ...formData,
          affected_locations: [{
            ...formData.affected_locations[0],
            address: { ...formData.affected_locations[0].address, province: text }
          }]
        })}
      />

      <View style={{ flexDirection: 'row', justifyContent: 'flex-end', gap: 8 }}>
        <Button mode="outlined" onPress={onCancel}>
          Cancel
        </Button>
        <Button
          mode="contained"
          onPress={handleSubmit}
          disabled={!formData.title || !formData.description || !formData.disaster_category || !formData.severity}
        >
          Create Warning
        </Button>
      </View>
    </View>
  );
};

export default WarningForm;