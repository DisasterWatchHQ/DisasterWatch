import { View, ScrollView, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Text,
  TextInput,
  Button,
  useTheme,
  HelperText,
} from "react-native-paper";
import { authApi } from "../../services/authApi";

const ForgotPassword = () => {
  const router = useRouter();
  const theme = useTheme();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const [form, setForm] = useState({
    email: "",
    workId: "",
    lastPassword: "",
  });

  const validateForm = () => {
    const newErrors = {};
    if (!form.email) newErrors.email = "Email is required";
    if (!form.workId) newErrors.workId = "Work ID is required";
    if (!form.lastPassword)
      newErrors.lastPassword = "Last remembered password is required";
    if (form.email && !/\S+@\S+\.\S+/.test(form.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleResetRequest = async () => {
    if (!validateForm()) return;
    setIsSubmitting(true);

    try {
      await authApi.requestPasswordReset({
        email: form.email.toLowerCase(),
        workId: form.workId,
        lastPassword: form.lastPassword,
      });

      Alert.alert(
        "Reset Request Sent",
        "If your information is correct, you will receive further instructions via email.",
        [
          {
            text: "OK",
            onPress: () => router.back(),
          },
        ],
      );
    } catch (error) {
      Alert.alert("Error", error.message || "Failed to process reset request");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View style={{ padding: 20, flex: 1 }}>
          <View style={{ marginBottom: 40, marginTop: 40 }}>
            <Text
              variant="headlineMedium"
              style={{ color: theme.colors.primary, fontWeight: "bold" }}
            >
              Reset Password
            </Text>
            <Text
              variant="bodyLarge"
              style={{ color: theme.colors.onSurfaceVariant, marginTop: 3 }}
            >
              Please enter your details to reset your password
            </Text>
          </View>

          <View style={{ gap: 10 }}>
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
              label="Work ID"
              value={form.workId}
              onChangeText={(text) => setForm({ ...form, workId: text })}
              mode="outlined"
              error={!!errors.workId}
              left={<TextInput.Icon icon="card-account-details" />}
            />
            <HelperText type="error" visible={!!errors.workId}>
              {errors.workId}
            </HelperText>

            <TextInput
              label="Last Remembered Password"
              value={form.lastPassword}
              onChangeText={(text) => setForm({ ...form, lastPassword: text })}
              mode="outlined"
              error={!!errors.lastPassword}
              left={<TextInput.Icon icon="lock" />}
              secureTextEntry
            />
            <HelperText type="error" visible={!!errors.lastPassword}>
              {errors.lastPassword}
            </HelperText>

            <Button
              mode="contained"
              onPress={handleResetRequest}
              loading={isSubmitting}
              style={{ marginTop: 20, padding: 4 }}
            >
              Submit Reset Request
            </Button>

            <Button
              mode="text"
              onPress={() => router.back()}
              style={{ marginTop: 12 }}
            >
              Back to Sign In
            </Button>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ForgotPassword;
