import { StatusBar } from "expo-status-bar";
import React, { useEffect, useRef } from "react";
import { SplashScreen, Stack } from "expo-router";
import { useFonts } from "expo-font";
import "../global.css";
import { UserProvider } from "../context/UserContext";
import {
  Provider,
  MD3LightTheme,
  PaperProvider,
} from "react-native-paper";
import Geocoder from "react-native-geocoding";
import { 
  addNotificationReceivedListener,
  addNotificationResponseReceivedListener,
  removeNotificationSubscription,
  getNotificationSettings
} from "../api/services/notifications";
import { useRouter } from "expo-router";
import { NetworkProvider } from '../context/NetworkContext';
import OfflineIndicator from '../components/OfflineIndicator';
import syncService from '../api/utils/syncService';
import NetInfo from '@react-native-community/netinfo';

Geocoder.init(process.env.GMAPS_API_KEY);
SplashScreen.preventAutoHideAsync();

const theme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: '#2196F3',
    secondary: '#03DAC6',
  }
};

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
        });

        // Handle notification response (when user taps notification)
        responseListener.current = addNotificationResponseReceivedListener(response => {
          const data = response.notification.request.content.data;

          // Handle navigation based on notification type with proper routing
          if (data.type === 'warning') {
            router.navigate('(tabs)', {
              screen: 'home',
              params: {
                showWarning: true,
                warningId: data.warningId
              }
            });
          } else if (data.type === 'report') {
            router.navigate('(tabs)', {
              screen: 'report',
              params: {
                reportId: data.reportId
              }
            });
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
        <UserProvider>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen 
              name="(auth)" 
              options={{
                animation: 'fade',
              }}
            />
            <Stack.Screen 
              name="(tabs)" 
              options={{
                animation: 'fade',
              }}
            />
            <Stack.Screen name="index" />
            <Stack.Screen 
              name="Dashboard" 
              options={{
                animation: 'slide_from_bottom',
                presentation: 'modal'
              }}
            />
          </Stack>
        </UserProvider>
      </PaperProvider>
    </NetworkProvider>
  );
};

export default RootLayout;
