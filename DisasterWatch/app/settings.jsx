import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import { Text, Switch, useTheme } from "react-native-paper";
import HeaderBar from "../components/headerBar";
import { registerForPushNotificationsAsync } from "../services/notifications";
import AsyncStorage from "@react-native-async-storage/async-storage";
// import { PreferencesContext } from "../context/PreferencesContext";
import { PreferencesContext } from '../app/_layout';

const Settings = () => {
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const { isDarkMode, toggleTheme } = React.useContext(PreferencesContext);
  const theme = useTheme();

  const toggleNotifications = async () => {
    try {
      const newValue = !notificationsEnabled;
      setNotificationsEnabled(newValue);
      await AsyncStorage.setItem(
        "notificationsEnabled",
        JSON.stringify(newValue),
      );

      if (newValue) {
        await registerForPushNotificationsAsync();
      }
    } catch (error) {
      console.error("Error toggling notifications:", error);
    }
  };

  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <HeaderBar title="Settings" showBack={true} />
      <View style={styles.content}>
        <View style={styles.settingItem}>
          <Text variant="bodyLarge">Dark Mode</Text>
          <Switch value={isDarkMode} onValueChange={toggleTheme} />
        </View>
        <View
          style={[
            styles.settingItem,
            { borderBottomColor: theme.colors.outline },
          ]}
        >
          <Text variant="bodyLarge">Notifications</Text>
          <Switch
            value={notificationsEnabled}
            onValueChange={toggleNotifications}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  settingItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
});

export default Settings;
