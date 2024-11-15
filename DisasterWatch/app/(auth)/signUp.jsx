import { Text, View, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import FormField from '../../components/formField';
import CustomerButton from '../../components/customButton';
import DropdownSelect from '../../components/dropDownSelect';
import { Link } from 'expo-router';
import { useState } from 'react';

const SignUp = () => {
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    district: '',
    remember: false,
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const submit = () => {
    
  }
  
  return (
    <SafeAreaView className="bg-teal-600 h-full">
      <ScrollView>
        <View className="w-full justify-center min-h-[85vh] px-4 my-6">
          <Text className="text-white text-2xl text-semibold mt-10 font-semibold">Sign In DisasterWatch</Text>
          
          <FormField 
            title="Username"
            value={form.username}
            handleChangeText={(e) => setForm({ ...form,
              username: e})}
            otherStyles="mt-10"
          />
          <FormField 
            title="Email"
            value={form.email}
            handleChangeText={(e) => setForm({ ...form,
              email: e})}
            otherStyles="mt-7"
            keyboardType="email-address"
          />
          <FormField 
            title="Password"
            value={form.password}
            handleChangeText={(e) => setForm({ ...form,
              password: e})}
            otherStyles="mt-7"
          />
          <FormField 
            title="District"
            value={form.district}
            handleChangeText={(e) => setForm({ ...form,
              district: e})}
            otherStyles="mt-7"
          />
          
          <CustomerButton 
            title="Sign Up"
            handlePress={submit}
            containerStyles="mt-7"
            isLoading={isSubmitting}
          />
          
          
          
          <View className="justify-center pt-5 flex-row gap-2">
            <Text className="text-lg text-gray-100 font-regular">Already have an account?</Text>
            <Link href="/signIn" className="text-lg font-semibold text-orange-400">Sign In</Link>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
};

export default SignUp;

