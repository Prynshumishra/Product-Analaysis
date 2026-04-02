import api from "./api.js";

export const registerRequest = async (payload) => {
  const response = await api.post("/register", payload);
  return response.data;
};

export const loginRequest = async (payload) => {
  const response = await api.post("/login", payload);
  return response.data;
};