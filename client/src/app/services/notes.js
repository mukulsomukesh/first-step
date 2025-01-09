import axiosInstance from "../lib/axios";

export const createNotesService = (payload) => {
  return new Promise(async (resolve, reject) => {
    try {
      let response = await axiosInstance.post(`/api/notes/create`, payload);
      resolve(response);
    } catch (error) {
      reject({ message: error });
    }
  });
};
