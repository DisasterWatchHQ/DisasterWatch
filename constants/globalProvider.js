import React, { createContext, useState, useEffect } from "react";
import * as SecureStore from "expo-secure-store";
import wardash from "../services/wardash";

const UserContext = createContext();

const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const validateSession = async (token) => {
    try {
      const response = await wardash.get('/users/validate-session', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response.data.valid;
    } catch (error) {
      console.error("Error validating session:", error);
      return false;
    }
  };

  const loadUser = async () => {
    try {
      const session = await SecureStore.getItemAsync("userSession");
      if (session) {
        const { user, token } = JSON.parse(session);
        
        // Validate the session token
        const isValid = await validateSession(token);
        if (isValid) {
          setUser(user);
        } else {
          // If session is invalid, clear it
          await SecureStore.deleteItemAsync("userSession");
          setUser(null);
        }
      }
    } catch (error) {
      console.error("Error loading user:", error);
      setUser(null);
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
