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


//  list of user notes
export const userNotesListService = (payload) => {
    return new Promise(async (resolve, reject) => {
      try {
        let response = await axiosInstance.get(`/api/notes/list`);
        resolve(response);
      } catch (error) {
        reject({ message: error });
      }
    });
  };

  //  list of user notes
  export const getNoteByIDService = (id) => {
    return new Promise(async (resolve, reject) => {
      try {
        let response = await axiosInstance.get(`/api/notes/${id}`);
        resolve(response);
      } catch (error) {
        reject({ message: error });
      }
    });
  };
  

  //  list of user notes
  export const updateNoteByIDService = (id, payload) => {
    return new Promise(async (resolve, reject) => {
      try {
        let response = await axiosInstance.put(`/api/notes/edit/${id}`,payload);
        resolve(response);
      } catch (error) {
        reject({ message: error });
      }
    });
  };
  

  //  list of user notes
  export const deleteNoteByIDService = (id) => {
    return new Promise(async (resolve, reject) => {
      try {
        let response = await axiosInstance.delete(`/api/notes/delete/${id}`);
        resolve(response);
      } catch (error) {
        reject({ message: error });
      }
    });
  };
  
  // dashboard today and pending revition list of user notes
  export const dashboardRevisionListService = (id) => {
    return new Promise(async (resolve, reject) => {
      try {
        let response = await axiosInstance.get(`/api/notes/dashboard/reminders`);
        resolve(response);
      } catch (error) {
        reject({ message: error });
      }
    });
  };
  