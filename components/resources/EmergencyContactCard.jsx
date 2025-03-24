import React, { useContext } from "react";
import { View, StyleSheet, Linking, TouchableOpacity } from "react-native";
import { Card, Chip, Text, useTheme, Menu, Divider } from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { UserContext } from "../../context/UserContext";

export const EmergencyContactCard = ({ contact, onEdit, onDelete }) => {
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

  return (
    <Menu
      visible={menuVisible}
      onDismiss={hideMenu}
      anchor={
        <Card
          style={styles.contactCard}
          mode="elevated"
          onLongPress={handleLongPress}
        >
          <Card.Title
            title={contact.name}
            subtitle={contact.metadata?.serviceHours || "24/7"}
            left={(props) => (
              <MaterialCommunityIcons
                name="phone-alert"
                size={24}
                color={theme.colors.error}
              />
            )}
          />
          <Card.Content>
            <View style={styles.contactDetails}>
              <TouchableOpacity
                style={styles.contactButton}
                onPress={() => Linking.openURL(`tel:${contact.contact.phone}`)}
              >
                <MaterialCommunityIcons
                  name="phone"
                  size={20}
                  color={theme.colors.primary}
                />
                <Text style={styles.contactText}>{contact.contact.phone}</Text>
                <Text style={styles.contactLabel}>Primary</Text>
              </TouchableOpacity>

              {contact.contact.email && (
                <TouchableOpacity
                  style={styles.contactButton}
                  onPress={() =>
                    Linking.openURL(`mailto:${contact.contact.email}`)
                  }
                >
                  <MaterialCommunityIcons
                    name="email"
                    size={20}
                    color={theme.colors.primary}
                  />
                  <Text style={styles.contactText}>
                    {contact.contact.email}
                  </Text>
                  <Text style={styles.contactLabel}>Email</Text>
                </TouchableOpacity>
              )}
            </View>

            <View style={styles.infoContainer}>
              <Chip
                icon="clock-outline"
                mode="outlined"
                style={styles.availabilityChip}
              >
                {contact.metadata?.serviceHours || "24/7"}
              </Chip>

              <Chip
                icon="alert"
                mode="outlined"
                style={[
                  styles.emergencyLevelChip,
                  {
                    backgroundColor:
                      contact.emergency_level === "high"
                        ? theme.colors.errorContainer
                        : theme.colors.surfaceVariant,
                  },
                ]}
              >
                {contact.emergency_level} priority
              </Chip>
            </View>

            {contact.tags && contact.tags.length > 0 && (
              <View style={styles.tagsContainer}>
                {contact.tags.map((tag, index) => (
                  <Chip key={index} mode="outlined" style={styles.tag}>
                    {tag}
                  </Chip>
                ))}
              </View>
            )}
          </Card.Content>
        </Card>
      }
    >
      <Menu.Item
        onPress={() => {
          hideMenu();
          onEdit(contact);
        }}
        title="Edit"
        leadingIcon="pencil"
      />
      <Divider />
      <Menu.Item
        onPress={() => {
          hideMenu();
          onDelete(contact.id);
        }}
        title="Delete"
        leadingIcon="delete"
        titleStyle={{ color: theme.colors.error }}
      />
    </Menu>
  );
};

const styles = StyleSheet.create({
  contactCard: {
    marginHorizontal: 12,
    marginVertical: 6,
    borderRadius: 12,
    elevation: 2,
  },
  contactDetails: {
    gap: 8,
    marginBottom: 12,
  },
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 12,
  },
  tag: {
    marginRight: 4,
    marginBottom: 4,
  },
  contactButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    backgroundColor: "#f8f9fa",
    borderRadius: 8,
    gap: 8,
  },
  contactText: {
    flex: 1,
    fontSize: 16,
  },
  contactLabel: {
    fontSize: 12,
    color: "#666",
    textTransform: "uppercase",
  },
  infoContainer: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 12,
  },
  availabilityChip: {
    flex: 1,
  },
  emergencyLevelChip: {
    flex: 1,
  },
  description: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
  },
});

export default EmergencyContactCard;
