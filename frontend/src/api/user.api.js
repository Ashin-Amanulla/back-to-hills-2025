import axiosInstance from "./axios";

export const login = async (username, password) => {
  if (!username || !password) {
    throw new Error("Username and password are required");
  }
  try {
    const response = await axiosInstance.post("/users/login", {
      username,
      password,
    });
    return response.data;
  } catch (error) {
    console.error("Error logging in", error);
    throw new Error("Check your username and password");
  }
};
