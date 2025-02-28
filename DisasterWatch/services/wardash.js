import axios from "axios";
import * as SecureStore from "expo-secure-store";

const wardash = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

wardash.interceptors.request.use(
  async (config) => {
    try {
      const session = await SecureStore.getItemAsync("userSession");
      if (session) {
        const userData = JSON.parse(session);
        if (userData?.token) {
          config.headers.Authorization = `Bearer ${userData.token}`;
        }
      }
      return config;
    } catch (error) {
      return Promise.reject(error);
    }
  },
  (error) => {
    return Promise.reject(error);
  },
);

export default wardash;
