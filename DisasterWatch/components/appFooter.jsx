import React from 'react';
import { StyleSheet, View } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Feather from 'react-native-vector-icons/Feather';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';

const AppFooter = () => {
  return (
    <View style={styles.container}>
      <View style={styles.footer}>
        <MaterialCommunityIcons name="newspaper-variant-multiple" size={40} color="black" style={styles.icon} />
        <Feather name="home" size={40} color="black" style={styles.icon} />
        <FontAwesome6 name="location-dot" size={40} color="black" style={styles.icon} />
      </View>
    </View>
  );
};

export default AppFooter;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 50,
    marginTop: 70,
    backgroundColor: '#808080', 
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
    marginTop: 5
  }
});
