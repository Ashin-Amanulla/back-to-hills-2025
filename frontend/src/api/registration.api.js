import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL||"https://api-onavesham2.unma.in/api";

export const createRegistration = async (registrationData) => {
  const response = await axios.post(`${API_URL}/registrations`, registrationData);
  return response.data;
};

export const getRegistrations = async (params) => {
  try{    
    const response = await axios.get(`${API_URL}/registrations?${params}`);
   
    return response.data;
  }catch(error){
    console.error("Error fetching registrations", error);
    throw new Error("Failed to fetch registrations");
  }
};

export const getRegistrationStats = async () => {
  const response = await axios.get(`${API_URL}/registrations/stats`);
  return response.data;
};

export const downloadRegistrations = async () => {
  const response = await axios.get(`${API_URL}/registrations/download`,{
    responseType: "blob",
  });
  return response;
};
