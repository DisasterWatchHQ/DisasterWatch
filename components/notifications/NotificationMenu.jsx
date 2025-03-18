import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Portal, Modal, Text, useTheme, IconButton, Divider } from 'react-native-paper';
import { useRouter } from 'expo-router';

const NotificationMenu = ({ visible, onDismiss, notifications = [], onNotificationRead }) => {
  const theme = useTheme();
  const router = useRouter();

  const handleNotificationPress = (notification) => {
    if (!notification.read) {
      onNotificationRead(notification.id);
    }

    // Handle navigation based on notification type
    if (notification.data?.type === 'warning') {
      router.navigate('(tabs)', {
        screen: 'home',
        params: {
          showWarning: true,
          warningId: notification.data.warningId
        }
      });
    } else if (notification.data?.type === 'report') {
      router.navigate('(tabs)', {
        screen: 'report',
        params: {
          reportId: notification.data.reportId
        }
      });
    }
    onDismiss();
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;
    
    // Less than 1 minute
    if (diff < 60000) {
      return 'Just now';
    }
    // Less than 1 hour
    if (diff < 3600000) {
      const minutes = Math.floor(diff / 60000);
      return `${minutes}m ago`;
    }
    // Less than 1 day
    if (diff < 86400000) {
      const hours = Math.floor(diff / 3600000);
      return `${hours}h ago`;
    }
    // Less than 1 week
    if (diff < 604800000) {
      const days = Math.floor(diff / 86400000);
      return `${days}d ago`;
    }
    // Otherwise, show the date
    return date.toLocaleDateString();
  };

  return (
    <Portal>
      <Modal
        visible={visible}
        onDismiss={onDismiss}
        contentContainerStyle={[styles.modal, { backgroundColor: theme.colors.background }]}
      >
        <View style={styles.header}>
          <Text variant="titleLarge">Notifications</Text>
          <IconButton
            icon="close"
            size={20}
            onPress={onDismiss}
            style={styles.closeButton}
          />
        </View>
        <Divider />
        <ScrollView style={styles.content}>
          {notifications.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text variant="bodyLarge" style={styles.emptyText}>
                No notifications
              </Text>
            </View>
          ) : (
            notifications.map((notification) => (
              <View
                key={notification.id}
                style={[
                  styles.notificationItem,
                  !notification.read && styles.unreadNotification,
                ]}
                onTouchEnd={() => handleNotificationPress(notification)}
              >
                <View style={styles.notificationContent}>
                  <Text variant="titleMedium" style={styles.notificationTitle}>
                    {notification.title}
                  </Text>
                  <Text variant="bodyMedium" style={styles.notificationBody}>
                    {notification.body}
                  </Text>
                  <Text variant="bodySmall" style={styles.timestamp}>
                    {formatTimestamp(notification.timestamp)}
                  </Text>
                </View>
                {!notification.read && (
                  <View style={[styles.unreadDot, { backgroundColor: theme.colors.primary }]} />
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
  modal: {
    margin: 20,
    borderRadius: 8,
    maxHeight: '80%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  closeButton: {
    margin: 0,
  },
  content: {
    maxHeight: '100%',
  },
  emptyContainer: {
    padding: 32,
    alignItems: 'center',
  },
  emptyText: {
    opacity: 0.6,
  },
  notificationItem: {
    flexDirection: 'row',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  unreadNotification: {
    backgroundColor: '#F3F4F6',
  },
  notificationContent: {
    flex: 1,
  },
  notificationTitle: {
    fontWeight: '600',
    marginBottom: 4,
  },
  notificationBody: {
    opacity: 0.8,
    marginBottom: 4,
  },
  timestamp: {
    opacity: 0.6,
    fontSize: 12,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginLeft: 8,
    alignSelf: 'center',
  },
});

export default NotificationMenu; 