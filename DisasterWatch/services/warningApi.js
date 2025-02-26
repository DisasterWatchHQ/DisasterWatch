import axios from "axios";

const BASE_URL = process.env.REACT_APP_API_URL;

const apiClient = axios.create({
  baseURL: BASE_URL,
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

export const warningApi = {
  getActiveWarnings: async () => {
    try {
      const response = await apiClient.get("/warning/active");
      return response.data.data;
    } catch (error) {
      console.error("Error fetching active warnings:", error);
      throw error;
    }
  },

  getWarnings: async (filters = {}) => {
    try {
      const queryParams = new URLSearchParams();

      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          queryParams.append(key, value);
        }
      });

      const response = await apiClient.get(
        `/warning?${queryParams.toString()}`,
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching warnings:", error);
      throw error;
    }
  },

  getWarningById: async (id) => {
    try {
      if (!id) {
        throw new Error("Warning ID is required");
      }

      const response = await apiClient.get(`/warning/${id}`);

      if (!response.data) {
        throw new Error("No data received from server");
      }

      return response.data;
    } catch (error) {
      console.error(`Error fetching warning details for ID ${id}:`, error);
      throw error;
    }
  },
};
