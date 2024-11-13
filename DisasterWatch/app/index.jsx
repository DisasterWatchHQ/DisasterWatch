import { StatusBar } from 'expo-status-bar';
import { ScrollView, Text, View } from 'react-native';
import { Redirect, router } from 'expo-router';
import '../global.css';
import { SafeAreaView } from 'react-native-safe-area-context';
import  CustomButton  from '../components/customButton';

export default function App() {
  return (
    <SafeAreaView className="bg-teal-700 h-full">
      <ScrollView contentContainerStyle={{ height: '100%' }}>
        <View className="w-full justify-center items-center min-h-[85vh] px-4">
          <Text className="text-4xl font-extrabold">Disaster Watch</Text>
          <CustomButton 
            title="Get Started"
            handlePress={() => router.push('/signIn')}
            containerStyles="w-full mt-7 rounded-xl"
          />
        </View>
      </ScrollView>
      <StatusBar style="light" backgroundColor="teal" />
    </SafeAreaView>
  );
}
