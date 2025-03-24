import React, { useContext } from "react";
import { View, StyleSheet, Linking } from "react-native";
import {
  Card,
  Chip,
  Text,
  IconButton,
  useTheme,
  Menu,
  Divider,
} from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { UserContext } from "../../context/UserContext";

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

export const FacilityCard = ({ facility, onEdit, onDelete }) => {
  const theme = useTheme();
  const { isAuthenticated } = useContext(UserContext);
  const [menuVisible, setMenuVisible] = React.useState(false);

  const showMenu = () => setMenuVisible(true);
  const hideMenu = () => setMenuVisible(false);

  const handleLongPress = () => {
    if (isAuthenticated) {
      showMenu();
    }
  };

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
    <Menu
      visible={menuVisible}
      onDismiss={hideMenu}
      anchor={
        <Card style={styles.card} mode="elevated" onLongPress={handleLongPress}>
          {/* Existing Card content */}
          <Card.Title
            title={facility.name}
            subtitle={facility.type.replace("_", " ")}
            left={(props) => (
              <MaterialCommunityIcons
                name={getFacilityIcon(facility.type)}
                size={24}
                color={theme.colors.primary}
              />
            )}
          />
          <Card.Content>
            <View style={styles.detailsContainer}>
              {/* Location */}
              <View style={styles.infoRow}>
                <MaterialCommunityIcons
                  name="map-marker"
                  size={20}
                  color={theme.colors.primary}
                />
                <Text style={styles.addressText}>
                  {facility.location.address.formatted_address ||
                    `${facility.location.address.city}, ${facility.location.address.province}`}
                </Text>
              </View>

              {/* Contact Info */}
              <View style={styles.infoRow}>
                <MaterialCommunityIcons
                  name="phone"
                  size={20}
                  color={theme.colors.primary}
                />
                <Text style={styles.contactText}>{facility.contact.phone}</Text>
              </View>

              {/* Capacity for shelters */}
              {facility.type === "shelter" &&
                facility.metadata?.capacity > 0 && (
                  <View style={styles.infoRow}>
                    <MaterialCommunityIcons
                      name="account-group"
                      size={20}
                      color={theme.colors.primary}
                    />
                    <Text style={styles.capacityText}>
                      Capacity: {facility.metadata.capacity}
                    </Text>
                  </View>
                )}

              {/* Status */}
              <View style={styles.statusContainer}>
                <Chip
                  mode="flat"
                  style={[
                    styles.statusChip,
                    {
                      backgroundColor: getStatusColor(
                        facility.availability_status,
                      ),
                    },
                  ]}
                >
                  {facility.availability_status.replace("_", " ")}
                </Chip>
              </View>

              {/* Tags */}
              {facility.tags && facility.tags.length > 0 && (
                <View style={styles.tagsContainer}>
                  {facility.tags.map((tag, index) => (
                    <Chip key={index} mode="outlined" style={styles.tag}>
                      {tag}
                    </Chip>
                  ))}
                </View>
              )}

              {/* Actions */}
              <View style={styles.actionsContainer}>
                <IconButton
                  icon="phone"
                  mode="contained-tonal"
                  onPress={() => handleCall(facility.contact.phone)}
                />
                <IconButton
                  icon="map-marker"
                  mode="contained-tonal"
                  onPress={handleDirections}
                />
              </View>
            </View>
          </Card.Content>
        </Card>
      }
    >
      <Menu.Item
        onPress={() => {
          hideMenu();
          onEdit(facility);
        }}
        title="Edit"
        leadingIcon="pencil"
      />
      <Divider />
      <Menu.Item
        onPress={() => {
          hideMenu();
          onDelete(facility.id);
        }}
        title="Delete"
        leadingIcon="delete"
        titleStyle={{ color: theme.colors.error }}
      />
    </Menu>
  );
};

const styles = StyleSheet.create({
  statusContainer: {
    flexDirection: "row",
    marginTop: 8,
  },
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 8,
  },
  tag: {
    marginRight: 4,
    marginBottom: 4,
  },
  contactText: {
    flex: 1,
    fontSize: 14,
    color: "#666",
  },
  card: {
    marginHorizontal: 12,
    marginVertical: 6,
    borderRadius: 12,
    elevation: 2,
  },
  statusChip: {
    marginRight: 12,
    borderRadius: 12,
  },
  actionButton: {
    marginRight: 6,
    borderRadius: 8,
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
