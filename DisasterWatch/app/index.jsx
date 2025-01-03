import { StatusBar } from "expo-status-bar";
import { ScrollView, Text, View, Animated, Dimensions } from "react-native";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useEffect, useRef } from "react";
import CustomButton from "../components/customButton";
import TitleText from "../components/titleText";
import "../global.css";

const { width, height } = Dimensions.get('window');

export default function WelcomePage() {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleGetStarted = () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      router.push("/signIn");
    });
  };

  return (
    <SafeAreaView className="bg-neutral-800 flex-1">
      <StatusBar style="light" backgroundColor="#262626" />
      
      <ScrollView 
        contentContainerStyle={{ 
          flexGrow: 1,
          justifyContent: 'center',
          minHeight: height * 0.85,
        }}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View 
          className="w-full justify-center items-center px-6"
          style={{
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          }}
        >
          {/* Logo or Image */}
          <View className="mb-8">
            <TitleText
              title="Welcome to"
              containerStyles="text-neutral-100 text-2xl font-bold text-center mb-2"
            />
            <TitleText
              title="Disaster Watch"
              containerStyles="text-5xl font-extrabold text-neutral-100 text-center"
            />
          </View>

          <Text className="text-neutral-400 text-center mb-12 text-lg">
            Stay informed and prepared for natural disasters in your area
          </Text>

          <View className="w-full space-y-4">
            <CustomButton
              title="Get Started"
              handlePress={handleGetStarted}
              containerStyles="w-full rounded-xl bg-blue-500 h-[50px]"
              textStyles="text-white font-bold text-lg"
            />
            
            <CustomButton
              title="Learn More"
              handlePress={() => {/* navigation to info page */}}
              containerStyles="mt-2 w-full rounded-xl border-2 border-neutral-400 h-[50px]"
              textStyles="text-neutral-100 font-semibold text-lg"
            />
          </View>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}