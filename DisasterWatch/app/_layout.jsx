import { StatusBar } from "expo-status-bar";
import { Text, View, Platform } from "react-native";
import React from "react";
import { SplashScreen, Stack } from "expo-router";
import { useFonts } from "expo-font";
import { useEffect } from "react";
import "../global.css";
import { UserProvider } from "../constants/globalProvider";
import {
  Provider as PaperProvider,
  MD3LightTheme as DefaultTheme,
} from "react-native-paper";
import * as Notifications from "expo-notifications";
import Geocoder from "react-native-geocoding";

// Configure notifications
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

Geocoder.init(process.env.GMAPS_API_KEY)
SplashScreen.preventAutoHideAsync();



const RootLayout = () => {
  const [fontsLoaded, error] = useFonts({
    "Poppins-Regular": require("../assets/fonts/Poppins-Regular.ttf"),
    "Poppins-Black": require("../assets/fonts/Poppins-Black.ttf"),
    "Poppins-Bold": require("../assets/fonts/Poppins-Bold.ttf"),
    "Poppins-ExtraBold": require("../assets/fonts/Poppins-ExtraBold.ttf"),
    "Poppins-ExtraLight": require("../assets/fonts/Poppins-ExtraLight.ttf"),
    "Poppins-Light": require("../assets/fonts/Poppins-Light.ttf"),
    "Poppins-Medium": require("../assets/fonts/Poppins-Medium.ttf"),
    "Poppins-SemiBold": require("../assets/fonts/Poppins-SemiBold.ttf"),
    "Poppins-Thin": require("../assets/fonts/Poppins-Thin.ttf"),
  });

  useEffect(() => {
    if (error) throw error;

    if (fontsLoaded) SplashScreen.hideAsync();
  }, [fontsLoaded, error]);

  // Setup notifications
  useEffect(() => {
    const setupNotifications = async () => {
      // Create notification channel for Android
      if (Platform.OS === "android") {
        await Notifications.setNotificationChannelAsync("default", {
          name: "Default",
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: "#FF231F7C",
        });

        // Create a channel specifically for disaster alerts
        await Notifications.setNotificationChannelAsync("disaster-alerts", {
          name: "Disaster Alerts",
          importance: Notifications.AndroidImportance.HIGH,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: "#FF0000",
          sound: "default",
          enableVibrate: true,
          showBadge: true,
        });
      }

      // Request notification permissions
      const { status: existingStatus } =
        await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync({
          ios: {
            allowAlert: true,
            allowBadge: true,
            allowSound: true,
            allowAnnouncements: true,
          },
        });
        finalStatus = status;
      }

      if (finalStatus !== "granted") {
        console.log("Failed to get push notification permissions");
        return;
      }

      // Set up notification listeners
      const subscription = Notifications.addNotificationReceivedListener(
        (notification) => {
          console.log("Notification received:", notification);
        },
      );

      const responseSubscription =
        Notifications.addNotificationResponseReceivedListener((response) => {
          console.log("Notification response received:", response);
          // Handle notification interaction here
        });

      return () => {
        subscription.remove();
        responseSubscription.remove();
      };
    };

    setupNotifications();
  }, []);

  const theme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      primary: "#007AFF", // or your preferred primary color
      // customize other colors as needed
    },
  };

  if (!fontsLoaded && !error) return null;


  return (
    <PaperProvider theme={theme}>
      <UserProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="Landingpage" />
          <Stack.Screen name="(auth)" />
          <Stack.Screen name="profile" />
        </Stack>
      </UserProvider>
      <StatusBar style="auto" />
    </PaperProvider>
  );
};

export default RootLayout;