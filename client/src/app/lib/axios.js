import axios from "axios";
import { toast } from "react-toastify";

const axiosInstance = axios.create({
  headers: {
    "Content-Type": "application/json",
  },
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token") || "set-my";
    if (token != null) {
      config.headers.Authorization = "Bearer " + token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  function (response) {
    return response.data;
  },
  function (error) {
    if (error.response.status === 401) {
      localStorage.removeItem("token");
      let { pathname } = window.location;

      setTimeout(()=>{
        window.location.href = "/pages/login/?redirect=" + window.btoa(pathname);
      },2000)

    } else {
      if (error?.response?.data?.errors) {
        for (const field in error.response.data.errors) {
          if (error.response.data.errors.hasOwnProperty(field)) {
            toast.error(`${error.response.data.errors[field]}`);
          }
        }
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
