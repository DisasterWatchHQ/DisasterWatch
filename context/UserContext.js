import React, { createContext, useState, useEffect, useContext } from "react";
import * as SecureStore from "expo-secure-store";
import wardash from "../api/services/wardash";

/**
 * @typedef {Object} User
 * @property {string} id - The user's ID
 * @property {string} name - The user's name
 * @property {string} email - The user's email
 * @property {string} [organization] - The user's organization (optional)
 * @property {Object} [preferences] - The user's preferences (optional)
 * @property {string} [push_token] - The user's push notification token (optional)
 */

/**
 * @typedef {Object} UserContextType
 * @property {User|null} user - The current user object or null if not authenticated
 * @property {boolean} loading - Whether the auth state is being loaded
 * @property {boolean} isAuthenticated - Whether the user is authenticated
 * @property {Function} setUser - Function to update the user object
 * @property {Function} signIn - Function to sign in a user
 * @property {Function} logout - Function to log out the user
 */

/** @type {React.Context<UserContextType>} */
const UserContext = createContext(null);

/**
 * Custom hook to use the user context
 * @returns {UserContextType}
 * @throws {Error} If used outside of UserProvider
 */
export const useUser = () => {
  const context = useContext(UserContext);
  if (context === null) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

/**
 * Provider component that wraps your app and makes user object available to any
 * child component that calls useUser().
 */
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  /**
   * Validates the user's session token with the backend
   * @param {string} token - The session token to validate
   * @returns {Promise<boolean>} Whether the token is valid
   */
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

  /**
   * Loads the user session from secure storage
   */
  const loadUser = async () => {
    try {
      const session = await SecureStore.getItemAsync("userSession");
      if (!session) {
        setLoading(false);
        return;
      }

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
    } catch (error) {
      console.error("Error loading user:", error);
      // Clear any potentially corrupted data
      await SecureStore.deleteItemAsync("userSession");
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Signs in a user and stores their session
   * @param {{ user: User, token: string }} credentials - The user credentials and token
   * @returns {Promise<boolean>} Whether the sign in was successful
   */
  const signIn = async (credentials) => {
    try {
      if (!credentials?.user || !credentials?.token) {
        throw new Error('Invalid credentials provided');
      }

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

  /**
   * Logs out the current user
   * @returns {Promise<void>}
   */
  const logout = async () => {
    try {
      await SecureStore.deleteItemAsync("userSession");
      setUser(null);
    } catch (error) {
      console.error("Error logging out:", error);
      // Even if there's an error deleting from storage, we should still clear the user state
      setUser(null);
      throw error;
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

// For backwards compatibility
export { UserContext }; 