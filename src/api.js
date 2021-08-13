import axios from "axios";

const normalAxios = axios.create({
  baseURL: "https://translate-app-node-api.herokuapp.com/api/v1",
  // baseURL: "http://localhost:5000/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor response
normalAxios.interceptors.response.use(
  function (response) {
    // Do something with response data
    return response.data;
  },
  function (error) {
    return error;
  }
);

export default normalAxios;
