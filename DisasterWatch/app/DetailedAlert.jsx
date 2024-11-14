import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import React from 'react';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import AppFooter from '../components/appFooter';

const DetailedAlert = () => {
  const handlePress = (button) => {
    console.log(`${button} pressed`);
  };

  return (
    <>
      <View style={styles.bigcontainer1}>
        <AntDesign name="arrowleft" size={40} color="black" style={[styles.icon, { marginTop: 40 }]} />
        <View style={styles.itemsalign}>
          <MaterialIcons name="warning-amber" size={50} color="white" style={styles.icon} />
        </View>
        <Text style={styles.text1}>Flood</Text>
        <Text style={styles.text2}>10Km away</Text>
        <Text style={styles.text3}>2 hours ago</Text>
      </View>
      
      <Text style={styles.text4}>Guides</Text>
      
      <View style={styles.smallBoxContainer}>
        <View style={styles.smallBox} />
        <View style={styles.smallBox} />
        <View style={styles.smallBox} />
      </View> 

      {/* Button placed directly below the small boxes */}
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
      {/* Place container2 directly after the header */}
      <View style={styles.container2} />
      <AppFooter/>
    </>
  );
};

export default DetailedAlert;

const styles = StyleSheet.create({
  bigcontainer1: {
    width: '100%',
    height: 280,
    backgroundColor: '#898989',
    borderRadius: 30,
  },
  itemsalign: {
    marginTop: 5,
    marginLeft: '45%',
  },
  text1: {
    color: 'white',
    fontSize: 30,
    fontWeight: '500',
    marginStart: 165,
  },
  text2: {
    color: 'white',
    fontSize: 20,
    fontWeight: '400',
    marginStart: 145,
  },
  text3: {
    color: 'white',
    fontSize: 15,
    fontWeight: '200',
    marginStart: 155,
    marginTop: 30,
  },
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
