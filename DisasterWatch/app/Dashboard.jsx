import { TextInput,TouchableOpacity, StyleSheet, Text, View } from 'react-native';
import React from 'react';

import { MaterialIcons } from '@expo/vector-icons';
import AppFooter from './components/appFooter';


const Dashboard = () => {

  return (
    <>
     
      <View style={styles.header}>
        <View style={styles.locationContainer}>
          <View style={styles.circle} />
          <View style={styles.textContainer}>
            <Text style={styles.text0}>Your Location</Text>
            <Text style={styles.text1}>Your Location</Text>
          </View>
        </View>
        <TouchableOpacity 
          onPress={() => handlePress('Third Button')}
          style={styles.button}
        >
          <Text style={styles.buttonText}>Change</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.bigcontainer}/>
      <View style={styles.container}>
          <View  style={styles.line1}>
          <MaterialIcons name="warning-amber" size={40} color="red" style={styles.icon} />
          <Text style={styles.text5}>  Flood broke out nearby</Text>
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
          <Text style={styles.text6}>Do you have an emergency situation?</Text>
          <Text style={styles.text7}>Select the type:</Text>
      <TextInput
        style={[styles.textInput]}
        placeholder="Type of Disaster"
      />
      <TouchableOpacity 
          onPress={() => handlePress('Third Button')}
          style={styles.button1}
        >
          <Text style={styles.buttonText1}>Next</Text>
        </TouchableOpacity>
        <AppFooter/>
    </>
  );
};

export default Dashboard;

const styles = StyleSheet.create({
  circle: {
    width: 60,
    height: 60,
    borderRadius: 35,
    backgroundColor: '#808080',
    marginRight: 10,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  textContainer: {
    flex: 1,
  },
  text0: {
    color: 'black',
    fontSize: 18,
    fontWeight: 'bold',
  },
  text1: {
    color: 'gray',
    fontSize: 14,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    padding: 10,
    marginLeft:10,
    marginRight:90,
  },
  button: {
    paddingVertical: 9,
    paddingHorizontal: 10,
    backgroundColor: '#FFFFFF',
    borderColor: '#000000',
    borderWidth: 1,
    borderRadius: 3,
  },
  buttonText: {
    color: 'black',
    fontSize: 16,
  },
  bigcontainer:{
    width: '100%',
    height: 200,
    backgroundColor: '#808080',
    marginTop: 5,
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
container: {
  width: '95%',
  height: 150,
  borderRadius: 15,
  borderColor: '#808080',
  alignItems: 'center',
  justifyContent: 'center',
  borderWidth: 3,
  marginTop: 20,
  padding: 10,
  marginLeft:7
},
icon: {
  marginBottom: 5,
},
text5: {
  color: 'black',
  fontSize: 18,
  fontWeight: 'bold',
},
text6: {
  color: 'black',
  fontSize: 20,
  fontWeight: '900',
  marginTop:25,
  marginLeft:10
},
text7: {
  color: 'black',
  fontSize: 15,
  fontWeight: '500',
  marginTop:5,
  marginLeft:10
},
textInput: {
  height: 40,
  width: '95%',
  marginLeft:10,
  alignItems:'baseline',
  backgroundColor:'gray',
  borderRadius: 5,
  paddingLeft: 10,
  marginBottom: 20,
  marginTop:5
},
button1: {
  width:'30%',
  height:35,
  marginLeft:10,
  backgroundColor: 'black',
  borderWidth: 1,
  borderRadius: 3,
},
buttonText1: {
  textAlign: 'center',
  color:'#FFFFFF',
  fontSize: 16,
  marginBottom: 5,
  marginTop:4,
},
});
