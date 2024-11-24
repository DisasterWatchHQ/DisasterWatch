import { Text, View } from 'react-native';
import React from 'react';
import { Tabs, Redirect } from 'expo-router';
import TabIcon from '../../components/tabIcons';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import '../../global.css';

const TabsLayout = () => {
  
  return (
    <>
      <Tabs
        screenOptions={{
          tabBarShowLabel: false,
          tabBarActiveTintColor: '#FFA001',
          tabBarInactiveTintColor: '#CDCDE0',
          tabBarStyle: {
            backgroundColor: '#161622',
            borderTopColor: '#232533',
            borderTopWidth: 1,
            height: 50,
          }
        }}
      >
        <Tabs.Screen 
          name="home"
          options={{
            title: 'Home',
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                icon="home"
                color={color}
                name="Home"
                focused={focused}
              />
            )
          }}
        />
        <Tabs.Screen
          name="map"
          options={{
            title: 'Map',
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                icon="map"
                color={color}
                name="Map"
                focused={focused}
              />
            )
          }}
        />
        <Tabs.Screen
          name="feed"
          options={{
            title: 'Feed',
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                icon="newspaper-variant"
                color={color}
                name="Feed"
                focused={focused}
              />
            )
          }}
        />
        <Tabs.Screen
          name="guides"
          options={{
            title: 'Guides',
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                icon="book"
                color={color}
                name="Guides"
                focused={focused}
              />
            )
          }}
        />
      </Tabs>
    </>
  )
};

export default TabsLayout;
