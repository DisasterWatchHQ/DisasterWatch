import { Text, View, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import FormField from '../../components/formField';
import { Link, useRouter } from "expo-router";
import CustomerButton from '../../components/customButton';
import { useState } from 'react';
import * as SecureStore from 'expo-secure-store';
import { MaterialIcons } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native';

const SignIn = () => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState({
    email: '',
    password: '',
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
      router.replace('/home');
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
          {/* Header */}
          <Text className="text-neutral-100 text-3xl font-semibold mt-10">
            Sign In to DisasterWatch
          </Text>
          
          {/* Description */}
          <Text className="text-neutral-400 mt-2 text-base">
            Welcome back! Please enter your details
          </Text>

          {/* Email Field */}
          <FormField
            title="Email"
            value={form.email}
            handleChangeText={(text) => setForm({ ...form, email: text })}
            otherStyles="mt-7"
            keyboardType="email-address"
            placeholder="Enter your email"
          />

          {/* Password Field */}
          <FormField
            title="Password"
            value={form.password}
            handleChangeText={(text) => setForm({ ...form, password: text })}
            otherStyles="mt-7"
            secureTextEntry
            placeholder="Enter your password"
          />

          {/* Remember Me & Forgot Password */}
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

          {/* Sign In Button */}
          <CustomerButton
            title="Sign In"
            handlePress={handleSignIn}
            containerStyles="mt-7 bg-primary-500 h-[50px]"
            textStyles="text-neutral-100 text-lg font-semibold"
            isLoading={isSubmitting}
          />

          {/* Sign Up Link */}
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