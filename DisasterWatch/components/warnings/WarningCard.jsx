import React from 'react';
import { View } from 'react-native';
import { Card, IconButton, Chip, Text, useTheme } from 'react-native-paper';

const WarningCard = ({ warning, onPress, getSeverityColor }) => {
  const theme = useTheme();
  
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
              }}
            >
              <IconButton
                icon={warning.type === "alert" ? "alert-circle" : "alert"}
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
            </View>
            <Text variant="titleMedium">{warning.text}</Text>
            <Text
              variant="bodySmall"
              style={{ color: theme.colors.onSurfaceVariant }}
            >
              {warning.timestamp.toLocaleTimeString()}
            </Text>
          </View>
          <IconButton icon="chevron-right" />
        </View>
      </Card.Content>
    </Card>
  );
};

export default WarningCard;