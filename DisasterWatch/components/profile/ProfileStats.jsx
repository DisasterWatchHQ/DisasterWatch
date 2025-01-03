import React from 'react';
import { View, Text } from 'react-native';

const ProfileStats = () => (
  <View className="flex-row justify-between p-6 border-b border-neutral-700">
    <View className="items-center">
      <Text className="text-white text-xl font-bold">12</Text>
      <Text className="text-neutral-400">Alerts</Text>
    </View>
    <View className="items-center">
      <Text className="text-white text-xl font-bold">5</Text>
      <Text className="text-neutral-400">Saved</Text>
    </View>
    <View className="items-center">
      <Text className="text-white text-xl font-bold">3</Text>
      <Text className="text-neutral-400">Reports</Text>
    </View>
  </View>
);

export default ProfileStats;