import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Image } from 'react-native';
import TitleText from './titleText'

export default function AppHeader() {
  
  return (
    <View className="flex-row justify-between items-center w-full h-18 px-4 bg-white">
      <TitleText title="DisasterWatch" containerStyles="text-4xl font-extrabold text-center " />
      <Image 
        source={require('../assets/favicon.png')} 
        className="w-15 h-15 rounded-full "
      />
    </View>
  );
}