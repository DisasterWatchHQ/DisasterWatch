import React from 'react';
import { View, StyleSheet } from 'react-native';
import { TextInput, SegmentedButtons, Text, useTheme } from 'react-native-paper';
import PropTypes from 'prop-types';

/**
 * @typedef {Object} WarningFormFieldsProps
 * @property {Object} control - React Hook Form control object
 * @property {Object} errors - Form validation errors
 */

/**
 * Component for warning form input fields
 * @param {WarningFormFieldsProps} props
 */
const WarningFormFields = ({ control, errors }) => {
  const theme = useTheme();

  const disasterCategories = [
    { label: 'Flood', value: 'flood' },
    { label: 'Fire', value: 'fire' },
    { label: 'Earthquake', value: 'earthquake' },
    { label: 'Landslide', value: 'landslide' },
    { label: 'Cyclone', value: 'cyclone' },
  ];

  const severityLevels = [
    { label: 'Low', value: 'low' },
    { label: 'Medium', value: 'medium' },
    { label: 'High', value: 'high' },
    { label: 'Critical', value: 'critical' },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.section}>
        <Text 
          variant="titleMedium" 
          style={[styles.sectionTitle, { color: theme.colors.onSurface }]}
        >
          Basic Information
        </Text>
        
        <Controller
          control={control}
          name="title"
          render={({ field: { onChange, value } }) => (
            <TextInput
              label="Warning Title"
              value={value}
              onChangeText={onChange}
              mode="outlined"
              error={!!errors.title}
              style={styles.input}
              placeholder="Enter a clear, descriptive title"
            />
          )}
        />
        {errors.title && (
          <Text style={[styles.errorText, { color: theme.colors.error }]}>
            {errors.title.message}
          </Text>
        )}

        <Controller
          control={control}
          name="description"
          render={({ field: { onChange, value } }) => (
            <TextInput
              label="Description"
              value={value}
              onChangeText={onChange}
              mode="outlined"
              multiline
              numberOfLines={4}
              error={!!errors.description}
              style={styles.input}
              placeholder="Provide detailed information about the warning"
            />
          )}
        />
        {errors.description && (
          <Text style={[styles.errorText, { color: theme.colors.error }]}>
            {errors.description.message}
          </Text>
        )}
      </View>

      <View style={styles.section}>
        <Text 
          variant="titleMedium" 
          style={[styles.sectionTitle, { color: theme.colors.onSurface }]}
        >
          Category & Severity
        </Text>
        
        <Text style={[styles.label, { color: theme.colors.onSurfaceVariant }]}>
          Disaster Category
        </Text>
        <Controller
          control={control}
          name="disaster_category"
          render={({ field: { onChange, value } }) => (
            <SegmentedButtons
              value={value}
              onValueChange={onChange}
              buttons={disasterCategories}
              style={styles.segmentedButton}
            />
          )}
        />
        {errors.disaster_category && (
          <Text style={[styles.errorText, { color: theme.colors.error }]}>
            {errors.disaster_category.message}
          </Text>
        )}

        <Text 
          style={[styles.label, { color: theme.colors.onSurfaceVariant }]}
        >
          Severity Level
        </Text>
        <Controller
          control={control}
          name="severity"
          render={({ field: { onChange, value } }) => (
            <SegmentedButtons
              value={value}
              onValueChange={onChange}
              buttons={severityLevels}
              style={styles.segmentedButton}
            />
          )}
        />
        {errors.severity && (
          <Text style={[styles.errorText, { color: theme.colors.error }]}>
            {errors.severity.message}
          </Text>
        )}
      </View>
    </View>
  );
};

WarningFormFields.propTypes = {
  control: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
};

const styles = StyleSheet.create({
  container: {
    gap: 24,
  },
  section: {
    gap: 12,
  },
  sectionTitle: {
    marginBottom: 8,
    fontWeight: '500',
  },
  input: {
    backgroundColor: 'transparent',
  },
  label: {
    fontSize: 14,
    marginBottom: 8,
  },
  segmentedButton: {
    marginBottom: 8,
  },
  errorText: {
    fontSize: 12,
    marginTop: -8,
  },
});

export default WarningFormFields; 