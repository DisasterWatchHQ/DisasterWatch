import React from 'react';
import { StyleSheet, View, StatusBar } from 'react-native';
import DetailedAlert from './DetailedAlert';
import Dashboard from './Dashboard';

export default function App() {
  return (
    <View style={styles.container}>
      <DetailedAlert/>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
