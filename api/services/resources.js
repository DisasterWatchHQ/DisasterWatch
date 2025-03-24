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
      console.error("Auth interceptor error:", error);
      return Promise.reject(error);
    }
  },
  (error) => {
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
      throw new Error(error.response.data.message || "Server error occurred");
    } else if (error.request) {
      console.error("No Response Received:", error.message);
      throw new Error("No response received from server");
    } else {
      console.error("Request Setup Error:", error.message);
      throw new Error("Failed to make request");
    }
  },
);

export const resourceApi = {
  getFacilities: async (filters = {}) => {
    try {
      const response = await apiClient.get("/resources/facilities", {
        params: filters,
      });
      return response.data.data || response.data;
    } catch (error) {
      console.error("Get facilities error:", error);
      throw error;
    }
  },

  getNearbyFacilities: async ({
    latitude,
    longitude,
    maxDistance,
    type,
    availability_status,
  }) => {
    try {
      const response = await apiClient.get("/resources/facilities/nearby", {
        params: {
          latitude,
          longitude,
          maxDistance,
          type,
          availabilityStatus: availability_status,
        },
      });
      return response.data.data || response.data;
    } catch (error) {
      console.error("Get nearby facilities error:", error);
      throw error;
    }
  },

  getGuides: async (filters = {}) => {
    try {
      const response = await apiClient.get("/resources/guides", {
        params: filters,
      });
      return response.data.data || response.data;
    } catch (error) {
      console.error("Get guides error:", error);
      throw error;
    }
  },

  getEmergencyContacts: async (filters = {}) => {
    try {
      const response = await apiClient.get("/resources/emergency-contacts", {
        params: filters,
      });
      return response.data.data || response.data;
    } catch (error) {
      console.error("Get emergency contacts error:", error);
      throw error;
    }
  },

  getResourceById: async (resourceId) => {
    try {
      const response = await apiClient.get(`/resources/${resourceId}`);
      return response.data.data || response.data;
    } catch (error) {
      console.error("Get resource error:", error);
      throw error;
    }
  },

  createResource: async (resourceData) => {
    try {
      const response = await apiClient.post("/resources", resourceData);
      return response.data.data || response.data;
    } catch (error) {
      console.error("Create resource error:", error);
      throw error;
    }
  },

  updateResource: async (resourceId, updateData) => {
    try {
      const response = await apiClient.put(`/resources/${resourceId}`, updateData);
      return response.data.data || response.data;
    } catch (error) {
      console.error("Update resource error:", error);
      throw error;
    }
  },

  deleteResource: async (resourceId) => {
    try {
      const response = await apiClient.delete(`/resources/${resourceId}`);
      return response.data.data || response.data;
    } catch (error) {
      console.error("Delete resource error:", error);
      throw error;
    }
  },

  getAllResources: async () => {
    try {
      const response = await apiClient.get("/resources");
      return response.data.data || response.data;
    } catch (error) {
      console.error("Get all resources error:", error);
      throw error;
    }
  },

  getVerifiedResources: async () => {
    try {
      const response = await apiClient.get("/resources/verified/last-month");
      return response.data.data || response.data;
    } catch (error) {
      console.error("Get verified resources error:", error);
      throw error;
    }
  },

  createFacility: async (facilityData) => {
    return resourceApi.createResource({
      ...facilityData,
      category: "facility",
    });
  },

  updateFacility: async (facilityId, updateData) => {
    return resourceApi.updateResource(facilityId, {
      ...updateData,
      category: "facility",
    });
  },

  deleteFacility: async (facilityId) => {
    return resourceApi.deleteResource(facilityId);
  },

  createGuide: async (guideData) => {
    return resourceApi.createResource({ ...guideData, category: "guide" });
  },

  updateGuide: async (guideId, updateData) => {
    return resourceApi.updateResource(guideId, {
      ...updateData,
      category: "guide",
    });
  },

  deleteGuide: async (guideId) => {
    return resourceApi.deleteResource(guideId);
  },

  createEmergencyContact: async (contactData) => {
    return resourceApi.createResource({
      ...contactData,
      category: "emergency_contact",
    });
  },

  updateEmergencyContact: async (contactId, updateData) => {
    return resourceApi.updateResource(contactId, {
      ...updateData,
      category: "emergency_contact",
    });
  },

  deleteEmergencyContact: async (contactId) => {
    return resourceApi.deleteResource(contactId);
  },
};
