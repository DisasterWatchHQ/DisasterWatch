import axios from "axios";
import * as SecureStore from "expo-secure-store";
import { router } from "expo-router";

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:5000/api';

const wardash = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

wardash.interceptors.request.use(
  async (config) => {
    try {
      const session = await SecureStore.getItemAsync("userSession");
      if (!session) {
        throw new Error("No user session found");
      }
      
      const userData = JSON.parse(session);
      if (!userData?.token) {
        throw new Error("No authentication token found");
      }
      
      config.headers.Authorization = `Bearer ${userData.token}`;
      return config;
    } catch (error) {
      console.error("Authentication error:", error);
      return Promise.reject(error);
    }
  },
  (error) => {
    return Promise.reject(error);
  }
);

wardash.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      SecureStore.deleteItemAsync("userSession")
        .then(() => {
          router.push("/login");
        })
        .catch(console.error);
    }
    return Promise.reject(error);
  }
);

export default wardash;
