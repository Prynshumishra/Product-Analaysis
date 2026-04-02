import api from "./api.js";

export const getAnalyticsData = async (params) => {
  const response = await api.get("/analytics", {
    params
  });

  return response.data;
};

export const trackFeatureEvent = async (featureName) => {
  await api.post("/track", {
    feature_name: featureName
  });
};