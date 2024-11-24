import { Text, View } from 'react-native';
import React from 'react';
import TitleText from './titleText';
import CustomerButton from './customButton';

const TopGuides = () => {
  return (
    <View className="items-center justify-center">
      <TitleText title="Guides" containerStyles="text-3xl font-bold items-center justify-Center" />
      
      <CustomerButton 
        title="For more Details"
        handlePress={() => console.log("Pressed")}
        containerStyles="bg-black w-[80vw] mt-7 rounded-xl"
        textStyles="text-white font-semibold text-md"
      />
    </View>
  )
};

export default TopGuides;

