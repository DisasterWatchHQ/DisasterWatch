import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import Constants from "expo-constants";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const API_URL = process.env.EXPO_PUBLIC_API_URL || "http://localhost:3000";

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add auth token to requests
apiClient.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Configure notification behavior
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

// Configure notification categories
const NOTIFICATION_CATEGORIES = {
  WARNING: 'warning',
  REPORT: 'report',
  SYSTEM: 'system',
};

// Configure notification sounds
const NOTIFICATION_SOUNDS = {
  warning: 'warning.mp3',
  report: 'report.mp3',
  system: 'system.mp3',
};

export async function registerForPushNotificationsAsync() {
  let token;

  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      console.error('Failed to get push token for push notification!');
      return;
    }

    token = await Notifications.getExpoPushTokenAsync({
      projectId: Constants.expoConfig.extra.eas.projectId,
    });

    try {
      await apiClient.patch('/users/push-token', {
        pushToken: token.data,
      });
      
      // Store the token locally
      await AsyncStorage.setItem('pushToken', token.data);
      
      return token.data;
    } catch (error) {
      console.error('Error registering push token:', error);
      throw error;
    }
  }

  return null;
}

export async function unregisterPushNotificationsAsync() {
  try {
    const token = await AsyncStorage.getItem('pushToken');
    if (token) {
      await apiClient.patch('/users/push-token', {
        pushToken: null,
      });
      await AsyncStorage.removeItem('pushToken');
    }
  } catch (error) {
    console.error('Error unregistering push token:', error);
    throw error;
  }
}

export function addNotificationReceivedListener(callback) {
  return Notifications.addNotificationReceivedListener(callback);
}

export function addNotificationResponseReceivedListener(callback) {
  return Notifications.addNotificationResponseReceivedListener(callback);
}

export function removeNotificationSubscription(subscription) {
  Notifications.removeNotificationSubscription(subscription);
}

export async function getNotificationSettings() {
  try {
    const settings = await AsyncStorage.getItem('notificationSettings');
    return settings ? JSON.parse(settings) : {
      enabled: false,
      categories: {
        warning: true,
        report: true,
        system: true,
      },
      sound: true,
      vibration: true,
    };
  } catch (error) {
    console.error('Error getting notification settings:', error);
    return null;
  }
}

export async function updateNotificationSettings(settings) {
  try {
    await AsyncStorage.setItem('notificationSettings', JSON.stringify(settings));
  } catch (error) {
    console.error('Error updating notification settings:', error);
    throw error;
  }
}

export { NOTIFICATION_CATEGORIES, NOTIFICATION_SOUNDS };