import axios from "axios";

const BASE_URL = import.meta.env.MODE === "development"
  ? "http://localhost:5001" // local dev backend
  : "https://finance-tracker-backend-hxmj.onrender.com"; // deployed backend

export const axiosInstance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});
