import axios from "axios";

const API_URL = "http://localhost:3001/api/registrations";

export const createRegistration = async (registrationData) => {
  const response = await axios.post(API_URL, registrationData);
  return response.data;
};

export const getRegistrations = async () => {
  const response = await axios.get(`${API_URL}?page=1&limit=10`);
  return response.data;
};