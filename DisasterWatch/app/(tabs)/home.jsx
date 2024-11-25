import { Text, View, ScrollView } from 'react-native';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import Appheader from '../../components/appheader';
import MapWindow from '../../components/mapwindow';

const Home = () => {
    
  return (
    <SafeAreaView className="bg-teal-600 h-full">
      <Appheader />
      <ScrollView>
      <View style={{ flex: 1 }}>
        <MapWindow/>
  
       
       
      </View>
      </ScrollView>
    </SafeAreaView>
  )
};

export default Home;