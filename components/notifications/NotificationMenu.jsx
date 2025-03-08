import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { Portal, Modal, Text, IconButton, useTheme, Badge } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import wardash from '../../services/wardash';

const NotificationMenu = ({ visible, onDismiss }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const theme = useTheme();

  useEffect(() => {
    if (visible) {
      fetchNotifications();
    }
  }, [visible]);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const response = await wardash.get('/notifications');
      setNotifications(response.data);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity?.toLowerCase()) {
      case 'critical':
        return '#DC2626';
      case 'high':
        return '#F87171';
      case 'medium':
        return '#FBBF24';
      case 'low':
        return '#34D399';
      default:
        return theme.colors.primary;
    }
  };

  const formatDate = (dateString) => {
    try {
      if (!dateString) return "Date unavailable";
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        console.error("Invalid date:", dateString);
        return "Date unavailable";
      }
      return date.toLocaleString();
    } catch (error) {
      console.error("Error formatting date:", error);
      return "Date unavailable";
    }
  };

  return (
    <Portal>
      <Modal
        visible={visible}
        onDismiss={onDismiss}
        contentContainerStyle={styles.modalContainer}
      >
        <View style={styles.header}>
          <Text variant="titleLarge">Notifications</Text>
          <IconButton
            icon="close"
            size={24}
            onPress={onDismiss}
            style={styles.closeButton}
          />
        </View>

        <ScrollView style={styles.notificationList}>
          {loading ? (
            <Text style={styles.loadingText}>Loading notifications...</Text>
          ) : notifications.length === 0 ? (
            <Text style={styles.emptyText}>No notifications</Text>
          ) : (
            notifications.map((notification) => (
              <View
                key={notification._id}
                style={[
                  styles.notificationItem,
                  {
                    borderLeftColor: getSeverityColor(notification.severity),
                  },
                ]}
              >
                <View style={styles.notificationHeader}>
                  <Text variant="titleMedium">{notification.title}</Text>
                  <Text variant="bodySmall" style={styles.timestamp}>
                    {formatDate(notification.created_at)}
                  </Text>
                </View>
                <Text variant="bodyMedium" style={styles.message}>
                  {notification.message}
                </Text>
                {notification.affected_locations && (
                  <View style={styles.locationContainer}>
                    <IconButton
                      icon="map-marker"
                      size={16}
                      iconColor={getSeverityColor(notification.severity)}
                    />
                    <Text variant="bodySmall" style={styles.locationText}>
                      {notification.affected_locations[0]?.address?.city}, {notification.affected_locations[0]?.address?.district}
                    </Text>
                  </View>
                )}
              </View>
            ))
          )}
        </ScrollView>
      </Modal>
    </Portal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    backgroundColor: 'white',
    margin: 20,
    borderRadius: 8,
    maxHeight: '80%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  closeButton: {
    margin: 0,
  },
  notificationList: {
    maxHeight: '100%',
  },
  notificationItem: {
    padding: 16,
    borderLeftWidth: 4,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  notificationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  timestamp: {
    color: '#6B7280',
  },
  message: {
    color: '#374151',
    marginBottom: 8,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationText: {
    color: '#6B7280',
    marginLeft: -8,
  },
  loadingText: {
    textAlign: 'center',
    padding: 20,
    color: '#6B7280',
  },
  emptyText: {
    textAlign: 'center',
    padding: 20,
    color: '#6B7280',
  },
});

export default NotificationMenu; 