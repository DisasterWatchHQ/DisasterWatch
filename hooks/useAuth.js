import { useState, useEffect } from 'react';
import { authApi } from '../services/authApi';
import * as SecureStore from 'expo-secure-store';

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const session = await SecureStore.getItemAsync('userSession');
      if (session) {
        const { user: userData } = JSON.parse(session);
        setUser(userData);
      }
    } catch (error) {
      console.error('Auth check error:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      setLoading(true);
      setError(null);
      const response = await authApi.login({ email, password });
      setUser(response.user);
      return response;
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    try {
      setLoading(true);
      setError(null);
      const response = await authApi.register(userData);
      return response;
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      setError(null);
      await authApi.logout();
      setUser(null);
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updatePreferences = async (preferences) => {
    try {
      setLoading(true);
      setError(null);
      const response = await authApi.updatePreferences(preferences);
      setUser({ ...user, preferences: response.preferences });
      return response;
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updatePushToken = async (pushToken) => {
    try {
      setLoading(true);
      setError(null);
      const response = await authApi.updatePushToken(pushToken);
      setUser({ ...user, push_token: pushToken });
      return response;
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    user,
    loading,
    error,
    login,
    register,
    logout,
    updatePreferences,
    updatePushToken,
  };
}; 