import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const API_URL = process.env.EXPO_PUBLIC_API_URL;

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

apiClient.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    console.log("API Request:", config.method.toUpperCase(), config.url);
    return config;
  },
  (error) => {
    console.error("Request Error:", error);
    return Promise.reject(error);
  },
);

apiClient.interceptors.response.use(
  (response) => {
    console.log("API Response:", response.status, response.config.url);
    return response;
  },
  (error) => {
    if (error.response) {
      console.error(
        "Response Error:",
        error.response.status,
        error.response.data,
      );
      throw new Error(error.response.data.message || 'Server error occurred');
    } else if (error.request) {
      console.error("No Response Received:", error.message);
      throw new Error('No response received from server');
    } else {
      console.error("Request Setup Error:", error.message);
      throw new Error('Failed to make request');
    }
  },
);

export const warningApi = {
  getActiveWarnings: async () => {
    try {
      const response = await apiClient.get('/warnings/active');
      
      // Ensure we return the array of warnings
      if (response.data?.data?.warnings) {
        return response.data.data.warnings;
      } else if (Array.isArray(response.data)) {
        return response.data;
      } else if (response.data?.data && Array.isArray(response.data.data)) {
        return response.data.data;
      } else if (response.data?.success && Array.isArray(response.data?.data)) {
        return response.data.data;
      }
      
      throw new Error('Invalid response format from server');
    } catch (error) {
      console.error('Get active warnings error:', error);
      throw error;
    }
  },

  getWarnings: async (filters = {}) => {
    try {
      const response = await apiClient.get('/warnings', { params: filters });
      return response.data;
    } catch (error) {
      console.error('Get warnings error:', error);
      throw error;
    }
  },

  getWarningsByLocation: async (latitude, longitude, radius) => {
    try {
      const response = await apiClient.get('/warnings', {
        params: { latitude, longitude, radius }
      });
      return response.data;
    } catch (error) {
      console.error('Get location warnings error:', error);
      throw error;
    }
  },

  getWarningById: async (warningId) => {
    try {
      const response = await apiClient.get(`/warnings/${warningId}`);
      return response.data;
    } catch (error) {
      console.error('Get warning details error:', error);
      throw error;
    }
  },

  createWarning: async (warningData) => {
    try {
      const response = await apiClient.post('/warnings', warningData);
      return response.data;
    } catch (error) {
      console.error('Create warning error:', error);
      throw error;
    }
  },

  updateWarning: async (warningId, updateData) => {
    try {
      const response = await apiClient.put(`/warnings/${warningId}`, updateData);
      return response.data;
    } catch (error) {
      console.error('Update warning error:', error);
      throw error;
    }
  },

  resolveWarning: async (warningId) => {
    try {
      const response = await apiClient.post(`/warnings/${warningId}/resolve`);
      return response.data;
    } catch (error) {
      console.error('Resolve warning error:', error);
      throw error;
    }
  },

  addWarningUpdate: async (warningId, updateMessage) => {
    try {
      const response = await apiClient.post(`/warnings/${warningId}/updates`, {
        message: updateMessage
      });
      return response.data;
    } catch (error) {
      console.error('Add warning update error:', error);
      throw error;
    }
  },
};
