import axiosInstance from "../lib/axios";

export const createNotesBookService = (payload) => {
  return new Promise(async (resolve, reject) => {
    try {
      let response = await axiosInstance.post(`/api/note-book`, payload);
      resolve(response);
    } catch (error) {
      reject({ message: error });
    }
  });
};

export const getNotesBookService = (payload) => {
  return new Promise(async (resolve, reject) => {
    try {
      let response = await axiosInstance.get(`/api/note-book`, payload);
      resolve(response);
    } catch (error) {
      reject({ message: error });
    }
  });
};

export const updateNotesBookService = (payload, id) => {
  return new Promise(async (resolve, reject) => {
    try {
      let response = await axiosInstance.put(`/api/note-book/${id}`, payload);
      resolve(response);
    } catch (error) {
      reject({ message: error });
    }
  });
};

export const deleteNotesBookService = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      let response = await axiosInstance.delete(`/api/note-book/${id}`);
      resolve(response);
    } catch (error) {
      reject({ message: error });
    }
  });
};

export const getNotesBookByIdService = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      let response = await axiosInstance.get(`/api/note-book/${id}`);
      resolve(response);
    } catch (error) {
      reject({ message: error });
    }
  });
};
