import { Text, View, ScrollView } from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import Appheader from '../../components/appheader';

const Home = () => {
  return (
    <SafeAreaView className="bg-teal-600 h-full">
      <Appheader />
      <ScrollView>
      </ScrollView>
    </SafeAreaView>
  )
};

export default Home;

