import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://growflex-backend-production.up.railway.app/",
});

export default axiosInstance;
