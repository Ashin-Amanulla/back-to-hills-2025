import axios from "axios";
import axiosInstance from "./axios";

// backend api url
const API_URL =
  import.meta.env.VITE_API_URL || "https://api-btth.jnvcan.com/api";

export const createRegistration = async (registrationData) => {
  const response = await axios.post(
    `${API_URL}/registrations`,
    registrationData
  );
  return response.data;
};

export const getRegistrations = async (params) => {
  try {
    const response = await axiosInstance.get(`/registrations?${params}`);

    return response.data;
  } catch (error) {
    console.error("Error fetching registrations", error);
    throw new Error("Failed to fetch registrations");
  }
};

export const getRegistrationStats = async () => {
  const response = await axiosInstance.get(`/registrations/stats`);
  return response.data;
};

export const downloadRegistrations = async () => {
  const response = await axiosInstance.get(`/registrations/download`, {
    responseType: "blob",
  });
  return response;
};

export const updateRegistration = async (id, registrationData) => {
  const response = await axiosInstance.put(
    `/registrations/${id}`,
    registrationData
  );
  return response.data;
};

export const getRegistration = async (id) => {
  const response = await axiosInstance.get(`/registrations/${id}`);
  return response.data;
};

export const searchRegistration = async (query) => {
  const response = await axios.get(`${API_URL}/registrations/search/${query}`);
  return response.data;
};
