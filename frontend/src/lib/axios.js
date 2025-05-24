import axios from "axios";

export const axiosInstance = axios.create({
  baseURL:  "https://chatt-appp.onrender.com//api" ,//it means every time we'll make request to this api
  withCredentials: true, //this withcredntials field will enable client to send cookies for login or signup.

});
