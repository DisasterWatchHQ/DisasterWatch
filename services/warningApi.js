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
  (config) => {
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
    } else if (error.request) {
      console.error("No Response Received:", error.message);
    } else {
      console.error("Request Setup Error:", error.message);
    }
    return Promise.reject(error);
  },
);

const getAuthHeader = async () => {
  const token = await AsyncStorage.getItem('token');
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  };
};

export const warningApi = {
  getActiveWarnings: async () => {
    try {
      const headers = await getAuthHeader();
      const response = await fetch(`${API_URL}/warnings/active`, {
        headers,
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch active warnings');
      }
      return data;
    } catch (error) {
      console.error('Get active warnings error:', error);
      throw error;
    }
  },

  getWarnings: async (filters = {}) => {
    try {
      const headers = await getAuthHeader();
      const queryParams = new URLSearchParams({
        ...filters,
      }).toString();

      const response = await fetch(
        `${API_URL}/warnings?${queryParams}`,
        { headers }
      );
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch warnings');
      }
      return data;
    } catch (error) {
      console.error('Get warnings error:', error);
      throw error;
    }
  },

  getWarningsByLocation: async (latitude, longitude, radius) => {
    try {
      const headers = await getAuthHeader();
      const response = await fetch(
        `${API_URL}/warnings?latitude=${latitude}&longitude=${longitude}&radius=${radius}`,
        { headers }
      );
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch location-based warnings');
      }
      return data;
    } catch (error) {
      console.error('Get location warnings error:', error);
      throw error;
    }
  },

  createWarning: async (warningData) => {
    try {
      const headers = await getAuthHeader();
      const response = await fetch(`${API_URL}/warnings`, {
        method: 'POST',
        headers,
        body: JSON.stringify(warningData),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to create warning');
      }
      return data;
    } catch (error) {
      console.error('Create warning error:', error);
      throw error;
    }
  },

  updateWarning: async (warningId, updateData) => {
    try {
      const headers = await getAuthHeader();
      const response = await fetch(`${API_URL}/warnings/${warningId}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify(updateData),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to update warning');
      }
      return data;
    } catch (error) {
      console.error('Update warning error:', error);
      throw error;
    }
  },

  resolveWarning: async (warningId) => {
    try {
      const headers = await getAuthHeader();
      const response = await fetch(`${API_URL}/warnings/${warningId}/resolve`, {
        method: 'POST',
        headers,
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to resolve warning');
      }
      return data;
    } catch (error) {
      console.error('Resolve warning error:', error);
      throw error;
    }
  },

  addWarningUpdate: async (warningId, updateMessage) => {
    try {
      const headers = await getAuthHeader();
      const response = await fetch(`${API_URL}/warnings/${warningId}/updates`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ message: updateMessage }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to add warning update');
      }
      return data;
    } catch (error) {
      console.error('Add warning update error:', error);
      throw error;
    }
  },
};
