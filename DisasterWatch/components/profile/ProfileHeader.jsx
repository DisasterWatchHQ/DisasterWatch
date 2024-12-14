import React from 'react';
import { View, Text, Image, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const ProfileHeader = ({ user }) => (
  <View className="p-6 border-b border-neutral-700">
    <View className="items-center">
      <View className="relative">
        <Image
          source={{ uri: 'https://via.placeholder.com/100' }}
          className="w-24 h-24 rounded-full"
        />
        <TouchableOpacity 
          className="absolute bottom-0 right-0 bg-blue-500 p-2 rounded-full"
          onPress={() => Alert.alert("Change photo")}
        >
          <Ionicons name="camera" size={20} color="white" />
        </TouchableOpacity>
      </View>
      <Text className="text-white text-xl font-bold mt-4">{user.name}</Text>
      <Text className="text-neutral-400 mt-1">{user.email}</Text>
      <Text className="text-neutral-500 text-sm mt-1">{user.joinDate}</Text>
    </View>
  </View>
);

export default ProfileHeader;