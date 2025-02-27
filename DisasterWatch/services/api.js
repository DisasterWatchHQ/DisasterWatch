const API_URL = process.env.REACT_APP_API_URL;

export const submitReport = async (reportData, images) => {
  try {
    const formData = new FormData();

    Object.keys(reportData).forEach((key) => {
      if (key === "location") {
        formData.append(key, JSON.stringify(reportData[key]));
      } else {
        formData.append(key, reportData[key]);
      }
    });

    if (images && images.length) {
      images.forEach((image) => {
        formData.append("images", image);
      });
    }

    const response = await fetch(`${API_URL}/userReport`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to submit report");
    }

    return await response.json();
  } catch (error) {
    console.error("Submit error:", error);
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
      `${API_URL}/userReport/reports?${queryParams}`,
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
