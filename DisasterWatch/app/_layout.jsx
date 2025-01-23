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