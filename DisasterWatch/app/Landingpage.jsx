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
  if (error) {
    return (
      <SafeAreaView
        style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
      >
        <Text variant="headlineMedium">Something went wrong!</Text>
        <Button
          mode="contained"
          onPress={() => setError(null)}
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
      />

      <ScrollView contentContainerStyle={{ padding: 16 }}>
        {/* Action Buttons */}
        <View style={{ marginBottom: 24 }}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              gap: 8, // Add gap between buttons
            }}
          >
            {navigationButtons.map((button, index) => (
              <Card
                key={index}
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

        {/* Warnings Section */}
        <Text variant="titleLarge" style={{ marginBottom: 16 }}>
          Recent Alerts
        </Text>
        {isLoading ? (
          <ActivityIndicator animating={true} size="large" />
        ) : (
          warnings.map((warning) => (
            <WarningCard key={warning.id} warning={warning} />
          ))
        )}
      </ScrollView>

      {/* Emergency Dialog */}
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
                router.push("/DetailedAlert");
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