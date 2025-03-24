import axios from "axios";
import * as SecureStore from "expo-secure-store";

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
    const session = await SecureStore.getItemAsync("userSession");
    if (session) {
      const { token } = JSON.parse(session);
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    console.error("Request Error:", error);
    return Promise.reject(error);
  },
);

apiClient.interceptors.response.use(
  (response) => {
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
      return response.data.data || response.data;
    } catch (error) {
      console.error('Get active warnings error:', error);
      throw error;
    }
  },

  fetchLiveUpdates: async (minutes = 30) => {
    try {
      const response = await fetch(
        `${API_URL}/reports/updates?minutes=${minutes}`
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to fetch updates");
      }

      return await response.json();
    } catch (error) {
      console.error("Fetch updates error:", error);
      throw error;
    }
  },

  getLiveUpdates: async () => {
    try {
      const response = await apiClient.get('/warnings/live-updates'); // Adjust the endpoint as necessary
      return response.data.data || response.data;
    } catch (error) {
      console.error('Get live updates error:', error);
      throw error;
    }
  },

  // New function to fetch feed stats
  fetchFeedStats: async () => {
    try {
      const response = await apiClient.get('/warnings/feed-stats'); // Adjust the endpoint as necessary
      return response.data.data || response.data;
    } catch (error) {
      console.error('Get feed stats error:', error);
      throw error;
    }
  },

  getWarnings: async (filters = {}) => {
    try {
      const response = await apiClient.get('/warnings', { params: filters });
      return response.data.data || response.data;
    } catch (error) {
      console.error('Get warnings error:', error);
      throw error;
    }
  },

  getWarningsByLocation: async (latitude, longitude, radius) => {
    try {
      const response = await apiClient.get('/warnings/location', {
        params: { latitude, longitude, radius }
      });
      return response.data.data || response.data;
    } catch (error) {
      console.error('Get location warnings error:', error);
      throw error;
    }
  },

  getWarningById: async (warningId) => {
    try {
      const response = await apiClient.get(`/warnings/${warningId}`);
      return response.data.data || response.data;
    } catch (error) {
      console.error('Get warning details error:', error);
      throw error;
    }
  },

  createWarning: async (warningData) => {
    try {
      const response = await apiClient.post('/warnings', warningData);
      return response.data.data || response.data;
    } catch (error) {
      console.error('Create warning error:', error);
      throw error;
    }
  },

  updateWarning: async (warningId, updateData) => {
    try {
      const response = await apiClient.patch(`/warnings/${warningId}`, updateData);
      return response.data.data || response.data;
    } catch (error) {
      console.error('Update warning error:', error);
      throw error;
    }
  },

  resolveWarning: async (warningId) => {
    try {
      const response = await apiClient.post(`/warnings/${warningId}/resolve`);
      return response.data.data || response.data;
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
      return response.data.data || response.data;
    } catch (error) {
      console.error('Add warning update error:', error);
      throw error;
    }
  },

  addResponseAction: async (warningId, actionData) => {
    try {
      const response = await apiClient.post(`/warnings/${warningId}/actions`, actionData);
      return response.data.data || response.data;
    } catch (error) {
      console.error('Add response action error:', error);
      throw error;
    }
  },

  updateActionStatus: async (warningId, actionId, status) => {
    try {
      const response = await apiClient.patch(`/warnings/${warningId}/actions/${actionId}`, { status });
      return response.data.data || response.data;
    } catch (error) {
      console.error('Update action status error:', error);
      throw error;
    }
  }
};
