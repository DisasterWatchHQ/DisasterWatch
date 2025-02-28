import React from "react";
import { View } from "react-native";
import { Text, Button, IconButton, useTheme, Chip } from "react-native-paper";
import { useRouter } from "expo-router";

const WarningMain = ({
  disaster_category,
  title,
  description,
  affected_locations = [],
  severity = "medium",
  created_at,
  status = "active",
  id,
  handleWarningPress,
  style,
}) => {
  const router = useRouter();
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

  const getBackgroundColor = () => {
    const color = getSeverityColor();
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(color);
    if (result) {
      const r = parseInt(result[1], 16);
      const g = parseInt(result[2], 16);
      const b = parseInt(result[3], 16);
      return `rgba(${r}, ${g}, ${b}, 0.1)`;
    }
    return `${color}10`;
  };

  const getTimeAgo = (timestamp) => {
    const now = new Date();
    const created = new Date(timestamp);
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
  };

  const getLocationString = () => {
    if (affected_locations && affected_locations.length > 0) {
      const location = affected_locations[0].address;
      return `${location.city}, ${location.district}`;
    }
    return "Location unavailable";
  };

  const getDisasterCategoryColor = () => {
    switch (disaster_category.toLowerCase()) {
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
        return theme.colors.primary;
    }
  };

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: getBackgroundColor(),
          borderLeftWidth: 4,
          borderLeftColor: getSeverityColor(),
        },
        style,
      ]}
    >
      <View style={styles.statusBar}>
        <Chip
          compact
          style={{
            backgroundColor: getSeverityColor(),
          }}
          textStyle={{ color: "white", fontSize: 12 }}
        >
          {severity.toUpperCase()}
        </Chip>
        <Text
          variant="bodySmall"
          style={{ color: theme.colors.onSurfaceVariant }}
        >
          {getTimeAgo(created_at)}
        </Text>
      </View>

      <View style={styles.content}>
        <Text
          variant="titleMedium"
          style={[styles.title, { color: theme.colors.onSurface }]}
        >
          {title}
        </Text>
        <Chip
          compact
          style={[
            styles.categoryChip,
            { backgroundColor: getDisasterCategoryColor() },
          ]}
          textStyle={{ fontSize: 12, color: "white" }}
        >
          {disaster_category.toUpperCase()}
        </Chip>
        {description && (
          <Text
            variant="bodyMedium"
            style={[
              styles.description,
              { color: theme.colors.onSurfaceVariant },
            ]}
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
            style={{ color: theme.colors.onSurfaceVariant }}
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
            created_at,
            status,
            id,
          })
        }
        style={[styles.button, { backgroundColor: getSeverityColor() }]}
        labelStyle={{ fontSize: 14 }}
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
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  statusBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  content: {
    gap: 8,
    marginBottom: 16,
  },
  title: {
    fontWeight: "bold",
    fontSize: 18,
  },
  categoryChip: {
    alignSelf: "flex-start",
    marginVertical: 4,
  },
  description: {
    lineHeight: 20,
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  locationIcon: {
    margin: 0,
    padding: 0,
  },
  button: {
    marginTop: 8,
    borderRadius: 8,
  },
};

export default WarningMain;
