import { StatusBar } from "expo-status-bar";
import React, { useState, useEffect, useRef } from "react";
import { SplashScreen, Stack } from "expo-router";
import { useFonts } from "expo-font";
import "../global.css";
import { UserProvider } from "../constants/globalProvider";
import {
  Provider,
  MD3LightTheme,
  MD3DarkTheme,
  PaperProvider,
  adaptNavigationTheme,
} from "react-native-paper";
import Geocoder from "react-native-geocoding";
import { PreferencesProvider } from "../context/PreferencesContext";
import { 
  addNotificationReceivedListener,
  addNotificationResponseReceivedListener,
  removeNotificationSubscription,
  getNotificationSettings
} from "../services/notifications";
import { useRouter } from "expo-router";
import { NetworkProvider } from '../context/NetworkContext';
import OfflineIndicator from '../components/OfflineIndicator';
import syncService from '../services/syncService';
import NetInfo from '@react-native-community/netinfo';

export const PreferencesContext = React.createContext();

Geocoder.init(process.env.GMAPS_API_KEY);
SplashScreen.preventAutoHideAsync();

const RootLayout = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };
  const theme = isDarkMode ? MD3DarkTheme : MD3LightTheme;

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

  const router = useRouter();
  const notificationListener = useRef();
  const responseListener = useRef();

  useEffect(() => {
    if (error) throw error;
    if (fontsLoaded) {
      SplashScreen.hideAsync();
      initializeApp();
    }
    setupNotifications();
    return () => {
      if (notificationListener.current) {
        removeNotificationSubscription(notificationListener.current);
      }
      if (responseListener.current) {
        removeNotificationSubscription(responseListener.current);
      }
    };
  }, [fontsLoaded, error, router]);

  const initializeApp = async () => {
    try {
      // Check network status
      const networkState = await NetInfo.fetch();
      
      // If online, perform initial sync
      if (networkState.isConnected && networkState.isInternetReachable) {
        const shouldSync = await syncService.shouldSync();
        if (shouldSync) {
          await syncService.syncData();
        }
      }
    } catch (error) {
      console.error('Error initializing app:', error);
    }
  };

  const setupNotifications = async () => {
    try {
      const settings = await getNotificationSettings();
      if (settings?.enabled) {
        // Handle notifications received while app is foregrounded
        notificationListener.current = addNotificationReceivedListener(notification => {
          console.log('Notification received:', notification);
        });

        // Handle notification response (when user taps notification)
        responseListener.current = addNotificationResponseReceivedListener(response => {
          const data = response.notification.request.content.data;
          console.log('Notification response:', data);

          // Handle navigation based on notification type
          if (data.type === 'warning') {
            router.push('/dashboard');
          } else if (data.type === 'report') {
            router.push('/report');
          }
        });
      }
    } catch (error) {
      console.error('Error setting up notifications:', error);
    }
  };

  if (!fontsLoaded && !error) return null;

  return (
    <NetworkProvider>
      <PaperProvider theme={theme}>
        <StatusBar style="auto" />
        <OfflineIndicator />
        <PreferencesContext.Provider value={{ isDarkMode, toggleTheme }}>
          <PreferencesProvider>
            <UserProvider>
              <Stack screenOptions={{ headerShown: false }}>
                <Stack.Screen name="index" />
                <Stack.Screen name="(tabs)" />
                <Stack.Screen name="(auth)" />
                <Stack.Screen name="profile" />
                <Stack.Screen name="settings" />
                <Stack.Screen name="Dashboard" />
              </Stack>
            </UserProvider>
          </PreferencesProvider>
        </PreferencesContext.Provider>
      </PaperProvider>
    </NetworkProvider>
  );
};

export default RootLayout;
