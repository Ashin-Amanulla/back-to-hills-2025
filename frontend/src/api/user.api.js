import axios from "axios";

const API_URL =
  import.meta.env.VITE_API_URL || "https://api-onavesham2.unma.in/api";

export const login = async (username, password) => {
  if (!username || !password) {
    throw new Error("Username and password are required");
  }
  try {
    const response = await axios.post(`${API_URL}/users/login`, {
      username,
      password,
    });
    return response.data;
  } catch (error) {
    console.error("Error logging in", error);
    throw new Error("Check your username and password");
  }
};
