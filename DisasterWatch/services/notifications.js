import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import Constants from "expo-constants";
import axios from "axios";
const BASE_URL = process.env.REACT_APP_API_URL;

const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});


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
      alert('Failed to get push token for push notification!');
      return;
    }

    token = await Notifications.getExpoPushTokenAsync();
    console.log("Push Token:", token.data);

    try {
      await axios.post('YOUR_RENDER_URL/api/notifications/register-push-token', {
        pushToken: token.data
      }, {
        withCredentials: true
      });
    } catch (error) {
      console.error('Error registering push token:', error);
    }
  }

  return token;
}