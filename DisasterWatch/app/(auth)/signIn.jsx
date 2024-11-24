import { Text, View, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import FormField from '../../components/formField';
import { Link, useRouter } from "expo-router";
import CustomerButton from '../../components/customButton';
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebaseConfig";
import { useContext, useState, useEffect } from 'react';
import { UserContext } from '../../constants/globalProvider';
import * as SecureStore from 'expo-secure-store';

const SignIn = () => {
  const router = useRouter();
  const { setUser }  = useContext(UserContext);
  
  const [form, setForm] = useState({
    email: '',
    password: '',
    remember: false,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Check for user credentials in SecureStore on initial load
  useEffect(() => {
    const autoLogin = async () => {
      const session = await SecureStore.getItemAsync('userSession');
      if (session) {
        const parsedUser = JSON.parse(session);
        signIn(parsedUser.email, parsedUser.password); // Auto sign-in if session exists
      }
    };
    
    autoLogin();
  }, []); // Runs only once when the component is mounted

  // Handle form submission
  const submit = async () => {
    setIsSubmitting(true);
    try {
      // Authenticate the user using Firebase
      const userCredential = await signInWithEmailAndPassword(auth, form.email, form.password);

      // If the 'remember' flag is true, store the session
      if (form.remember) {
        await SecureStore.setItemAsync('userSession', JSON.stringify({ email: form.email, password: form.password }));
      }

      // Save the authenticated user in context
      setUser(userCredential.user); // Set the logged-in user in context

      // Redirect to dashboard or main screen
      router.push('/home');
    } catch (error) {
      // Handle any authentication errors
      Alert.alert('Sign In Error', error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView className="bg-teal-600 h-full">
      <ScrollView>
        <View className="w-full justify-center min-h-[85vh] px-4 my-6">
          <Text className="text-white text-2xl text-semibold mt-10 font-semibold">Sign In DisasterWatch</Text>

          {/* Form Field for Email */}
          <FormField
            title="Email"
            value={form.email}
            handleChangeText={(e) => setForm({ ...form, email: e })}
            otherStyles="mt-7"
            keyboardType="email-address"
          />

          {/* Form Field for Password */}
          <FormField
            title="Password"
            value={form.password}
            handleChangeText={(e) => setForm({ ...form, password: e })}
            otherStyles="mt-7"
            secureTextEntry
          />

          {/* Submit Button */}
          <CustomerButton
            title="Sign In"
            handlePress={submit}
            containerStyles="mt-7"
            isLoading={isSubmitting}
          />

          {/* Link to sign up */}
          <View className="justify-center pt-5 flex-row gap-2">
            <Text className="text-lg text-gray-100 font-regular">Don't have an account?</Text>
            <Link href="/signUp" className="text-lg font-semibold text-orange-400">Sign Up</Link>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SignIn;
