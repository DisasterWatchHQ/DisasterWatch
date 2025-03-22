import React from "react";
import { Tabs } from "expo-router";
import { useTheme } from "react-native-paper";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import "../../global.css";

const TabsLayout = () => {
  const theme = useTheme();

  const tabBarStyles = {
    tabBarStyle: {
      backgroundColor: theme.colors.elevation.level2,
      borderTopColor: theme.colors.primary,
      borderTopWidth: 1,
      height: 70,
      paddingBottom: 10,
      paddingTop: 5,
      elevation: 12,
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: -3,
      },
      shadowOpacity: 0.15,
      shadowRadius: 8,
      position: "absolute",
      bottom: 0,
      left: 0,
      right: 0,
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
    },
    tabBarActiveTintColor: theme.colors.primary,
    tabBarInactiveTintColor: theme.colors.onSurfaceVariant,
    tabBarLabelStyle: {
      fontSize: 11,
      fontWeight: "600",
      marginTop: 2,
      marginBottom: 2,
      letterSpacing: 0.3,
    },
    tabBarItemStyle: {
      paddingTop: 4,
      paddingBottom: 8,
    },
    headerStyle: {
      backgroundColor: theme.colors.elevation.level2,
      elevation: 0,
      shadowOpacity: 0,
    },
    headerTintColor: theme.colors.onSurface,
    headerTitleStyle: {
      fontWeight: "700",
      fontSize: 18,
      letterSpacing: 0.5,
    },
  };

  const TabIcon = ({ name, focused, color }) => (
    <Icon
      name={focused ? name : `${name}-outline`}
      size={24}
      color={color}
      style={{
        marginBottom: 4,
        opacity: focused ? 1 : 0.8,
        transform: [{ scale: focused ? 1.1 : 1 }],
      }}
    />
  );

  const screenOptions = {
    ...tabBarStyles,
    tabBarShowLabel: true,
    tabBarHideOnKeyboard: true,
    headerShown: false,
  };

  return (
    <Tabs screenOptions={screenOptions}>
      <Tabs.Screen
        name="home"
        options={{
          title: "Home",
          tabBarIcon: ({ color, focused }) => (
            <TabIcon name="home" focused={focused} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="map"
        options={{
          title: "Map",
          tabBarIcon: ({ color, focused }) => (
            <TabIcon name="map" focused={focused} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="feed"
        options={{
          title: "Feed",
          tabBarIcon: ({ color, focused }) => (
            <TabIcon name="newspaper-variant" focused={focused} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="resources"
        options={{
          title: "Resources",
          tabBarIcon: ({ color, focused }) => (
            <TabIcon name="bookmark" focused={focused} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="report"
        options={{
          title: "Report",
          tabBarIcon: ({ color, focused }) => (
            <TabIcon name="alert-circle" focused={focused} color={color} />
          ),
        }}
      />
    </Tabs>
  );
};

export default TabsLayout;
