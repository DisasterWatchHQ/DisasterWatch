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
import { getDisasterCategoryColor } from '../../utils/disasterUtils';

const WarningDetailsModal = ({ visible, warning, onDismiss }) => {
  if (!warning) return null;

  const formatDate = (dateString) => {
    if (!dateString) return "Not specified";
    
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "Invalid date";
      
      return date.toLocaleString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });
    } catch (error) {
      console.error("Date formatting error:", error);
      return "Date unavailable";
    }
  };

  const getTimeAgo = (timestamp) => {
    if (!timestamp) return "Time unavailable";

    try {
      const now = new Date();
      const created = new Date(timestamp);
      
      if (isNaN(created.getTime())) return "Invalid time";

      const diffInMinutes = Math.floor((now - created) / (1000 * 60));
      const diffInHours = Math.floor(diffInMinutes / 60);
      const diffInDays = Math.floor(diffInHours / 24);

      if (diffInMinutes < 1) {
        return "Just now";
      } else if (diffInMinutes < 60) {
        return `${diffInMinutes} ${diffInMinutes === 1 ? 'minute' : 'minutes'} ago`;
      } else if (diffInHours < 24) {
        return `${diffInHours} ${diffInHours === 1 ? 'hour' : 'hours'} ago`;
      } else if (diffInDays < 7) {
        return `${diffInDays} ${diffInDays === 1 ? 'day' : 'days'} ago`;
      } else {
        return formatDate(timestamp);
      }
    } catch (error) {
      console.error("Time ago calculation error:", error);
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

  return (
    <Portal>
      <Modal
        visible={visible}
        onDismiss={onDismiss}
        contentContainerStyle={styles.modalContainer}
      >
        <SafeAreaView style={styles.safeArea}>
          <Card style={styles.card}>
            <IconButton
              icon="close"
              size={24}
              onPress={onDismiss}
              style={styles.closeButton}
            />
            <ScrollView
              style={styles.scrollView}
              showsVerticalScrollIndicator={false}
            >
              <View style={styles.headerSection}>
                <View style={styles.chips}>
                  {warning.severity && (
                    <Chip
                      style={[
                        styles.chip,
                        { backgroundColor: getSeverityColor(warning.severity) },
                      ]}
                      textStyle={styles.chipText}
                    >
                      {warning.severity?.toUpperCase()}
                    </Chip>
                  )}
                  {warning.disaster_category && (
                    <Chip
                      style={[
                        styles.chip,
                        {
                          backgroundColor: getDisasterCategoryColor(
                            warning.disaster_category
                          ),
                        },
                      ]}
                      textStyle={styles.chipText}
                    >
                      {warning.disaster_category?.toUpperCase()}
                    </Chip>
                  )}
                </View>
                <Text variant="titleLarge" style={styles.title}>
                  {warning.title || "Untitled Warning"}
                </Text>
                <Text variant="bodySmall" style={styles.timestamp}>
                  {getTimeAgo(warning.created_at)}
                </Text>
              </View>

              {warning.description && (
                <View style={styles.section}>
                  <Text variant="titleMedium" style={styles.sectionTitle}>
                    Description
                  </Text>
                  <Text variant="bodyMedium" style={styles.description}>
                    {warning.description}
                  </Text>
                </View>
              )}

              {warning.expected_duration && (
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
              )}

              {warning.created_by && (
                <View style={styles.section}>
                  <Text variant="titleMedium" style={styles.sectionTitle}>
                    Issued By
                  </Text>
                  <Text variant="bodyMedium">
                    {warning.created_by.name || "Unknown"}{" "}
                    {warning.created_by.associated_department && 
                      `- ${warning.created_by.associated_department}`}
                  </Text>
                </View>
              )}

              {warning.affected_locations?.length > 0 && (
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
                        {location.address?.city && location.address?.district ? 
                          `${location.address.city}, ${location.address.district}` :
                          `Lat: ${location.latitude?.toFixed(4)}, Long: ${location.longitude?.toFixed(4)}`}
                      </Text>
                    </View>
                  ))}
                </View>
              )}

              {warning.status && (
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
              )}
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
        </SafeAreaView>
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
