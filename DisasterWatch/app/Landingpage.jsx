import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Alert } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
// import AppHeader from './components/appheader';



const LandingPage = () => {
  const handlePress = () => {
    Alert.alert("More Info", "Details about the flood warning");
  };

  return (
    <>
      <View style={styles.layoutContainer}>
        <AppHeader/>
        <View style={styles.container}>
          <View  style={styles.line1}>
          <MaterialIcons name="warning-amber" size={40} color="red" style={styles.icon} />
          <Text style={styles.text1}>  Flood broke out nearby</Text>
          </View >
          
          <View style={styles.fullline}>
          <View style={styles.line}>
          <Text style={styles.text2}>Estimated 4 ft, about 10KM</Text>
          <Text style={styles.text3}>away. Tap to know more</Text>
          <Text style={styles.text4}>2 hours ago.</Text>
          </View>
          <View>
          <MaterialIcons name="keyboard-arrow-right" size={40} color="black" style={styles.icon}  />
          </View>
          </View>
        </View>
      </View>
      
      <View style={styles.buttonContainer}>
      {/* Button 1 */}
      <TouchableOpacity onPress={() => handlePress('First Button')} 
      style={[styles.button, { backgroundColor: '#000000', borderColor:'#000000', borderWidth: 1, borderRadius:3}]}>
        <View style={styles.buttonalign}>
        <View style={styles.circle} />
        <Text style={[styles.buttonText,{color: '#FFFFFF'}]}>Emergency</Text>
          <MaterialIcons name="keyboard-arrow-right" size={30} color="white" style={styles.icon} />
          </View>
      </TouchableOpacity>

      {/* Button 2 */}
      <TouchableOpacity onPress={() => handlePress('Second Button')} 
       style={[styles.button, { backgroundColor: '#FFFFFF', borderColor:'#000000', borderWidth: 1, borderRadius:3}]}>
      <View style={styles.buttonalign}>
        <View style={styles.circle} />
        <Text style={[styles.buttonText,{color: '#000000'}]}>Guide</Text>
          <MaterialIcons name="keyboard-arrow-right" size={30} color="black" style={styles.icon} />
          </View>
      </TouchableOpacity>

      {/* Button 3 */}
      <TouchableOpacity onPress={() => handlePress('Third Button')} 
       style={[styles.button, { backgroundColor: '#FFFFFF', borderColor:'#000000', borderWidth: 1, borderRadius:3}]}>
        <View style={styles.buttonalign}>
        <View style={styles.circle} />
        <Text style={[styles.buttonText,{color: '#000000'}]}>Dashbord</Text>
          <MaterialIcons name="keyboard-arrow-right" size={30} color="black" style={styles.icon} />
          </View>
      </TouchableOpacity>
    </View>
    </>
  );
};

export default LandingPage;

const styles = StyleSheet.create({
  layoutContainer: {
    flex: 1,
    alignItems: 'center',
  },
  container: {
    width: '95%',
    height: 300,
    borderRadius: 15,
    borderColor: '#808080',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    marginTop: 20,
    padding: 10,
  },
  icon: {
    marginBottom: 5,
  },
  text1: {
    color: 'black',
    fontSize: 18,
    fontWeight: 'bold',
  },
  text2: {
    color: 'black',
    fontSize: 16,
    alignItems:'flex-start'
    
  },
  text3: {
    color: 'black',
    fontSize: 16,
    alignItems:'stretch'
  },
  text4: {
    color: 'gray',
    fontSize: 14,
  },
  fullline:{
    flexDirection: 'row',
    alignItems:'flex-start',
  },
  line :{
    flexDirection: 'column',
    alignItems:'center',
  },

  line1:{
  flexDirection: 'row',
  alignItems:'center',
},
  
  buttonContainer: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'stretch',
    padding: 5,
    marginBottom : 100,
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
    marginBottom: 10,
  },
  circle: {
    width: 35,
    height: 35,
    borderRadius: 45,
    backgroundColor: '#808080',
    padding: 15,
    marginTop:-10,
  },
  buttonalign:{
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom:-10,
    }
});
