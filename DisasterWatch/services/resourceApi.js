import axios from "axios";

const BASE_URL = process.env.REACT_APP_API_URL;

const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const facilityApi = {
  getFacilities: async ({
    type,
    availability_status,
    city,
    district,
    province,
    status,
    tags,
    limit = 10,
    page = 1,
  }) => {
    try {
      const response = await apiClient.get("/resources/facilities", {
        params: {
          type,
          availability_status,
          city,
          district,
          province,
          status,
          tags,
          limit,
          page,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching facilities:", error);
      throw error;
    }
  },

  getGuides: async ({ type, tags, limit = 10, page = 1 }) => {
    try {
      const response = await apiClient.get("/resources/guides", {
        params: {
          type,
          tags,
          limit,
          page,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching guides:", error);
      throw error;
    }
  },

  getEmergencyContacts: async ({ emergency_level }) => {
    try {
      const response = await apiClient.get("/resources/emergency-contacts", {
        params: {
          emergency_level,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching emergency contacts:", error);
      throw error;
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
      return response.data;
    } catch (error) {
      console.error("Error fetching resource by ID:", error);
      throw error;
    }
  },
};
