import { Text, View, TouchableOpacity, ActivityIndicator } from 'react-native';
import React, { memo } from 'react';
import { MaterialIcons } from '@expo/vector-icons';

const CustomerButton = ({ 
  title, 
  handlePress = () => {}, 
  containerStyles = '', 
  textStyles = '', 
  isLoading = false,
  disabled = false,
  leftIcon,
  rightIcon,
  iconSize = 24,
  iconColor = "#fff",
  loadingColor = "#fff",
  variant = 'filled' // filled, outlined, text
}) => {
  // Button state style
  const getButtonStateStyle = () => {
    if (isLoading || disabled) return "opacity-50";
    return "";
  };

  // Variant style
  const getVariantStyles = () => {
    switch (variant) {
      case 'outlined':
        return 'border-2 border-current bg-transparent';
      case 'text':
        return 'bg-transparent';
      default:
        return '';
    }
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      activeOpacity={0.7}
      className={`
        rounded-xl 
        min-h-[62px] 
        flex 
        flex-row 
        justify-center 
        items-center 
        px-4
        ${getVariantStyles()}
        ${containerStyles} 
        ${getButtonStateStyle()}
      `}
      disabled={isLoading || disabled}
    >
      {/* Left Icon */}
      {leftIcon && !isLoading && (
        <View className="mr-2">
          {typeof leftIcon === 'string' ? (
            <MaterialIcons name={leftIcon} size={iconSize} color={iconColor} />
          ) : (
            leftIcon
          )}
        </View>
      )}

      {/* Title and Loading State */}
      <View className="flex-row items-center">
        {isLoading ? (
          <>
            <ActivityIndicator
              animating={true}
              color={loadingColor}
              size="small"
            />
            <Text className={`ml-2 ${textStyles}`}>
              Loading...
            </Text>
          </>
        ) : (
          <Text className={`text-primary font-psemibold text-lg ${textStyles}`}>
            {title}
          </Text>
        )}
      </View>

      {/* Right Icon */}
      {rightIcon && !isLoading && (
        <View className="ml-2">
          {typeof rightIcon === 'string' ? (
            <MaterialIcons name={rightIcon} size={iconSize} color={iconColor} />
          ) : (
            rightIcon
          )}
        </View>
      )}
    </TouchableOpacity>
  );
};

export default memo(CustomerButton);