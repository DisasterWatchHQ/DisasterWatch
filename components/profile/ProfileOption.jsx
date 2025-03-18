import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const ProfileOption = ({ icon, title, onPress, danger }) => {
  const theme = useTheme();

  return (
    <TouchableOpacity
      style={[
        styles.container,
        { backgroundColor: theme.colors.surface }
      ]}
      onPress={onPress}
    >
      <View style={styles.content}>
        <MaterialCommunityIcons
          name={icon}
          size={24}
          color={danger ? theme.colors.error : theme.colors.primary}
        />
        <Text
          variant="bodyLarge"
          style={[
            styles.title,
            { color: danger ? theme.colors.error : theme.colors.onSurface }
          ]}
        >
          {title}
        </Text>
      </View>
      <MaterialCommunityIcons
        name="chevron-right"
        size={24}
        color={danger ? theme.colors.error : theme.colors.onSurfaceVariant}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 4,
    borderRadius: 12,
    elevation: 1,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  title: {
    fontWeight: '500',
  },
});

export default ProfileOption;