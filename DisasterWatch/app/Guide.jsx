import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import AppHeader from '../components/appheader';
import AntDesign from 'react-native-vector-icons/AntDesign';
import AppFooter from '../components/appFooter';

const Guide = () => {
  return (
    <>
      <AppHeader />
      <AntDesign name="arrowleft" size={40} color="black" style={styles.icon} />
      <Text style={styles.Text1}>Prepare yourself for the disaster</Text>
      <View style={styles.container}>
        {[...Array(3)].map((_, index) => (
          <View key={index} style={styles.GuideBox}>
            <View style={styles.smallBox} />
            <Text style={styles.GuideText}>Label </Text>
          </View>
        ))}
      </View>
      <Text style={styles.Text2}>Do's and Dont's</Text>
      <Text style={styles.Text3}>Before the disaster</Text>
      <View style={styles.container}>
        {[...Array(3)].map((_, index) => (
          <View key={index} style={styles.GuideBox}>
            <View style={styles.smallBox} />
            <Text style={styles.GuideText}>Label </Text>
          </View>
        ))}
      </View>
      <Text style={styles.Text4}>During the disaster</Text>
      <View style={styles.container}>
        {[...Array(3)].map((_, index) => (
          <View key={index} style={styles.GuideBox}>
            <View style={styles.smallBox} />
            <Text style={styles.GuideText}>Label </Text>
          </View>
        ))}
      </View>
      <AppFooter/>
    </>
  );
};

export default Guide;

const styles = StyleSheet.create({
  Text1: {
    marginTop: -5,
    marginLeft: 20,
    fontSize: 15,
    fontWeight: '500',
  },
  container: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginTop: 10,
    paddingHorizontal: 10,
  },
  GuideBox: {
    alignItems: 'flex-end',
    marginBottom: 15,
    width: '50%', 
  },
  smallBox: {
    backgroundColor: '#898989',
    height: 115,
    width: 115,
    marginBottom: 10,
  },
  GuideText: {
    fontSize: 14,
    textAlign: 'center',
    marginRight:35,
    marginTop:-5
  },
  Text2: {
    marginTop: 3,
    marginLeft: 16,
    fontSize: 23,
    fontWeight: '700',
  },
  Text3: {
    marginTop: 2,
    marginLeft: 20,
    fontSize: 15,
    fontWeight: '500',
  },
  Text4: {
    marginTop: -2,
    marginLeft: 20,
    fontSize: 15,
    fontWeight: '500',
  },
});
