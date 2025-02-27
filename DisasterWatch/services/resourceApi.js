import axios from "axios";

const BASE_URL = process.env.REACT_APP_API_URL;

const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const facilityApi = {
  getFacilities: async ({ ...params }) => {
    try {
      const response = await apiClient.get("/resources/facilities", {
        params,
      });
      return {
        data: response.data.resources,
        pagination: {
          currentPage: response.data.currentPage,
          totalPages: response.data.totalPages,
          totalResults: response.data.totalResults,
        },
      };
    } catch (error) {
      throw new Error(
        error.response?.data?.error || "Error fetching facilities",
      );
    }
  },

  getGuides: async ({ ...params }) => {
    try {
      const response = await apiClient.get("/resources/guides", {
        params,
      });
      return {
        data: response.data.resources,
        pagination: {
          currentPage: response.data.currentPage,
          totalPages: response.data.totalPages,
          totalResults: response.data.totalResults,
        },
      };
    } catch (error) {
      throw new Error(error.response?.data?.error || "Error fetching guides");
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
        params: {
          latitude,
          longitude,
          maxDistance,
          type,
          availability_status,
        },
      });
      return response.data.data;
    } catch (error) {
      console.error("Error fetching nearby facilities:", error);
      throw error;
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
      console.error("Error fetching resource by ID:", error);
      throw new Error(
        error.response?.data?.error ||
          error.message ||
          "Failed to fetch resource details",
      );
    }
  },
};
