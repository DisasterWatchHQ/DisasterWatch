const API_URL = process.env.REACT_APP_API_URL;

export const submitReport = async (reportData, images) => {
  try {
    const formattedReport = {
      ...reportData,
      images: images,
      date_time: new Date(),
    };

    const response = await fetch(`${API_URL}/userReport`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formattedReport),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Error response:", errorData);
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
      ...(filters.disaster_category && { disaster_category: filters.disaster_category }),
      ...(filters.verified_only && { verified_only: true }),
    }).toString();

    const response = await fetch(`${API_URL}/userReport/reports?${queryParams}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch reports');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Fetch reports error:', error);
    throw error;
  }
};

export const fetchFeedStats = async () => {
  try {
    const response = await fetch(`${API_URL}/userReport/feedstats`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch feed stats');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Fetch stats error:', error);
    throw error;
  }
};

export const fetchLiveUpdates = async (minutes = 30) => {
  try {
    const response = await fetch(`${API_URL}/userReport/updates?minutes=${minutes}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch updates');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Fetch updates error:', error);
    throw error;
  }
};