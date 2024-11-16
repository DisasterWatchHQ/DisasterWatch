import React from 'react';
import { Redirect, router } from 'expo-router';
import { StyleSheet, Text, View, TouchableOpacity, Alert, ScrollView } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import AppHeader from '../components/appheader';
import { SafeAreaView } from 'react-native-safe-area-context';
import CustomerButton from '../components/customButton';
import WarningMain from '../components/warningMain';

const LandingPage = () => {
  const handlePress = () => {
    Alert.alert("More Info", "Details about the flood warning");
  };

  return (
    <SafeAreaView className="bg-teal-600 h-full">
      <AppHeader/>
      <ScrollView>
        <View className="w-full justify-center min-h-[85vh] px-4 my-6">
          <View >
            <WarningMain 
              alertOrWarning="alert"
              notificationText="Flood broke out nearby"
              containerStyle="mt-6"
            />
            <WarningMain 
              alertOrWarning="alert"
              notificationText="Flood broke out nearby"
              containerStyle="mt-6"
            />
            <WarningMain 
              alertOrWarning="warning"
              notificationText="Flood broke out nearby"
              containerStyle="mt-6"
            />
            <WarningMain 
              alertOrWarning="warning"
              notificationText="Flood broke out nearby"
              containerStyle="mt-6"
            />
          </View>
          <View className="w-full justify-center ">
            <CustomerButton 
              title="Emergency"
              containerStyles="bg-red-700 rounded-xl min-h-[62px] flex flex-row justify-center items-center mt-5"
              // handlePress={() => router.push('/DetailedAlert')}
              textStyles="text-white font-psemibold text-lg"
              isLoading={false}
            />
            <CustomerButton 
              title="Guide"
              containerStyles="bg-yellow-700 rounded-xl min-h-[62px] flex flex-row justify-center items-center mt-5"
              handlePress={() => router.push('/(tabs)/guides')}
              textStyles="text-white font-psemibold text-lg"
              isLoading={false}
            />
            <CustomerButton 
              title="Dashboard"
              containerStyles="bg-green-700 rounded-xl min-h-[62px] flex flex-row justify-center items-center mt-5"
              handlePress={() => router.push('/(tabs)/home')}
              textStyles="text-white font-psemibold text-lg"
              isLoading={false}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default LandingPage;