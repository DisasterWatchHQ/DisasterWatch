import React from 'react';
import { View } from 'react-native';
import { Card, IconButton, Chip, Text, useTheme } from 'react-native-paper';
import { getDisasterCategoryIcon } from '../../utils/disasterUtils';

const WarningCard = ({ warning, onPress, getSeverityColor }) => {
  const theme = useTheme();
  
  const getTimeAgo = (timestamp) => {
    try {
      const now = new Date();
      const created = new Date(timestamp);
      if (isNaN(created.getTime())) {
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
  
  return (
    <Card
      mode="outlined"
      style={{ marginBottom: 12 }}
      onPress={() => onPress(warning)}
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
                gap: 8,
              }}
            >
              <IconButton
                icon={getDisasterCategoryIcon(warning.disaster_category)}
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
              <Chip
                mode="outlined"
                textStyle={{ color: theme.colors.primary }}
                style={{ borderColor: theme.colors.primary }}
              >
                {warning.disaster_category.toUpperCase()}
              </Chip>
            </View>
            <Text variant="titleMedium">{warning.title}</Text>
            {warning.description && (
              <Text
                variant="bodyMedium"
                style={{ color: theme.colors.onSurfaceVariant, marginTop: 4 }}
                numberOfLines={2}
              >
                {warning.description}
              </Text>
            )}
            <Text
              variant="bodySmall"
              style={{ color: theme.colors.onSurfaceVariant, marginTop: 4 }}
            >
              {getTimeAgo(warning.created_at)}
            </Text>
          </View>
          <IconButton icon="chevron-right" />
        </View>
      </Card.Content>
    </Card>
  );
};

export default WarningCard;