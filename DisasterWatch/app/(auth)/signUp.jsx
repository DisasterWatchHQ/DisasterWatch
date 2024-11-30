import { Text, View, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import FormField from '../../components/formField';
import CustomerButton from '../../components/customButton';
import { Link } from 'expo-router';
import { useState } from 'react';
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebaseConfig";
import * as SecureStore from 'expo-secure-store';
import { Alert } from 'react-native';

const SignUp = () => {
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    district: '',
    remember: true,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const submit = async () => {
    if (!form.email || !form.password) {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }

    setIsSubmitting(true);

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, form.email, form.password);
      const user = userCredential.user;

      // Log the user details for debugging
      // console.log('User created:', user);

      // Save the user session if the user wants to remember credentials
      if (form.remember) {
        await SecureStore.setItemAsync('userSession', JSON.stringify({
          email: form.email,
          password: form.password,
        }));
      }

      Alert.alert('Success', 'Account created successfully!');
    } catch (error) {
      // Log detailed error message
      console.error('Firebase error:', error);

      // Display error message
      Alert.alert('Error', error.message || 'Something went wrong.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView className="bg-neutral-800 h-full">
      <ScrollView>
        <View className="w-full justify-center min-h-[85vh] px-4 my-6">
          <Text className="text-neutral-100 text-2xl text-semibold mt-10 font-semibold">Sign Up to DisasterWatch</Text>
          
          <FormField 
            title="Username"
            value={form.username}
            handleChangeText={(e) => setForm({ ...form, username: e })}
            otherStyles="mt-7"
          />

          <FormField
            title="Email"
            value={form.email}
            handleChangeText={(e) => setForm({ ...form, email: e })}
            otherStyles="mt-7"
            keyboardType="email-address"
          />

          <FormField
            title="Password"
            value={form.password}
            handleChangeText={(e) => setForm({ ...form, password: e })}
            otherStyles="mt-7"
            secureTextEntry
          />
          
          <FormField
            title="District"
            value={form.district}
            handleChangeText={(e) => setForm({ ...form, district: e })}
            otherStyles="mt-7"
          />

          {/* Submit Button */}
          <CustomerButton 
            title="Create Account"
            handlePress={submit}
            containerStyles="mt-7 bg-primary-500"
            isLoading={isSubmitting}
          />

          <View className="justify-center pt-5 flex-row gap-2">
            <Text className="text-lg text-neutral-400 font-regular">Already have an account?</Text>
            <Link href="/signIn" className="text-lg font-semibold text-tertiary-700">Sign In</Link>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SignUp;
