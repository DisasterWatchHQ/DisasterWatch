import { StatusBar } from 'expo-status-bar';
import { ScrollView, Text, View } from 'react-native';
import { Redirect, router } from 'expo-router';
import '../global.css';
import { SafeAreaView } from 'react-native-safe-area-context';
import  CustomButton  from '../components/customButton';
import TitleText from '../components/titleText';

export default function App() {
  return (
    <SafeAreaView className="bg-teal-700 h-full">
      <ScrollView contentContainerStyle={{ height: `[85vh]` }}>
        <View className="w-full justify-center items-center min-h-[85vh] px-4">
          <TitleText title="Welcome to" containerStyles="text-white text-2xl font-bold" />
          <TitleText title="Disaster Watch" containerStyles="text-4xl font-extrabold" />
          <CustomButton 
            title="Get Started"
            handlePress={() => router.push('/signIn')}
            containerStyles="w-full mt-7 rounded-xl bg-yellow-700"
          />
          <CustomButton 
            title="To Home"
            handlePress={() => router.push('/home')}
            containerStyles="w-full mt-7 rounded-xl bg-yellow-700"
          />
          <CustomButton 
            title="To Dashboard"
            handlePress={() => router.push('/Dashboard')}
            containerStyles="w-full mt-7 rounded-xl bg-yellow-700"
          />
          <CustomButton 
            title="To Landing Page"
            handlePress={() => router.push('/Landingpage')}
            containerStyles="w-full mt-7 rounded-xl bg-yellow-700"
          />
          <CustomButton 
            title="To Detailed alerts"
            handlePress={() => router.push('/DetailedAlert')}
            containerStyles="w-full mt-7 rounded-xl bg-yellow-700"
          />
         
        </View>
      </ScrollView>
      <StatusBar style="light" backgroundColor="teal" />
    </SafeAreaView>
  );
}