import axios from "axios";

export const axiosInstance = axios.create({
  baseURL:  "https://chat-app-mern-new-1.onrender.com/api" ,
  withCredentials: true,
});