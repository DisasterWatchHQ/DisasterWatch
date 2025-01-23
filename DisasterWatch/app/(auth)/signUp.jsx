import { View, ScrollView, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Link, useRouter } from "expo-router";
import { useState } from "react";
import * as SecureStore from "expo-secure-store";
import {
  Text,
  TextInput,
  Button,
  useTheme,
  Divider,
  HelperText,
  List,
  Portal,
  Dialog,
  RadioButton,
} from "react-native-paper";
import { authApi } from "../../services/authApi";

const SignUp = () => {
  const router = useRouter();
  const theme=useTheme();
  const [departmentDialogVisible,setDepartmentDialogVisible]=useState(false);

  // Replace districts with departments
  const departments=["Fire Department","Police","Disaster Response Team"];

  const [form,setForm]=useState({
    name:"",
    email:"",
    password:"",
    workId:"",
    associated_department:"",
  });

  const districts = [
    "",
    "Colombo",
    "Gampaha",
    "Kalutara",
    "Kandy",
    "Matale",
    "Matara",
    "Nuwara Eliya",
    "Point Pedro",
    "Puttalam",
    "Ratnapura",
    "Trincomalee",
    "Kegalle",
    "Batticaloa",
    "Badulla",
  ];
  
  const SignUp = () => {
    const router = useRouter();
    const theme = useTheme();
    const [departmentDialogVisible, setDepartmentDialogVisible] = useState(false);
  
    // Replace districts with departments
    const departments = ["Fire Department", "Police", "Disaster Response Team"];
  
    const [form, setForm] = useState({
      name: "",
      email: "",
      password: "",
      workId: "",
      associated_department: "",
    });
  
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
  
    const validateForm = () => {
      const newErrors = {};
      if (!form.name) newErrors.name = "Name is required";
      if (!form.email) newErrors.email = "Email is required";
      if (!form.password) newErrors.password = "Password is required";
      if (!form.workId) newErrors.workId = "Work ID is required";
      if (!form.associated_department)
        newErrors.associated_department = "Department is required";
  
      // Basic email validation
      if (form.email && !/\S+@\S+\.\S+/.test(form.email)) {
        newErrors.email = "Please enter a valid email address";
      }
  
      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    };
  
    const handleSignUp = async () => {
      if (!validateForm()) return;
  
      setIsSubmitting(true);
  
      try {
        const response = await authApi.register(form);
  
        Alert.alert(
          "Success",
          "Account created successfully! Awaiting verification.",
          [{ text: "OK", onPress: () => router.replace("/signIn") }],
        );
      } catch (error) {
        Alert.alert(
          "Error",
          error.message || "Something went wrong. Please try again.",
        );
      } finally {
        setIsSubmitting(false);
      }
    };

    
  return (
    <SafeAreaView className="bg-neutral-800 h-full">
      <ScrollView>
        <View className="w-full justify-center min-h-[85vh] px-4 my-6">
          <Text className="text-neutral-100 text-3xl font-semibold mt-10">
            Sign Up to DisasterWatch
          </Text>
          
          <Text className="text-neutral-400 mt-2 text-base">
            Create an account to get started
          </Text>
          
          <FormField 
            title="Username"
            value={form.username}
            handleChangeText={(text) => setForm({ ...form, username: text })}
            otherStyles="mt-7"
            placeholder="Enter your username"
          />

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
            placeholder="Create a password"
          />
          
          <View className="mt-7">
            <Text className="text-neutral-400 text-base mb-2">District</Text>
            <View className="border-2 border-neutral-400 rounded-2xl overflow-hidden">
              <Picker
                selectedValue={form.district}
                onValueChange={(itemValue) => setForm({ ...form, district: itemValue })}
                style={{ color: '#FFFFFF' }}
                dropdownIconColor="#FFFFFF"
              >
                {districts.map((district) => (
                  <Picker.Item 
                    key={district} 
                    label={district || "Select your district"} 
                    value={district}
                    style={{ color: '#000000' }}
                  />
                ))}
              </Picker>
            </View>
          </View>

          <CustomerButton 
            title="Create Account"
            handlePress={handleSignUp}
            containerStyles="mt-7 bg-primary-500 h-[50px]"
            textStyles="text-neutral-100 text-lg font-semibold"
            isLoading={isSubmitting}
          />

          <View className="justify-center pt-5 flex-row gap-2">
            <Text className="text-lg text-neutral-400">
              Already have an account?
            </Text>
            <Link 
              href="/signIn" 
              className="text-lg font-semibold text-tertiary-700"
            >
              Sign In
            </Link>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SignUp;