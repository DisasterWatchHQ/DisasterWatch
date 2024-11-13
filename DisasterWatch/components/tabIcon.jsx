import { Text, View, Image } from 'react-native';
import React from 'react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const TabIcon = ({ icon, color, name, focused}) => {
  
  return (
    <View className=" items-center justify-center ">
      <Icon 
        name={icon} 
        size={35} 
        color={focused ? '#ad7712' : color}
        className="w-10 h-10"
      />
      <Text className={`${focused ? 'font-semibold' : 'font-regular'} text-xs`}
        style={{ color: color }}
      >
        {name}
      </Text>
    </View>
  )
};

export default TabIcon;

