import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL||"http://localhost:5454/api/registrations";

export const createRegistration = async (registrationData) => {
  const response = await axios.post(`${API_URL}/registrations`, registrationData);
  return response.data;
};

export const getRegistrations = async () => {
  const response = await axios.get(`${API_URL}/registrations?page=1&limit=10`);
  return response.data;
};