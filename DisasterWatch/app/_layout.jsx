import { Text, View } from 'react-native';
import React from 'react';
import { Tabs } from 'expo-router';
import { useTheme } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const TabsLayout = () => {
  const theme = useTheme();

  return (
    <Tabs
      screenOptions={{
        tabBarStyle: {
          backgroundColor: theme.colors.elevation.level2,
          borderTopColor: theme.colors.primary,
          borderTopWidth: 2,
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
          elevation: 8,
        },
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.onSurfaceVariant,
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
        },
        headerStyle: {
          backgroundColor: theme.colors.elevation.level2,
        },
        headerTintColor: theme.colors.onSurface,
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Tabs.Screen 
        name="home"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, focused }) => (
            <Icon 
              name={focused ? 'home' : 'home-outline'} 
              size={24} 
              color={color} 
            />
          ),
        }}
      />
      <Tabs.Screen
        name="map"
        options={{
          title: 'Map',
          tabBarIcon: ({ color, focused }) => (
            <Icon 
              name={focused ? 'map' : 'map-outline'} 
              size={24} 
              color={color} 
            />
          ),
        }}
      />
    </Tabs>
  );
};

export default TabsLayout;
