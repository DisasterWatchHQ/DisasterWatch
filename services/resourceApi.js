import axios from "axios";
import * as SecureStore from "expo-secure-store";
import AsyncStorage from "@react-native-async-storage/async-storage";

const API_URL = process.env.EXPO_PUBLIC_API_URL;

const getAuthHeader = async () => {
  const token = await AsyncStorage.getItem('token');
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  };
};

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add request interceptor for authentication
apiClient.interceptors.request.use(
  async (config) => {
    try {
      const session = await SecureStore.getItemAsync("userSession");
      if (session) {
        const { token } = JSON.parse(session);
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      }
      return config;
    } catch (error) {
      return config;
    }
  },
  (error) => {
    return Promise.reject(error);
  },
);

export const resourceApi = {
  getFacilities: async (filters = {}) => {
    try {
      const headers = await getAuthHeader();
      const queryParams = new URLSearchParams({
        ...filters,
      }).toString();

      const response = await fetch(
        `${API_URL}/resources/facilities?${queryParams}`,
        { headers }
      );
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch facilities');
      }
      return data;
    } catch (error) {
      console.error('Get facilities error:', error);
      throw error;
    }
  },

  getNearbyFacilities: async (latitude, longitude, maxDistance) => {
    try {
      const headers = await getAuthHeader();
      const response = await fetch(
        `${API_URL}/resources/facilities/nearby?latitude=${latitude}&longitude=${longitude}&maxDistance=${maxDistance}`,
        { headers }
      );
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch nearby facilities');
      }
      return data;
    } catch (error) {
      console.error('Get nearby facilities error:', error);
      throw error;
    }
  },

  getGuides: async (filters = {}) => {
    try {
      const headers = await getAuthHeader();
      const queryParams = new URLSearchParams({
        ...filters,
      }).toString();

      const response = await fetch(
        `${API_URL}/resources/guides?${queryParams}`,
        { headers }
      );
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch guides');
      }
      return data;
    } catch (error) {
      console.error('Get guides error:', error);
      throw error;
    }
  },

  getEmergencyContacts: async (filters = {}) => {
    try {
      const headers = await getAuthHeader();
      const queryParams = new URLSearchParams({
        ...filters,
      }).toString();

      const response = await fetch(
        `${API_URL}/resources/emergency-contacts?${queryParams}`,
        { headers }
      );
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch emergency contacts');
      }
      return data;
    } catch (error) {
      console.error('Get emergency contacts error:', error);
      throw error;
    }
  },

  createResource: async (resourceData) => {
    try {
      const headers = await getAuthHeader();
      const response = await fetch(`${API_URL}/resources`, {
        method: 'POST',
        headers,
        body: JSON.stringify(resourceData),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to create resource');
      }
      return data;
    } catch (error) {
      console.error('Create resource error:', error);
      throw error;
    }
  },

  updateResource: async (resourceId, updateData) => {
    try {
      const headers = await getAuthHeader();
      const response = await fetch(`${API_URL}/resources/${resourceId}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify(updateData),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to update resource');
      }
      return data;
    } catch (error) {
      console.error('Update resource error:', error);
      throw error;
    }
  },

  deleteResource: async (resourceId) => {
    try {
      const headers = await getAuthHeader();
      const response = await fetch(`${API_URL}/resources/${resourceId}`, {
        method: 'DELETE',
        headers,
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to delete resource');
      }
      return data;
    } catch (error) {
      console.error('Delete resource error:', error);
      throw error;
    }
  },
};
