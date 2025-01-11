import axiosInstance from "../lib/axios";

export const loginService = (payload) => {
  return new Promise(async (resolve, reject) => {
    try {
      let response = await axiosInstance.post(`/api/auth/login`, payload);
      localStorage.setItem("token", response.jwtToken); // Corrected method
      localStorage.setItem("notesMasterUserDetails", JSON.stringify(response.Details)); // Corrected method
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


export const forgotPasswordService = (payload) => {
  return new Promise(async (resolve, reject) => {
    try {
      let response = await axiosInstance.post(`/api/auth/forgot-password`, payload);
      resolve(response);
    } catch (error) {
      reject({ message: error });
    }
  });
};


export const resetPasswordService  = (payload) => {
  return new Promise(async (resolve, reject) => {
    try {
      let response = await axiosInstance.post(`/api/auth/update-password`, payload);
      resolve(response);
    } catch (error) {
      reject({ message: error });
    }
  });
};

export const getUserProfileService  = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let response = await axiosInstance.get(`/api/auth/user-profile`);
      resolve(response);
    } catch (error) {
      reject({ message: error });
    }
  });
};


export const updateUserProfileService  = (formData) => {
  return new Promise(async (resolve, reject) => {
    try {
      let response = await axiosInstance.put(`/api/auth/update-user-profile`,formData );
      resolve(response);
    } catch (error) {
      reject({ message: error });
    }
  });
};
