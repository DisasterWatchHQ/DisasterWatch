import { Text, View, Pressable } from 'react-native';
import LoadIcon from './loadIcon';
import React from 'react';
import { Link, useRouter } from 'expo-router';

const WarningMain = ({ 
  alertOrWarning = 'alert', 
  notificationText, 
  distance = '10KM',
  height = '4 ft',
  timeAgo = '2 hours ago',
  containerStyle 
}) => {
  const router = useRouter();

  const isAlert = alertOrWarning === 'alert';
  const borderColor = isAlert ? 'border-yellow-500' : 'border-red-500';
  const bgColor = isAlert ? 'bg-yellow-500/10' : 'bg-red-500/10';
  const iconColor = isAlert ? '#EAB308' : '#EF4444';

  return (
    <Pressable 
      onPress={() => router.push('/DetailedAlert')}
      className={`
        mx-4 my-2 p-4
        border-2 ${borderColor} ${bgColor}
        rounded-xl
        shadow-md
        ${containerStyle}
      `}
    >
      {/* Header */}
      <View className="flex-row items-center space-x-2 mb-3">
        <LoadIcon 
          name={isAlert ? 'alert-circle' : 'alert-decagram'} 
          color={iconColor}
          size={24}
        />
        <Text className="text-white text-xl font-bold flex-1">
          {notificationText}
        </Text>
      </View>

      {/* Content */}
      <View className="space-y-2 mb-4">
        <View className="flex-row justify-between">
          <Text className="text-neutral-300">Estimated Height:</Text>
          <Text className="text-white font-semibold">{height}</Text>
        </View>
        <View className="flex-row justify-between">
          <Text className="text-neutral-300">Distance:</Text>
          <Text className="text-white font-semibold">{distance} away</Text>
        </View>
      </View>

      {/* Footer */}
      <View className="flex-row justify-between items-center mt-2">
        <Text className="text-neutral-400 text-sm">
          {timeAgo}
        </Text>
        <Link 
          href="/DetailedAlert" 
          className="text-sm font-semibold"
          style={{ color: iconColor }}
        >
          View Details →
        </Link>
      </View>
    </Pressable>
  );
};

export default WarningMain;