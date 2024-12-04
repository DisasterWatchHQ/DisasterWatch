import { Text, View, TouchableOpacity } from 'react-native';
import React from 'react';
import { ActivityIndicator } from "react-native";

const CustomerButton = ({ title, handlePress, containerStyles, textStyles, isLoading }) => {
  return (
    <TouchableOpacity
      onPress={handlePress}
      activeOpacity={0.7}
      className={`rounded-xl h-[62px] flex flex-row justify-center items-center ${containerStyles} ${isLoading ? "opacity-50" : ""
        }`}
      disabled={isLoading}
    >
      <Text className={`text-primary font-psemibold text-lg ${textStyles}`} >{title}</Text>
      {isLoading && (
             <ActivityIndicator
               animating={isLoading}
               color="#fff"
               size="small"
               className="ml-2"
             />
           )}
    </TouchableOpacity>
  )
};

export default CustomerButton;

