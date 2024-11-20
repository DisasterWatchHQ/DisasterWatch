import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import React from 'react';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import AppFooter from '../components/appFooter';
import DisasterCard from '../components/DisasterCard';

const DetailedAlert = () => {
  const handleArrowPress = () => {
    console.log('Arrow pressed');
  };

  const handlePress = (button) => {
    console.log(`${button} pressed`);
  };

  return (
    <>
      <DisasterCard
        disaster="Flood"
        distance="10Km away"
        timeAgo="2 hours ago"
        onArrowPress={handleArrowPress}
      />

      <Text style={styles.text4}>Guides</Text>

      <View style={styles.smallBoxContainer}>
        <View style={styles.smallBox} />
        <View style={styles.smallBox} />
        <View style={styles.smallBox} />
      </View> 

      <TouchableOpacity 
        onPress={() => handlePress('First Button')} 
        style={[styles.button, { backgroundColor: '#000000', borderColor: '#000000', borderWidth: 1, borderRadius: 3 }]}
      >
        <View style={styles.buttonalign}>
          <Text style={[styles.buttonText, { color: '#FFFFFF' }]}>For more Details</Text>
          <MaterialIcons name="keyboard-arrow-right" size={30} color="white" style={styles.icon} />
        </View>
      </TouchableOpacity>

      <View style={styles.header}>
        <View style={styles.locationContainer}>
          <View style={styles.circle} />
          <View style={styles.textContainer}>
            <Text style={styles.text5}>Your Location</Text>
            <Text style={styles.text6}>Your Location</Text>
          </View>
          <TouchableOpacity 
            onPress={() => handlePress('Third Button')}
            style={styles.button2}
          >
            <Text style={[styles.buttonText, { color: 'black', textAlign: 'center' }]}>Change</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.container2} />
      <AppFooter/>
    </>
  );
};

export default DetailedAlert;

const styles = StyleSheet.create({
  text4: {
    color: '#000000',
    fontSize: 30,
    fontWeight: '500',
    marginStart: 155,
    marginTop: 20,
    marginBottom: 10,
  },
  smallBox: {
    backgroundColor: '#898989',
    height: 70,
    width: 70,
    marginLeft: 10,
  },
  smallBoxContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginBottom: 20,
  },
  container2: {
    width: '100%',
    height: 220,
    backgroundColor: '#808080',
    marginBottom: -60,
  },
  button: {
    width: '90%',
    height: 55,
    padding: 15,
    backgroundColor: '#000000',
    marginLeft: 20,
    marginBottom: 20,
  },
  buttonText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#FFFFFF',
  },
  buttonalign: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  circle: {
    width: 60,
    height: 60,
    borderRadius: 35,
    backgroundColor: '#808080',
    marginRight: 10,
  },
  text5: {
    color: 'black',
    fontSize: 18,
    fontWeight: 'bold',
  },
  text6: {
    color: 'black',
    fontSize: 14,
  },
  textContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 0,
    marginLeft: 20,
    marginBottom: 10,
  },
  button2: {
    borderColor: 'black',
    borderWidth: 1,
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderRadius: 5,
    marginLeft: 30,
  },
});
