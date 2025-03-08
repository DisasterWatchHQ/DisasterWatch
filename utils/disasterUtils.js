export const getDisasterCategoryColor = (category) => {
  switch (category?.toLowerCase()) {
    case "flood":
      return "#3B82F6";
    case "fire":
      return "#EF4444";
    case "earthquake":
      return "#8B5CF6";
    case "landslide":
      return "#D97706";
    case "cyclone":
      return "#6366F1";
    default:
      return "#6B7280";
  }
};

export const getDisasterCategoryIcon = (category) => {
  switch (category?.toLowerCase()) {
    case "flood":
      return "water";
    case "fire":
      return "local-fire-department";
    case "earthquake":
      return "vibration";
    case "landslide":
      return "landscape";
    case "cyclone":
      return "cyclone";
    default:
      return "warning";
  }
}; 