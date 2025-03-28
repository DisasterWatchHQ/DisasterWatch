import React, { useContext } from "react";
import { View, StyleSheet, Animated } from "react-native";
import { Card, Chip, Text, useTheme, Menu, Divider } from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { formatDate } from "../../scripts/dateUtils";
import { router } from "expo-router";
import { UserContext } from "../../context/UserContext";

export const GuideCard = ({ guide, onEdit, onDelete }) => {
  const theme = useTheme();
  const scale = new Animated.Value(1);
  const { isAuthenticated } = useContext(UserContext);
  const [menuVisible, setMenuVisible] = React.useState(false);

  const showMenu = () => setMenuVisible(true);
  const hideMenu = () => setMenuVisible(false);

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
        <Animated.View
          style={[styles.cardContainer, { transform: [{ scale }] }]}
        >
          <Card
            mode="elevated"
            onPress={handlePress}
            onPressIn={onPressIn}
            onPressOut={onPressOut}
            onLongPress={handleLongPress}
          >
            <Card.Title
              title={guide.name}
              titleStyle={styles.cardTitle}
              subtitle={guide.type}
            />
            <Card.Content>
              <Text style={styles.description}>{guide.description}</Text>
              <View style={styles.tagsContainer}>
                {guide.tags?.map((tag) => (
                  <Chip key={tag} style={styles.chip}>
                    {tag}
                  </Chip>
                ))}
              </View>
              <Text style={styles.lastUpdated}>
                Last updated: {formatDate(guide.metadata?.lastUpdated)}
              </Text>
            </Card.Content>
          </Card>
        </Animated.View>
      }
    >
      <Menu.Item
        onPress={() => {
          hideMenu();
          onEdit(guide);
        }}
        title="Edit"
        leadingIcon="pencil"
      />
      <Divider />
      <Menu.Item
        onPress={() => {
          hideMenu();
          onDelete(guide.id);
        }}
        title="Delete"
        leadingIcon="delete"
        titleStyle={{ color: theme.colors.error }}
      />
    </Menu>
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
