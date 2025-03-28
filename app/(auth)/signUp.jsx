import { View, ScrollView, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Link, useRouter } from "expo-router";
import { useState } from "react";
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
import { authApi } from "../../api/services/auth.js";

const SignUp = () => {
  const router = useRouter();
  const theme = useTheme();
  const [departmentDialogVisible, setDepartmentDialogVisible] = useState(false);
  const departments = ["Fire Department", "Police", "Disaster Response Team"];
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    workId: "",
    associatedDepartment: "",
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    const newErrors = {};
    if (!form.name) newErrors.name = "Name is required";
    if (!form.email) newErrors.email = "Email is required";
    if (!form.password) newErrors.password = "Password is required";
    if (!form.workId) newErrors.workId = "Work ID is required";
    if (!form.associatedDepartment)
      newErrors.associatedDepartment = "Department is required";
    if (form.email && !/\S+@\S+\.\S+/.test(form.email)) {
      newErrors.email = "Please enter a valid email address";
    }
    if (form.password && form.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters long";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignUp = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const response = await authApi.register({
        name: form.name,
        email: form.email.toLowerCase(),
        password: form.password,
        workId: form.workId,
        associatedDepartment: form.associatedDepartment,
      });

      Alert.alert("Success", "Account created successfully!", [
        { text: "OK", onPress: () => router.replace("/signIn") },
      ]);
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
              Create Account
            </Text>
            <Text
              variant="bodyLarge"
              style={{ color: theme.colors.onSurfaceVariant, marginTop: 3 }}
            >
              Join our platform
            </Text>
          </View>
          <View style={{ gap: 10 }}>
            <TextInput
              label="Full Name"
              value={form.name}
              onChangeText={(text) => setForm({ ...form, name: text })}
              mode="outlined"
              error={!!errors.name}
              left={<TextInput.Icon icon="account" />}
            />
            <HelperText type="error" visible={!!errors.name}>
              {errors.name}
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
              secureTextEntry
              error={!!errors.password}
              left={<TextInput.Icon icon="lock" />}
            />
            <HelperText type="error" visible={!!errors.password}>
              {errors.password}
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
          <View style={{ marginTop: 10 }}>
            <Button
              mode="contained"
              onPress={handleSignUp}
              loading={isSubmitting}
              style={{ padding: 4 }}
            >
              Sign Up
            </Button>

            <Divider style={{ marginVertical: 20 }} />

            <View
              style={{
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text variant="bodyMedium">Already have an account? </Text>
              <Link href="/signIn">
                <Text
                  variant="bodyMedium"
                  style={{ color: theme.colors.primary, fontWeight: "bold" }}
                >
                  Sign In
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

export default SignUp;
