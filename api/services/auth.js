import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';

const API_URL = process.env.EXPO_PUBLIC_API_URL;

const handleResponse = async (response) => {
  try {
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Something went wrong');
    }
    return data;
  } catch (error) {
    console.error('Response handling error:', error);
    throw new Error('Failed to process server response');
  }
};

export const authApi = {
  register: async (userData) => {
    try {
      const url = `${API_URL}/users/register`;
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });
      return handleResponse(response);
    } catch (error) {
      console.error('Registration error:', error);
      if (error.message === 'Failed to fetch') {
        throw new Error('Unable to connect to server. Please check your internet connection and try again.');
      }
      throw new Error(error.message || 'Failed to register. Please try again.');
    }
  },

  login: async (credentials) => {
    try {
      const url = `${API_URL}/users/login`;
     
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });
      
      const data = await handleResponse(response);
      if (data.token) {
        await SecureStore.setItemAsync('userSession', JSON.stringify({
          token: data.token,
          user: data.user
        }));
      }
      return data;
    } catch (error) {
      console.error('Login error:', error);
      if (error.message === 'Failed to fetch') {
        throw new Error('Unable to connect to server. Please check your internet connection and try again.');
      }
      throw new Error(error.message || 'Invalid email or password');
    }
  },

  forgotPassword: async (data) => {
    try {
      const response = await fetch(`${API_URL}/users/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: data.email,
          workId: data.workId,
          associatedDepartment: data.associatedDepartment
        }),
      });
      return handleResponse(response);
    } catch (error) {
      console.error('Forgot password error:', error);
      throw new Error(error.message || 'Failed to process forgot password request');
    }
  },

  resetPassword: async (token, password) => {
    try {
      const response = await fetch(`${API_URL}/users/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token, password }),
      });
      return handleResponse(response);
    } catch (error) {
      console.error('Reset password error:', error);
      throw new Error(error.message || 'Failed to reset password');
    }
  },

  updatePreferences: async (preferences) => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) throw new Error('No authentication token found');

      const response = await fetch(`${API_URL}/users/preferences`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(preferences),
      });
      return handleResponse(response);
    } catch (error) {
      console.error('Update preferences error:', error);
      throw new Error(error.message || 'Failed to update preferences');
    }
  },

  updatePushToken: async (pushToken) => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) throw new Error('No authentication token found');

      const response = await fetch(`${API_URL}/users/push-token`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ push_token: pushToken }),
      });
      return handleResponse(response);
    } catch (error) {
      console.error('Update push token error:', error);
      throw new Error(error.message || 'Failed to update push token');
    }
  },

  logout: async () => {
    try {
      await SecureStore.deleteItemAsync('userSession');
      await SecureStore.deleteItemAsync('rememberedCredentials');
    } catch (error) {
      console.error('Logout error:', error);
      throw new Error(error.message || 'Failed to logout');
    }
  },
};