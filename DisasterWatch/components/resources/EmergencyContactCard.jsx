import React from "react";
import {
  View,
  StyleSheet,
  Animated,
  Linking,
  TouchableOpacity,
} from "react-native";
import { Card, Chip, Text, IconButton, useTheme } from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export const EmergencyContactCard = ({ contact }) => {
  const theme = useTheme();

  return (
    <Card style={styles.contactCard} mode="elevated">
      <Card.Title
        title={contact.name}
        subtitle={`Response time: ${contact.response_time}`}
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
          {/* Primary Phone */}
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

          {/* Alternate Phone if available */}
          {contact.contact.alternate_phone && (
            <TouchableOpacity
              style={styles.contactButton}
              onPress={() =>
                Linking.openURL(`tel:${contact.contact.alternate_phone}`)
              }
            >
              <MaterialCommunityIcons
                name="phone-classic"
                size={20}
                color={theme.colors.primary}
              />
              <Text style={styles.contactText}>
                {contact.contact.alternate_phone}
              </Text>
              <Text style={styles.contactLabel}>Alternate</Text>
            </TouchableOpacity>
          )}

          {/* Email */}
          <TouchableOpacity
            style={styles.contactButton}
            onPress={() => Linking.openURL(`mailto:${contact.contact.email}`)}
          >
            <MaterialCommunityIcons
              name="email"
              size={20}
              color={theme.colors.primary}
            />
            <Text style={styles.contactText}>{contact.contact.email}</Text>
            <Text style={styles.contactLabel}>Email</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.infoContainer}>
          <Chip
            icon="clock-outline"
            mode="outlined"
            style={styles.availabilityChip}
          >
            {contact.available_hours}
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

        <Text style={styles.description}>{contact.description}</Text>
      </Card.Content>
    </Card>
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
