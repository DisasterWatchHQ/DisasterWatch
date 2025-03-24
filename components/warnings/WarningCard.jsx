import React, { useMemo } from 'react';
import { View, StyleSheet } from 'react-native';
import { Card, IconButton, Chip, Text, useTheme } from 'react-native-paper';
import PropTypes from 'prop-types';

const WarningCard = ({ warning, onPress, getSeverityColor }) => {
  const theme = useTheme();
  
  const getTimeAgo = useMemo(() => (timestamp) => {
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
  }, []);

  const severityColor = useMemo(() => 
    getSeverityColor(warning.severity),
    [warning.severity, getSeverityColor]
  );
  
  return (
    <Card
      mode="outlined"
      style={[styles.card, { borderColor: theme.colors.outline }]}
      onPress={() => onPress(warning)}
    >
      <Card.Content style={styles.content}>
        <View style={styles.container}>
          <View style={styles.mainContent}>
            <View style={styles.header}>
              <Chip
                mode="outlined"
                textStyle={{ color: severityColor }}
                style={[styles.chip, { borderColor: severityColor }]}
              >
                {warning.severity.toUpperCase()}
              </Chip>
              <Chip
                mode="outlined"
                textStyle={{ color: theme.colors.primary }}
                style={[styles.chip, { borderColor: theme.colors.primary }]}
              >
                {warning.disaster_category.toUpperCase()}
              </Chip>
            </View>
            
            <Text 
              variant="titleMedium"
              style={{ color: theme.colors.onSurface }}
            >
              {warning.title}
            </Text>
            
            {warning.description && (
              <Text
                variant="bodyMedium"
                style={[styles.description, { color: theme.colors.onSurfaceVariant }]}
                numberOfLines={2}
              >
                {warning.description}
              </Text>
            )}
            
            <Text
              variant="bodySmall"
              style={[styles.timestamp, { color: theme.colors.onSurfaceVariant }]}
            >
              {getTimeAgo(warning.created_at)}
            </Text>
          </View>
          
          <IconButton 
            icon="chevron-right"
            iconColor={theme.colors.onSurfaceVariant}
          />
        </View>
      </Card.Content>
    </Card>
  );
};

WarningCard.propTypes = {
  warning: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string,
    disaster_category: PropTypes.string.isRequired,
    severity: PropTypes.string.isRequired,
    created_at: PropTypes.string.isRequired,
  }).isRequired,
  onPress: PropTypes.func.isRequired,
  getSeverityColor: PropTypes.func.isRequired,
};

const styles = StyleSheet.create({
  card: {
    marginBottom: 12,
  },
  content: {
    padding: 12,
  },
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  mainContent: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    gap: 8,
  },
  chip: {
    height: 28,
  },
  description: {
    marginTop: 4,
  },
  timestamp: {
    marginTop: 4,
  },
});

export default WarningCard;