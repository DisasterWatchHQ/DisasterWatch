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

  const validateForm = () => {
    const newErrors = {};
    if (!form.email) newErrors.email = "Email is required";
    if (!form.password) newErrors.password = "Password is required";

    // Basic email validation
    if (form.email && !/\S+@\S+\.\S+/.test(form.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };


  const handleSignIn = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const response = await authApi.login({
        email: form.email.toLowerCase(),
        password: form.password,
      });

      if (form.remember) {
        // Store user session data
        await SecureStore.setItemAsync(
          "userSession",
          JSON.stringify({
            token: response.token,
            user: {
              id: response.user.id,
              name: response.user.name,
              email: response.user.email,
              department: response.user.department,
              isVerified: response.user.isVerified,
            },
          }),
        );
      }

      // Check if user is verified
      if (!response.user.isVerified) {
        Alert.alert(
          "Account Not Verified",
          "Your account is pending verification. Please contact your administrator.",
          [{ text: "OK" }],
        );
        return;
      }

      router.replace("/Landingpage");
    } catch (error) {
      Alert.alert("Error", error.message || "Invalid email or password");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <view style={{ padding: 20, flex: 1 }}>
        <View style={{ marginBottom: 32 }}>
            <Text
              variant="headlineMedium"
              style={{ color: theme.colors.primary, fontWeight: "bold" }}
            >
              Welcome Back
            </Text>
            <Text
              variant="bodyLarge"
              style={{ color: theme.colors.onSurfaceVariant, marginTop: 8 }}
            >
              Sign in to continue
            </Text>
          </View>

          {/* Form Section */}
          <View style={{ gap: 16 }}>
            <TextInput
              label="Email"
              value={form.email}
              onChangeText={(text) => setForm({ ...form, email: text })}
              mode="outlined"
              keyboardType="email-address"
              error={!!errors.email}
              left={<TextInput.Icon icon="email" />}
              autoCapitalize="none"
              autoComplete="email"
            />
            <HelperText type="error" visible={!!errors.email}>
              {errors.email}
            </HelperText>

            <TextInput
              label="Password"
              value={form.password}
              onChangeText={(text) => setForm({ ...form, password: text })}
              mode="outlined"
              secureTextEntry={!showPassword}
              error={!!errors.password}
              left={<TextInput.Icon icon="lock" />}
              right={
                <TextInput.Icon
                  icon={showPassword ? "eye-off" : "eye"}
                  onPress={() => setShowPassword(!showPassword)}
                />
              }
            />
            <HelperText type="error" visible={!!errors.password}>
              {errors.password}
            </HelperText>


        </view>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SignIn;