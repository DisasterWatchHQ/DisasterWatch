import React from "react";
import {
  Modal,
  Portal,
  Card,
  Text,
  Button,
  IconButton,
  Chip,
} from "react-native-paper";
import { View, ScrollView, StyleSheet } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";

const WarningDetailsModal = ({ visible, warning, onDismiss }) => {
  if (!warning) {
    return null;
  }
  console.log(warning);

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        console.error("Invalid date:", dateString);
        return "Date unavailable";
      }
      return date.toLocaleString();
    } catch (error) {
      console.error("Error formatting date:", error);
      return "Date unavailable";
    }
  };

  const getTimeAgo = (timestamp) => {
    try {
      const now = new Date();
      const created = new Date(timestamp);
      if (isNaN(created.getTime())) {
        console.error("Invalid timestamp:", timestamp);
        return "Time unavailable";
      }
      const diffInMinutes = Math.floor((now - created) / (1000 * 60));

      if (diffInMinutes < 60) {
        return `${diffInMinutes} minutes ago`;
      } else if (diffInMinutes < 1440) {
        const hours = Math.floor(diffInMinutes / 60);
        return `${hours} ${hours === 1 ? "hour" : "hours"} ago`;
      } else {
        const days = Math.floor(diffInMinutes / 1440);
        return `${days} ${days === 1 ? "day" : "days"} ago`;
      }
    } catch (error) {
      console.error("Error calculating time ago:", error);
      return "Time unavailable";
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity?.toLowerCase()) {
      case "critical":
        return "#DC2626";
      case "high":
        return "#F87171";
      case "medium":
        return "#FBBF24";
      case "low":
        return "#34D399";
      default:
        return "#6B7280";
    }
  };

  const getDisasterCategoryColor = (category) => {
    switch (category?.toLowerCase()) {
      case "flood":
        return "#3B82F6";
      case "fire":
        return "#EF4444";
      case "earthquake":
        return "#8B5CF6";
      case "landslide":
        return "#D97706";
      case "cyclone":
        return "#6366F1";
      default:
        return "#6B7280";
    }
  };

  return (
    <Portal>
      <Modal
        visible={visible}
        onDismiss={onDismiss}
        contentContainerStyle={styles.modalContainer}
      >
        <Card style={styles.card}>
          <IconButton
            icon="close"
            size={24}
            onPress={onDismiss}
            style={styles.closeButton}
          />
          <ScrollView
            style={styles.scrollView}
            showsVerticalScrollIndicator={true}
          >
            <View style={styles.headerSection}>
              <View style={styles.chips}>
                <Chip
                  style={[
                    styles.chip,
                    { backgroundColor: getSeverityColor(warning.severity) },
                  ]}
                  textStyle={styles.chipText}
                >
                  {warning.severity?.toUpperCase()}
                </Chip>
                <Chip
                  style={[
                    styles.chip,
                    {
                      backgroundColor: getDisasterCategoryColor(
                        warning.disaster_category,
                      ),
                    },
                  ]}
                  textStyle={styles.chipText}
                >
                  {warning.disaster_category?.toUpperCase()}
                </Chip>
              </View>
              <Text variant="titleLarge" style={styles.title}>
                {warning.title}
              </Text>
              <Text variant="bodySmall" style={styles.timestamp}>
                {getTimeAgo(warning.created_at)}
              </Text>
            </View>

            <View style={styles.section}>
              <Text variant="titleMedium" style={styles.sectionTitle}>
                Description
              </Text>
              <Text variant="bodyMedium" style={styles.description}>
                {warning.description}
              </Text>
            </View>

            <View style={styles.section}>
              <Text variant="titleMedium" style={styles.sectionTitle}>
                Expected Duration
              </Text>
              <Text variant="bodyMedium">
                From: {formatDate(warning.expected_duration?.start_time)}
              </Text>
              {warning.expected_duration?.end_time && (
                <Text variant="bodyMedium">
                  To: {formatDate(warning.expected_duration.end_time)}
                </Text>
              )}
            </View>

            <View style={styles.section}>
              <Text variant="titleMedium" style={styles.sectionTitle}>
                Issued By
              </Text>
              <Text variant="bodyMedium">
                {warning.created_by.name} -{" "}
                {warning.created_by.associated_department}
              </Text>
            </View>

            <View style={styles.section}>
              <Text variant="titleMedium" style={styles.sectionTitle}>
                Affected Locations
              </Text>
              {warning.affected_locations.map((location, index) => (
                <View key={index} style={styles.locationItem}>
                  <MaterialCommunityIcons
                    name="map-marker"
                    size={20}
                    color="#6B7280"
                  />
                  <Text variant="bodyMedium" style={styles.locationText}>
                    {`Lat: ${location.latitude.toFixed(4)}, Long: ${location.longitude.toFixed(4)}`}
                  </Text>
                </View>
              ))}
            </View>

            <View style={styles.section}>
              <Text variant="titleMedium" style={styles.sectionTitle}>
                Status
              </Text>
              <Chip
                style={[styles.chip, { backgroundColor: "#4B5563" }]}
                textStyle={styles.chipText}
              >
                {warning.status.toUpperCase()}
              </Chip>
            </View>
          </ScrollView>

          <View style={styles.actionButtons}>
            <Button
              mode="contained"
              onPress={onDismiss}
              style={[
                styles.button,
                { backgroundColor: getSeverityColor(warning.severity) },
              ]}
            >
              Close
            </Button>
          </View>
        </Card>
      </Modal>
    </Portal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    margin: 16,
    backgroundColor: "transparent",
    height: "90%",
  },
  safeArea: {
    flex: 1,
  },
  card: {
    flex: 1,
    borderRadius: 16,
    backgroundColor: "white",
    maxHeight: "100%",
  },
  closeButton: {
    position: "absolute",
    right: 8,
    top: 8,
    zIndex: 1,
  },
  scrollView: {
    marginTop: 20,
  },
  headerSection: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  chips: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 12,
  },
  chip: {
    height: 32,
  },
  chipText: {
    color: "white",
    fontSize: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
  },
  timestamp: {
    color: "#6B7280",
  },
  section: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  sectionTitle: {
    fontWeight: "bold",
    marginBottom: 8,
  },
  description: {
    lineHeight: 24,
  },
  locationItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 8,
  },
  locationText: {
    flex: 1,
  },
  safetyText: {
    lineHeight: 24,
  },
  actionButtons: {
    flexDirection: "row",
    gap: 8,
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
  },
  button: {
    flex: 1,
  },
});

export default WarningDetailsModal;
