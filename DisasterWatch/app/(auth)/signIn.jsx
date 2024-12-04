import { Text, View, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import FormField from '../../components/formField';
import { Link, useRouter } from "expo-router";
import { Redirect, router } from "expo-router";
import CustomerButton from '../../components/customButton';
import { useContext, useState, useEffect } from 'react';
import { UserContext } from '../../constants/globalProvider';
import * as SecureStore from 'expo-secure-store';

const SignIn = () => {

  return (
    <SafeAreaView className="bg-neutral-800 h-full">
      <ScrollView>
        <View className="w-full justify-center min-h-[85vh] px-4 my-6">
          <Text className="text-neutral-100 text-3xl text-semibold mt-10 font-semibold">Sign In to DisasterWatch</Text>

          {/* Form Field for Email */}
          <FormField
            title="Email"
            // value={form.email}
            // handleChangeText={() => setForm({ ...form, email: e })}
            otherStyles="mt-7"
            keyboardType="email-address"
          />

          {/* Form Field for Password */}
          <FormField
            title="Password"
            // value={form.password}
            // handleChangeText={(e) => setForm({ ...form, password: e })}
            otherStyles="mt-7"
            secureTextEntry
          />

          {/* Submit Button */}
          <CustomerButton
            title="Sign In"
            // handlePress={submit}
            handlePress={() => router.push("/home")}
            containerStyles="mt-7 bg-primary-500 h-[50px]"
            textStyles="text-white font-semibold text-base"
            // isLoading={isSubmitting}
          />

          {/* Link to sign up */}
          <View className="justify-center pt-5 flex-row gap-2">
            <Text className="text-lg text-neutral-400 font-regular">Don't have an account?</Text>
            <Link href="/signUp" className="text-lg font-semibold text-tertiary-700">Sign Up</Link>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SignIn;
