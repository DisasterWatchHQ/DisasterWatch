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

  const navigationButtons = [
    {
      title: "Emergency",
      color: theme.colors.error,
      onPress: handleEmergency,
      icon: "alert-octagon", // More distinct emergency icon
      description: "Report Emergency",
    },
    {
      title: "Map",
      color: theme.colors.primary, // Changed from warning to primary
      onPress: () => router.push("/(tabs)/map"), // Update this route as needed
      icon: "map",
      description: "View Disaster Map",
    },
    {
      title: "Dashboard",
      color: theme.colors.tertiary, // Changed from success to tertiary
      onPress: () => router.push("/(tabs)/home"),
      icon: "view-dashboard",
      description: "View Statistics",
    },
  ];
  const WarningCard = ({ warning }) => (
    <Card
      mode="outlined"
      style={{ marginBottom: 12 }}
      onPress={() => handleWarningPress(warning)}
    >
      <Card.Content>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <View style={{ flex: 1 }}>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginBottom: 8,
              }}
            >
              <IconButton
                icon={warning.type === "alert" ? "alert-circle" : "alert"}
                size={24}
                iconColor={getSeverityColor(warning.severity)}
              />
              <Chip
                mode="outlined"
                textStyle={{ color: getSeverityColor(warning.severity) }}
                style={{ borderColor: getSeverityColor(warning.severity) }}
              >
                {warning.severity.toUpperCase()}
              </Chip>
            </View>
            <Text variant="titleMedium">{warning.text}</Text>
            <Text
              variant="bodySmall"
              style={{ color: theme.colors.onSurfaceVariant }}
            >
              {warning.timestamp.toLocaleTimeString()}
            </Text>
          </View>
          <IconButton icon="chevron-right" />
        </View>
      </Card.Content>
    </Card>
  );