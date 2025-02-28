import React, { createContext, useState, useEffect } from "react";
import * as SecureStore from "expo-secure-store";

const UserContext = createContext();

const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load user from secure storage
  const loadUser = async () => {
    try {
      const session = await SecureStore.getItemAsync("userSession");
      if (session) {
        const sessionData = JSON.parse(session);
        console.log("Loaded session data:", sessionData); // Debug log
        setUser(sessionData);
      }
    } catch (error) {
      console.log("Error loading user:", error);
    } finally {
      setLoading(false);
    }
  };

  // Sign in function
  const signIn = async (credentials) => {
    try {
      const userSession = {
        user: credentials.user,
        token: credentials.token,
      };
      // Store user session
      await SecureStore.setItemAsync(
        "userSession",
        JSON.stringify(userSession),
      );
      setUser(credentials.user);
      return true;
    } catch (error) {
      console.log("Error signing in:", error);
      return false;
    }
  };

  // Logout function
  const logout = async () => {
    try {
      await SecureStore.deleteItemAsync("userSession");
      setUser(null);
    } catch (error) {
      console.log("Error logging out:", error);
    }
  };

  // Load user when component mounts
  useEffect(() => {
    loadUser();
  }, []);

  return (
    <UserContext.Provider
      value={{
        user,
        loading,
        setUser,
        signIn,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export { UserContext, UserProvider };
