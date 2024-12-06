import { Text, View } from 'react-native';
import React from 'react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const TabIcon = ({ icon, color, name, focused }) => {
  return (
    <View style={{ alignItems: 'center', justifyContent: 'center', marginTop: 7 }}>
     
      <Icon name={icon} size={30} color={focused ? '#FFF176' : color} />
     
      {name && <Text style={{ color: focused ? '#FFF176' : color, fontSize: 10 }}>{name}</Text>}
    </View>
  );
};

export default TabIcon;
