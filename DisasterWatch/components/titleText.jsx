import { Text, View } from 'react-native'
import React from 'react'

const TitleText = ({ title, containerStyles }) => {
  return (
    <View>
      <Text className={`${containerStyles}`}>{title}</Text>
    </View>
  )
}

export default TitleText
