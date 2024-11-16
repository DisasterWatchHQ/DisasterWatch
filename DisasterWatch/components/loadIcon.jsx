import { Text, View } from 'react-native';
import React from 'react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const LoadIcon = ({ name, color }) => {
  return (
    <View style={{ alignItems: 'center', justifyContent: 'center' }}>
     
      <Icon name={name} size={30} color={color} />
    </View>
  );
};

export default LoadIcon;
