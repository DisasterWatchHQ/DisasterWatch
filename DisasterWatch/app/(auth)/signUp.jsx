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
    <SafeAreaView >
      <ScrollView>
        <View>
          
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SignUp;