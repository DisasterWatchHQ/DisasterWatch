import React from "react";
import { View, StyleSheet, Animated } from "react-native";
import { Card, Chip, Text, useTheme } from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { formatDate } from "../../scripts/dateUtils";
import { router } from "expo-router";

export const GuideCard = ({ guide }) => {
  const theme = useTheme();
  const scale = new Animated.Value(1);

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high":
        return theme.colors.error;
      case "medium":
        return theme.colors.warning;
      case "low":
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

  const contentPreview = guide.content
    ? guide.content
        .replace(/[#*`_~\[\]]/g, "") 
        .substring(0, 150)
        .trim() + (guide.content.length > 150 ? "..." : "")
    : "";

  const handlePress = () => {
    router.push({
      pathname: "/resources/[id]",
      params: { id: guide.id },
    });
  };

  return (
    <Animated.View style={[styles.cardContainer, { transform: [{ scale }] }]}>
      <Card
        mode="elevated"
        onPress={handlePress}
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
                { backgroundColor: getPriorityColor(guide.priority) },
              ]}
            >
              {guide.priority}
            </Chip>
          )}
        />
        <Card.Content>
          <Text style={styles.description}>{guide.description}</Text>

          {/* Content Preview */}
          <Text style={styles.preview} numberOfLines={3}>
            {contentPreview}
          </Text>

          <View style={styles.tagsContainer}>
            {guide.tags?.map((tag) => (
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

          <View style={styles.footer}>
            <Text style={styles.lastUpdated}>
              Last updated: {formatDate(guide.lastUpdated)}
            </Text>
            <Text style={styles.readMore}>Read More →</Text>
          </View>
        </Card.Content>
      </Card>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    marginHorizontal: 12,
    marginVertical: 6,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "bold",
  },
  description: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
  },
  preview: {
    fontSize: 13,
    color: "#444",
    marginBottom: 8,
    lineHeight: 18,
  },
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
    marginBottom: 6,
  },
  chip: {
    borderRadius: 8,
  },
  chipText: {
    fontSize: 12,
  },
  priorityChip: {
    marginRight: 12,
    borderRadius: 8,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
  },
  lastUpdated: {
    fontSize: 12,
    color: "#999",
  },
  readMore: {
    fontSize: 12,
    color: "#666",
    fontWeight: "500",
  },
});
