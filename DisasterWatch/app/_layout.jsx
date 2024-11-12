import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { Slot } from 'expo-router';

const RootLayout = () => {
  return (
    <>
      <Text> Header </Text>
        <Slot />
      <Text> Footer </Text>
    </>
  )
};

export default RootLayout;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    display: 'flex',
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
