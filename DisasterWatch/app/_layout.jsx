import { StatusBar } from 'expo-status-bar';
import { Text, View } from 'react-native';
import React from 'react';
import { SplashScreen, Stack } from 'expo-router';
import { useFonts } from 'expo-font';
import { useEffect } from 'react';
import '../global.css';
import { UserProvider } from '../constants/globalProvider';

SplashScreen.preventAutoHideAsync();

const RootLayout = () => {
  
  const [fontsLoaded, error] = useFonts({
    "Poppins-Regular": require('../assets/fonts/Poppins-Regular.ttf'),
    "Poppins-Black": require('../assets/fonts/Poppins-Black.ttf'),
    "Poppins-Bold": require('../assets/fonts/Poppins-Bold.ttf'),
    "Poppins-ExtraBold": require('../assets/fonts/Poppins-ExtraBold.ttf'),
    "Poppins-ExtraLight": require('../assets/fonts/Poppins-ExtraLight.ttf'),
    "Poppins-Light": require('../assets/fonts/Poppins-Light.ttf'),
    "Poppins-Medium": require('../assets/fonts/Poppins-Medium.ttf'),
    "Poppins-SemiBold": require('../assets/fonts/Poppins-SemiBold.ttf'),
    "Poppins-Thin": require('../assets/fonts/Poppins-Thin.ttf'),
  });
  
  useEffect(() => {
    if(error) throw error;
    
    if(fontsLoaded) SplashScreen.hideAsync();
  }, [fontsLoaded, error]);
  
  if(!fontsLoaded && !error) return null;
  
  return (
    <UserProvider>
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="Landingpage" options={{ headerShown: false }} />
    </Stack>
    </UserProvider>
  )
};

export default RootLayout;
