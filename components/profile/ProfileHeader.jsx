import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Avatar, Text, useTheme } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const ProfileHeader = ({ user }) => {
  const theme = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.surface }]}>
      <View style={styles.avatarContainer}>
        <Avatar.Image
          size={80}
          source={user?.avatar ? { uri: user.avatar } : require('../../assets/default-avatar.png')}
          style={styles.avatar}
        />
      </View>
      <View style={styles.infoContainer}>
        <Text variant="headlineSmall" style={styles.name}>
          {user?.name || 'User Name'}
        </Text>
        <Text variant="bodyLarge" style={styles.email}>
          {user?.email || 'user@example.com'}
        </Text>
      </View>
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <MaterialCommunityIcons name="map-marker" size={24} color={theme.colors.primary} />
          <Text variant="bodyMedium" style={styles.statText}>
            {user?.location ? `${user.location.latitude}, ${user.location.longitude}` : 'Location not set'}
          </Text>
        </View>
        <View style={styles.statItem}>
          <MaterialCommunityIcons name="office-building" size={24} color={theme.colors.primary} />
          <Text variant="bodyMedium" style={styles.statText}>
            {user?.organization || 'Not specified'}
          </Text>
        </View>
        <View style={styles.statItem}>
          <MaterialCommunityIcons name="calendar" size={24} color={theme.colors.primary} />
          <Text variant="bodyMedium" style={styles.statText}>
            Joined {user?.joinDate || 'Recently'}
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    borderRadius: 12,
    margin: 16,
    elevation: 2,
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  avatar: {
    backgroundColor: '#f0f0f0',
  },
  infoContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  name: {
    fontWeight: 'bold',
    marginBottom: 4,
  },
  email: {
    opacity: 0.7,
  },
  statsContainer: {
    gap: 12,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statText: {
    flex: 1,
  },
});

export default ProfileHeader;