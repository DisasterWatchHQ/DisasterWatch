import * as SecureStore from "expo-secure-store";

const API_URL = process.env.EXPO_PUBLIC_API_URL;

export const submitReport = async (reportData) => {
  try {
    // Get auth token
    const session = await SecureStore.getItemAsync("userSession");
    let headers = {
      Accept: "application/json",
      "Content-Type": "application/json",
    };

    if (session) {
      const { token } = JSON.parse(session);
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }
    }

    const response = await fetch(`${API_URL}/reports`, {
      method: "POST",
      headers,
      body: JSON.stringify(reportData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to submit report");
    }

    return await response.json();
  } catch (error) {
    console.error("Submit report error:", error);
    throw error;
  }
};

export const fetchReports = async (filters) => {
  try {
    const queryParams = new URLSearchParams({
      page: filters.page || 1,
      limit: filters.limit || 10,
      ...(filters.disaster_category && {
        disaster_category: filters.disaster_category,
      }),
      ...(filters.verified_only && { verified_only: true }),
      ...(filters.district && { district: filters.district }),
    }).toString();

    const response = await fetch(
      `${API_URL}/reports/reports?${queryParams}`,
    );

    if (!response.ok) {
      throw new Error("Failed to fetch reports");
    }

    return await response.json();
  } catch (error) {
    console.error("Fetch reports error:", error);
    throw error;
  }
};

export const fetchFeedStats = async () => {
  try {
    const response = await fetch(`${API_URL}/userReport/feedstats`);

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to fetch feed stats");
    }

    const data = await response.json();
    return data.success ? data.data : data;
  } catch (error) {
    console.error("Fetch stats error:", error);
    throw error;
  }
};

export const fetchLiveUpdates = async (minutes = 30) => {
  try {
    const response = await fetch(
      `${API_URL}/userReport/updates?minutes=${minutes}`,
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to fetch updates");
    }

    const data = await response.json();
    return data.success ? data.data : data;
  } catch (error) {
    console.error("Fetch updates error:", error);
    throw error;
  }
};
