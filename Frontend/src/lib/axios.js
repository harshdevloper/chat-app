import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: import.meta.env.MODE === "development" ? "https://finance-tracker-backend-hxmj.onrender.com" : "/api",
  withCredentials: true,
});
