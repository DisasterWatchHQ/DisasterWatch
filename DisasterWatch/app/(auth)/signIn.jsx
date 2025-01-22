import { View, ScrollView, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Link, useRouter } from "expo-router";
import { useState } from "react";
import * as SecureStore from "expo-secure-store";
import {
  Text,
  TextInput,
  Button,
  Checkbox,
  useTheme,
  HelperText,
  Divider,
} from "react-native-paper";
import {authApi} from "../../services/authApi";

const SignIn = () => {
  const router = useRouter();
  const theme = useTheme();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  const [form, setForm] = useState({
    email: "",
    password: "",
    remember: true,
  });

  

  const handleSignIn = async () => {
    if (!form.email || !form.password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setIsSubmitting(true);

    try {
      // Here make an API call to backend
      // For now simulate a successful login
      
      // Save user session if remember is true
      if (form.remember) {
        await SecureStore.setItemAsync('userSession', JSON.stringify({
          email: form.email,
          token: 'dummy-token', // This would come from your backend
        }));
      }

      // Navigate to home screen
      router.replace('/Landingpage');
    } catch (error) {
      Alert.alert('Error', 'Invalid email or password');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView className="bg-neutral-800 h-full">
      <ScrollView>
        <View className="w-full justify-center min-h-[85vh] px-4 my-6">
          <Text className="text-neutral-100 text-3xl font-semibold mt-10">
            Sign In to DisasterWatch
          </Text>
          
          <Text className="text-neutral-400 mt-2 text-base">
            Welcome back! Please enter your details
          </Text>

          <FormField
            title="Email"
            value={form.email}
            handleChangeText={(text) => setForm({ ...form, email: text })}
            otherStyles="mt-7"
            keyboardType="email-address"
            placeholder="Enter your email"
          />

          <FormField
            title="Password"
            value={form.password}
            handleChangeText={(text) => setForm({ ...form, password: text })}
            otherStyles="mt-7"
            secureTextEntry
            placeholder="Enter your password"
          />

          <View className="flex-row justify-between items-center mt-4">
            <View className="flex-row items-center">
              <TouchableOpacity
                onPress={() => setForm({ ...form, remember: !form.remember })}
                className={`w-5 h-5 rounded border ${
                  form.remember ? 'bg-primary-500 border-primary-500' : 'border-neutral-400'
                } justify-center items-center`}
              >
                {form.remember && (
                  <MaterialIcons name="check" size={14} color="white" />
                )}
              </TouchableOpacity>
              <Text className="text-neutral-400 ml-2">Remember me</Text>
            </View>

            <TouchableOpacity onPress={() => router.push('/forgot-password')}>
              <Text className="text-primary-500 font-semibold">
                Forgot password?
              </Text>
            </TouchableOpacity>
          </View>

          <CustomerButton
            title="Sign In"
            handlePress={handleSignIn}
            containerStyles="mt-7 bg-primary-500 h-[50px]"
            textStyles="text-neutral-100 text-lg font-semibold"
            isLoading={isSubmitting}
          />

          <View className="justify-center pt-5 flex-row gap-2">
            <Text className="text-lg text-neutral-400">
              Don't have an account?
            </Text>
            <Link 
              href="/signUp" 
              className="text-lg font-semibold text-tertiary-700"
            >
              Sign Up
            </Link>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SignIn;