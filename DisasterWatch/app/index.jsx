import { StatusBar } from 'expo-status-bar';
import { ScrollView, Text, View } from 'react-native';
import { Link } from 'expo-router';
import '../global.css';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function App() {
  return (
    <SafeAreaView className="bg-teal-700 h-full">
      <ScrollView contentContainerStyle={{ height: '100%' }}>
        <View className="w-full justify-center items-center h-full px-4">
          <Text className="text-4xl font-extrabold">Disaster Watch</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
