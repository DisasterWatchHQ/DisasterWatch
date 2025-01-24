import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React from "react";
import { PaperProvider, MD3DarkTheme } from "react-native-paper";
import "../../global.css";

const theme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    background: "#161622",
  },
};

const AuthLayout = () => {
  return (
    <>
      <Stack>
        <Stack.Screen
          name="signIn"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="signUp"
          options={{
            headerShown: false,
          }}
        />
      </Stack>
      <StatusBar backgroundColor="#161622" style="light" />
    </>
  );
};

export default AuthLayout;
