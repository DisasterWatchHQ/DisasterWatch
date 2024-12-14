import React from 'react';
import { TouchableOpacity, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const ProfileOption = ({ icon, title, onPress, danger }) => (
  <TouchableOpacity 
    onPress={onPress}
    className="flex-row items-center p-4 border-b border-neutral-700"
  >
    <Ionicons 
      name={icon} 
      size={24} 
      color={danger ? "#ef4444" : "#fff"} 
    />
    <Text className={`ml-3 text-lg ${danger ? "text-red-500" : "text-white"}`}>
      {title}
    </Text>
    <Ionicons 
      name="chevron-forward" 
      size={24} 
      color={danger ? "#ef4444" : "#d4d4d4"} 
      style={{ marginLeft: 'auto' }} 
    />
  </TouchableOpacity>
);

export default ProfileOption;