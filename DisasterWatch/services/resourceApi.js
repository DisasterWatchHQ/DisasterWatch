import axios from "axios";
import * as SecureStore from "expo-secure-store";

const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

const apiClient = axios.create({
  baseURL: BASE_URL,
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

export const facilityApi = {
  getFacilities: async ({ ...params }) => {
    try {
      const response = await apiClient.get("/resources/facilities", { params });
      return {
        data: response.data.resources,
        pagination: response.data.pagination,
      };
    } catch (error) {
      throw new Error(
        error.response?.data?.error || "Error fetching facilities",
      );
    }
  },

  getGuides: async ({ type, page = 1, limit = 20 }) => {
    try {
      const response = await apiClient.get("/resources/guides", {
        params: { type, page, limit },
      });
      return {
        data: response.data.resources,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(response.data.resources.length / limit),
          totalResults: response.data.resources.length,
        },
      };
    } catch (error) {
      throw new Error(error.response?.data?.error || "Failed to fetch guides");
    }
  },

  getEmergencyContacts: async ({ ...params }) => {
    try {
      const response = await apiClient.get("/resources/emergency-contacts", {
        params,
      });
      return {
        data: response.data.resources,
      };
    } catch (error) {
      throw new Error(
        error.response?.data?.error || "Error fetching emergency contacts",
      );
    }
  },

  getNearbyFacilities: async ({
    latitude,
    longitude,
    maxDistance = 10000,
    type,
    availability_status,
  }) => {
    try {
      const response = await apiClient.get("/resources/facilities/nearby", {
        params: { latitude, longitude, maxDistance, type, availability_status },
      });
      return response.data.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.error || "Error fetching nearby facilities",
      );
    }
  },

  getResourceById: async (id) => {
    try {
      const response = await apiClient.get(`/resources/${id}`);
      if (!response.data.success) {
        throw new Error(response.data.error || "Failed to fetch resource");
      }
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.error || "Failed to fetch resource details",
      );
    }
  },

  createGuide: async (guideData) => {
    try {
      const response = await apiClient.post("/resources", guideData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || "Failed to create guide");
    }
  },

  deleteGuide: async (guideId) => {
    try {
      const response = await apiClient.delete(`/resources/${guideId}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || "Failed to delete guide");
    }
  },

  updateGuide: async (guideId, guideData) => {
    try {
      const response = await apiClient.put(`/resources/${guideId}`, guideData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || "Failed to update guide");
    }
  },
  deleteResource: async (resourceId) => {
    try {
      const response = await apiClient.delete(`/resources/${resourceId}`);
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.error || "Failed to delete resource",
      );
    }
  },

  updateContact: async (contactId, contactData) => {
    try {
      const response = await apiClient.put(
        `/resources/${contactId}`,
        contactData,
      );
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.error || "Failed to update contact",
      );
    }
  },

  createContact: async (contactData) => {
    try {
      const response = await apiClient.post("/resources", contactData);
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.error || "Failed to create contact",
      );
    }
  },
};
