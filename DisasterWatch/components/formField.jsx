import { Text, TextInput, View, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import React from 'react';

const FormField = ({ title, value, placeholder, handleChangeText, otherStyles, ...props }) => {
  
  const [showPassword, setShowPassword] = React.useState(false);
  const EyeIcon = <Icon name="eye" size={20} color="#fff" className="w-6 h-6" resizeMode="contain" />
  const EyeIconOFF = <Icon name="eye-off" size={20} color="#fff" className="w-6 h-6" resizeMode="contain"/>
  
  return (
    <View className={`space-y-2 ${otherStyles}`}>
      <Text className="text-base text-gray-100 font-medium">{title}</Text>
      
      <View className="border-2 border-red-500 w-full h-16 px-4 bg-black-100 rounded-2xl 
        focus:border-orange-400 items-center flex-row">
          <TextInput 
          className="flex-1 text-white font-semibold text-base"
          value={value}
          placeholder={placeholder}
          placeholderTextColor="#7b7b8b"
          onChangeText={handleChangeText}
          secureTextEntry={title === 'Password' && !showPassword}
          />
          
          {title === 'Password' && (
          <TouchableOpacity onPress={() =>
            setShowPassword(!showPassword)}>
              {!showPassword ? EyeIconOFF : EyeIcon }
          </TouchableOpacity>
          )}
          
      </View>
    </View>
  )
};

export default FormField;

