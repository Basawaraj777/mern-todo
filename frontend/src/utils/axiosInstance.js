// utils/axiosInstance.js
import axios from "axios";

const axiosInstance = (token) => {
  return axios.create({
    baseURL: "https://mern-todo-pslr.onrender.com/api/v1",
    headers: {
      "Content-Type": "application/json",
      Authorization: token ? `Bearer ${token}` : "",
    },
    // Remove credentials if not needed, or keep if your backend expects cookies
    // withCredentials: true,
  });
};

export default axiosInstance;
