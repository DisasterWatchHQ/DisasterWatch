import React, { useState, useEffect } from "react";
import { View, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { Text, Switch, useTheme, Divider } from "react-native-paper";
import HeaderBar from "../components/HeaderBar";
import {
  registerForPushNotificationsAsync,
  unregisterPushNotificationsAsync,
  getNotificationSettings,
  updateNotificationSettings,
  NOTIFICATION_CATEGORIES,
} from "../api/services/notifications";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useUser } from "../context/UserContext";

const Settings = () => {
  const [notificationSettings, setNotificationSettings] = useState({
    enabled: false,
    categories: {
      warning: true,
      report: true,
      system: true,
    },
    sound: true,
    vibration: true,
  });
  const { user } = useUser();
  const theme = useTheme();

  useEffect(() => {
    loadNotificationSettings();
  }, []);

  const loadNotificationSettings = async () => {
    try {
      const settings = await getNotificationSettings();
      if (settings) {
        setNotificationSettings(settings);
      }
    } catch (error) {
      console.error("Error loading notification settings:", error);
    }
  };

  const handleProfilePress = () => {
    if (!user) {
      router.push("/(auth)/signIn");
      return;
    }
    router.push("/profile");
  };

  const toggleNotifications = async () => {
    try {
      const newValue = !notificationSettings.enabled;
      const updatedSettings = {
        ...notificationSettings,
        enabled: newValue,
      };

      setNotificationSettings(updatedSettings);
      await updateNotificationSettings(updatedSettings);

      if (newValue) {
        await registerForPushNotificationsAsync();
      } else {
        await unregisterPushNotificationsAsync();
      }
    } catch (error) {
      console.error("Error toggling notifications:", error);
    }
  };

  const toggleCategory = async (category) => {
    try {
      const updatedSettings = {
        ...notificationSettings,
        categories: {
          ...notificationSettings.categories,
          [category]: !notificationSettings.categories[category],
        },
      };

      setNotificationSettings(updatedSettings);
      await updateNotificationSettings(updatedSettings);
    } catch (error) {
      console.error("Error toggling notification category:", error);
    }
  };

  const toggleSound = async () => {
    try {
      const updatedSettings = {
        ...notificationSettings,
        sound: !notificationSettings.sound,
      };

      setNotificationSettings(updatedSettings);
      await updateNotificationSettings(updatedSettings);
    } catch (error) {
      console.error("Error toggling notification sound:", error);
    }
  };

  const toggleVibration = async () => {
    try {
      const updatedSettings = {
        ...notificationSettings,
        vibration: !notificationSettings.vibration,
      };

      setNotificationSettings(updatedSettings);
      await updateNotificationSettings(updatedSettings);
    } catch (error) {
      console.error("Error toggling notification vibration:", error);
    }
  };

  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <HeaderBar title="Settings" showBack={true} />
      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <Text variant="titleMedium" style={styles.sectionTitle}>
            Account
          </Text>
          <TouchableOpacity
            style={styles.settingItem}
            onPress={handleProfilePress}
          >
            <View style={styles.settingItemContent}>
              <MaterialCommunityIcons
                name="account"
                size={24}
                color={theme.colors.primary}
              />
              <Text variant="bodyLarge">Profile Settings</Text>
            </View>
            <MaterialCommunityIcons
              name="chevron-right"
              size={24}
              color={theme.colors.onSurfaceVariant}
            />
          </TouchableOpacity>
        </View>

        <Divider style={styles.divider} />

        <View style={styles.section}>
          <Text variant="titleMedium" style={styles.sectionTitle}>
            Notifications
          </Text>
          <View style={styles.settingItem}>
            <Text variant="bodyLarge">Enable Notifications</Text>
            <Switch
              value={notificationSettings.enabled}
              onValueChange={toggleNotifications}
            />
          </View>

          {notificationSettings.enabled && (
            <>
              <View style={styles.settingItem}>
                <Text variant="bodyLarge">Warning Notifications</Text>
                <Switch
                  value={notificationSettings.categories.warning}
                  onValueChange={() => toggleCategory("warning")}
                />
              </View>
              <View style={styles.settingItem}>
                <Text variant="bodyLarge">Report Notifications</Text>
                <Switch
                  value={notificationSettings.categories.report}
                  onValueChange={() => toggleCategory("report")}
                />
              </View>
              <View style={styles.settingItem}>
                <Text variant="bodyLarge">System Notifications</Text>
                <Switch
                  value={notificationSettings.categories.system}
                  onValueChange={() => toggleCategory("system")}
                />
              </View>
              <View style={styles.settingItem}>
                <Text variant="bodyLarge">Sound</Text>
                <Switch
                  value={notificationSettings.sound}
                  onValueChange={toggleSound}
                />
              </View>
              <View style={styles.settingItem}>
                <Text variant="bodyLarge">Vibration</Text>
                <Switch
                  value={notificationSettings.vibration}
                  onValueChange={toggleVibration}
                />
              </View>
            </>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  section: {
    padding: 16,
  },
  sectionTitle: {
    marginBottom: 16,
    fontWeight: "bold",
  },
  settingItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
  },
  settingItemContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  divider: {
    marginVertical: 8,
  },
});

export default Settings;
