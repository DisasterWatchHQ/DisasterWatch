import React from "react";
import { View } from "react-native";
import { Text, Button, IconButton, useTheme, Chip } from "react-native-paper";

const WarningMain = ({
  disaster_category,
  title,
  description,
  affected_locations = [],
  severity = "medium",
  status = "active",
  id,
  handleWarningPress,
  style,
}) => {
  const theme = useTheme();

  const getSeverityColor = () => {
    switch (severity.toLowerCase()) {
      case "critical":
        return "#DC2626";
      case "high":
        return "#F87171";
      case "medium":
        return "#FBBF24";
      case "low":
        return "#34D399";
      default:
        return theme.colors.primary;
    }
  };

  const getLocationString = () => {
    if (affected_locations && affected_locations.length > 0) {
      const location = affected_locations[0].address;
      return `${location.city}, ${location.district}`;
    }
    return "Location unavailable";
  };

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme.colors.surface,
          borderLeftWidth: 4,
          borderLeftColor: getSeverityColor(),
        },
        style,
      ]}
    >
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Chip
            compact
            style={[
              styles.severityChip,
              { backgroundColor: getSeverityColor() },
            ]}
            textStyle={styles.chipText}
          >
            {severity.toUpperCase()}
          </Chip>
          <Chip
            compact
            style={[styles.categoryChip, { backgroundColor: getSeverityColor() } ]}
            textStyle={styles.chipText}
          >
            {disaster_category.toUpperCase()}
          </Chip>
        </View>
      </View>

      <View style={styles.content}>
        <Text
          variant="titleMedium"
          style={[styles.title, { color: theme.colors.onSurface }]}
          numberOfLines={2}
        >
          {title}
        </Text>

        {description && (
          <Text
            variant="bodyMedium"
            style={[
              styles.description,
              { color: theme.colors.onSurfaceVariant },
            ]}
            numberOfLines={3}
          >
            {description}
          </Text>
        )}

        <View style={styles.locationContainer}>
          <IconButton
            icon="map-marker"
            iconColor={getSeverityColor()}
            size={20}
            style={styles.locationIcon}
          />
          <Text
            variant="bodyMedium"
            style={[styles.location, { color: theme.colors.onSurfaceVariant }]}
          >
            {getLocationString()}
          </Text>
        </View>
      </View>

      <Button
        mode="contained"
        onPress={() =>
          handleWarningPress({
            disaster_category,
            title,
            description,
            affected_locations,
            severity,
            status,
            id,
          })
        }
        style={[styles.button, { backgroundColor: getSeverityColor() }]}
        labelStyle={styles.buttonLabel}
      >
        View Details
      </Button>
    </View>
  );
};

const styles = {
  container: {
    margin: 8,
    padding: 16,
    borderRadius: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  headerLeft: {
    flexDirection: "row",
    gap: 8,
  },
  severityChip: {
    height: 32,
  },
  categoryChip: {
    height: 32,
  },
  chipText: {
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
  },
  timestamp: {
    fontSize: 12,
    opacity: 0.7,
  },
  content: {
    gap: 12,
    marginBottom: 16,
  },
  title: {
    fontWeight: "700",
    fontSize: 18,
    lineHeight: 24,
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  locationIcon: {
    margin: 0,
    marginRight: -4,
    padding: 0,
  },
  location: {
    fontSize: 14,
  },
  button: {
    marginTop: 8,
    borderRadius: 8,
    height: 40,
  },
  buttonLabel: {
    fontSize: 14,
    fontWeight: "600",
    letterSpacing: 0.5,
  },
};

export default WarningMain;
