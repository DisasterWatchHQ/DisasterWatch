import { Text, View } from 'react-native';
import LoadIcon from './loadIcon';
import React from 'react';
import { Link } from 'expo-router';

const WarningMain = ({ alertOrWarning, notificationText, containerStyle }) => {
  return (
    <View className={`flex-1 p-2 justify-between items-center border-4 ${alertOrWarning === 'alert' ? 'border-yellow-500 rounded-xl' : 'border-red-500 rounded-xl'} ${containerStyle}`}>
      <View className="flex-row justify-center items-center">
        <LoadIcon 
          name={alertOrWarning === 'alert' ? 'alert-circle' : 'alert-decagram'} 
          color={alertOrWarning === 'alert' ? 'yellow' : 'red'} 
        />
        <Text className="text-2xl font-black">{notificationText}</Text>
      </View>
      <View className="flex-1 justify-center items-center">
        <Text>
          Estimated 4 ft, about 10KM away.
        </Text>
        <Link href="/DetailedAlert" className="decoration-2 underline text-sm text-blue-900 font-bold">
          Tap to know more
        </Link>
      </View>
      <Text className="text-sm text-gray-500 font-bold">
        2 hours ago
      </Text>
    </View>
  )
};

export default WarningMain;

