import axios from "axios";
import store from "../store";

const api = axios.create({
  baseURL: "https://enterprise-analytics-backend.vercel.app",
});

api.interceptors.request.use((config) => {
    console.log(config,'Test');
    
  const token = store.getState().auth.token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
