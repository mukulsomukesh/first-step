import axiosInstance from "../lib/axios";

export const getDashboardStats = (payload) => {
    return new Promise(async (resolve, reject) => {
      try {
        let response = await axiosInstance.get(`/api/dashboard/stats?${payload}`);
        resolve(response);
      } catch (error) {
        reject({ message: error });
      }
    });
  };


  export const getDashboardRevisionAndTodoList = (payload) => {
    return new Promise(async (resolve, reject) => {
      try {
        let response = await axiosInstance.get(`/api/dashboard/schaduled-revision-and-todos?${payload}`);
        resolve(response);
      } catch (error) {
        reject({ message: error });
      }
    });
  };


  export const getDashboardStudyProgressChart = (payload) => {
    return new Promise(async (resolve, reject) => {
      try {
        let response = await axiosInstance.get(`/api/dashboard/study-progress-chart-data?${payload}`, );
        resolve(response);
      } catch (error) {
        reject({ message: error });
      }
    });
  };