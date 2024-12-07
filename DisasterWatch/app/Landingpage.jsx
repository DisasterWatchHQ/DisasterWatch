import React, { useState, useCallback } from 'react';
import { Redirect, router } from 'expo-router';
import { 
  Text, 
  View, 
  TouchableOpacity, 
  Alert, 
  ScrollView,
  ActivityIndicator 
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { SafeAreaView } from 'react-native-safe-area-context';
import AppHeader from '../components/appheader';
import CustomerButton from '../components/customButton';
import WarningMain from '../components/warningMain';
import HeaderBar from '../components/headerBar';

// Sample warning data - replace with actual data source
const warningData = [
  {
    id: '1',
    type: 'alert',
    text: 'Flood broke out nearby',
    severity: 'high',
    timestamp: new Date(),
  },
  {
    id: '2',
    type: 'alert',
    text: 'Heavy rainfall expected',
    severity: 'medium',
    timestamp: new Date(),
  },
  {
    id: '3',
    type: 'warning',
    text: 'Possible landslide risk',
    severity: 'high',
    timestamp: new Date(),
  },
  {
    id: '4',
    type: 'warning',
    text: 'Strong winds expected',
    severity: 'low',
    timestamp: new Date(),
  },
];

const LandingPage = () => {
  const [warnings, setWarnings] = useState(warningData);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Handle emergency button press
  const handleEmergency = useCallback(() => {
    Alert.alert(
      "Emergency Alert",
      "Are you sure you want to report an emergency?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        { 
          text: "Yes", 
          onPress: () => router.push('/DetailedAlert'),
          style: 'destructive'
        }
      ]
    );
  }, []);

  // Navigation handlers
  const navigationButtons = [
    {
      title: "Emergency",
      style: "bg-red-700",
      onPress: handleEmergency,
      icon: "warning"
    },
    {
      title: "Guide",
      style: "bg-yellow-700",
      onPress: () => router.push('/(tabs)/guides'),
      icon: "menu-book"
    },
    {
      title: "Dashboard",
      style: "bg-green-700",
      onPress: () => router.push('/(tabs)/home'),
      icon: "dashboard"
    }
  ];

  // Warning press handler
  const handleWarningPress = (warning) => {
    Alert.alert(
      warning.type === 'alert' ? "Alert Details" : "Warning Details",
      `${warning.text}\nSeverity: ${warning.severity}\nTime: ${warning.timestamp.toLocaleTimeString()}`,
      [{ text: "OK" }]
    );
  };

  if (error) {
    return (
      <SafeAreaView className="bg-teal-600 h-full justify-center items-center">
        <Text className="text-white text-lg">Something went wrong!</Text>
        <TouchableOpacity 
          onPress={() => setError(null)}
          className="mt-4 p-2 bg-white rounded-lg"
        >
          <Text className="text-teal-600">Try Again</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="bg-neutral-800 flex-1">
      <HeaderBar />
      <ScrollView 
        className="flex-1"
        showsVerticalScrollIndicator={false}
      >
        <View className="w-full px-4 py-6">
          {/* Warnings Section */}
          <View className="mb-6">
            {isLoading ? (
              <ActivityIndicator size="large" color="#fff" />
            ) : (
              warnings.map((warning) => (
                <WarningMain 
                  key={warning.id}
                  alertOrWarning={warning.type}
                  notificationText={warning.text}
                  containerStyle="mt-6"
                  onPress={() => handleWarningPress(warning)}
                />
              ))
            )}
          </View>

          {/* Navigation Buttons */}
          <View className="w-full">
            {navigationButtons.map((button, index) => (
              <CustomerButton 
                key={index}
                title={button.title}
                containerStyles={`${button.style} rounded-xl min-h-[62px] flex flex-row justify-center items-center mt-5`}
                handlePress={button.onPress}
                textStyles="text-white font-semibold text-lg"
                isLoading={isLoading}
                icon={
                  <MaterialIcons 
                    name={button.icon} 
                    size={24} 
                    color="white" 
                    style={{ marginRight: 8 }}
                  />
                }
              />
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default LandingPage;