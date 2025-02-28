import React, { useState, useCallback, useEffect } from "react";
import { warningApi } from "../services/warningApi";
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
} from "react-native-paper";
import HeaderBar from "../components/headerBar";
import WarningCard from "../components/warnings/WarningCard";

const LandingPage = () => {
  const theme = useTheme();
  const [warnings, setWarnings] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [emergencyDialogVisible, setEmergencyDialogVisible] = useState(false);

  const fetchWarnings = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await warningApi.getActiveWarnings();
      const formattedWarnings = response.map((warning) => ({
        id: warning.id,
        type: warning.type || "alert",
        text: warning.description || warning.title,
        severity: warning.severity || "medium",
        timestamp: new Date(warning.createdAt || Date.now()),
      }));
      setWarnings(formattedWarnings);
    } catch (err) {
      setError(err.message || "Failed to fetch warnings");
      console.error("Error fetching warnings:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchWarnings();
  }, [fetchWarnings]);

  const handleRefresh = () => {
    fetchWarnings();
  };

  const handleEmergency = useCallback(() => {
    setEmergencyDialogVisible(true);
  }, []);

  const navigationButtons = [
    {
      title: "Report",
      id: 1,
      color: theme.colors.error,
      onPress: handleEmergency,
      icon: "alert-octagon",
      description: "Report Emergency",
    },
    {
      title: "Map",
      id: 2,
      color: theme.colors.primary,
      onPress: () => router.push("/(tabs)/map"),
      icon: "map",
      description: "View Disaster Map",
    },
    {
      title: "Dashboard",
      id: 3,
      color: theme.colors.tertiary,
      onPress: () => router.push("/(tabs)/home"),
      icon: "view-dashboard",
      description: "View Statistics",
    },
  ];

  const getSeverityColor = (severity) => {
    switch (severity) {
      case "high":
        return theme.colors.error;
      case "medium":
        return theme.colors.warning;
      case "low":
        return theme.colors.success;
      default:
        return theme.colors.primary;
    }
  };
  const handleWarningPress = (warning) => {
    // Add warning press handler logic here
    console.log("Warning pressed:", warning);
  };
  if (error) {
    return (
      <SafeAreaView
        style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
      >
        <Text variant="headlineMedium">Something went wrong!</Text>
        <Text
          variant="bodyMedium"
          style={{ marginTop: 8, textAlign: "center" }}
        >
          {error}
        </Text>
        <Button
          mode="contained"
          onPress={handleRefresh}
          style={{ marginTop: 16 }}
        >
          Try Again
        </Button>
      </SafeAreaView>
    );
  }
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <HeaderBar
        title="DisasterWatch"
        subtitle="Your safety companion"
        showBack={false}
        containerStyle={{ marginTop: 1 }}
        rightAction={
          <IconButton
            icon="refresh"
            onPress={handleRefresh}
            disabled={isLoading}
          />
        }
      />

      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <View style={{ marginBottom: 24 }}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              gap: 8,
            }}
          >
            {navigationButtons.map((button) => (
              <Card
                key={button.id}
                mode="elevated"
                style={{
                  flex: 1,
                  backgroundColor: button.color,
                }}
                onPress={button.onPress}
              >
                <Card.Content
                  style={{
                    alignItems: "center",
                    padding: 16,
                    gap: 8,
                  }}
                >
                  <IconButton
                    icon={button.icon}
                    size={32}
                    iconColor="#fff"
                    style={{
                      margin: 0,
                      backgroundColor: "rgba(255,255,255,0.2)",
                      borderRadius: 12,
                    }}
                  />
                  <Text
                    variant="titleMedium"
                    style={{
                      color: "#fff",
                      textAlign: "center",
                      fontWeight: "bold",
                    }}
                  >
                    {button.title}
                  </Text>
                  <Text
                    variant="bodySmall"
                    style={{
                      color: "#fff",
                      textAlign: "center",
                      opacity: 0.8,
                    }}
                  >
                    {button.description}
                  </Text>
                </Card.Content>
              </Card>
            ))}
          </View>
        </View>

        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 16,
          }}
        >
          <Text variant="titleLarge">Recent Alerts</Text>
          {isLoading && <ActivityIndicator size="small" />}
        </View>

        {warnings.length === 0 && !isLoading ? (
          <Text
            variant="bodyMedium"
            style={{ textAlign: "center", marginTop: 20 }}
          >
            No active warnings at the moment
          </Text>
        ) : (
          warnings.map((warning) => (
            <WarningCard
              key={warning.id || warning._id}
              warning={warning}
              onPress={handleWarningPress}
              getSeverityColor={getSeverityColor}
            />
          ))
        )}
      </ScrollView>

      <Portal>
        <Dialog
          visible={emergencyDialogVisible}
          onDismiss={() => setEmergencyDialogVisible(false)}
        >
          <Dialog.Title>Emergency Alert</Dialog.Title>
          <Dialog.Content>
            <Text variant="bodyMedium">
              Are you sure you want to report an emergency?
            </Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setEmergencyDialogVisible(false)}>
              Cancel
            </Button>
            <Button
              onPress={() => {
                setEmergencyDialogVisible(false);
                router.push("/report");
              }}
              textColor={theme.colors.error}
            >
              Report Emergency
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </SafeAreaView>
  );
};

export default LandingPage;
