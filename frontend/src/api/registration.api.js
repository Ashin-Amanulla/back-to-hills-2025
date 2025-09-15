import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL||"https://api-onavesham2.unma.in/api";

export const createRegistration = async (registrationData) => {
  const response = await axios.post(`${API_URL}/registrations`, registrationData);
  return response.data;
};

export const getRegistrations = async () => {
  const response = await axios.get(`${API_URL}/registrations?page=1&limit=10`);
  return response.data;
};