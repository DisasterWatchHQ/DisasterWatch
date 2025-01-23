import React, { useState, useCallback } from "react";
import { router } from "expo-router";
import { View, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  Text,
  Card,
  Button,
  ActivityIndicator,
  useTheme,
  Appbar,
  Portal,
  Dialog,
  IconButton,
  Chip,
  Surface,
} from "react-native-paper";
import HeaderBar from "../components/headerBar";

const warningData = [
  {
    id: "1",
    type: "alert",
    text: "Flood broke out nearby",
    severity: "high",
    timestamp: new Date(),
  },
  {
    id: "2",
    type: "alert",
    text: "Heavy rainfall expected",
    severity: "medium",
    timestamp: new Date(),
  },
  {
    id: "3",
    type: "warning",
    text: "Possible landslide risk",
    severity: "high",
    timestamp: new Date(),
  },
  {
    id: "4",
    type: "warning",
    text: "Strong winds expected",
    severity: "low",
    timestamp: new Date(),
  },
];
const LandingPage = () => {
  const theme = useTheme();
  const [warnings, setWarnings] = useState(warningData);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [emergencyDialogVisible, setEmergencyDialogVisible] = useState(false);

  const handleEmergency = useCallback(() => {
    setEmergencyDialogVisible(true);
  }, []);