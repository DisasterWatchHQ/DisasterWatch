import React from 'react';
import { View, SafeAreaView, ScrollView } from 'react-native';
import MapWindow from '../../components/mapwindow';
import WarningMain from '../../components/warningMain';
import HeaderBar from '../../components/headerBar';
import DisasterReport from '../../components/disasterReport';

const Home = () => {
  
  const handleSubmit = async (reportData) => {
      try {
        console.log('Report Data:', reportData);
        // Handle submission to your backend
        // You can upload images, send data to API, etc.
      } catch (error) {
        console.error('Error submitting report:', error);
        alert('Failed to submit report. Please try again.');
      }
    };
  
  const handlePress = () => {
    Alert.alert("More Info", "Details about the flood warning");
  };
  
  // Example markers data
  const markers = [
    {
      coordinate: {
        latitude: 6.9271,
        longitude: 79.8612,
      },
      title: "Disaster Alert",
      description: "Flood warning in this area",
      color: "yellow",
    },
    // Add more markers as needed
  ];

  return (
    <SafeAreaView className="bg-neutral-800 flex-1">
      <HeaderBar containerStyle="mt-8"/>
      <ScrollView className="h-full">
        <View>
          <MapWindow 
            markers={markers}
            height={300}
          />
        </View>
        <View>
          <WarningMain 
            alertOrWarning="alert"
            notificationText="Flood broke out nearby"
            containerStyle="mt-3"
            textStyles="text-neutral-100"
          />
        </View>
        <View>
          <DisasterReport 
            onSubmit={handleSubmit}
            isLoading={false} // Control loading state
          />
        </View>
        
      </ScrollView>
    </SafeAreaView>
  );
};

export default Home;