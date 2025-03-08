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

export const resourceApi = {
  getFacilities: async (filters = {}) => {
    try {
      const response = await apiClient.get('/resources/facilities', {
        params: filters
      });
      return response.data;
    } catch (error) {
      console.error('Get facilities error:', error);
      throw error;
    }
  },

  getNearbyFacilities: async (params) => {
    try {
      const { latitude, longitude, district, maxDistance } = params;
      
      if (!latitude || !longitude || !district) {
        throw new Error('Missing required parameters: latitude, longitude, and district are required');
      }

      const response = await apiClient.get('/resources/facilities/nearby', {
        params: {
          latitude,
          longitude,
          district,
          maxDistance: maxDistance || 5
        }
      });
      
      // Handle different response formats
      if (response.data?.data?.facilities) {
        return {
          success: true,
          data: response.data.data.facilities.map(facility => ({
            ...facility,
            distance: facility.distance ? `${(facility.distance).toFixed(1)} km` : 'Unknown'
          }))
        };
      } else if (Array.isArray(response.data)) {
        return {
          success: true,
          data: response.data.map(facility => ({
            ...facility,
            distance: facility.distance ? `${(facility.distance).toFixed(1)} km` : 'Unknown'
          }))
        };
      } else if (response.data?.data && Array.isArray(response.data.data)) {
        return {
          success: true,
          data: response.data.data.map(facility => ({
            ...facility,
            distance: facility.distance ? `${(facility.distance).toFixed(1)} km` : 'Unknown'
          }))
        };
      }
      
      throw new Error('Invalid response format from server');
    } catch (error) {
      console.error('Get nearby facilities error:', error);
      if (error.response?.status === 404) {
        return {
          success: true,
          data: [] // Return empty array if no facilities found
        };
      }
      throw error;
    }
  },

  getGuides: async (filters = {}) => {
    try {
      const response = await apiClient.get('/resources/guides', {
        params: filters
      });
      return response.data;
    } catch (error) {
      console.error('Get guides error:', error);
      throw error;
    }
  },

  getEmergencyContacts: async (filters = {}) => {
    try {
      const response = await apiClient.get('/resources/emergency-contacts', {
        params: filters
      });
      return response.data;
    } catch (error) {
      console.error('Get emergency contacts error:', error);
      throw error;
    }
  },

  createResource: async (resourceData) => {
    try {
      const response = await apiClient.post('/resources', resourceData);
      return response.data;
    } catch (error) {
      console.error('Create resource error:', error);
      throw error;
    }
  },

  updateResource: async (resourceId, updateData) => {
    try {
      const response = await apiClient.put(`/resources/${resourceId}`, updateData);
      return response.data;
    } catch (error) {
      console.error('Update resource error:', error);
      throw error;
    }
  },

  deleteResource: async (resourceId) => {
    try {
      const response = await apiClient.delete(`/resources/${resourceId}`);
      return response.data;
    } catch (error) {
      console.error('Delete resource error:', error);
      throw error;
    }
  },
};
