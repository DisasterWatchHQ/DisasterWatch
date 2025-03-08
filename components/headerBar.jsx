import { View, StyleSheet } from "react-native";
import { Text, IconButton, useTheme, Badge } from "react-native-paper";
import { useRouter } from "expo-router";
import { useState, useEffect } from "react";
import NotificationMenu from "./notifications/NotificationMenu";
import wardash from "../services/wardash";

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

  useEffect(() => {
    if (showBell) {
      fetchUnreadCount();
    }
  }, [showBell]);

  const fetchUnreadCount = async () => {
    try {
      const response = await wardash.get('/notifications/unread-count');
      setUnreadCount(response.data.count);
    } catch (error) {
      console.error('Error fetching unread count:', error);
    }
  };

  return (
    <View style={[styles.container, containerStyle]}>
      <View style={styles.header}>
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
          <Text variant="headlineMedium" style={styles.title}>
            {title}
          </Text>
          {subtitle && (
            <Text variant="bodyMedium" style={styles.subtitle}>
              {subtitle}
            </Text>
          )}
        </View>
        <View style={styles.headerButtons}>
          {showBell && (
            <View style={styles.bellContainer}>
              <IconButton
                icon="bell"
                mode="text"
                size={20}
                onPress={() => setShowNotifications(true)}
                style={styles.actionButton}
              />
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
    borderBottomColor: "#E5E7EB",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: 14,
    color: "#6B7280",
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
