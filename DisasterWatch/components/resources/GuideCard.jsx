import React from "react";
import { View, StyleSheet, Animated } from "react-native";
import { Card, Chip, Text, useTheme } from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { formatDate } from "../../scripts/dateUtils";

export const GuideCard = ({ guide, onPress }) => {
  const theme = useTheme();
  const scale = new Animated.Value(1);

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return theme.colors.error;
      case 'medium':
        return theme.colors.warning;
      case 'low':
        return theme.colors.success;
      default:
        return theme.colors.surfaceVariant;
    }
  };

  const onPressIn = () => {
    Animated.spring(scale, {
      toValue: 0.98,
      useNativeDriver: true,
    }).start();
  };

  const onPressOut = () => {
    Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  return (
    <Animated.View style={[styles.cardContainer, { transform: [{ scale }] }]}>
      <Card
        mode="elevated"
        onPress={onPress}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
      >
        <Card.Title
          title={guide.name}
          titleStyle={styles.cardTitle}
          left={(props) => (
            <MaterialCommunityIcons
              name="book-open-variant"
              size={24}
              color={theme.colors.primary}
            />
          )}
          right={(props) => (
            <Chip
              mode="flat"
              style={[
                styles.priorityChip,
                { backgroundColor: getPriorityColor(guide.priority) }
              ]}
            >
              {guide.priority}
            </Chip>
          )}
        />
        <Card.Content>
          <Text style={styles.description}>{guide.description}</Text>
          <View style={styles.tagsContainer}>
            {guide.tags.map((tag) => (
              <Chip
                key={tag}
                style={styles.chip}
                textStyle={styles.chipText}
                icon="tag"
              >
                {tag}
              </Chip>
            ))}
          </View>
          <Text style={styles.lastUpdated}>
            Last updated: {formatDate(guide.lastUpdated)}
          </Text>
        </Card.Content>
      </Card>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    marginHorizontal: 16,
    marginVertical: 8,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  description: {
    fontSize: 14,
    color: "#666",
    marginBottom: 12,
  },
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 8,
  },
  chip: {
    borderRadius: 16,
  },
  chipText: {
    fontSize: 12,
  },
  priorityChip: {
    marginRight: 16,
  },
  lastUpdated: {
    fontSize: 12,
    color: "#999",
    marginTop: 8,
  },
});
