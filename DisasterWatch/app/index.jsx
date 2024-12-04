import { StatusBar } from "expo-status-bar";
import { ScrollView, Text, View } from "react-native";
import { Redirect, router } from "expo-router";
import "../global.css";
import { SafeAreaView } from "react-native-safe-area-context";
import CustomButton from "../components/customButton";
import TitleText from "../components/titleText";

export default function App() {
  return (
    <SafeAreaView className="bg-neutral-800 h-full">
      <ScrollView contentContainerStyle={{ height: `[85vh]` }}>
        <View className="w-full justify-center items-center min-h-[85vh] px-4">
          <TitleText
            title="Welcome to"
            containerStyles="text-neutral-100 text-2xl font-bold"
          />
          <TitleText
            title="Disaster Watch"
            containerStyles="text-4xl font-extrabold text-neutral-100"
          />
          <CustomButton
            title="Get Started"
            handlePress={() => router.push("/signIn")}
            containerStyles="w-full mt-3 rounded-xl bg-neutral-300 h-[45px]"
          />
        </View>
      </ScrollView>
      <StatusBar style="light" backgroundColor="#1212" />
    </SafeAreaView>
  );
}
