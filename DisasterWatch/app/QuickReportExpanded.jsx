import { TouchableOpacity, StyleSheet, Text, View, TextInput } from 'react-native';
import React from 'react';
import AppHeader from '../components/appheader';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Feather from 'react-native-vector-icons/Feather';
import AppFooter from '../components/appFooter';

const QuickReportExpanded = () => {
  return (
    <>
      <AppHeader />
      <AntDesign name="arrowleft" size={45} color="black" style={styles.icon} />

      {/* Emergency Contacts Section */}
      <TouchableOpacity style={styles.button}>
        <View style={styles.buttonAlign}>
          <View style={styles.circle} />
          <Text style={styles.buttonText}>Emergency Contacts</Text>
          <Feather name="chevron-down" size={40} color="black" />
        </View>
      </TouchableOpacity>
      <View style={styles.emergencyContainer}>
        {/* Displaying the emergency contacts (placeholder) */}
        <View style={styles.contactRow}>
          <View style={styles.contactItem}>
            <View style={styles.alignmentvertical}>
            <View style={styles.contactCircle} />
            <View style={styles.alignmenthorizontal}>
            <Text style={styles.contactText}>Name</Text>
            <Text style={styles.contactText}>Contact</Text>
            </View>
          </View>
          </View>
          <View style={styles.contactItem}>
            <View style={styles.alignmentvertical}>
            <View style={styles.contactCircle} />
            <View style={styles.alignmenthorizontal}>
            <Text style={styles.contactText}>Name</Text>
            <Text style={styles.contactText}>Contact</Text>
            </View>
          </View>
          </View>
        </View>
        <View style={styles.contactRow}>
          <View style={styles.contactItem}>
            <View style={styles.alignmentvertical}>
            <View style={styles.contactCircle} />
            <View style={styles.alignmenthorizontal}>
            <Text style={styles.contactText}>Name</Text>
            <Text style={styles.contactText}>Contact</Text>
          </View>
          </View>
          </View>
          <View style={styles.contactItem}>
            <View style={styles.alignmentvertical}>
            <View style={styles.contactCircle} />
            <View style={styles.alignmenthorizontal}>
            <Text style={styles.contactText}>Name</Text>
            <Text style={styles.contactText}>Contact</Text>
          </View>
          </View>
          </View>
        </View>
        <TouchableOpacity style={styles.addButton}>
          <Text style={styles.addButtonText}>Add</Text>
        </TouchableOpacity>
      </View>

      {/* Report Incident Section */}
      <View style={styles.conatinerspace}/>
      <TouchableOpacity style={styles.button1}>
        <View style={styles.buttonAlign}>
          <View style={styles.circle} />
          <Text style={styles.buttonText}>Report Incident</Text>
          <Feather name="chevron-down" size={40} color="black" />
        </View>
      </TouchableOpacity>
      <View style={styles.reportContainer}>
        {/* Location and incident details */}
        <View style={styles.locationContainer}>
          <View style={styles.locationCircle} />
          <View style={styles.textContainer}>
            <Text style={styles.locationText}>Your Location</Text>
            <Text style={styles.locationText1}>Your Location</Text>
          </View>
          <TouchableOpacity style={styles.changeButton}>
            <Text style={styles.changeButtonText}>Change</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.incidentLabel}>Incident Details</Text>
        <TextInput
          style={styles.incidentInput}
          placeholder="Explain the incident briefly"
          placeholderTextColor="#808080"
          multiline
        />
        <TouchableOpacity style={styles.submitButton}>
          <Text style={styles.submitButtonText}>Submit</Text>
        </TouchableOpacity>
      </View>

      <AppFooter />
    </>
  );
};

export default QuickReportExpanded;

const styles = StyleSheet.create({
  icon: {
    marginLeft: 10,
    marginVertical: 1,
    marginBottom:38
  },
  button: {
    width: '90%',
    height: 58,
    marginLeft: 20,
    marginTop: 10,
    borderColor: '#000',
    borderWidth: 1,
    borderRadius: 5,
  },
  buttonAlign: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    marginTop:7
  },
  circle: {
    width: 35,
    height: 35,
    borderRadius: 45,
    backgroundColor: '#808080',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000',
  },

  // Emergency Contacts Section
  emergencyContainer: {
    marginLeft: 20,
    marginRight: 20,
    backgroundColor: '#d3d3d3',
    padding: 5,
    borderRadius: 5,
  },
  contactRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 2,
    marginLeft:5,
    marginBottom:20,
    marginRight:40,
  },
  contactItem: {
    alignItems: 'center',
    justifyContent: 'center', // Center items vertically
  },
  contactCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#808080',
    marginBottom: 5,
  },
  contactText: {
    fontSize: 12,
    color: '#000',
    textAlign: 'center', // Center text horizontally
  },
  addButton: {
    alignSelf: 'flex-end',
    marginTop: -15,
    padding: 5,
    borderWidth: 1,
    borderColor: '#000',
    borderRadius: 5,
    height:30,
    width:80,
    marginRight:5,
    marginBottom:5
  },
  addButtonText: {
    fontSize: 14,
    color: '#000',
    marginLeft:20,
    marginRight:5,
  },

  // Report Incident Section
  reportContainer: {
    marginLeft: 20,
    marginTop: 20,
    backgroundColor: '#d3d3d3',
    padding: 10,
    borderRadius: 5,
    marginLeft:22,
    marginRight:20,
    marginBottom:-30
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,

  },
  locationCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#808080',
    marginRight: 10,
  },
  textContainer: {
    flex: 1,
  },
  locationText: {
    fontSize: 12,
    color: '#000',
  },
  locationText1: {
    fontSize: 18,
    color: '#000',
    fontWeight:'500'
  },
  changeButton: {
    borderWidth: 1,
    borderColor: '#000',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
  },
  changeButtonText: {
    color: '#000',
  },
  incidentLabel: {
    fontSize: 14,
    color: '#000',
    marginBottom: 5,
    fontWeight:'500'
  },
  incidentInput: {
    height: 90,
    backgroundColor: '#e0e0e0',
    borderRadius: 5,
    padding: 10,
    textAlignVertical: 'top',
    color: '#000',
  },
  submitButton: {
    alignSelf: 'flex-end',
    marginTop: 10,
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderColor: '#000',
    borderWidth: 1,
    borderRadius: 5,
    marginRight:260,
    
  },
  submitButtonText: {
    fontSize: 14,
    color: '#000',
  },
  alignmentvertical:{
    display:'flex',
    flexDirection:'row',
    alignItems:'center'
  },
  alignmenthorizontal:{
    display:'flex',
    flexDirection:'column',
    marginLeft:5
  },
  conatinerspace:{
    marginBottom:25
  },
  button1: {
    width: '90%',
    height: 58,
    marginLeft: 20,
    marginTop: 7,
    borderColor: '#000',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom:-20
  },
});
