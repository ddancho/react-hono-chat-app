import axios from "axios";

const serverUrl = import.meta.env.VITE_SERVER_URL;
const baseUrl = `${serverUrl}/api`;

export const axiosInstance = axios.create({
  baseURL: baseUrl,
  withCredentials: true,
});
