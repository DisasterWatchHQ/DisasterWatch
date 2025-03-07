const API_URL = process.env.REACT_APP_API_URL;

export const uploadImages = async (images, reportData) => {
  try {
    const formData = new FormData();

    Object.keys(reportData).forEach((key) => {
      if (key === "location") {
        formData.append("location", JSON.stringify(reportData[key]));
      } else {
        formData.append(key, reportData[key]);
      }
    });

    if (images && images.length > 0) {
      images.forEach((uri, index) => {
        if (!uri) return;
        const fileType = uri.split(".").pop().toLowerCase();
        const imageFile = {
          uri: uri,
          type: `image/${fileType}`,
          name: `photo_${Date.now()}_${index}.${fileType}`,
        };
        formData.append("images", imageFile);
      });
    }

    const response = await fetch(`${API_URL}/userReport`, {
      method: "POST",
      body: formData,
      headers: {
        Accept: "application/json",
        "Content-Type": "multipart/form-data",
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Upload error response:", errorText);
      throw new Error(`Upload failed: ${errorText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Detailed upload error:", error);
    throw error;
  }
};
