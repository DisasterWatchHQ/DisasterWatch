import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function AppHeader() {
  return (
    <View style={styles.headerContainer}>
      <Text style={styles.appName}>Disaster Watch</Text>
      <View style={styles.circle} />
    </View>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'stretch',
    padding: 15,
    backgroundColor: '#f8f8f8',
    width: '100%',
  },
  circle: {
    width: 60,
    height: 60,
    borderRadius: 45,
    backgroundColor: '#007bff',
  },
  appName: {
    fontSize: 35,
    fontWeight: 'bold',
    color: '#333',
  },
});
