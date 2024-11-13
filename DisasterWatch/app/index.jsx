import { StatusBar } from 'expo-status-bar';
import { Text, View } from 'react-native';
import { Link } from 'expo-router';
import '../global.css';

export default function App() {
  return (
    <View className="flex-1 items-center justify-center">
      <Text className="text-3xl font-bold">Disaster Watch</Text>
      <StatusBar style="auto" />
      <Link href="/signIn">Sign In</Link>
      <Link href="/signUp">Sign Up</Link>
    </View>
  );
}
