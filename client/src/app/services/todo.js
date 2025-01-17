import axiosInstance from "../lib/axios";

export const createTodoService = (payload) => {
    return new Promise(async (resolve, reject) => {
      try {
        let response = await axiosInstance.post(`/api/todo/create`, payload);
        resolve(response);
      } catch (error) {
        reject({ message: error });
      }
    });
  };

  
export const updateTodoService = (id,payload) => {
    return new Promise(async (resolve, reject) => {
      try {
        let response = await axiosInstance.put(`/api/todo/edit/${id}`, payload);
        resolve(response);
      } catch (error) {
        reject({ message: error });
      }
    });
  };

    
  export const markCompletedTodoService = (id) => {
    return new Promise(async (resolve, reject) => {
      try {
        let response = await axiosInstance.put(`/api/todo/mark-completed/${id}`);
        resolve(response);
      } catch (error) {
        reject({ message: error });
      }
    });
  };   


  export const deleteTodoService = (id) => {
      return new Promise(async (resolve, reject) => {
        try {
          let response = await axiosInstance.delete(`/api/todo/delete/${id}`);
          resolve(response);
        } catch (error) {
          reject({ message: error });
        }
      });
    };

    
  export const listTodoService = () => {
    return new Promise(async (resolve, reject) => {
      try {
        let response = await axiosInstance.get(`/api/todo/list`);
        resolve(response);
      } catch (error) {
        reject({ message: error });
      }
    });
  };

  
  export const getTodoByIdService = (id) => {
    return new Promise(async (resolve, reject) => {
      try {
        let response = await axiosInstance.delete(`/api/todo/${id}`);
        resolve(response);
      } catch (error) {
        reject({ message: error });
      }
    });
  };