import { View, ScrollView, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Link, useRouter } from "expo-router";
import { useState } from "react";
import {
  Text,
  TextInput,
  Button,
  useTheme,
  HelperText,
  List,
  Portal,
  Dialog,
  RadioButton,
} from "react-native-paper";
import { authApi } from "../../api/services/auth.js";

const ForgotPassword = () => {
  const router = useRouter();
  const theme = useTheme();
  const [departmentDialogVisible, setDepartmentDialogVisible] = useState(false);
  const departments = ["Fire Department", "Police", "Disaster Response Team"];
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const [form, setForm] = useState({
    email: "",
    workId: "",
    associatedDepartment: "",
  });

  const validateForm = () => {
    const newErrors = {};
    if (!form.email) newErrors.email = "Email is required";
    if (!form.workId) newErrors.workId = "Work ID is required";
    if (!form.associatedDepartment)
      newErrors.associatedDepartment = "Department is required";
    if (form.email && !/\S+@\S+\.\S+/.test(form.email)) {
      newErrors.email = "Please enter a valid email address";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      await authApi.forgotPassword({
        email: form.email.toLowerCase(),
        workId: form.workId,
        associatedDepartment: form.associatedDepartment,
      });
      Alert.alert(
        "Success",
        "Password reset instructions have been sent to the administrator.",
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
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View style={{ padding: 20, flex: 1 }}>
          <View style={{ marginBottom: 32, marginTop: 40 }}>
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
              Enter your details to reset your password
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

            <List.Item
              title="Select Department"
              description={
                form.associatedDepartment || "Choose your department"
              }
              onPress={() => setDepartmentDialogVisible(true)}
              left={(props) => <List.Icon {...props} icon="office-building" />}
              right={(props) => <List.Icon {...props} icon="chevron-right" />}
            />
            <HelperText type="error" visible={!!errors.associatedDepartment}>
              {errors.associatedDepartment}
            </HelperText>
          </View>

          <View style={{ marginTop: 32 }}>
            <Button
              mode="contained"
              onPress={handleSubmit}
              loading={isSubmitting}
              style={{ padding: 4 }}
            >
              Send Reset Request
            </Button>

            <View style={{ marginTop: 20, alignItems: "center" }}>
              <Link href="/signIn">
                <Text
                  variant="bodyMedium"
                  style={{ color: theme.colors.primary }}
                >
                  Back to Sign In
                </Text>
              </Link>
            </View>
          </View>
        </View>
      </ScrollView>

      <Portal>
        <Dialog
          visible={departmentDialogVisible}
          onDismiss={() => setDepartmentDialogVisible(false)}
        >
          <Dialog.Title>Select Department</Dialog.Title>
          <Dialog.Content>
            <RadioButton.Group
              onValueChange={(value) => {
                setForm({ ...form, associatedDepartment: value });
                setDepartmentDialogVisible(false);
              }}
              value={form.associatedDepartment}
            >
              {departments.map((department) => (
                <RadioButton.Item
                  key={department}
                  label={department}
                  value={department}
                />
              ))}
            </RadioButton.Group>
          </Dialog.Content>
        </Dialog>
      </Portal>
    </SafeAreaView>
  );
};

export default ForgotPassword;
