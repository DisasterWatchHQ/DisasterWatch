import React, { useState } from 'react';
import { ScrollView, Text, Alert, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import ProfileOption from '../components/profile/ProfileOption';
import ProfileHeader from '../components/profile/ProfileHeader';
import ProfileStats from '../components/profile/ProfileStats';

const Profile = () => {
  const [user] = useState({
    name: "John Doe",
    email: "john.doe@example.com",
    location: "New York, USA",
    joinDate: "Member since Jan 2024"
  });

  const handleLogout = () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Logout",
          onPress: () => router.push("/signIn"),
          style: "destructive"
        }
      ]
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-neutral-800">
      <ScrollView>
        <ProfileHeader user={user} />
        <ProfileStats />
        <View className="mt-4">
          <ProfileOption
            icon="person-outline"
            title="Edit Profile"
            onPress={() => Alert.alert("Edit Profile")}
          />
          <ProfileOption
            icon="notifications-outline"
            title="Notifications"
            onPress={() => Alert.alert("Notifications")}
          />
          <ProfileOption
            icon="location-outline"
            title="Location Settings"
            onPress={() => Alert.alert("Location Settings")}
          />
          <ProfileOption
            icon="shield-outline"
            title="Privacy & Security"
            onPress={() => Alert.alert("Privacy & Security")}
          />
          <ProfileOption
            icon="help-circle-outline"
            title="Help & Support"
            onPress={() => Alert.alert("Help & Support")}
          />
          <ProfileOption
            icon="information-circle-outline"
            title="About"
            onPress={() => Alert.alert("About")}
          />
          <ProfileOption
            icon="log-out-outline"
            title="Logout"
            danger
            onPress={handleLogout}
          />
        </View>
        <Text className="text-neutral-500 text-center py-4 mt-4">
          Version 1.0.0
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Profile;