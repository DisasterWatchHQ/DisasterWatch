import React from "react";
import { View, StyleSheet, Animated, Linking } from "react-native";
import { Card, Chip, Text, IconButton, useTheme } from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const getFacilityIcon = (type) => {
  switch (type.toLowerCase()) {
    case "hospital":
      return "hospital-building";
    case "shelter":
      return "home-outline";
    case "fire_station":
      return "fire-truck";
    case "police_station":
      return "police-badge";
    case "clinic":
      return "medical-bag";
    case "pharmacy":
      return "pharmacy";
    case "emergency":
      return "ambulance";
    default:
      return "office-building-marker";
  }
};

export const FacilityCard = ({ facility }) => {
  const theme = useTheme();

  const getStatusColor = (status) => {
    switch (status) {
      case "open":
        return theme.colors.success;
      case "limited":
        return theme.colors.warning;
      case "closed":
        return theme.colors.error;
      default:
        return theme.colors.surfaceVariant;
    }
  };

  const handleCall = (number) => {
    Linking.openURL(`tel:${number}`);
  };

  const handleDirections = () => {
    const { lat, lng } = facility.location.coordinates;
    Linking.openURL(
      `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`,
    );
  };

  return (
    <Card style={styles.card} mode="elevated">
      <Card.Title
        title={facility.name}
        subtitle={facility.type}
        left={(props) => (
          <MaterialCommunityIcons
            name={getFacilityIcon(facility.type)}
            size={24}
            color={theme.colors.primary}
          />
        )}
        right={(props) => (
          <Chip
            mode="flat"
            style={[
              styles.statusChip,
              { backgroundColor: getStatusColor(facility.availability_status) },
            ]}
            textStyle={styles.statusText}
          >
            {facility.availability_status}
          </Chip>
        )}
      />
      <Card.Content>
        <View style={styles.detailsContainer}>
          <View style={styles.infoRow}>
            <MaterialCommunityIcons
              name="map-marker"
              size={20}
              color={theme.colors.primary}
            />
            <Text style={styles.addressText}>
              {facility.location.address.formatted_address}
            </Text>
          </View>

          <View style={styles.infoRow}>
            <MaterialCommunityIcons
              name="account-group"
              size={20}
              color={theme.colors.primary}
            />
            <Text style={styles.capacityText}>
              Capacity: {facility.capacity} ({facility.current_occupancy}{" "}
              occupied)
            </Text>
          </View>

          {facility.specialties && (
            <View style={styles.specialtiesContainer}>
              {facility.specialties.map((specialty) => (
                <Chip
                  key={specialty}
                  style={styles.specialtyChip}
                  textStyle={styles.specialtyText}
                  icon="star"
                >
                  {specialty}
                </Chip>
              ))}
            </View>
          )}

          <View style={styles.actionsContainer}>
            <IconButton
              icon="phone"
              mode="contained"
              onPress={() => handleCall(facility.contact.phone)}
              style={styles.actionButton}
            />
            <IconButton
              icon="directions"
              mode="contained"
              onPress={handleDirections}
              style={styles.actionButton}
            />
            {facility.emergency_unit && (
              <Chip icon="ambulance" mode="flat" style={styles.emergencyChip}>
                24/7 Emergency
              </Chip>
            )}
          </View>
        </View>
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 12,
  },
  statusChip: {
    marginRight: 16,
    borderRadius: 16,
  },
  statusText: {
    color: "white",
    fontWeight: "bold",
  },
  detailsContainer: {
    gap: 12,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  addressText: {
    flex: 1,
    fontSize: 14,
    color: "#666",
  },
  capacityText: {
    flex: 1,
    fontSize: 14,
  },
  specialtiesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  specialtyChip: {
    backgroundColor: "#f0f0f0",
  },
  specialtyText: {
    fontSize: 12,
  },
  actionsContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 8,
  },
  actionButton: {
    marginRight: 8,
  },
  emergencyChip: {
    backgroundColor: "#ff6b6b",
  },
});
