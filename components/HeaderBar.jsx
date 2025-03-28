import { View, StyleSheet } from "react-native";
import { Text, IconButton, useTheme, Badge, ActivityIndicator } from "react-native-paper";
import { useRouter } from "expo-router";
import { useState, useEffect, useCallback } from "react";
import PropTypes from 'prop-types';
import NotificationMenu from "./notifications/NotificationMenu";
import * as Notifications from "expo-notifications";

/**
 * @typedef {Object} HeaderBarProps
 * @property {boolean} [showBack=false] - Whether to show back button
 * @property {boolean} [showBell=true] - Whether to show notification bell
 * @property {boolean} [showCog=true] - Whether to show settings cog
 * @property {string} [title="DisasterWatch"] - Header title
 * @property {string} [subtitle] - Optional subtitle
 * @property {Object} [containerStyle] - Additional container styles
 */

/**
 * Header bar component with navigation and notification controls
 * @param {HeaderBarProps} props
 */
const HeaderBar = ({
  showBack = false,
  showBell = true, 
  showCog = true,
  title = "DisasterWatch",
  subtitle,
  containerStyle,
}) => {
  const router = useRouter();
  const theme = useTheme();
  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const getBadgeCount = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const count = await Notifications.getBadgeCountAsync();
      setUnreadCount(count);
    } catch (error) {
      console.error('Error getting badge count:', error);
      setError('Failed to get notification count');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (showBell) {
      // Get initial badge count
      getBadgeCount();
      
      // Listen for notification changes
      const subscription = Notifications.addNotificationReceivedListener(() => {
        setUnreadCount(prev => prev + 1);
      });

      return () => {
        subscription.remove();
      };
    }
  }, [showBell, getBadgeCount]);

  const handleNotificationPress = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      setShowNotifications(true);
      await Notifications.setBadgeCountAsync(0);
      setUnreadCount(0);
    } catch (error) {
      console.error('Error resetting badge count:', error);
      setError('Failed to clear notifications');
    } finally {
      setIsLoading(false);
    }
  }, []);

  return (
    <View style={[styles.container, containerStyle]}>
      <View style={[styles.header, { borderBottomColor: theme.colors.outline }]}>
        <View>
          {showBack && (
            <IconButton
              icon="arrow-left"
              mode="text"
              size={20}
              onPress={() => router.back()}
              style={styles.backButton}
            />
          )}
          <Text 
            variant="headlineMedium" 
            style={[styles.title, { color: theme.colors.onSurface }]}
          >
            {title}
          </Text>
          {subtitle && (
            <Text 
              variant="bodyMedium" 
              style={[styles.subtitle, { color: theme.colors.onSurfaceVariant }]}
            >
              {subtitle}
            </Text>
          )}
          {error && (
            <Text 
              variant="bodySmall" 
              style={[styles.error, { color: theme.colors.error }]}
            >
              {error}
            </Text>
          )}
        </View>
        <View style={styles.headerButtons}>
          {showBell && (
            <View style={styles.bellContainer}>
              {isLoading ? (
                <ActivityIndicator size={20} style={styles.actionButton} />
              ) : (
                <IconButton
                  icon="bell"
                  mode="text"
                  size={20}
                  onPress={handleNotificationPress}
                  style={styles.actionButton}
                  disabled={isLoading}
                />
              )}
              {unreadCount > 0 && (
                <Badge
                  size={20}
                  style={[styles.badge, { backgroundColor: theme.colors.error }]}
                >
                  {unreadCount}
                </Badge>
              )}
            </View>
          )}
          {showCog && (
            <IconButton
              icon="cog"
              mode="text"
              size={20}
              onPress={() => router.push("/settings")}
              style={styles.actionButton}
            />
          )}
        </View>
      </View>

      <NotificationMenu
        visible={showNotifications}
        onDismiss={() => setShowNotifications(false)}
      />
    </View>
  );
};

HeaderBar.propTypes = {
  showBack: PropTypes.bool,
  showBell: PropTypes.bool,
  showCog: PropTypes.bool,
  title: PropTypes.string,
  subtitle: PropTypes.string,
  containerStyle: PropTypes.object,
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
  },
  header: {
    padding: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: 14,
  },
  error: {
    fontSize: 12,
    marginTop: 4,
  },
  headerButtons: {
    flexDirection: "row",
    gap: 4,
  },
  actionButton: {
    margin: 0,
    width: 32,
    height: 32,
  },
  backButton: {
    margin: 0,
  },
  bellContainer: {
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: 0,
    right: 0,
    zIndex: 1,
  },
});

export default HeaderBar;
