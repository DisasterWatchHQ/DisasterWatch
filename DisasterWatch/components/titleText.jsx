import { Text, View } from 'react-native'
import React from 'react'

const TitleText = ({ title, containerStyles }) => {
  return (
    <View className="items-center justify-center">
      <Text className={`${containerStyles} items-center justify-center`}>{title}</Text>
    </View>
  )
}

export default TitleText
