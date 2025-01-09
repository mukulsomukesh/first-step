import axiosInstance from "../lib/axios";

export const loginService = (payload) => {
  return new Promise(async (resolve, reject) => {
    try {
      let response = await axiosInstance.post(`/api/auth/login`, payload);
      localStorage.setItem("token", response.jwtToken); // Corrected method
      resolve(response);
    } catch (error) {
      reject({ message: error });
    }
  });
};

export const signupService = (payload) => {
  return new Promise(async (resolve, reject) => {
    try {
      let response = await axiosInstance.post(`/api/auth/signup`, payload);
      resolve(response);
    } catch (error) {
      reject({ message: error });
    }
  });
};
