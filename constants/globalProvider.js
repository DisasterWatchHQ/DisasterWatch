import React, { createContext, useState, useEffect } from "react";
import * as SecureStore from "expo-secure-store";

const UserContext = createContext();

const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadUser = async () => {
    try {
      const session = await SecureStore.getItemAsync("userSession");
      if (session) {
        const { user } = JSON.parse(session);
        setUser(user);
      }
    } catch (error) {
      console.error("Error loading user:", error);
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (credentials) => {
    try {
      const userSession = {
        user: credentials.user,
        token: credentials.token,
      };
      await SecureStore.setItemAsync(
        "userSession",
        JSON.stringify(userSession),
      );
      setUser(credentials.user);
      return true;
    } catch (error) {
      console.error("Error signing in:", error);
      return false;
    }
  };

  const logout = async () => {
    try {
      await SecureStore.deleteItemAsync("userSession");
      setUser(null);
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

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
