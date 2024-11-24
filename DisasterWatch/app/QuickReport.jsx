import { TouchableOpacity,StyleSheet, Text, View } from 'react-native'
import React from 'react'
import AppHeader from '../components/appheader'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import AppFooter from '../components/appFooter';
const QuickReport = () => {
  return (
    <View>
      <AppHeader/>
      <AntDesign name="arrowleft" size={45} color="black" style={styles.icon} />
      <TouchableOpacity onPress={() => handlePress('Second Button')} 
       style={[styles.button, { backgroundColor: '#FFFFFF', borderColor:'#000000', borderWidth: 1, borderRadius:3}]}>
      <View style={styles.buttonalign}>
        <View style={styles.circle} />
        <Text style={[styles.buttonText,{color: '#000000'}]}>Emergency Contact</Text>
          <MaterialIcons name="keyboard-arrow-right" size={30} color="black" style={styles.icon} />
          </View>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => handlePress('Second Button')} 
       style={[styles.button, { backgroundColor: '#FFFFFF', borderColor:'#000000', borderWidth: 1, borderRadius:3}]}>
      <View style={styles.buttonalign}>
        <View style={styles.circle} />
        <Text style={[styles.buttonText,{color: '#000000'}]}>Report incident</Text>
          <MaterialIcons name="keyboard-arrow-right" size={30} color="black" style={styles.icon} />
          </View>
      </TouchableOpacity>
      <View style={styles.appfooteralign}>
      <AppFooter />
      </View>
    </View>
  )
}

export default QuickReport

const styles = StyleSheet.create({
    button: {
        width: '90%',
        height: 55,
        padding: 15,
        backgroundColor: '#000000',
        marginLeft: 20,
        marginBottom: -30,
        marginTop:40
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
        },
        appfooteralign:{
            marginTop:460
        }
})