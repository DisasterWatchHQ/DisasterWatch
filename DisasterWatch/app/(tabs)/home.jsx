import React from 'react';
import { View, SafeAreaView, ScrollView } from 'react-native';
import MapWindow from '../../components/mapwindow';

const Home = () => {
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
      <ScrollView>
        {/* Other components can go here */}
        
        <MapWindow 
          markers={markers}
          height={300} // Adjust the height as needed
        />
        
        {/* Other components can go here */}
      </ScrollView>
    </SafeAreaView>
  );
};

export default Home;