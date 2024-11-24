import { StyleSheet, Text, View } from 'react-native';
import React from 'react';

import AntDesign from 'react-native-vector-icons/AntDesign';
import AppHeader from '../components/appheader';
import AppFooter from '../components/appFooter';



const Categories = () => {
  return (
    <View style={styles.pageContainer}>
      <AppHeader/>
      <View style={styles.header}>
        <AntDesign name="arrowleft" size={25} color="black" style={styles.icon} />
        <Text style={styles.headerText}>Select the category</Text>
      </View>
      <View style={styles.container}>
        {[...Array(8)].map((_, index) => (
          <View key={index} style={styles.categoryBox}>
            <View style={styles.smallBox} />
            <Text style={styles.categoryText}>Category name</Text>
          </View>
        ))}
      </View>
      <AppFooter/>
    </View>
  );
};

export default Categories;

const styles = StyleSheet.create({
  pageContainer: {
    flex: 1, // Allows the main content to expand and positions footer at bottom
    justifyContent: 'space-evenly',
   
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
  },
  icon: {
    marginRight: 10,
  },
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
   
    
  },
  categoryBox: {
    alignItems: 'center',
    marginBottom: 9,
    width: '40%', 
  },
  smallBox: {
    backgroundColor: '#898989',
    height: 115,
    width: 115,
    marginBottom: 0,
  },
  categoryText: {
    fontSize: 14,
    textAlign: 'center',
  },
});
